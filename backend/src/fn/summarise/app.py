"""
# --*-- coding: utf-8 --*--
# This module is used to scrape the content from the news item
"""

# ==================================================================================================
# Python imports
import json
import os

# ==================================================================================================
# AWS imports
import boto3
from aws_lambda_powertools.utilities.data_classes import SQSEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext
from lib import scrapers

# ==================================================================================================
# Module imports
from shared.ai import GEMINI
from shared.logger import logger
from shared.news_model import ProcessedNewsItemModel
from shared.utils import article_exists

# ==================================================================================================
# Global declarations

SUMMARISED_QUEUE_NAME = os.environ["SUMMARISED_NEWS_QUEUE_NAME"]
SSM_GEMINI_API_KEY = os.environ["SSM_GEMINI_API_KEY"]
GEMINI_MODEL_NAME = os.environ["GEMINI_MODEL_NAME"]
LOG_LEVEL = os.environ["POWERTOOLS_LOG_LEVEL"]

logger.service = "Summariser"
logger.setLevel(LOG_LEVEL)


ssm = boto3.client("ssm")
GEMINI_API_KEY = ssm.get_parameter(Name=SSM_GEMINI_API_KEY, WithDecryption=True)["Parameter"]["Value"]

summarised_queue = boto3.resource("sqs").Queue(SUMMARISED_QUEUE_NAME)


# Custom Exceptions for better error signaling
class ScraperNotFoundError(Exception):
    """Base exception for scraper not found errors."""


class ScraperError(Exception):
    """Base exception for scraper errors."""


def get_summary(item: ProcessedNewsItemModel) -> str:
    """
    This function gets the summary for a news item
    """
    try:
        # Get the appropriate parser class based on feed_source
        scraper_class = getattr(scrapers, item.source_id)
    except AttributeError as e:
        logger.error(f"Parser class '{item.source_id}' not found in parsers module.", exc_info=e)
        raise ScraperNotFoundError(f"Parser '{item.source_id}' not found.") from e

    try:
        scraper = scraper_class()
        article = scraper.get_article(item.news_url)
    except Exception as e:
        logger.error(f"Error getting article from {item.news_url}", exc_info=e)
        raise ScraperError(f"Error getting article from {item.news_url}") from e

    try:
        logger.info(f"Generating summary for {item.news_url}")
        gemini = GEMINI(api_key=GEMINI_API_KEY, model_name=GEMINI_MODEL_NAME)
        summary = gemini.generate_summary(article)
    except Exception as e:  # noqa: BLE001
        logger.debug(f"Error generating summary for {item.news_url}", exc_info=e)
        logger.info(f"Keeping the original summary for {item.news_url}")
        summary = item.summary

    return summary


@event_source(data_class=SQSEvent)
def main(event: SQSEvent, context: LambdaContext) -> dict:  # noqa: ARG001
    """
    This function is used to scrape and summarise news items
    """
    for record in event.records:
        processed_item = ProcessedNewsItemModel.model_validate_json(record.body)

        stored_item = article_exists(processed_item.pk, processed_item.item_hash)

        if stored_item is None:
            summary = get_summary(processed_item)
            logger.info(f"Summary for {processed_item.news_url}: {summary}")
            processed_item.summary = summary
        else:
            logger.info(f"Item already exists in the database: {stored_item}")
            logger.info("Skipping summarisation, sending for possible category update")
            processed_item.summary = stored_item.summary

        # Send item to the summarised queue
        summarised_queue.send_message(MessageBody=json.dumps(processed_item.model_dump()))
        logger.info(f"Sent item for {processed_item.news_url} to the summarised queue")

    return {"statusCode": 200, "body": "Success"}
