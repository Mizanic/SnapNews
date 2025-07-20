import { Stack, StackProps } from "aws-cdk-lib";
import {
    aws_s3 as s3,
    aws_sqs as sqs,
    aws_dynamodb as dynamodb,
    aws_lambda as lambda,
    aws_events as events,
    aws_events_targets as targets,
    aws_logs as logs,
    aws_ssm as ssm,
    aws_iam as iam,
    RemovalPolicy,
    Duration,
    aws_lambda_event_sources as lambdaEventSources,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import { ConstantsType, ParamsType } from "../constants";

export interface ProcessStackProps extends StackProps {
    constants: ConstantsType;
    params: ParamsType;
}

export class ProcessStack extends Stack {
    constructor(scope: Construct, id: string, props: ProcessStackProps) {
        super(scope, id, props);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Import SSM parameters
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const processedQueueArn = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-ProcessedQueueArn`, {
            parameterName: props.params.PROCESSED_QUEUE_ARN,
        });

        const summarisedQueueArn = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-SummarisedQueueArn`, {
            parameterName: props.params.SUMMARISED_QUEUE_ARN,
        });

        const tableName = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-TableName`, {
            parameterName: props.params.TABLE_NAME,
        });

        const commonLayerArn = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-CommonLayerArn`, {
            parameterName: props.params.COMMON_LAYER_ARN,
        });

        // Enable eventbridge notifications for the bucket
        const bucket = s3.Bucket.fromBucketName(this, "NewsBucket", props.constants.NEWS_FEED_BUCKET);
        bucket.enableEventBridgeNotification();

        // Create S3 Event Notification
        const rule = new events.Rule(this, "s3_events", {
            eventPattern: {
                source: ["aws.s3"],
                detailType: ["Object Created"],
                detail: {
                    bucket: {
                        name: [props.constants.NEWS_FEED_BUCKET],
                    },
                },
            },
        });

        // Get the dynamodb table
        const table = dynamodb.Table.fromTableAttributes(this, "NewsTable", {
            tableName: tableName.stringValue,
            localIndexes: ["byItemHash"],
            grantIndexPermissions: true,
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // SQS queues
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const processedNewsQueue = sqs.Queue.fromQueueArn(this, `${props.constants.APP_NAME}-ProcessedQueue`, processedQueueArn.stringValue);
        const summarisedNewsQueue = sqs.Queue.fromQueueArn(this, `${props.constants.APP_NAME}-SummarisedQueue`, summarisedQueueArn.stringValue);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Common Layers
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
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Lambda: Process the RSS items
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Create a lambda function to process the rss items
        const processFn = new lambda.Function(this, "ProcessFn", {
            functionName: `${props.constants.APP_NAME}-Processor`,
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "app.main",
            code: lambda.Code.fromAsset(join(__dirname, "fn/process")),
            timeout: Duration.seconds(120),
            environment: {
                PROCESSED_NEWS_QUEUE_NAME: processedNewsQueue.queueName,
                NEWS_TABLE_NAME: table.tableName,
                POWERTOOLS_LOG_LEVEL: props.constants.LOG_LEVEL,
            },
            layers: [commonLayer, powertoolsLayer],
        });

        rule.addTarget(new targets.LambdaFunction(processFn));

        new logs.LogGroup(this, `${props.constants.APP_NAME}-ProcessFnLogGroup`, {
            logGroupName: `/aws/lambda/${processFn.functionName}`,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.TWO_WEEKS,
        });

        // Grant the lambda function access to the queue and table
        processedNewsQueue.grantSendMessages(processFn);
        table.grantReadData(processFn);
        bucket.grantRead(processFn);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Lambda: Scrape and summarise the news
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Create a lambda function to scrape and summarise the news
        const summariseFn = new lambda.Function(this, "SummariseFn", {
            functionName: `${props.constants.APP_NAME}-Summariser`,
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "app.main",
            code: lambda.Code.fromAsset(join(__dirname, "fn/summarise")),
            timeout: Duration.seconds(120),
            environment: {
                SUMMARISED_NEWS_QUEUE_NAME: summarisedNewsQueue.queueName,
                NEWS_TABLE_NAME: table.tableName,
                POWERTOOLS_LOG_LEVEL: props.constants.LOG_LEVEL,
                SSM_GEMINI_API_KEY: props.params.GEMINI_API_KEY,
                GEMINI_MODEL_NAME: props.constants.GEMINI_MODEL_NAME,
            },
            layers: [commonLayer, powertoolsLayer],
        });

        new logs.LogGroup(this, `${props.constants.APP_NAME}-SummariseFnLogGroup`, {
            logGroupName: `/aws/lambda/${summariseFn.functionName}`,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.TWO_WEEKS,
        });

        summariseFn.addEventSource(
            new lambdaEventSources.SqsEventSource(processedNewsQueue, {
                enabled: true,
                maxConcurrency: 3,
            })
        );

        // Grant the lambda function access to the queue and table
        // Grant the lambda function access to SSM parameter manually
        summariseFn.addToRolePolicy(
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ["ssm:GetParameter"],
                resources: [`arn:aws:ssm:${this.region}:${this.account}:parameter${props.params.GEMINI_API_KEY}`],
            })
        );
        summarisedNewsQueue.grantSendMessages(summariseFn);
        table.grantReadData(summariseFn);
    }
}
