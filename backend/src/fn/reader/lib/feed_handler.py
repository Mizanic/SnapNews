"""
# --*-- coding: utf-8 --*--
# This module contains the feed handler
# FEED_HANDLER reads RSS feeds and returns a JSON object containing the feed data
"""

# ==================================================================================================
# Python imports
import requests
import requests.exceptions
from lxml import etree as ET  # noqa: N812

# ==================================================================================================
# Module imports
from shared.logger import logger  # Import the Powertools logger

from . import parsers

# ==================================================================================================


# Custom Exceptions for better error signaling
class FeedError(Exception):
    """Base exception for feed handling errors."""

    pass


class FeedFetchError(FeedError):
    """Error during feed fetching."""

    pass


class FeedParseError(FeedError):
    """Error during XML parsing."""

    pass


class ParserNotFoundError(FeedError):
    """Parser class for the source not found."""

    pass


class ParserExecutionError(FeedError):
    """Error occurred within a specific feed parser."""

    pass


SUCCESS_STATUS_CODE = 200
HEADERS = {"User-Agent": "SnapNewsReader/1.0"}  # It's good practice to identify your bot

# Define expected XML content types
XML_CONTENT_TYPES = ["application/xml", "text/xml", "application/rss+xml", "application/atom+xml"]


def get_feed_from_rss(feed_source: str, feed_url: str) -> list[dict]:
    """
    Fetches and parses an RSS feed using lxml and custom parsers, raising specific exceptions on failure.

    Args:
        feed_source: The name of the parser class (e.g., 'TimesOfIndia', 'NDTV').
        feed_url: The URL of the RSS feed.

    Returns:
        A list of dictionaries representing the feed items.

    Raises:
        FeedFetchError: If the feed cannot be fetched (network, timeout, bad status).
        FeedParseError: If the fetched content is not valid XML or has wrong content type.
        ParserNotFoundError: If the specified parser class doesn't exist.
        ParserExecutionError: If an error occurs within the custom parser logic.
    """
    try:
        response = requests.get(feed_url, timeout=30, headers=HEADERS)
        response.raise_for_status()  # Raises HTTPError for bad status codes (4xx or 5xx)

    except requests.exceptions.Timeout as e:
        logger.error(f"Timeout error fetching feed from {feed_url}", exc_info=e)
        raise FeedFetchError(f"Timeout fetching {feed_url}") from e
    except requests.exceptions.RequestException as e:
        # Includes HTTPError, ConnectionError, etc.
        logger.error(f"Network error fetching feed from {feed_url}. Status: {getattr(e.response, 'status_code', 'N/A')}", exc_info=e)
        raise FeedFetchError(f"Network error fetching {feed_url}: {e}") from e

    # Check Content-Type
    content_type = response.headers.get("Content-Type", '').split(';')[0].strip().lower()
    if content_type not in XML_CONTENT_TYPES:
        logger.warning(f"Unexpected Content-Type '{content_type}' for feed {feed_url}. Attempting parse anyway.")
        # Optionally raise FeedParseError here if strict checking is desired:
        # raise FeedParseError(f"Invalid Content-Type '{content_type}' for feed {feed_url}")

    if not response.content:
        logger.error(f"No content received from {feed_url} despite successful status.")
        raise FeedFetchError(f"No content received from {feed_url}")

    try:
        # Use lxml to parse. It often handles encoding better.
        # Use recover=True to try and parse even slightly broken XML
        parser = ET.XMLParser(recover=True, strip_cdata=False, resolve_entities=False)
        xml_root = ET.fromstring(response.content, parser=parser)  # noqa: S320
    except ET.XMLSyntaxError as e:
        logger.error(f"Failed to parse XML from {feed_url} using lxml", exc_info=e)
        # Log part of the content for debugging (carefully)
        # logger.debug(f"Content sample (first 500 bytes): {response.content[:500]!r}")
        raise FeedParseError(f"Failed to parse XML from {feed_url}: {e}") from e

    try:
        # Get the appropriate parser class based on feed_source
        parser_class = getattr(parsers, feed_source)
    except AttributeError as e:
        logger.error(f"Parser class '{feed_source}' not found in parsers module.", exc_info=e)
        raise ParserNotFoundError(f"Parser '{feed_source}' not found.") from e

    try:
        # Instantiate the parser and parse the feed
        feed_parser_instance = parser_class()
        feed_items = feed_parser_instance.parse_feed(xml_root)
        return feed_items
    except Exception as e:
        # Catching general Exception from within a specific parser
        logger.error(f"Error during execution of parser '{feed_source}' for {feed_url}", exc_info=True)
        raise ParserExecutionError(f"Parser '{feed_source}' failed for {feed_url}: {e}") from e
