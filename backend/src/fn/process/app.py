"""
# --*-- coding: utf-8 --*--
# This module is used to process S3 files
"""

# ==================================================================================================
# Python imports
import json
import os

# ==================================================================================================
# AWS imports
import boto3
from aws_lambda_powertools.utilities.data_classes import EventBridgeEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext

# ==================================================================================================
# Module imports
from lib.aws_utils import article_exists, get_feed_from_s3
from lib.preprocess import inject_metadata, validate_feed_items
from shared.logger import logger

# ==================================================================================================
# Global declarations

PROCESSED_NEWS_QUEUE_NAME = os.environ["PROCESSED_NEWS_QUEUE_NAME"]


@event_source(data_class=EventBridgeEvent)
def main(event: EventBridgeEvent, context: LambdaContext) -> dict:
    """
    This function is used to read RSS feeds
    """
    logger.info("I'm a process being invoked by S3 Notification!")
    logger.info(event.raw_event)
    logger.info(context)

    bucket_name: str = event["detail"]["bucket"]["name"]
    object_name: str = event["detail"]["object"]["key"]

    # Read the file from S3

    logger.info("Reading file from S3")
    feed = get_feed_from_s3(bucket_name, object_name)
    logger.info(feed)

    feed_with_metadata = inject_metadata(feed)

    validated_feed, defective_feed = validate_feed_items(feed_with_metadata)

    logger.info(f"Validated feed: {validated_feed}")
    logger.info(f"Defective feed: {defective_feed}")

    logger.info("QUEUE_NAME: %s", PROCESSED_NEWS_QUEUE_NAME)
    queue = boto3.resource("sqs").get_queue_by_name(QueueName=PROCESSED_NEWS_QUEUE_NAME)

    # Send the message to SQS
    for item in validated_feed:
        logger.info(f"Processing item {item}")
        # query dynamodb to see if the item exists by using "url_hash" as the sk in LSI named "byUrlHash"

        if article_exists(item) is False:
            logger.info(f"Item {item['url_hash']} does not exist in the database")
            queue.send_message(MessageBody=json.dumps(item))
        else:
            logger.info(f"Item {item['url_hash']} already exists in the database")

    return {"statusCode": 200, "body": "Success"}
