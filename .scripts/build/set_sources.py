import json
import os
import sys

import boto3
from botocore.exceptions import ClientError, NoCredentialsError, PartialCredentialsError

# --- Configuration ---
TABLE_NAME_SSM_PARAMETER = "/SnapNews/common/table-name"
NEWS_SOURCES_FILE = "./NewsSources.json"
# Optional: Specify region if not configured in your environment/AWS config
AWS_REGION = "us-east-1"


def get_dynamodb_table_from_ssm(ssm_client: boto3.client) -> str:
    """
    Retrieves the DynamoDB table name from AWS SSM Parameter Store.

    Args:
        ssm_client: The boto3 client for SSM.

    """
    try:
        response = ssm_client.get_parameter(Name=TABLE_NAME_SSM_PARAMETER)
        table_name = response["Parameter"]["Value"]
        if not table_name:
            print("Error: Could not retrieve table name from SSM.")
            sys.exit(1)
        print(f"Using table: {table_name}")
    except ClientError as e:
        print(f"AWS Error getting table name from SSM: {e}")
        sys.exit(1)
    except Exception as e:  # noqa: BLE001
        print(f"Error getting table name from SSM: {e}")
        sys.exit(1)

    return table_name


# --- Helper Function to Transform Source to DynamoDB Item ---
def transform_source_to_dynamodb_item(source_data: dict) -> dict | None:
    """
    Transforms a standard Python dictionary (from JSON) into the DynamoDB item format.

    Args:
        source_data: A dictionary representing a single news source.

    Returns:
        A dictionary formatted for DynamoDB put_item, or None if input is invalid.
    """
    try:
        short_name = source_data.get("Name", {}).get("Short")
        country = source_data.get("Country", "")
        language = source_data.get("Language", "")
        if not short_name or not country or not language:
            print(f"Warning: Skipping source due to missing or empty 'Name.Short', 'Country', or 'Language'. Data: {source_data}")
            return None

        pk_value = f"SOURCE#{country}#{language}"
        sk_value = f"NAME#{short_name}"
        dynamodb_item = {
            "pk": {"S": pk_value},
            "sk": {"S": sk_value},
            "Language": {"S": language},
            "Country": {"S": country},
            "Name": {"M": {"Long": {"S": source_data.get("Name", {}).get("Long", "")}, "Short": {"S": short_name}}},
        }

        # Handle the 'FEEDS' object transformation - new structure
        input_feeds = source_data.get("FEEDS", {})
        dynamodb_feeds_map = {}

        if isinstance(input_feeds, dict):
            # FEEDS is now a single object with category keys
            for category, feeds in input_feeds.items():
                if isinstance(feeds, list):
                    # Handle array of URLs (like INDIA category in NDTV)
                    feeds_list = []
                    for feed_url in feeds:
                        feeds_list.append({"S": str(feed_url).strip('"')})
                    dynamodb_feeds_map[category] = {"L": feeds_list}
                elif isinstance(feeds, str):
                    # Handle single URL string (like TECH, WORLD, etc.)
                    dynamodb_feeds_map[category] = {"S": str(feeds).strip('"')}
                else:
                    # Handle other types by converting to string
                    dynamodb_feeds_map[category] = {"S": str(feeds).strip('"')}

        # Assign the transformed map to the 'Feeds' key in the DynamoDB item
        dynamodb_item["Feeds"] = {"M": dynamodb_feeds_map}

        return dynamodb_item

    except Exception as e:  # noqa: BLE001
        print(f"Error transforming source data: {e}. Data: {source_data}")
        return None


def main() -> None:  # noqa: C901, PLR0915
    print("Starting news source loading process...")

    # --- Initialize Boto3 Clients ---
    try:
        # If region is specified: boto3.Session(region_name=AWS_REGION)
        session = boto3.Session()
        ssm_client = session.client("ssm")
        dynamodb_client = session.client("dynamodb")
        print("Boto3 clients initialized.")
    except (NoCredentialsError, PartialCredentialsError) as e:
        print(f"AWS Credentials Error: {e}. Please configure your AWS credentials.")
        sys.exit(1)
    except Exception as e:  # noqa: BLE001
        print(f"Error initializing Boto3: {e}")
        sys.exit(1)

    # --- Get Table Name ---
    table_name = get_dynamodb_table_from_ssm(ssm_client)

    # --- Read and Parse JSON File ---
    if not os.path.exists(NEWS_SOURCES_FILE):  # noqa: PTH110
        print(f"Error: News sources file not found at '{NEWS_SOURCES_FILE}'")
        sys.exit(1)

    print(f"Reading sources from: {NEWS_SOURCES_FILE}")
    try:
        with open(NEWS_SOURCES_FILE) as f:  # noqa: PTH123
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from '{NEWS_SOURCES_FILE}': {e}")
        sys.exit(1)
    except Exception as e:  # noqa: BLE001
        print(f"Error reading file '{NEWS_SOURCES_FILE}': {e}")
        sys.exit(1)

    # --- Process and Load Sources ---
    sources_list = data.get("Sources")
    if not isinstance(sources_list, list):
        print(f"Error: Expected a list under the 'Sources' key in '{NEWS_SOURCES_FILE}', but found type {type(sources_list)}.")
        sys.exit(1)

    print(f"Found {len(sources_list)} source(s) to process.")
    items_added = 0
    items_failed = 0

    for source_data in sources_list:
        print("-" * 20)
        # --- Transform Data ---
        dynamodb_item = transform_source_to_dynamodb_item(source_data)

        if not dynamodb_item:
            items_failed += 1
            continue  # Skip to next source if transformation failed

        short_name = dynamodb_item["Name"]["M"]["Short"]["S"]  # Get name for logging
        print(f"Processing source: {short_name}")
        # print(f"DEBUG: DynamoDB Item JSON:\n{json.dumps(dynamodb_item, indent=2)}") # Uncomment for debugging

        # --- Put Item into DynamoDB ---
        try:
            print(f"Attempting to put item for {short_name} into table {table_name}...")
            dynamodb_client.put_item(TableName=table_name, Item=dynamodb_item)
            print(f"Successfully added source: {short_name}")
            items_added += 1
        except ClientError as e:
            print(f"AWS Error putting item for '{short_name}': {e}")
            items_failed += 1
        except Exception as e:  # noqa: BLE001
            print(f"An unexpected error occurred putting item for '{short_name}': {e}")
            items_failed += 1

    print("-" * 20)
    print("Finished processing sources.")
    print(f"Summary: Added={items_added}, Failed/Skipped={items_failed}")


# --- Main Execution ---
if __name__ == "__main__":
    main()
