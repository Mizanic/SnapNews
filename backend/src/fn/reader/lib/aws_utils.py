"""
# --coding: utf-8 --
# AWS Utilities
# Utilities related to operations on AWS
"""

# ==================================================================================================
# Python imports
import json
from pathlib import Path

# ==================================================================================================
# AWS imports
import boto3
from botocore.exceptions import ClientError

# ==================================================================================================
# Module imports
# from .logger import logger  # noqa: ERA001

# ==================================================================================================

def upload_feed_to_s3(feed: list[dict], news_source: str, bucket_name: str) -> None:
    """
    This function uploads the feed to S3
    """
    temp_file_name = Path(f"/tmp/{news_source}-latest.json")  # noqa: S108
    s3_object_name = Path(f"{news_source}-latest.json")

    # Write the feed to a temporary file
    with Path(temp_file_name).open("w", encoding="utf-8") as outfile:
        json.dump(feed, outfile, ensure_ascii=False, indent=4)

    # Upload the file to S3
    s3_client = boto3.client("s3")
    try:
        s3_client.upload_file(temp_file_name, bucket_name, s3_object_name)
    except ClientError as s3_error:
        raise s3_error
