"""
# --coding: utf-8 --
# AWS Utilities
# Utilities related to operations on AWS
"""

# ==================================================================================================
# Python imports
import os

# ==================================================================================================
# AWS imports
import boto3

# ==================================================================================================
# Module imports
from shared.logger import logger
from shared.news_model import ProcessedNewsItemModel

# ==================================================================================================
# Global declarations
NEWS_TABLE_NAME = os.environ["NEWS_TABLE_NAME"]
table = boto3.resource("dynamodb").Table(NEWS_TABLE_NAME)


def article_exists(pk: str, item_hash: str) -> ProcessedNewsItemModel | None:
    """
    Check if the article exists in the database
    """
    response = table.query(
        IndexName="byItemHash",
        KeyConditionExpression="pk = :pk AND item_hash = :item_hash",
        ExpressionAttributeValues={":pk": pk, ":item_hash": item_hash},
    )

    logger.info(f"Response: {response}")

    if response["Items"]:
        return ProcessedNewsItemModel.model_validate(response["Items"][0])

    return None
