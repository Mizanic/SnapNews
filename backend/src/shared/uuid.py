"""
# --coding: utf-8 --
# UUID Utilities
# Utilities related to operations on UUIDs
"""

# ==================================================================================================
# Python imports
import os

# ==================================================================================================


def uuid7(unix_timestamp: int) -> str:
    """
    Generate a UUIDv7 string from a Unix timestamp
    """
    ## Convert the timestamp to milliseconds
    timestamp_ms = unix_timestamp * 1000

    # Get 48-bit timestamp (6 bytes)
    timestamp_bytes = timestamp_ms.to_bytes(6, 'big')

    # Generate 10 random bytes
    random_bytes = os.urandom(10)

    # Construct the UUID bytes
    uuid_bytes = bytearray(timestamp_bytes + random_bytes)

    # Set version bits (version 7)
    uuid_bytes[6] = (uuid_bytes[6] & 0x0F) | 0x70

    # Set variant bits (RFC 4122)
    uuid_bytes[8] = (uuid_bytes[8] & 0x3F) | 0x80

    hex_string = uuid_bytes.hex()

    # Insert hyphens at positions: 8-4-4-4-12
    uuid_string = f"{hex_string[0:8]}-{hex_string[8:12]}-{hex_string[12:16]}-{hex_string[16:20]}-{hex_string[20:32]}"

    return uuid_string
