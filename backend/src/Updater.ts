/*
This module contains the final processed news queue and the lambda function that will be triggered by
it to insert the news into the database
*/

import { Stack, StackProps } from "aws-cdk-lib";
import {
    aws_sqs as sqs,
    aws_lambda as lambda,
    aws_dynamodb as dynamodb,
    aws_logs as logs,
    aws_ssm as ssm,
    RemovalPolicy,
    aws_lambda_event_sources as lambdaEventSources,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import { ConstantsType, ParamsType } from "../constants";

export interface UpdaterStackProps extends StackProps {
    constants: ConstantsType;
    params: ParamsType;
}

export class UpdaterStack extends Stack {
    constructor(scope: Construct, id: string, props: UpdaterStackProps) {
        super(scope, id, props);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // SSM parameters
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const processedQueueArn = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-ProcessedQueueArn`, {
            parameterName: props.params.PROCESSED_QUEUE_ARN,
        });

        const tableName = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-TableName`, {
            parameterName: props.params.TABLE_NAME,
        });

        const commonLayerArn = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-CommonLayerArn`, {
            parameterName: props.params.COMMON_LAYER_ARN,
        });

        // Get the processed queue
        const processedQueue = sqs.Queue.fromQueueArn(this, `${props.constants.APP_NAME}-ProcessedQueue`, processedQueueArn.stringValue);

        // Fetch dynamodb main table and local index
        const newsTable = dynamodb.Table.fromTableAttributes(this, `${props.constants.APP_NAME}-NewsTable`, {
            tableName: tableName.stringValue,
            localIndexes: ["byItemHash"],
            grantIndexPermissions: true,
        });

        // Configure the Layer

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
        // Create a lambda function to process the rss items
        const updaterFn = new lambda.Function(this, `${props.constants.APP_NAME}-Updater`, {
            functionName: `${props.constants.APP_NAME}-Updater`,
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "app.main",
            code: lambda.Code.fromAsset(join(__dirname, "fn/updater")),
            layers: [commonLayer, powertoolsLayer],
            environment: {
                NEWS_TABLE_NAME: newsTable.tableName,
                PROCESSED_NEWS_QUEUE_NAME: processedQueue.queueName,
            },
        });

        new logs.LogGroup(this, `${props.constants.APP_NAME}-UpdaterFnLogGroup`, {
            logGroupName: `/aws/lambda/${updaterFn.functionName}`,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.TWO_WEEKS,
        });

        // Grant the lambda function access to the queue and table
        processedQueue.grantConsumeMessages(updaterFn);
        newsTable.grantReadWriteData(updaterFn);

        // Create a rule to trigger the lambda function
        updaterFn.addEventSource(new lambdaEventSources.SqsEventSource(processedQueue));
    }
}
