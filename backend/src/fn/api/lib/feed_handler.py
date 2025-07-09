"""
News Feed Handler Module

This module implements two main query paths for the SnapNews API:

1. LATEST PATH (/feed/latest):
   - Queries the main DynamoDB table using pk and sk
   - pk: NEWS#{country}#{language}
   - sk: UUIDv7 (naturally time-ordered)
   - Returns news sorted by publication time (newest first)
   - Pagination: Uses simple sk value as page_key (string)

2. TOP PATH (/feed/top):
   - Queries the "byTop" Local Secondary Index (LSI)
   - pk: NEWS#{country}#{language} (same as main table)
   - sk_top: TOP#{popularity_score}#{uuidv7}
   - Returns news sorted by popularity score (highest first)
   - Pagination: Uses encoded page_key (string) containing pk, sk, and sk_top

Access Patterns:
- Latest: pk=NEWS#{country}#{language}, sk=UUIDv7 (time-ordered)
- Top: pk=NEWS#{country}#{language}, sk_top=TOP#{score}#{uuidv7} (popularity-ordered)

Both endpoints expose a consistent API with simple string page_key parameters,
with the complexity of DynamoDB's LSI pagination requirements handled internally.
"""

# ==================================================================================================
# Python imports
import base64
import json
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


def _encode_page_key(key_dict: dict) -> str:
    """Encode a DynamoDB key as a base64 string for clean API interface."""
    json_str = json.dumps(key_dict, sort_keys=True)
    return base64.b64encode(json_str.encode()).decode()


def _decode_page_key(page_key: str) -> dict:
    """Decode a base64 page key back to DynamoDB key format."""
    try:
        json_str = base64.b64decode(page_key.encode()).decode()
        return json.loads(json_str)
    except (ValueError, json.JSONDecodeError):
        raise ValueError(f"Invalid page_key format: {page_key}") from None


def _build_latest_query_args(pk_value: str, item_limit: int, page_key: Optional[str]) -> dict:
    """Build query arguments for LATEST view (main table)."""
    query_args = {
        "KeyConditionExpression": Key("pk").eq(pk_value),
        "Limit": item_limit,
        "ScanIndexForward": False,  # Newest first (UUIDv7 is time-ordered)
    }

    if page_key:
        try:
            # For main table, page_key is just the sk value
            query_args["ExclusiveStartKey"] = {"pk": pk_value, "sk": page_key}
            logger.info(f"Using ExclusiveStartKey with sk: {page_key}")
        except (ValueError, TypeError):
            logger.error(f"Invalid page_key format received: {page_key}. Ignoring pagination key.")

    return query_args


def _build_top_query_args(pk_value: str, item_limit: int, page_key: Optional[str]) -> dict:
    """Build query arguments for TOP view (LSI)."""
    query_args = {
        "IndexName": "byTop",
        "KeyConditionExpression": Key("pk").eq(pk_value) & Key("sk_top").gte("TOP#"),
        "Limit": item_limit,
        "ScanIndexForward": False,  # Highest popularity first
    }

    if page_key:
        try:
            # Decode the base64 page_key to get the complete DynamoDB key structure
            decoded_key = _decode_page_key(page_key)
            # For LSI, we need pk, sk, and sk_top for proper DynamoDB pagination
            if "pk" in decoded_key and "sk" in decoded_key and "sk_top" in decoded_key:
                query_args["ExclusiveStartKey"] = decoded_key
                logger.info(f"Using complete ExclusiveStartKey for LSI: {decoded_key}")
            else:
                logger.error("Incomplete key structure in page_key. Ignoring pagination key.")
        except (ValueError, TypeError):
            logger.error(f"Invalid page_key format received: {page_key}. Ignoring pagination key.")

    return query_args


def _prepare_next_page_key(view: str, last_key: Optional[dict]) -> Optional[str]:
    """Prepare next page key based on view type and last evaluated key."""
    if not last_key:
        return None

    if view == "LATEST":
        # For main table, return just the sk value (simple string)
        return str(last_key["sk"]) if "sk" in last_key else None
    if view == "TOP" and "pk" in last_key and "sk" in last_key and "sk_top" in last_key:
        # For LSI, encode the complete key structure as base64 string for clean API
        complete_key = {"pk": str(last_key["pk"]), "sk": str(last_key["sk"]), "sk_top": str(last_key["sk_top"])}
        return _encode_page_key(complete_key)

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
