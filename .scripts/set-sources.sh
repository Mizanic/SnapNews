#!/bin/bash

# --- Configuration ---
TABLE_NAME_SSM_PARAMETER=/SnapNews/common/table-name
NEWS_SOURCES="./NewsSources.json" # Make sure this file exists and is readable

# --- Validate Input ---
if [ -z "$TABLE_NAME_SSM_PARAMETER" ]; then
  echo "Error: TABLE_NAME_SSM_PARAMETER is not set."
  exit 1
fi
if [ ! -f "$NEWS_SOURCES" ]; then
  echo "Error: News sources file not found at '$NEWS_SOURCES'"
  exit 1
fi

# --- Get DynamoDB Table Name ---
echo "Fetching table name from SSM parameter..."
TABLE_NAME=$(aws ssm get-parameter --name "$TABLE_NAME_SSM_PARAMETER" --query "Parameter.Value" --output text)

if [ -z "$TABLE_NAME" ] || [ "$TABLE_NAME" == "None" ]; then
  echo "Error: Could not find table name for '$TABLE_NAME_SSM_PARAMETER'."
  exit 1
fi
echo "Using table: $TABLE_NAME"

# --- Process and Load News Sources ---
echo "Reading sources from: $NEWS_SOURCES"

# Use jq to read each source object compactly (-c)
jq -c '.Sources[]' "$NEWS_SOURCES" | while IFS= read -r source_json; do
    # Extract the short name for pk/sk generation
    SOURCE_NAME=$(echo "$source_json" | jq -r '.Name.Short')

    if [ -z "$SOURCE_NAME" ]; then
      echo "Warning: Skipping source with missing or empty '.Name.Short': $source_json"
      continue
    fi

    echo "Processing source: $SOURCE_NAME"

    # Use jq to transform the standard JSON ($source_json) into DynamoDB JSON format
    # Pass SOURCE_NAME via --arg for safe usage within jq
    # Use -c for compact output suitable for --item
    ITEM_JSON=$(echo "$source_json" | jq -c --arg name "$SOURCE_NAME" '
      # Start constructing the top-level DynamoDB item object
      {
        # Primary Key (pk) - String
        pk: {S: ("SOURCE#" + $name)},

        # Sort Key (sk) - String
        sk: {S: ("SOURCE#" + $name)},

        # Language - String (assuming it exists in input)
        # Use // "" as a fallback if .Language might be null or missing
        Language: {S: (.Language // "")},

        # Name - Map (M)
        Name: {
          M: {
            # Nested Long Name - String
            Long: {S: (.Name.Long // "")},
            # Nested Short Name - String
            Short: {S: (.Name.Short // "")}
          }
        },

        # Sources - List (L)
        Sources: {
          # The value of L is an array derived from the input .Sources array
          L: (
            # map() iterates over each element in the input .Sources array
            .Sources | map(
              # For each object in the input array (e.g., {"CRICKET": "url", ...})
              # create the DynamoDB Map structure {M: ...}
              {
                # Convert the object keys/values into the nested DynamoDB Map format
                # $feed_obj refers to the current object being mapped (e.g., {"CRICKET": "url", ...})
                M: . as $feed_obj |
                   # Use with_entries to transform {key: value} into {key: {S: value}}
                   # Assumes all feed URLs are strings. Add checks if other types are possible.
                   ($feed_obj | with_entries(.value = {S: .value}))
              }
            )
          )
          # Handle case where input .Sources might be null or not an array
          # If .Sources is not an array or null, default to an empty DynamoDB List {L: []}
          // {L: []}
        }
      }
    ')

    # Check if jq failed to generate valid JSON
    if [ $? -ne 0 ] || [ -z "$ITEM_JSON" ]; then
        echo "Error: Failed to generate DynamoDB JSON for '$SOURCE_NAME'. Skipping."
        echo "Input JSON was: $source_json"
        continue
    fi

    # --- Execute PutItem ---
    echo "Attempting to put item for $SOURCE_NAME..."
    # echo "DEBUG: Item JSON: $ITEM_JSON" # Uncomment for debugging the JSON

    # Perform the actual PutItem operation (uncomment the command)
    # aws dynamodb put-item --table-name "$TABLE_NAME" --item "$ITEM_JSON"

    # Check the exit status (optional but recommended)
    # status=$?
    # if [ $status -ne 0 ]; then
    #   echo "Error: Failed to put item for source '$SOURCE_NAME'. AWS CLI exit code: $status"
    # else
    #    echo "Successfully added source: $SOURCE_NAME"
    # fi

    # --- FOR TESTING: Print the command instead of running it ---
    echo "Command to be executed:"
    echo "aws dynamodb put-item --table-name \"$TABLE_NAME\" --item '$ITEM_JSON'"
    echo "-------------------------------------"


done

echo "Finished processing sources."