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
from aws_lambda_powertools.utilities.data_classes import SQSEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext
from botocore.exceptions import ClientError

# ==================================================================================================
# Module imports
from lib.utils import article_exists
from shared.logger import logger

# ==================================================================================================
# Global declarations
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["NEWS_TABLE_NAME"])


@event_source(data_class=SQSEvent)
def main(event: SQSEvent, context: LambdaContext) -> dict:  # noqa: ARG001
    """
    This function is used to read RSS feeds
    """
    logger.info("Yo! I'm a handler of the Databases")
    message = json.loads(event["Records"][0]["body"])
    logger.info(message)

    try:
        if article_exists(message) is False:
            logger.info(f"Item {message['item_hash']} does not exist in the database")
            table.put_item(Item=message)
        else:
            logger.info(f"Item {message['item_hash']} already exists in the database")
    except ClientError as dynamodb_error:
        logger.error(dynamodb_error)
        raise dynamodb_error

    return {"statusCode": 200, "body": "Success"}
