import { Stack, StackProps, RemovalPolicy, Size } from "aws-cdk-lib";
import { aws_cognito as cognito, aws_dynamodb as dynamodb } from "aws-cdk-lib";
import { aws_apigateway as apigateway, aws_lambda as lambda } from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";

export interface AdminStackProps extends StackProps {
    appName: string;
    tableName: string;
    layers: Record<string, string>;
}

export class AdminStack extends Stack {
    constructor(scope: Construct, id: string, props: AdminStackProps) {
        super(scope, id, props);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Admin User Authentication
         */
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const adminUserPool = new cognito.UserPool(this, `${props.appName}-AdminUserPool`, {
            userPoolName: `${props.appName}-AdminUserPool`,
            signInAliases: { email: true },
            standardAttributes: {
                email: { required: true, mutable: true },
                givenName: { required: true, mutable: true },
                familyName: { required: true, mutable: true },
            },
            mfa: cognito.Mfa.OFF,
            accountRecovery: cognito.AccountRecovery.NONE,
            selfSignUpEnabled: false,

            removalPolicy: RemovalPolicy.DESTROY,
        });

        const adminUserPoolClient = new cognito.UserPoolClient(this, `${props.appName}-AdminUserPoolClient`, {
            userPool: adminUserPool,
            authFlows: {
                adminUserPassword: true,
                userPassword: true,
                userSrp: true,
            },
            generateSecret: false,
            disableOAuth: true,
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Admin API Lambda
         */
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Configure the Admin Lambda
        const adminLayer = new lambda.LayerVersion(this, `${props.appName}-AdminLayer`, {
            compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
            code: lambda.Code.fromAsset(join(__dirname, "../../.layers/admin")),
            removalPolicy: RemovalPolicy.RETAIN,
        });

        // Configure the Powertools Layer
        const powertoolsLayer = lambda.LayerVersion.fromLayerVersionArn(this, `${props.appName}-PowertoolsLayer`, props.layers.POWERTOOLS);

        // Configure the Admin Lambda
        const adminLambda = new lambda.Function(this, `${props.appName}-AdminLambda`, {
            functionName: `${props.appName}-AdminLambda`,
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "app.main",
            code: lambda.Code.fromAsset(join(__dirname, "fn/admin")),
            layers: [adminLayer, powertoolsLayer],
            environment: {
                TABLE_NAME: props.tableName,
            },
        });

        // Configure the Admin Lambda to access the Admin Table
        const table = dynamodb.Table.fromTableName(this, `${props.appName}-Table`, props.tableName);
        table.grantReadWriteData(adminLambda);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Admin API
         */
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, `${props.appName}-AdminAuthorizer`, {
            authorizerName: `${props.appName}-AdminAuthorizer`,
            cognitoUserPools: [adminUserPool],
        });

        const adminApi = new apigateway.LambdaRestApi(this, `${props.appName}-AdminApi`, {
            handler: adminLambda,
            proxy: true,
            restApiName: `${props.appName}-AdminApi`,
            deployOptions: {
                stageName: "admin",
            },
            endpointTypes: [apigateway.EndpointType.REGIONAL],
            minCompressionSize: Size.bytes(0),
            defaultMethodOptions: {
                authorizationType: apigateway.AuthorizationType.COGNITO,
                authorizer: authorizer,
            },
            defaultCorsPreflightOptions: {
                allowOrigins: ["*"],
                allowMethods: apigateway.Cors.ALL_METHODS,
                allowHeaders: ["*", "Authorization"],
            },
        });
    }
}
