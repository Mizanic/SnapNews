"""
# --*-- coding: utf-8 --*--
# This module defines the REST API routes
"""

# ==================================================================================================
# Python imports
from typing import Annotated, Optional

# ==================================================================================================
# AWS imports
from aws_lambda_powertools.event_handler import APIGatewayRestResolver, CORSConfig
from aws_lambda_powertools.event_handler.openapi.params import Body, Query
from aws_lambda_powertools.utilities.typing import LambdaContext

# ==================================================================================================
# Module imports
from lib.feed_handler import get_feed
from shared.lambda_response import RESPONSE
from shared.logger import logger
from shared.news_model import BatchActionModel

# ==================================================================================================
# Global declarations
PAGE_SIZE = 50

cors_config = CORSConfig(
    allow_origin="*",
    allow_headers=["*"],
)

app = APIGatewayRestResolver(enable_validation=True, cors=cors_config)

app.enable_swagger(
    path="/docs",
    title="News Feed API",
    version="1.0.0",
    description="API for fetching news feeds for SnapNews",
)


@app.get("/")
def feed() -> dict:
    """
    Get the latest feed

    Returns:
        dict: Welcome message response
    """

    # Fetch all news items that are published in last 24 hours

    response = {"message": "Hello, World!"}  # get_feed(duration_hours=DURATION_HOURS)
    logger.info(response)
    logger.info(f"Count: {len(response)}")

    return RESPONSE(response)


@app.get("/feed/latest")
def feed_latest(
    country: Annotated[str, Query(description="Country code ('IN')")],
    language: Annotated[str, Query(description="Language code ('EN')")],
    page_key: Annotated[Optional[str], Query(description="Pagination key for next page")] = None,
) -> dict:
    """
    Get the latest feed sorted by time

    Args:
        country: Country code (required)
        language: Language code (required)
        page_key: Pagination key for next page (optional)

    Returns:
        dict: Feed response with news items and pagination info
    """

    if not all([country, language]):
        logger.error("Missing required parameters: country, language")
        # Return an appropriate error response
        return RESPONSE(status_code=400, body={"news": [], "page_key": None, "error": "Missing required parameters"})

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
def feed_top(
    country: Annotated[str, Query(description="Country code ('IN')")],
    language: Annotated[str, Query(description="Language code ('EN')")],
    page_key: Annotated[Optional[str], Query(description="Pagination key for next page")] = None,
) -> dict:
    """
    Get the top feed sorted by popularity

    Args:
        country: Country code (required)
        language: Language code (required)
        page_key: Pagination key for next page (optional)

    Returns:
        dict: Feed response with news items and pagination info
    """

    if not all([country, language]):
        logger.error("Missing required parameters: country, language")
        # Return an appropriate error response
        return RESPONSE(status_code=400, body={"news": [], "page_key": None, "error": "Missing required parameters"})

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

    logger.info(response)

    return RESPONSE(response)


@app.post("/actions")
def actions(batch_action: Annotated[BatchActionModel, Body(description="Batch of actions to perform on news items")]) -> dict:
    """
    Handle actions on a news item

    Args:
        batch_action: Batch of actions containing news item IDs and metrics updates

    Returns:
        dict: Response with message indicating success or failure
    """
    logger.info(f"Received batch action: {batch_action.model_dump()}")

    # Process the validated batch action
    # The data is already validated by AWS Lambda Powertools using the BatchActionModel

    # TODO: Implement actual action processing logic here
    # For example:
    # - Update metrics in database
    # - Send analytics events
    # - Update recommendation scores

    return RESPONSE(status_code=200, body={"message": f"Successfully processed {len(batch_action.actions)} actions"})


def main(event: dict, context: LambdaContext) -> dict:
    """
    The lambda handler method: It resolves the proxy route and invokes the appropriate method
    """

    logger.info(event)
    return app.resolve(event, context)
