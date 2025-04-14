"""
# --*-- coding: utf-8 --*--
# This module contains the feed handler
# FEED_HANDLER reads RSS feeds and returns a JSON object containing the feed data
"""

# ==================================================================================================
# Python imports
import xml.etree.ElementTree as ET

import requests
import requests.exceptions

# ==================================================================================================
# Module imports
from . import parsers
from .logger import logger  # Import the Powertools logger

# ==================================================================================================

SUCCESS_STATUS_CODE = 200
HEADERS = {"User-Agent": "SnapNewsReader/1.0"}  # It's good practice to identify your bot


def get_feed_from_rss(feed_source: str, feed_url: str) -> list[dict]:
    """
    Fetches and parses an RSS feed with error handling.

    Args:
        feed_source: The name of the parser class (e.g., 'TimesOfIndia', 'NDTV').
        feed_url: The URL of the RSS feed.

    Returns:
        A list of dictionaries representing the feed items, or an empty list if an error occurs.
    """
    xml_content = None
    try:
        # Fetch XML content from the URL with timeout and headers
        response = requests.get(feed_url, timeout=30, headers=HEADERS)

        # Check if the request was successful
        if response.status_code != SUCCESS_STATUS_CODE:
            logger.error(f"Failed to fetch feed from {feed_url}. Status code: {response.status_code}")
            return []

        xml_content = response.content

    except requests.exceptions.Timeout as e:
        logger.error(f"Timeout error when fetching feed from {feed_url}", exc_info=e)
        return []
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error fetching feed from {feed_url}", exc_info=e)
        return []

    if not xml_content:
        # This case might occur if an unexpected error happened after success check but before assignment
        # Or if the content is genuinely empty (though unlikely for valid RSS)
        logger.warning(f"No XML content received from {feed_url}, despite status code 200.")
        return []

    try:
        # Parse the XML content
        xml_root = ET.fromstring(xml_content)
    except ET.ParseError as e:
        logger.error(f"Failed to parse XML from {feed_url}", exc_info=e)
        # Optionally log part of the content for debugging, being careful with large/malformed data
        # logger.debug(f"Content sample: {xml_content[:500]}")
        return []

    try:
        # Get the appropriate parser class based on feed_source
        parser_class = getattr(parsers, feed_source)
        # Instantiate the parser and parse the feed
        feed = parser_class().parse_feed(xml_root)
        return feed  # noqa: RET504
    except AttributeError as e:
        logger.error(f"Parser class '{feed_source}' not found in parsers module.", exc_info=e)
        return []
    except Exception as e:
        # Catching general Exception is broad, but useful for unexpected errors within a specific parser
        logger.error(f"Error during parsing feed '{feed_source}' from {feed_url}", exc_info=True)
        logger.error(f"Error: {e}")
        # exc_info=True adds traceback to the log
        return []
