import random

from shared.time import time_to_unix
from shared.uuid import uuid7

sk = uuid7(time_to_unix("2025-07-26T22:19:07+05:30"))

view_max = 100000

counts = {
    "view": random.randint(0, view_max),  # noqa: S311
    "like": random.randint(0, view_max // 10),  # noqa: S311
    "bookmark": random.randint(0, view_max // 50),  # noqa: S311
    "share": random.randint(0, view_max // 250),  # noqa: S311
}

weights = {
    "view": 1,
    "like": 10,
    "bookmark": 10,
    "share": 100,
}


score = f"TOP#{str(sum(counts[key] * weights[key] for key in counts)).zfill(10)}#{sk}"

print(counts)

print(score)
