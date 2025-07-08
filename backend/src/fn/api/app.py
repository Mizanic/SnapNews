"""
# --*-- coding: utf-8 --*--
# This module defines the REST API routes
"""

# ==================================================================================================
# Python imports
import json

# ==================================================================================================
# AWS imports
from aws_lambda_powertools.event_handler import APIGatewayRestResolver, CORSConfig
from aws_lambda_powertools.utilities.typing import LambdaContext

# ==================================================================================================
# Module imports
from lib.feed_handler import get_feed
from shared.lambda_response import RESPONSE
from shared.logger import logger

# ==================================================================================================
# Global declarations
PAGE_SIZE = 50

cors_config = CORSConfig(
    allow_origin="*",
    allow_headers=["*"],
)

app = APIGatewayRestResolver(enable_validation=True, cors=cors_config)

app.enable_swagger(path="/docs", title="News Feed API", version="1.0.0", description="API for the News Feed")


@app.get("/")
def feed() -> dict:
    """
    Get the latest feed
    """

    # Fetch all news items that are published in last 24 hours

    response = {"message": "Hello, World!"}  # get_feed(duration_hours=DURATION_HOURS)
    logger.info(response)
    logger.info(f"Count: {len(response)}")

    return RESPONSE(response)


@app.get("/feed/latest")
def feed_latest() -> dict:
    """
    Get the latest feed sorted by time
    """

    # Get the country and language from query string
    country = app.current_event["queryStringParameters"].get("country") if app.current_event["queryStringParameters"] else None
    language = app.current_event["queryStringParameters"].get("language") if app.current_event["queryStringParameters"] else None

    if not all([country, language]):
        logger.error("Missing required parameters: country, language")
        # Return an appropriate error response
        return RESPONSE(status_code=400, body={"news": [], "page_key": None, "error": "Missing required parameters"})

    # Check if any Query String Parameters are passed
    page_key = app.current_event["queryStringParameters"].get("page_key") if app.current_event["queryStringParameters"] else None

    logger.info(f"start_key: {page_key}")
    logger.info(f"country: {country}")
    logger.info(f"language: {language}")

    # Fetch the feed from the database

    response_params = {
        "view": "LATEST",
        "page_key": page_key,
        "country": country,
        "language": language,
    }

    response = get_feed(
        item_limit=PAGE_SIZE,
        params=response_params,
    )

    logger.info(response)

    return RESPONSE(response)


@app.get("/feed/top")
def feed_top() -> dict:
    """
    Get the top feed sorted by popularity
    """

    # Get the country and language from query string
    country = app.current_event["queryStringParameters"].get("country") if app.current_event["queryStringParameters"] else None
    language = app.current_event["queryStringParameters"].get("language") if app.current_event["queryStringParameters"] else None

    if not all([country, language]):
        logger.error("Missing required parameters: country, language")
        # Return an appropriate error response
        return RESPONSE(status_code=400, body={"news": [], "page_key": None, "error": "Missing required parameters"})

    # Check if any Query String Parameters are passed
    page_key_param = app.current_event["queryStringParameters"].get("page_key") if app.current_event["queryStringParameters"] else None

    # For top view, page_key might be a JSON string containing sk and sk_top
    page_key = None
    if page_key_param:
        try:

            # Try to parse as JSON for complex pagination key
            page_key = json.loads(page_key_param)
        except (json.JSONDecodeError, TypeError):
            # If it's not JSON, treat as simple string (backward compatibility)
            page_key = page_key_param

    logger.info(f"page_key: {page_key}")
    logger.info(f"country: {country}")
    logger.info(f"language: {language}")

    # Fetch the feed from the database

    response_params = {
        "view": "TOP",
        "page_key": page_key,
        "country": country,
        "language": language,
    }

    response = get_feed(
        item_limit=PAGE_SIZE,
        params=response_params,
    )

    # Convert page_key back to JSON string if it's a dict for the client
    if response.get("page_key") and isinstance(response["page_key"], dict):
        response["page_key"] = json.dumps(response["page_key"])

    logger.info(response)

    return RESPONSE(response)


def main(event: dict, context: LambdaContext):  # noqa: ANN201
    """
    The lambda handler method: It resolves the proxy route and invokes the appropriate method
    """

    logger.info(event)
    return app.resolve(event, context)
