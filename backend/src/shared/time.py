"""
# --*-- coding: utf-8 --*--
This Module contains the utility functions for the parsers
"""

# ==================================================================================================
# Python imports
import time
from datetime import datetime, timezone

from dateutil import parser

# ==================================================================================================
# Module imports
from shared.logger import logger


def time_to_unix(time_stamp: str | None) -> int:
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


def time_to_iso(time_stamp: str | None) -> str:
    """
    This function converts a string timestamp to ISO 8601 format in UTC
    """
    if time_stamp is None:
        # If time_stamp is None, return current UTC time in ISO format
        return datetime.now(timezone.utc).isoformat()

    try:
        # Use dateutil.parser.parse for robust parsing
        dt_object = parser.parse(time_stamp)

        # Ensure the datetime object is in UTC
        dt_object = dt_object.replace(tzinfo=timezone.utc) if dt_object.tzinfo is None else dt_object.astimezone(timezone.utc)

        return dt_object.isoformat()
    except (ValueError, parser.ParserError) as e:
        logger.error(f"Failed to parse timestamp '{time_stamp}' for ISO conversion: {e}")
        # Return current UTC time in ISO format as a fallback
        return datetime.now(timezone.utc).isoformat()
