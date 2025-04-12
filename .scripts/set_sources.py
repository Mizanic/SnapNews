# Read the sources from ./NewsSources.json
import json
from pathlib import Path

import boto3

events = boto3.client("events")
lambda_client = boto3.client("lambda")


def get_rule_name() -> str:
    return events.list_rules(NamePrefix="SnapNews")["Rules"][0]["Name"]


def get_reader_arn() -> str:
    return lambda_client.get_function(FunctionName="SnapNews-Reader")["Configuration"]["FunctionArn"]


def set_source(source):
    events = boto3.client("events")


def main():
    # Get the event rule
    rule_name = get_rule_name()
    reader_arn = get_reader_arn()

    # Set the target for the event rule
    events.put_targets(
        Rule=rule_name,
        Targets=[
            {
                "Id": "1",
                "Arn": reader_arn,
                "Input": json.dumps(
                    {
                        "NewsSource": "Test source",
                        "NewsUrl": "https://www.test.com",
                    },
                ),
            },
        ],
    )


if __name__ == "__main__":
    main()

# with Path("./NewsSources.json").open("r") as f:
#     sources = json.load(f)["Sources"]

# for source in sources:
#     events = get_events()
#     print(events)
#     set_source(source)
