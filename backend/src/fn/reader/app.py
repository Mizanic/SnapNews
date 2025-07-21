"""
# --*-- coding: utf-8 --*--
# This module is used to read RSS feeds
"""

# ==================================================================================================
# Python imports
import os

# ==================================================================================================
# AWS imports
from aws_lambda_powertools.utilities.data_classes import EventBridgeEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext

# ==================================================================================================
# Module imports
from lib.aws_utils import get_source_metadata, upload_feed_to_s3
from lib.feed_handler import get_feed_from_rss
from shared.logger import logger

# ==================================================================================================
# Global declarations

BUCKET_NAME = os.environ["NEWS_FEED_BUCKET"]
LOG_LEVEL = os.environ["POWERTOOLS_LOG_LEVEL"]

logger.service = "Reader"
logger.setLevel(LOG_LEVEL)


@event_source(data_class=EventBridgeEvent)
def main(event: EventBridgeEvent, context: LambdaContext) -> dict:
    """
    This function is used to read RSS feeds
    """
    logger.info(f"Event: {event.raw_event}")
    logger.info(f"Context: {context}")

    news_source = str(event.get("NewsSource"))
    country = str(event.get("Country"))
    language = str(event.get("Language"))

    source_metadata = get_source_metadata(news_source, country, language)

    if not source_metadata or not isinstance(source_metadata, dict):
        logger.error(f"Invalid source metadata structure received for {news_source}: {source_metadata}")
        return {"statusCode": 400, "body": "Invalid source metadata data"}

    items = source_metadata.get("feeds", {}).items()

    for category, feed_url in items:
        logger.info(f"Processing category: {category}, URL: {feed_url}")
        try:
            feed = get_feed_from_rss(news_source, feed_url, category, language, country)

            if feed:  # Check if feed retrieval was successful
                # Upload the json feed to S3
                s3_key = f"{news_source}-{category}.json"  # Define S3 key using source and category
                logger.info(f"Uploading feed to S3 with key: {s3_key}")
                upload_feed_to_s3(feed.model_dump()["feed"], s3_key, BUCKET_NAME)
                logger.info(f"Uploaded feed for {category} to S3 successfully")
            else:
                logger.warning(f"No feed data received for category: {category}, URL: {feed_url}")

        except Exception as e:
            logger.error(f"Error processing category {category} ({feed_url}): {e}")
            raise e

    return {"statusCode": 200, "body": "Success"}
