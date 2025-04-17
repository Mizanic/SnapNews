#!/bin/bash

# Parse the JSON to get list of events
EVENTS=$(jq -c '.[]' .scripts/test_event.json)

READER_FUNCTION_NAME="SnapNews-Reader"

# For each event, invoke the lambda function
for EVENT in $EVENTS; do
    # Invoke the lambda function with the event
    echo "Invoking lambda function with event: $EVENT"
    #aws lambda invoke --function-name $READER_FUNCTION_NAME --payload "$(echo $EVENT | base64)" response.json
    b64=$(echo $EVENT | base64)
    
    aws lambda invoke --function-name $READER_FUNCTION_NAME --payload "$b64" response.json

    # Print the response
    cat response.json
    echo -e "\n"
done


# Remove the response file
rm response.json

