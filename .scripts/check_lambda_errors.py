import sys
import time
from datetime import datetime, timedelta, timezone

import boto3
from botocore.exceptions import ClientError

# === CONFIG ===
REGION = "us-east-1"
LAMBDA_PREFIX = "/aws/lambda/SnapNews-"
HOURS_LOOKBACK = 24  # Look back 24 hours only
MAX_EVENTS_PER_GROUP = 10  # Reduced from 20 to save on data transfer
MAX_MESSAGE_LENGTH = 150  # Reduced from 200 to save on data transfer
FILTER_STRING = "ERROR"

# === TIMEZONE ===
IST = timezone(timedelta(hours=5, minutes=30))  # UTC+5:30

# === INIT CLIENT ===
logs_client = boto3.client("logs", region_name=REGION)

# === TIME RANGE ===
now_ms = int(time.time() * 1000)
start_ms = now_ms - (HOURS_LOOKBACK * 60 * 60 * 1000)

print(f"Searching logs for '{FILTER_STRING}' in last {HOURS_LOOKBACK} hours...")
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
        # Use filter_log_events with pagination but limit results
        paginator = logs_client.get_paginator("filter_log_events")
        group_error_count = 0

        for page in paginator.paginate(
            logGroupName=log_group,
            filterPattern=FILTER_STRING,  # More precise filter pattern
            startTime=start_ms,
            endTime=now_ms,
            PaginationConfig={"MaxItems": MAX_EVENTS_PER_GROUP},
        ):
            events = page.get("events", [])

            if events:
                group_error_count += len(events)
                print(f"❌ Found {len(events)} {FILTER_STRING} log(s) in this batch:")

                for event in events:
                    ts = datetime.fromtimestamp(event["timestamp"] / 1000, IST).strftime("%Y-%m-%d %H:%M:%S")
                    msg = event["message"].strip()

                    # Extract just the error part to save on output
                    if FILTER_STRING in msg:
                        error_part = msg[msg.find(FILTER_STRING) : msg.find(FILTER_STRING) + MAX_MESSAGE_LENGTH]
                    else:
                        error_part = msg[:MAX_MESSAGE_LENGTH]

                    print(f"  [{ts}] {error_part}")

                    # Track error patterns for summary
                    error_key = error_part.split("\n")[0][:50]  # First line, first 50 chars
                    error_summary[error_key] = error_summary.get(error_key, 0) + 1

            # If we got less than the max, we've seen all events
            if len(events) < MAX_EVENTS_PER_GROUP:
                break

        if group_error_count == 0:
            print(f"✅ No {FILTER_STRING} logs found in this group.")
        else:
            total_errors += group_error_count
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
    f"Total {FILTER_STRING}s: {total_errors}\n",
    f"Log groups checked: {len(log_groups)}",
)
