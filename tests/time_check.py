from shared.time import time_to_iso, time_to_unix
from shared.uuid import uuid7

date_string = "Sat, 26 Jul 2025 22:19:05 +0530"
date_string = "Sat, 26 Jul 2025 22:19:07 +0530"

timestamp = time_to_unix(date_string)


uuid = uuid7(timestamp)

print(uuid)
