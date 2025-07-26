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

    feeds = source_metadata.get("feeds", {})
    logger.info(f"Processing feeds for {news_source}: {list(feeds.keys())}")

    successful_feeds = 0
    failed_feeds = 0

    for category, feed_value in feeds.items():
        logger.info(f"Processing category: {category}")

        # Handle both single URLs and arrays of URLs
        urls_to_process = []
        if isinstance(feed_value, list):
            urls_to_process = feed_value
            logger.info(f"Found {len(urls_to_process)} URLs for category {category}")
        elif isinstance(feed_value, str):
            urls_to_process = [feed_value]
            logger.info(f"Found 1 URL for category {category}")
        else:
            logger.error(f"Invalid feed value type for category {category}: {type(feed_value)}")
            failed_feeds += 1
            continue

        # Process each URL in the category
        for i, feed_url in enumerate(urls_to_process):
            try:
                logger.info(f"Processing URL {i+1}/{len(urls_to_process)} for category {category}: {feed_url}")

                # Validate that feed_url is a string
                if not isinstance(feed_url, str):
                    logger.error(f"Invalid feed URL type for category {category}: {type(feed_url)}")
                    failed_feeds += 1
                    continue

                feed = get_feed_from_rss(news_source, feed_url, category, language, country)

                if feed:  # Check if feed retrieval was successful
                    # Upload the json feed to S3
                    # For multiple URLs in same category, add index to S3 key to avoid overwrites
                    s3_key = f"{news_source}-{category}"
                    if len(urls_to_process) > 1:
                        s3_key += f"-{i+1}"
                    s3_key += ".json"

                    logger.info(f"Uploading feed to S3 with key: {s3_key}")
                    upload_feed_to_s3(feed.model_dump()["feed"], s3_key, BUCKET_NAME)
                    logger.info(f"Uploaded feed for {category} (URL {i+1}) to S3 successfully")
                    successful_feeds += 1
                else:
                    logger.warning(f"No feed data received for category: {category}, URL: {feed_url}")
                    failed_feeds += 1

            except Exception as e:
                logger.error(f"Error processing category {category} URL {feed_url}: {e}")
                failed_feeds += 1
                # Continue processing other feeds instead of raising exception
                continue

    logger.info(f"Feed processing completed. Successful: {successful_feeds}, Failed: {failed_feeds}")

    if successful_feeds == 0:
        return {"statusCode": 500, "body": f"All feeds failed to process for {news_source}"}

    return {"statusCode": 200, "body": f"Success - Processed {successful_feeds}/{successful_feeds + failed_feeds} feeds"}
