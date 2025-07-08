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
from shared.logger import logger
from shared.news_model import SourceNewsFeedModel, SourceNewsItemModel

# ==================================================================================================
# Global declarations


def get_feed_from_s3(bucket_name: str, s3_object_name: str) -> SourceNewsFeedModel:
    """
    This function gets the stored feed from S3
    """
    logger.info(f"Getting feed from S3: {bucket_name}/{s3_object_name}")
    s3_client = boto3.client("s3")

    try:
        s3_client.download_file(bucket_name, s3_object_name, f"/tmp/{s3_object_name}")  # noqa: S108
    except ClientError as s3_error:
        logger.error(f"Error getting feed from S3: {s3_error}")
        raise s3_error

    with Path(f"/tmp/{s3_object_name}").open("r", encoding="utf-8") as infile:  # noqa: S108
        feed_data = json.load(infile)

    logger.info(f"Feed data: {feed_data}")
    feed = SourceNewsFeedModel(feed=[SourceNewsItemModel.model_validate(item) for item in feed_data])

    return feed
