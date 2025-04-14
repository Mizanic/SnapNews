"""
# --*-- coding: utf-8 --*--
This Module contains the utility functions for the parsers
"""

# ==================================================================================================
# Python imports
import re
import time
from typing import Union

# ==================================================================================================

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
    This function converts a string timestamp to UNIX epoch time
    Time stamp format is "Mon, 07 Aug 2023 18:53:00 +0530"
    """

    if time_stamp is None:
        # If time_stamp is None, return current time
        return int(time.time())

    pattern = "%a, %d %b %Y %H:%M:%S %z"
    epoch = int(time.mktime(time.strptime(time_stamp, pattern)))
    return epoch