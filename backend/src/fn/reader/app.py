"""
# --*-- coding: utf-8 --*--
# This module is used to read RSS feeds
"""

# ==================================================================================================
# Python imports
import os

# ==================================================================================================
# AWS imports
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.utilities.data_classes import EventBridgeEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext

# ==================================================================================================
# Module imports
from lib.aws_utils import get_news_url, upload_feed_to_s3
from lib.feed_handler import get_feed_from_rss

# ==================================================================================================
# Global declarations
tracer = Tracer()
logger = Logger()

BUCKET_NAME = os.environ["NEWS_FEED_BUCKET"]


@event_source(data_class=EventBridgeEvent)
def main(event: EventBridgeEvent, context: LambdaContext) -> dict:
    """
    This function is used to read RSS feeds
    """
    logger.info(f"Context: {context}")

    news_source: str = event["NewsSource"]
    news_url: str = get_news_url(news_source)

    logger.info(f"News URL: {news_url}")
    ## Get the json feed
    # logger.info(f"Getting feed for {news_source}")
    # feed = get_feed_from_rss(news_source, news_url)
    # logger.info(f"Feed for {news_source} is {feed}")

    # ## Upload the json feed to S3
    # logger.info("Uploading feed to S3")
    # upload_feed_to_s3(feed, news_source, BUCKET_NAME)
    # logger.info("Uploaded feed to S3 successfully")

    return {"statusCode": 200, "body": "Success"}
