#!/bin/bash

PROJECT_NAME=$(cat config.json | jq -r '.PROJECT_NAME' | tr -d ' ')

# Get the API Keys from DynamoDB
geminiApiKey=$(aws dynamodb get-item --table-name "${PROJECT_NAME}-Table" --key '{"pk": {"S": "APP#DATA"}, "sk": {"S": "GEMINI"}}' --query "Item.API_KEY.S" --output text)

# Add to a SSM Parameter Store
aws ssm put-parameter --name "/${PROJECT_NAME}/keys/GEMINI_API_KEY" --value "${geminiApiKey}" --type "SecureString" --overwrite