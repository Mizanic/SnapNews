"""
# --*-- coding: utf-8 --*--
Inserts metadata into news items
"""

# ==================================================================================================
# Python imports
import os

from pydantic import ValidationError

# ==================================================================================================
# Module imports
from shared.logger import logger
from shared.news_model import NewsItemModel
from shared.url_hasher import hasher

# ==================================================================================================
# Global declarations

TTL_DAYS = int(os.environ.get("NEWS_TTL_DAYS", "14"))  # TODO: To be changed to parameter in future


def inject_metadata(news_items: list[dict]) -> list[dict]:
    """
    Inject metadata into news items
    """
    for item in news_items:
        item["pk"] = f"NEWS#{item['country']}#{item['language']}#{item['category']}"
        item["sk"] = f"{item['published']}"
        item["item_hash"] = hasher(f"{item['pk']}#{item['news_url']}")
        item["ttl"] = item["published"] + TTL_DAYS * 86400

    return news_items


def validate_feed_items(feed: list[dict]) -> tuple[list[dict], list[dict]]:
    """
    This function validates the feed items
    # TODO: Also check if any of the mandatory fields are set to null / None.
    """
    if len(feed) > 0:
        valid_items = []
        invalid_items = []
        for item in feed:
            try:
                news_item = NewsItemModel(**item)
                valid_items.append(news_item.model_dump())
            except ValidationError as exception:
                logger.error(repr(exception.errors()[0]["type"]))
                invalid_items.append(item)

        return (valid_items, invalid_items)

    return ([{}], [{}])
