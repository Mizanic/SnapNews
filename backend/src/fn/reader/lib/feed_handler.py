"""
# --*-- coding: utf-8 --*--
# This module contains the feed handler
# FEED_HANDLER reads RSS feeds and returns a JSON object containing the feed data
"""

# ==================================================================================================
# Python imports
import xml.etree.ElementTree as ET

import requests

# ==================================================================================================
# Module imports
from . import parsers

# ==================================================================================================

SUCCESS_STATUS_CODE = 200

def get_feed_from_rss(feed_source: str, feed_url: str) -> list[dict]:
    """
    Function that implements the feed handler
    """
    # Fetch XML content from the URL
    response = requests.get(feed_url, timeout=30)
    if response.status_code != SUCCESS_STATUS_CODE:
        return []

    xml_content = response.content

    # Parse the XML content
    xml_root = ET.fromstring(xml_content)

    feed = getattr(parsers, feed_source)().parse_feed(xml_root)

    return feed