import json
import logging
from pathlib import Path
from xml.etree import ElementTree as ET

import requests

from backend.src.fn.reader.lib.parsers.ndtv import NDTV
from backend.src.fn.reader.lib.parsers.toi import TOI

# Set up logger
logger = logging.getLogger(__name__)

# Test headers
HEADERS = {"User-Agent": "SnapNewsReader/1.0"}  # It's good practice to identify your bot
# Define expected XML content types
XML_CONTENT_TYPES = ["application/xml", "text/xml", "application/rss+xml", "application/atom+xml"]


def get_all_rss_feeds() -> dict:
    """Get the list of all RSS feeds from NewsSources.json"""

    sources = json.loads(Path("NewsSources.json").read_text(encoding="utf-8"))
    return sources["Sources"]


def test_ndtv_parser_single_feed() -> None:
    """Test that NDTV parser can be imported and instantiated"""
    assert NDTV is not None
    # You could add more specific tests here if needed
    sources = get_all_rss_feeds()

    for source in sources:
        if source["Name"]["Short"] == "NDTV":
            ndtv_rss_feeds = source["FEEDS"]
            logger.info(ndtv_rss_feeds)
            for category, rss_feed in ndtv_rss_feeds.items():
                logger.info(f"Testing {category} feed")
                logger.info(f"RSS feed: {rss_feed}")


def test_ndtv_parser() -> None:
    """Test that NDTV parser can be imported and instantiated"""
    assert NDTV is not None
    # You could add more specific tests here if needed
    sources = get_all_rss_feeds()

    for source in sources:
        if source["Name"]["Short"] == "NDTV":
            ndtv_rss_feeds = source["FEEDS"]
            logger.info(ndtv_rss_feeds)
            for category, rss_feed in ndtv_rss_feeds.items():
                logger.info(f"Testing {category} feed")
                logger.info(f"RSS feed: {rss_feed}")
                if isinstance(rss_feed, list):
                    for feed_url in rss_feed:
                        test_ndtv_parser_single_feed(feed_url, category, source["Language"], source["Country"])
                else:
                    test_ndtv_parser_single_feed(rss_feed, category, source["Language"], source["Country"])
