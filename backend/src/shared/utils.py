"""
# --coding: utf-8 --
# AWS Utilities
# Utilities related to operations on AWS
"""

# ==================================================================================================
# Python imports
import os
from typing import Optional

# ==================================================================================================
# AWS imports
import boto3
from pydantic import BaseModel

# ==================================================================================================
# Module imports
from shared.logger import logger

# ==================================================================================================
# Global declarations


class ArticleExistsResponse(BaseModel):
    pk: str
    sk: str
    categories: list[str]


def article_exists(item: dict) -> Optional[ArticleExistsResponse]:
    """
    Check if the article exists in the database
    """
    table = boto3.resource("dynamodb").Table(os.environ["NEWS_TABLE_NAME"])
    response = table.query(
        IndexName="byItemHash",
        KeyConditionExpression="pk = :pk AND item_hash = :item_hash",
        ExpressionAttributeValues={":pk": item["pk"], ":item_hash": item["item_hash"]},
    )

    logger.info(f"Response: {response}")

    # Return the pk and sk of the item if it exists
    if response["Items"]:
        return ArticleExistsResponse(
            pk=response["Items"][0]["pk"],
            sk=response["Items"][0]["sk"],
            categories=response["Items"][0]["categories"],
        )

    return None
