"""
# --*-- coding: utf-8 --*--
# This module is used to process S3 files
"""

# ==================================================================================================
# Python imports
import json  # noqa: I001
import os

from pydantic import ValidationError

# ==================================================================================================
# AWS imports
import boto3
from aws_lambda_powertools.utilities.data_classes import EventBridgeEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext

# ==================================================================================================
# Module imports
from lib.aws_utils import get_feed_from_s3
from lib.preprocess import inject_data, validate_feed_items
from shared.logger import logger
from shared.news_model import ProcessedNewsItemModel

# ==================================================================================================
# Global declarations

PROCESSED_NEWS_QUEUE_NAME = os.environ["PROCESSED_NEWS_QUEUE_NAME"]
processed_news_queue = boto3.resource("sqs").get_queue_by_name(QueueName=PROCESSED_NEWS_QUEUE_NAME)


@event_source(data_class=EventBridgeEvent)
def main(event: EventBridgeEvent, context: LambdaContext) -> dict:
    """
    This function is used to read RSS feeds
    """
    logger.info("Processing feed!")
    logger.info(event.raw_event)
    logger.info(context)

    bucket_name: str = event["detail"]["bucket"]["name"]
    object_name: str = event["detail"]["object"]["key"]

    # Read the file from S3

    logger.info("Reading file from S3")

    try:
        feed = get_feed_from_s3(bucket_name, object_name)
    except ValidationError as e:
        logger.error(f"Validation error for feed {object_name}", exc_info=e)
        raise e

    feed_with_metadata = inject_data(feed)

    validated_feed, defective_feed = validate_feed_items(feed_with_metadata.model_dump()["feed"])

    logger.info(f"Validated feed: {validated_feed}")
    logger.info(f"Defective feed: {defective_feed}")

    # Send the message to SQS
    for item in validated_feed:
        logger.info(f"Processing item {item}")
        ProcessedNewsItemModel.model_validate(item)
        # query dynamodb to see if the item exists by using "item_hash" as the sk in LSI named "byItemHash"
        try:
            processed_news_queue.send_message(MessageBody=json.dumps(item))
        except Exception as e:
            logger.error(f"Error sending message to SQS: {e}")
            raise e

    return {"statusCode": 200, "body": "Success"}
