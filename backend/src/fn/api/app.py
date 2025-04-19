"""
# --*-- coding: utf-8 --*--
# This module defines the REST API routes
"""

# ==================================================================================================
# Python imports

# ==================================================================================================
# AWS imports
from aws_lambda_powertools.event_handler import api_gateway
from aws_lambda_powertools.utilities.typing import LambdaContext

# ==================================================================================================
# Module imports
from lib.feed_handler import get_feed
from shared.logger import logger

# ==================================================================================================
# Global declarations
DURATION_HOURS = 14 * 24
PAGE_SIZE = 50

app = api_gateway.APIGatewayRestResolver()


@app.get("/")
def feed() -> dict:
    """
    Get the latest feed
    """

    # Fetch all news items that are published in last 24 hours

    response = {"message": "Hello, World!"}  # get_feed(duration_hours=DURATION_HOURS)
    logger.info(response)
    logger.info(f"Count: {len(response)}")

    return response


@app.get("/feed")
def feed_paginated() -> dict:
    """
    Get the paginated feed
    """

    # Get the country and language from query string
    country = app.current_event["queryStringParameters"].get("country") if app.current_event["queryStringParameters"] else None
    language = app.current_event["queryStringParameters"].get("language") if app.current_event["queryStringParameters"] else None
    category = app.current_event["queryStringParameters"].get("category") if app.current_event["queryStringParameters"] else None

    if not all([country, language, category]):
        logger.error("Missing required parameters: country, language, or category")
        # Return an appropriate error response
        return {"news": [], "page_key": None, "error": "Missing required parameters"}

    # Check if any Query String Parameters are passed
    page_key = app.current_event["queryStringParameters"].get("page_key") if app.current_event["queryStringParameters"] else None

    logger.info(f"category: {category}")
    logger.info(f"start_key: {page_key}")
    logger.info(f"country: {country}")
    logger.info(f"language: {language}")

    # Fetch the feed from the database

    response_params = {
        "category": category,
        "page_key": page_key,
        "country": country,
        "language": language,
    }

    response = get_feed(
        duration_hours=DURATION_HOURS,
        item_limit=PAGE_SIZE,
        params=response_params,
    )

    logger.info(response)

    return response


@app.post("/like")
def like() -> dict:
    """
    Like a news item
    """

    item_hash = app.current_event["body"]["item_hash"]

    return {"message": "Liked"}


def main(event: dict, context: LambdaContext):  # noqa: ANN201
    """
    The lambda handler method: It resolves the proxy route and invokes the appropriate method
    """

    logger.info(event)
    return app.resolve(event, context)
