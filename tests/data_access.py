import json
import time
from pathlib import Path

import boto3
from boto3.dynamodb.conditions import Key

with Path("tests/news_item.json").open("r") as f:
    news_items = json.load(f)


dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("SnapNews-CommonStack-SnapNewsTableE507FEBF-1B2DIXA0685LX")

# for item in news_items:
#     table.put_item(Item=item)  # noqa: ERA001


# Get news by category sorted by time
time_now = int(time.time())
time_before = str(time_now - (24 * 60 * 60))
expression = Key("pk").eq("NEWS#TOP") & Key("sk").gte(time_before)
params = {
    "KeyConditionExpression": expression,
    "Limit": 10,
}

response = table.query(**params)

print(response["Items"])  # noqa: T201
