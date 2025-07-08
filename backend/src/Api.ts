import { Stack, StackProps } from "aws-cdk-lib";
import {
    aws_apigateway as apigw,
    aws_lambda as lambda,
    aws_dynamodb as dynamodb,
    aws_logs as logs,
    aws_ssm as ssm,
    RemovalPolicy,
    Size,
    Duration,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { ConstantsType, ParamsType } from "../constants";
import { join } from "path";

export interface ApiStackProps extends StackProps {
    constants: ConstantsType;
    params: ParamsType;
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // SSM parameters
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const tableName = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-TableName`, {
            parameterName: props.params.TABLE_NAME,
        });

        const commonLayerArn = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-CommonLayerArn`, {
            parameterName: props.params.COMMON_LAYER_ARN,
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // DynamoDB table
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const newsTable = dynamodb.Table.fromTableAttributes(this, "NewsTable", {
            tableName: tableName.stringValue,
            localIndexes: ["byItemHash", "byTop"],
            grantIndexPermissions: true,
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Lambda handler
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const commonLayer = lambda.LayerVersion.fromLayerVersionArn(
            this,
            `${props.constants.APP_NAME}-CommonLayer`,
            commonLayerArn.stringValue
        );

        const powertoolsLayer = lambda.LayerVersion.fromLayerVersionArn(
            this,
            `${props.constants.APP_NAME}-PowertoolsLayer`,
            props.constants.ARN_POWERTOOLS_LAYER
        );

        const apiFn = new lambda.Function(this, `${props.constants.APP_NAME}-ApiHandler`, {
            functionName: `${props.constants.APP_NAME}-ApiHandler`,
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "app.main",
            code: lambda.Code.fromAsset(join(__dirname, "fn/api")),
            layers: [commonLayer, powertoolsLayer],
            environment: {
                NEWS_TABLE_NAME: newsTable.tableName,
            },
        });

        newsTable.grantReadWriteData(apiFn);

        new logs.LogGroup(this, `${props.constants.APP_NAME}-ApiHandlerLogGroup`, {
            logGroupName: `/aws/lambda/${apiFn.functionName}`,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.TWO_WEEKS,
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // API Gateway
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const api = new apigw.LambdaRestApi(this, `${props.constants.APP_NAME}-Api`, {
            restApiName: `${props.constants.APP_NAME}-Api`,
            handler: apiFn,
            proxy: true,
            deployOptions: {
                stageName: "v1",
            },
            defaultCorsPreflightOptions: {
                allowOrigins: ["*"], // TODO: Change to the mobile app URL
                allowMethods: apigw.Cors.ALL_METHODS,
                allowHeaders: ["*"],
            },
            endpointTypes: [apigw.EndpointType.REGIONAL],
            minCompressionSize: Size.bytes(0),
        });
    }
}
