"""
Docstring for module.
"""

# ==================================================================================================
# Python imports
import os
import time
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


def get_feed(
    duration_hours: int = 24,
    item_limit: int = 50,
    params: Optional[dict] = None,
) -> dict:
    """
    Fetches the feed from the database, filtered by category, country, and language.
    Sorts by timestamp (descending implicitly via query on SK).
    Handles pagination.
    """
    if params is None:
        params = {}
    logger.info(f"Fetching feed from {TABLE_NAME} for params={params}")

    time_now = int(time.time())
    # Ensure timestamp is a number for comparison
    time_before = str(time_now - (duration_hours * 60 * 60))

    # Construct the partition key including category
    country = params.get("country")
    language = params.get("language")
    category = params.get("category")

    pk_value = f"NEWS#{country}#{language}#{category}"

    # Define the key condition expression using the full PK and numeric timestamp SK
    expression = Key("pk").eq(pk_value) & Key("sk").gte(time_before)

    # Use a different name for the query arguments dictionary
    query_args = {
        "KeyConditionExpression": expression,
        "Limit": item_limit,
        "ScanIndexForward": False,  # Assuming newest first (requires SK to be timestamp)
    }

    # Safely access start_key from the original params dictionary
    page_key = params.get("page_key")
    if page_key:
        try:
            # ExclusiveStartKey requires the full key (pk and sk) of the last evaluated item.
            # Assume start_key provided by the client is the numeric timestamp (sk) as a string.
            start_sk = page_key
            # Add ExclusiveStartKey to the query_args dictionary
            query_args["ExclusiveStartKey"] = {"pk": pk_value, "sk": start_sk}
            logger.info(f"Using ExclusiveStartKey with sk: {start_sk}")
        except (ValueError, TypeError):
            logger.error(f"Invalid start_key format received: {page_key}. Ignoring pagination key.")
            # Optionally, you could return an error response here instead of just logging.

    try:
        # Pass the correctly constructed query_args to the query
        result = table.query(**query_args)
        logger.info(f"DynamoDB query result count: {result.get('Count', 0)}")
    except Exception as e:
        logger.error(f"DynamoDB query failed: {e}")
        raise e

    # Extract items and the next page key (SK of the last evaluated item)
    items = result.get("Items", [])
    last_key = result.get("LastEvaluatedKey")

    # Return the SK (timestamp) as a string for the client
    next_page_key = str(last_key["sk"]) if last_key and "sk" in last_key else None
    logger.info(f"Returning {len(items)} items. Next page_key: {next_page_key}")

    response = {
        "news": items,
        "page_key": next_page_key,
    }
    return response


def like_news_item(item_pk: str, item_hash: str, item_sk: str) -> dict:
    """
    Likes a news item
    """
    logger.info(f"Liking news item with hash: {item_hash}")
    try:
        table.update_item(
            IndexName="byItemHash",
            Key={"pk": item_pk, "sk": item_hash},
            UpdateExpression="SET likes = likes + :inc",
            ExpressionAttributeValues={":inc": 1},
        )
    except Exception as e:
        logger.error(f"Error liking news item: {e}")
        raise e
    return {"message": "Liked"}
