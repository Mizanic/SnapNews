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
from botocore.exceptions import ClientError

# ==================================================================================================
# Module imports
from shared.logger import logger

# ==================================================================================================


def upload_feed_to_s3(feed: list[dict], s3_key: str, bucket_name: str) -> None:
    """
    This function uploads the feed to S3
    """
    temp_file_path = Path(f"/tmp/{s3_key}")  # noqa: S108

    # Write the feed to a temporary file
    with temp_file_path.open("w", encoding="utf-8") as outfile:
        json.dump(feed, outfile, ensure_ascii=False, indent=4)

    # Upload the file to S3 using the correct S3 key
    s3_client = boto3.client("s3")
    try:
        s3_client.upload_file(str(temp_file_path), bucket_name, s3_key)
    except ClientError as s3_error:
        logger.error(f"Failed to upload {s3_key} to {bucket_name}: {s3_error}")
        raise s3_error
    finally:
        # Clean up the temporary file
        if temp_file_path.exists():
            temp_file_path.unlink()


def get_news_urls(news_source: str) -> dict:
    """
    This function gets the news url dictionary for the given news source
    """
    logger.info(f"Getting news url for {news_source}")
    logger.info(f"News table name: {os.environ['NEWS_TABLE_NAME']}")

    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(os.environ["NEWS_TABLE_NAME"])

    response = table.get_item(Key={"pk": f"SOURCE#{news_source}", "sk": f"SOURCE#{news_source}"})
    item = response.get("Item")

    if item:
        return item.get("Sources")[0]

    msg = f"News source {news_source} not found"
    raise ValueError(msg)
