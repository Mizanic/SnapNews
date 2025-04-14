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
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.utilities.data_classes import SQSEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext
from botocore.exceptions import ClientError

# ==================================================================================================
# Global declarations
tracer = Tracer()
logger = Logger()


@event_source(data_class=SQSEvent)
def main(event: SQSEvent, context: LambdaContext) -> dict:  # noqa: ARG001
    """
    This function is used to read RSS feeds
    """
    logger.info("Yo! I'm a handler of the Databases")
    message = json.loads(event["Records"][0]["body"])
    logger.info(message)

    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(os.environ["NEWS_TABLE_NAME"])

    try:
        table.put_item(Item=message)
    except ClientError as dynamodb_error:
        logger.error(dynamodb_error)
        raise dynamodb_error

    return {"statusCode": 200, "body": "Success"}
