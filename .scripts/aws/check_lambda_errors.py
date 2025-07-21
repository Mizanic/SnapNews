import sys
import time
from datetime import datetime, timedelta, timezone

import boto3
from botocore.exceptions import ClientError

# === CONFIG ===
REGION = "us-east-1"
LAMBDA_PREFIX = "/aws/lambda/SnapNews-"
HOURS_LOOKBACK = 24 * 3  # Look back 24 hours only
MAX_EVENTS_PER_GROUP = 10  # Reduced from 20 to save on data transfer
MAX_MESSAGE_LENGTH = 150  # Reduced from 200 to save on data transfer
SEARCH_TERMS = ["ERROR", "[ERROR]"]
# For CloudWatch filter patterns, '?' provides OR logic.
# Terms with non-alphanumeric characters must be quoted.
FILTER_PATTERN = f'?{SEARCH_TERMS[0]} ?"[{SEARCH_TERMS[1]}]"'

# === TIMEZONE ===
IST = timezone(timedelta(hours=5, minutes=30))  # UTC+5:30

# === INIT CLIENT ===
logs_client = boto3.client("logs", region_name=REGION)

# === TIME RANGE ===
now_ms = int(time.time() * 1000)
start_ms = now_ms - (HOURS_LOOKBACK * 60 * 60 * 1000)

print(f"Searching logs for '{' or '.join(SEARCH_TERMS)}' in last {HOURS_LOOKBACK} hours...")
print("=" * 50)
print(
    f"From: {datetime.fromtimestamp(start_ms/1000, IST).isoformat()}\n",
    f"To: {datetime.fromtimestamp(now_ms/1000, IST).isoformat()}\n",
)
print("=" * 50)

# === GET ALL LOG GROUPS ===
print(f"Fetching all log groups with prefix: {LAMBDA_PREFIX}")
paginator = logs_client.get_paginator("describe_log_groups")
log_groups = []

try:
    for page in paginator.paginate(logGroupNamePrefix=LAMBDA_PREFIX):
        for lg in page["logGroups"]:
            # Include all log groups with the prefix, regardless of last event time
            if "BucketNotificationsHandler" not in lg["logGroupName"]:
                log_groups.append(lg["logGroupName"])
except ClientError as e:
    print(f"❌ Error fetching log groups: {e}")
    sys.exit(1)

if not log_groups:
    print(f"No log groups found with prefix {LAMBDA_PREFIX}")
    sys.exit(0)

print(f"Found {len(log_groups)} log group(s):")
for lg in log_groups:
    print(f"- {lg}")

# === SEARCH EACH LOG GROUP ===
total_errors = 0
error_summary = {}

for log_group in log_groups:
    print(f"\n🔍 Checking log group: {log_group}")

    try:
        paginator = logs_client.get_paginator("filter_log_events")
        all_events = []

        # We'll collect all events up to the API limit to ensure we scan the whole range
        for page in paginator.paginate(
            logGroupName=log_group,
            filterPattern=FILTER_PATTERN,
            startTime=start_ms,
            endTime=now_ms,
            limit=10000,  # Max limit to ensure we get everything in a large window
        ):
            events = page.get("events", [])
            if events:
                all_events.extend(events)

        group_error_count = len(all_events)
        if group_error_count > 0:
            total_errors += group_error_count
            display_events = all_events[:MAX_EVENTS_PER_GROUP]

            print(f"❌ Found {group_error_count} error log(s). Showing up to {MAX_EVENTS_PER_GROUP}:")

            for event in display_events:
                ts = datetime.fromtimestamp(event["timestamp"] / 1000, IST).strftime("%Y-%m-%d %H:%M:%S")
                msg = event["message"].strip()

                # Extract just the error part to save on output
                error_part = msg[:MAX_MESSAGE_LENGTH]
                for term in SEARCH_TERMS:
                    if term in msg:
                        start_pos = msg.find(term)
                        error_part = msg[start_pos : start_pos + MAX_MESSAGE_LENGTH]
                        break

                print(f"  [{ts}] {error_part}")

                # Track error patterns for summary from all found errors
                error_key = error_part.split("\n")[0][:50]
                error_summary[error_key] = error_summary.get(error_key, 0) + 1

        if group_error_count == 0:
            print("✅ No error logs found in this group.")
        else:
            print(f"📊 Total errors in this group: {group_error_count}")

    except logs_client.exceptions.ResourceNotFoundException:
        print("⚠️  Log group not found. Skipping.")
    except ClientError as e:
        print(f"⚠️  Error accessing log group: {e}")
        continue

# === SUMMARY ===
print(f"\n{'='*50}")
print("📊 SUMMARY")
print(f"{'='*50}")
print(f"Total errors found: {total_errors}")
print(f"Log groups checked: {len(log_groups)}")

if error_summary:
    print("\nTop error patterns:")
    sorted_errors = sorted(error_summary.items(), key=lambda x: x[1], reverse=True)
    for error, count in sorted_errors[:5]:  # Show top 5 error patterns
        print(f"  {count}x: {error}")

print("\n✅ Done checking logs.")
print(
    f"From: {datetime.fromtimestamp(start_ms/1000, IST).strftime('%Y-%m-%d %H:%M:%S')}\n",
    f"To: {datetime.fromtimestamp(now_ms/1000, IST).strftime('%Y-%m-%d %H:%M:%S')}\n",
    f"Total errors: {total_errors}\n",
    f"Log groups checked: {len(log_groups)}",
)
