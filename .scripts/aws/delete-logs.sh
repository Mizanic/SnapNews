#!/bin/bash

set -e

PROJECT_NAME=$(cat config.json | jq -r '.PROJECT_NAME' | tr -d ' ')

echo ">>> Deleting logs for project: $PROJECT_NAME"

# Get all log groups with the prefix "POC-"
log_groups=$(aws logs describe-log-groups --query "logGroups[?starts_with(logGroupName, '/aws/lambda/$PROJECT_NAME')].logGroupName" --output text)


for log_group in $log_groups; do
    echo "Deleting log streams in log group: $log_group"
    # Get all log streams in the log group
    log_streams=$(aws logs describe-log-streams --log-group-name $log_group --query "logStreams[].logStreamName" --output text)
    for log_stream in $log_streams; do
        echo "Deleting log stream: $log_stream"
        aws logs delete-log-stream --log-group-name $log_group --log-stream-name $log_stream
    done
done

echo ">>> Logs deleted successfully"