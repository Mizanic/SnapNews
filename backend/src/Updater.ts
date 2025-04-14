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
export interface UpdaterStackProps extends StackProps {
    appName: string;
    tableName: string;
    processedQueueArn: string;
    layers: {
        COMMON_SSM_PARAMETER_NAME: string;
        POWERTOOLS_ARN: string;
    };
    ttlDays: number;
}

export class UpdaterStack extends Stack {
    constructor(scope: Construct, id: string, props: UpdaterStackProps) {
        super(scope, id, props);

        // Get the processed queue
        const processedQueue = sqs.Queue.fromQueueArn(this, `${props.appName}-ProcessedQueue`, props.processedQueueArn);

        // Fetch dynamodb main table and local index
        const NewsTable = dynamodb.Table.fromTableAttributes(this, "NewsTable", {
            tableName: props.tableName,
            localIndexes: ["byUrlHash"],
            grantIndexPermissions: true,
        });

        // Configure the Layer
        const commonLayerArn = ssm.StringParameter.fromStringParameterAttributes(this, `${props.appName}-CommonLayerArn`, {
            parameterName: props.layers.COMMON_SSM_PARAMETER_NAME,
        });
        const commonLayer = lambda.LayerVersion.fromLayerVersionArn(this, `${props.appName}-CommonLayer`, commonLayerArn.stringValue);
        const powertoolsLayer = lambda.LayerVersion.fromLayerVersionArn(
            this,
            `${props.appName}-PowertoolsLayer`,
            props.layers.POWERTOOLS_ARN
        );
        // Create a lambda function to process the rss items
        const updaterFn = new lambda.Function(this, `${props.appName}-Updater`, {
            functionName: `${props.appName}-Updater`,
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "app.main",
            code: lambda.Code.fromAsset(join(__dirname, "fn/updater")),
            layers: [commonLayer, powertoolsLayer],
            environment: {
                NEWS_TABLE_NAME: NewsTable.tableName,
                PROCESSED_NEWS_QUEUE_NAME: processedQueue.queueName,
            },
        });

        new logs.LogGroup(this, "UpdaterFnLogGroup", {
            logGroupName: `/aws/lambda/${updaterFn.functionName}`,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.TWO_WEEKS,
        });

        // Grant the lambda function access to the queue and table
        processedQueue.grantConsumeMessages(updaterFn);
        NewsTable.grantReadWriteData(updaterFn);

        // Create a rule to trigger the lambda function
        updaterFn.addEventSource(new lambdaEventSources.SqsEventSource(processedQueue));
    }
}
