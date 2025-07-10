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
from shared.logger import logger
from shared.utils import article_exists

# ==================================================================================================
# Global declarations
LOG_LEVEL = os.environ["POWERTOOLS_LOG_LEVEL"]

logger.service = "Updater"
logger.setLevel(LOG_LEVEL)


dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["NEWS_TABLE_NAME"])


@event_source(data_class=SQSEvent)
def main(event: SQSEvent, context: LambdaContext) -> dict:  # noqa: ARG001
    """
    This function is used to read RSS feeds
    """
    logger.info("Updating news feed")
    message = json.loads(event["Records"][0]["body"])
    logger.info(message)

    article = article_exists(message)
    logger.info(f"Article: {article}")

    try:
        if article is None:
            logger.info(f"Item {message['item_hash']} does not exist in the database. Creating it.")
            table.put_item(Item=message)
        else:
            logger.info(f"Item {message['item_hash']} already exists in the database.")
            logger.info("Adding the category to the list of categories of the item")

            # Get existing categories and new categories
            existing_categories = article.categories
            new_categories = message["categories"]

            # Combine and deduplicate categories
            merged_categories = list(set(existing_categories + new_categories))

            table.update_item(
                Key={"pk": article.pk, "sk": article.sk},
                UpdateExpression="SET #categories = :categories",
                ExpressionAttributeNames={"#categories": "categories"},
                ExpressionAttributeValues={":categories": merged_categories},
            )
    except ClientError as dynamodb_error:
        logger.error(dynamodb_error)
        raise dynamodb_error

    return {"statusCode": 200, "body": "Success"}
