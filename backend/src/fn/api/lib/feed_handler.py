"""
News Feed Handler Module

This module implements two main query paths for the SnapNews API:

1. LATEST PATH (/feed/latest):
   - Queries the main DynamoDB table using pk and sk
   - pk: NEWS#{country}#{language}
   - sk: UUIDv7 (naturally time-ordered)
   - Returns news sorted by publication time (newest first)
   - Pagination: Uses simple sk value as page_key

2. TOP PATH (/feed/top):
   - Queries the "byTop" Local Secondary Index (LSI)
   - pk: NEWS#{country}#{language} (same as main table)
   - sk_top: TOP#{popularity_score}#{uuidv7}
   - Returns news sorted by popularity score (highest first)
   - Pagination: Uses complex page_key containing both sk and sk_top

Access Patterns:
- Latest: pk=NEWS#{country}#{language}, sk=UUIDv7 (time-ordered)
- Top: pk=NEWS#{country}#{language}, sk_top=TOP#{score}#{uuidv7} (popularity-ordered)

The like_news_item function updates both the likes count and recalculates the sk_top
for proper popularity ranking in the TOP view.
"""

# ==================================================================================================
# Python imports
import os
from typing import Optional

# ==================================================================================================
# AWS imports
import boto3
from boto3.dynamodb.conditions import Key

# ==================================================================================================
# Module imports
from shared.logger import logger

# ==================================================================================================
# Global declarations

TABLE_NAME = os.environ["NEWS_TABLE_NAME"]
table = boto3.resource("dynamodb").Table(TABLE_NAME)


def _build_latest_query_args(pk_value: str, item_limit: int, page_key: Optional[str]) -> dict:
    """Build query arguments for LATEST view (main table)."""
    expression = Key("pk").eq(pk_value)

    query_args = {
        "KeyConditionExpression": expression,
        "Limit": item_limit,
        "ScanIndexForward": False,  # Newest first (UUIDv7 is time-ordered)
    }

    if page_key:
        try:
            query_args["ExclusiveStartKey"] = {"pk": pk_value, "sk": page_key}
            logger.info(f"Using ExclusiveStartKey with sk: {page_key}")
        except (ValueError, TypeError):
            logger.error(f"Invalid page_key format received: {page_key}. Ignoring pagination key.")

    return query_args


def _build_top_query_args(pk_value: str, item_limit: int, page_key: Optional[dict]) -> dict:
    """Build query arguments for TOP view (LSI)."""
    expression = Key("pk").eq(pk_value) & Key("sk_top").gte("TOP#")

    query_args = {
        "IndexName": "byTop",
        "KeyConditionExpression": expression,
        "Limit": item_limit,
        "ScanIndexForward": False,  # Highest popularity first
    }

    if page_key:
        try:
            # For LSI, we need pk, sk, and sk_top in ExclusiveStartKey
            if isinstance(page_key, dict) and "sk" in page_key and "sk_top" in page_key:
                query_args["ExclusiveStartKey"] = {"pk": pk_value, "sk": page_key["sk"], "sk_top": page_key["sk_top"]}
                logger.info(f"Using ExclusiveStartKey for LSI: {query_args['ExclusiveStartKey']}")
            else:
                logger.error(f"Invalid page_key format for LSI query: {page_key}. Ignoring pagination key.")
        except (ValueError, TypeError):
            logger.error(f"Invalid page_key format received: {page_key}. Ignoring pagination key.")

    return query_args


def _prepare_next_page_key(view: str, last_key: Optional[dict]) -> Optional[str | dict]:
    """Prepare next page key based on view type and last evaluated key."""
    if not last_key:
        return None

    if view == "LATEST":
        # For main table, just return the sk
        return str(last_key["sk"]) if "sk" in last_key else None
    if view == "TOP" and "sk" in last_key and "sk_top" in last_key:
        # For LSI, return both sk and sk_top for proper pagination
        return {"sk": str(last_key["sk"]), "sk_top": str(last_key["sk_top"])}

    return None


def get_feed(
    item_limit: int = 50,
    params: Optional[dict] = None,
) -> dict:
    """
    Fetches the feed from the database, filtered by category, country, and language.
    Supports both "latest" (sorted by time) and "top" (sorted by popularity) views.
    Handles pagination.
    """
    if params is None:
        params = {}
    logger.info(f"Fetching feed from {TABLE_NAME} for params={params}")

    # Construct the partition key
    country = params.get("country")
    language = params.get("language")
    view = params.get("view", "latest").upper()

    if view not in ["LATEST", "TOP"]:
        raise ValueError(f"Invalid view: {view}. Must be 'latest' or 'top'")

    pk_value = f"NEWS#{country}#{language}"
    page_key = params.get("page_key")

    # Prepare query arguments based on view type
    if view == "LATEST":
        query_args = _build_latest_query_args(pk_value, item_limit, page_key)
    else:  # TOP
        query_args = _build_top_query_args(pk_value, item_limit, page_key)

    try:
        # Execute the query
        result = table.query(**query_args)
        logger.info(f"DynamoDB query result count: {result.get('Count', 0)}")
    except Exception as e:
        logger.error(f"DynamoDB query failed: {e}")
        raise e

    # Extract items and prepare pagination info
    items = result.get("Items", [])
    last_key = result.get("LastEvaluatedKey")
    next_page_key = _prepare_next_page_key(view, last_key)

    logger.info(f"Returning {len(items)} items. Next page_key: {next_page_key}")

    return {
        "news": items,
        "page_key": next_page_key,
    }
