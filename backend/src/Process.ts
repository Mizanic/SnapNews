import { Stack, StackProps } from "aws-cdk-lib";
import {
    aws_s3 as s3,
    aws_sqs as sqs,
    Duration,
    aws_dynamodb as dynamodb,
    aws_lambda as lambda,
    aws_events as events,
    aws_events_targets as targets,
    aws_logs as logs,
    RemovalPolicy,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";

export interface ProcessStackProps extends StackProps {
    appName: string;
    bucketName: string;
    tableName: string;
    layers: Record<string, string>;
    processedQueueArn: string;
}

export class ProcessStack extends Stack {
    constructor(scope: Construct, id: string, props: ProcessStackProps) {
        super(scope, id, props);

        // Enable eventbridge notifications for the bucket
        const bucket = s3.Bucket.fromBucketName(this, "NewsBucket", props.bucketName);
        bucket.enableEventBridgeNotification();

        // Create S3 Event Notification
        const rule = new events.Rule(this, "s3_events", {
            eventPattern: {
                source: ["aws.s3"],
                detailType: ["Object Created"],
                detail: {
                    bucket: {
                        name: [props.bucketName],
                    },
                },
            },
        });

        // Get the dynamodb table
        const table = dynamodb.Table.fromTableAttributes(this, "NewsTable", {
            tableName: props.tableName,
            localIndexes: ["byUrlHash"],
            grantIndexPermissions: true,
        });

        // Create a SQS queue to store individual rss items
        const processedNewsQueue = sqs.Queue.fromQueueArn(this, `${props.appName}-ProcessedQueue`, props.processedQueueArn);

        // Configure the Powertools Layer
        const commonLayer = lambda.LayerVersion.fromLayerVersionArn(this, `${props.appName}-CommonLayer`, props.layers.COMMON);
        const powertoolsLayer = lambda.LayerVersion.fromLayerVersionArn(this, `${props.appName}-PowertoolsLayer`, props.layers.POWERTOOLS);

        // Create a lambda function to process the rss items
        const processFn = new lambda.Function(this, "ProcessFn", {
            functionName: `${props.appName}-Processor`,
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "app.main",
            code: lambda.Code.fromAsset(join(__dirname, "fn/process")),
            timeout: Duration.seconds(120),
            environment: {
                PROCESSED_NEWS_QUEUE_NAME: processedNewsQueue.queueName,
                NEWS_TABLE_NAME: table.tableName,
            },
            layers: [commonLayer, powertoolsLayer],
        });

        rule.addTarget(new targets.LambdaFunction(processFn));

        new logs.LogGroup(this, "ProcessFnLogGroup", {
            logGroupName: `/aws/lambda/${processFn.functionName}`,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.TWO_WEEKS,
        });

        // Grant the lambda function access to the queue and table
        processedNewsQueue.grantSendMessages(processFn);
        table.grantReadData(processFn);
        bucket.grantRead(processFn);
    }
}
