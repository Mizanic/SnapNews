#!/bin/bash

PROJECT_NAME=$(cat config.json | jq -r '.PROJECT_NAME' | tr -d ' ')

userPoolId=$(aws cognito-idp list-user-pools --max-results 50 --query "UserPools[?Name=='${PROJECT_NAME}-AdminUserPool'].Id" --output text)
appClientId=$(aws cognito-idp list-user-pool-clients --user-pool-id "$userPoolId" --query "UserPoolClients[*].[ClientId]" --output text)
# appClientSecret=$(aws cognito-idp describe-user-pool-client --user-pool-id "$userPoolId" --client-id "$appClientId" --query "UserPoolClient.ClientSecret" --output text)
accountId=$(aws sts get-caller-identity --query "Account" --output text)
region=$(aws configure get region)


echo "PUBLIC_USER_POOL_ID=${userPoolId}" > ./.env.web.local
echo "PUBLIC_APP_CLIENT_ID=${appClientId}" >> ./.env.web.local
echo "PUBLIC_ACCOUNT_ID=${accountId}" >> ./.env.web.local



echo "SECRET_CDK_AWS_ACCOUNT=${accountId}" > ./.env.cdk.local
echo "PUBLIC_CDK_AWS_REGION=${region}" >> ./.env.cdk.local

mise set