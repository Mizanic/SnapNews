"""
# --*-- coding: utf-8 --*--
This Module contains the utility functions for the parsers
"""

# ==================================================================================================
# Python imports
import re
import time
from typing import Union

from dateutil import parser

# ==================================================================================================
# Module imports
from shared.logger import logger


def _remove_html_tags(text: str) -> str:
    """Remove HTML tags from a given string."""
    clean = re.compile("<.*?>")
    return re.sub(clean, "", text)


def santise_content(content: str) -> str:
    """
    This function santises the content
    """
    # Remove HTML tags
    content = _remove_html_tags(content)

    # Remove newlines
    content = content.replace("\n", "")

    # Remove multiple spaces
    content = re.sub(" +", " ", content)

    return content


def time_to_unix(time_stamp: Union[str, None]) -> int:
    """
    This function converts a string timestamp to UNIX epoch time using dateutil.parser
    Handles various formats like:
     - "Mon, 07 Aug 2023 18:53:00 +0530"
     - "2025-04-17T20:08:34+05:30"
     - "Thu, 17 Apr 2025 10:43:44 GMT"
    """

    if time_stamp is None:
        # If time_stamp is None, return current time
        return int(time.time())

    try:
        # Use dateutil.parser.parse for robust parsing
        # It automatically handles timezone information (including GMT)
        dt_object = parser.parse(time_stamp)
        epoch = int(dt_object.timestamp())
        return epoch
    except (ValueError, parser.ParserError) as e:
        logger.error(f"Failed to parse timestamp '{time_stamp}' using dateutil: {e}")
        # Return current time as a fallback if parsing fails
        return int(time.time())
