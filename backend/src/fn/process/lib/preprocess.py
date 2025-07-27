"""
# --*-- coding: utf-8 --*--
Inserts metadata into news items
"""

# ==================================================================================================
# Python imports
import os  # noqa: I001
from datetime import datetime, timedelta, timezone

from dateutil import parser
from pydantic import ValidationError

# ==================================================================================================
# Module imports
from shared.logger import logger
from shared.time import time_to_unix
from shared.score import calculate_score, set_random_counts
from shared.news_model import (
    MetricsModel,
    ProcessedNewsFeedModel,
    ProcessedNewsItemModel,
    SourceNewsFeedModel,
    SourceNewsItemModel,
)
from shared.url_hasher import hasher
from shared.uuid import uuid7

# ==================================================================================================
# Global declarations

TTL_DAYS = int(os.environ.get("NEWS_TTL_DAYS", "14"))  # TODO: To be changed to parameter in future


class FeedError(Exception):
    """Base exception for feed handling errors."""


class ParserNotFoundError(FeedError):
    """Parser class for the source not found."""


def inject_data(news_items: SourceNewsFeedModel) -> ProcessedNewsFeedModel:
    """
    Inject metadata into news items.
    Assumes 'published' is an ISO 8601 string. Calculates 'ttl' as a Unix timestamp.
    """
    news_items_with_metadata: list[ProcessedNewsItemModel] = []
    for item in news_items.feed:
        SourceNewsItemModel.model_validate(item)

        pk = f"NEWS#{item.country}#{item.language}"
        sk = str(uuid7(time_to_unix(item.published)))
        item_hash = hasher(f"{pk}#{item.news_url}")

        random_counts = set_random_counts()

        sk_top = calculate_score(random_counts, sk)

        # Calculate TTL based on the ISO published string
        ttl = _calculate_ttl(item.published)

        # TODO: This is a temporary solution to set the metrics. This will be set to 0 in the future.
        metrics = MetricsModel(
            views=random_counts["view"],
            likes=random_counts["like"],
            shares=random_counts["share"],
            bookmarks=random_counts["bookmark"],
        )

        news_items_with_metadata.append(
            ProcessedNewsItemModel(
                pk=pk,
                sk=sk,
                item_hash=item_hash,
                **item.model_dump(),
                sk_top=sk_top,
                ttl=ttl,
                metrics=metrics,
            ),
        )

    return ProcessedNewsFeedModel(feed=news_items_with_metadata)


def validate_feed_items(feed: list[dict]) -> tuple[list[dict], list[dict]]:
    """
    This function validates the feed items
    TODO: Also check if any of the mandatory fields are set to null / None.
    """
    logger.info(f"Validating feed items: {len(feed)}")
    if len(feed) > 0:
        valid_items = []
        invalid_items = []
        for item in feed:
            try:
                logger.info(f"Validating item: {item}")
                news_item = ProcessedNewsItemModel.model_validate(item)
                valid_items.append(news_item.model_dump())
            except ValidationError as exception:
                logger.error(repr(exception.errors()[0]["type"]))
                invalid_items.append(item)

        return (valid_items, invalid_items)

    return ([], [])


def _calculate_ttl(published: str) -> int:
    """
    This function calculates the TTL for a news item
    """
    try:
        published_dt = parser.parse(published)
        # Ensure timezone awareness - if naive, assume UTC as per time_to_iso fallback
        if published_dt.tzinfo is None:
            published_dt = published_dt.replace(tzinfo=timezone.utc)

        ttl_dt = published_dt + timedelta(days=TTL_DAYS)
        ttl = int(ttl_dt.timestamp())
    except (ValueError, parser.ParserError, TypeError) as e:
        logger.error(f"Error processing published date '{published}' for TTL calculation: {e}")
        # Fallback: Set TTL based on current time, or handle error appropriately
        now_dt = datetime.now(timezone.utc)
        ttl_dt = now_dt + timedelta(days=TTL_DAYS)
        ttl = int(ttl_dt.timestamp())

    return ttl
