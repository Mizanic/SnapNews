"""
# --*-- coding: utf-8 --*--
This Module is used to santise the content
"""

# ==================================================================================================
# Python imports
import re

# ==================================================================================================
# Module imports


def santise_content(content: str) -> str:
    """
    This function santises the content
    """
    clean = re.compile("<.*?>")
    # Remove HTML tags
    content = re.sub(clean, "", content)

    # Remove newlines
    content = content.replace("\n", "")

    # Remove multiple spaces
    content = re.sub(" +", " ", content)

    return content
