"""
# --coding: utf-8 --
# AWS Utilities
# Utilities related to operations on AWS
"""

# ==================================================================================================
# Python imports
import json
import os
from pathlib import Path

# ==================================================================================================
# AWS imports
import boto3
from aws_lambda_powertools import Logger
from botocore.exceptions import ClientError

# ==================================================================================================
# Global declarations
logger = Logger(service="pre-processor")


def get_feed_from_s3(bucket_name: str, s3_object_name: str) -> list[dict]:
    """
    This function gets the stored feed from S3
    """

    s3_client = boto3.client("s3")

    try:
        s3_client.download_file(bucket_name, s3_object_name, f"/tmp/{s3_object_name}")  # noqa: S108
    except ClientError as s3_error:
        raise s3_error

    with Path(f"/tmp/{s3_object_name}").open("r", encoding="utf-8") as infile:  # noqa: S108
        feed = json.load(infile)

    return feed


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
