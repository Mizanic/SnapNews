#!/bin/bash

PROJECT_NAME=$(cat config.json | jq -r '.PROJECT_NAME' | tr -d ' ')

CREATE_USER=false
GET_COGNITO_CREDS=false


# Check if a file named .env.creds.local exists
if [ -f .env.creds.local ]; then
    # Check if the file has the correct variables
    source .env.creds.local
    if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ] || [ -z "$GIVEN_NAME" ] || [ -z "$FAMILY_NAME" ]; then
        echo ".env.creds.local file is missing variables"
        echo "Creating .env.creds.local file"
        CREATE_USER=true
    fi
else
    echo ".env.creds.local file not found"
    echo "Creating .env.creds.local file"
    CREATE_USER=true
fi

if [ "$CREATE_USER" = true ]; then
    # Prompt for the username, email, and password
    read -p "Enter the email: " EMAIL
    read -p "Enter the given name: " GIVEN_NAME
    read -p "Enter the family name: " FAMILY_NAME
    read -s -p "Enter the password: " PASSWORD


    # Create the .env.creds.local file
    echo "EMAIL=$EMAIL" >> .env.creds.local
    echo "PASSWORD=$PASSWORD" >> .env.creds.local
    echo "GIVEN_NAME=$GIVEN_NAME" >> .env.creds.local
    echo "FAMILY_NAME=$FAMILY_NAME" >> .env.creds.local
fi

source .env.creds.local


# Get the user pool id and app client id
# Check if .env.web.local exists
if [ -f .env.web.local ]; then
    source .env.web.local
    # Check if PUBLIC_USER_POOL_ID and PUBLIC_APP_CLIENT_ID are set
    if [ -z "$PUBLIC_USER_POOL_ID" ] || [ -z "$PUBLIC_APP_CLIENT_ID" ]; then
        echo ".env.web.local file is missing PUBLIC_USER_POOL_ID or PUBLIC_APP_CLIENT_ID"
        GET_COGNITO_CREDS=true
    fi
fi

if [ "$GET_COGNITO_CREDS" = true ]; then
    echo "Getting user pool id and app client id"
    userPoolId=$(aws cognito-idp list-user-pools --max-results 50 --query "UserPools[?Name=='${PROJECT_NAME}-AdminUserPool'].Id" --output text)
    appClientId=$(aws cognito-idp list-user-pool-clients --user-pool-id "$userPoolId" --query "UserPoolClients[*].[ClientId]" --output text)
else
    echo "Using existing user pool id and app client id"
    userPoolId=$PUBLIC_USER_POOL_ID
    appClientId=$PUBLIC_APP_CLIENT_ID
    echo "PUBLIC_USER_POOL_ID=$PUBLIC_USER_POOL_ID"
    echo "PUBLIC_APP_CLIENT_ID=$PUBLIC_APP_CLIENT_ID"
fi


# Create a new user in the admin user pool
echo "Creating a new user in the admin user pool"
aws cognito-idp admin-create-user --user-pool-id $userPoolId --username $EMAIL --user-attributes Name="email",Value="$EMAIL"


# Set the password for the user
echo "Setting the password for the user"
aws cognito-idp admin-set-user-password --user-pool-id $userPoolId --username $EMAIL --password $PASSWORD --permanent



# Set the first name and given name for the user
echo "Setting the first name and given name for the user"
aws cognito-idp admin-update-user-attributes --user-pool-id $userPoolId --username $EMAIL --user-attributes Name="given_name",Value="$GIVEN_NAME"
aws cognito-idp admin-update-user-attributes --user-pool-id $userPoolId --username $EMAIL --user-attributes Name="family_name",Value="$FAMILY_NAME"

