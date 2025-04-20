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

# ==================================================================================================
# Global declarations


def article_exists(item: dict) -> bool:
    """
    Check if the article exists in the database
    """
    table = boto3.resource("dynamodb").Table(os.environ["NEWS_TABLE_NAME"])
    response = table.query(
        IndexName="byItemHash",
        KeyConditionExpression="pk = :pk AND item_hash = :item_hash",
        ExpressionAttributeValues={":pk": item["pk"], ":item_hash": item["item_hash"]},
    )

    logger.debug(f"Query Response: {response}")
    return response["Count"] != 0
