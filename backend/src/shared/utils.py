"""
# --coding: utf-8 --
# AWS Utilities
# Utilities related to operations on AWS
"""

# ==================================================================================================
# Python imports

# ==================================================================================================
# AWS imports
import boto3

# ==================================================================================================
# Module imports
from shared.logger import logger
from shared.news_model import ProcessedNewsItemModel

# ==================================================================================================
# Global declarations


def article_exists(table_name: str, pk: str, item_hash: str) -> ProcessedNewsItemModel | None:
    """
    Check if the article exists in the database
    """
    table = boto3.resource("dynamodb").Table(table_name)

    response = table.query(
        IndexName="byItemHash",
        KeyConditionExpression="pk = :pk AND item_hash = :item_hash",
        ExpressionAttributeValues={":pk": pk, ":item_hash": item_hash},
    )

    logger.info(f"Response: {response}")

    if response["Items"]:
        return ProcessedNewsItemModel.model_validate(response["Items"][0])

    return None
