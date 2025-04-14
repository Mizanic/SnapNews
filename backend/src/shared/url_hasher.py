"""
# --*-- coding: utf-8 --*--
This Module generates hash of a given URL
"""

import hashlib


def hasher(url: str) -> str:
    """
    This function generates hash of a given URL
    """
    sha256_hash = hashlib.sha256(url.encode()).hexdigest()
    return sha256_hash
