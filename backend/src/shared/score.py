"""
# --coding: utf-8 --
# Score Utilities
# Utilities related to operations on scores
"""

# ==================================================================================================
# Python imports
import random

# ==================================================================================================
# Module imports


def set_random_counts() -> dict[str, int]:
    view_max = 100000

    counts = {
        "view": random.randint(0, view_max),  # noqa: S311
        "like": random.randint(0, view_max // 10),  # noqa: S311
        "bookmark": random.randint(0, view_max // 50),  # noqa: S311
        "share": random.randint(0, view_max // 250),  # noqa: S311
    }

    return counts


def calculate_score(counts: dict[str, int], sk: str) -> str:

    weights = {
        "view": 1,
        "like": 10,
        "bookmark": 10,
        "share": 100,
    }

    score = f"TOP#{str(sum(counts[key] * weights[key] for key in counts)).zfill(10)}#{sk}"

    return score
