import { Stack, StackProps } from "aws-cdk-lib";
import {
    aws_dynamodb as dynamodb,
    aws_lambda as lambda,
    aws_sqs as sqs,
    aws_ssm as ssm,
    RemovalPolicy,
    Duration,
    aws_s3 as s3,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import { ConstantsType, ParamsType } from "../constants";

export interface CommonStackProps extends StackProps {
    constants: ConstantsType;
    params: ParamsType;
}

export class CommonStack extends Stack {
    constructor(scope: Construct, id: string, props: CommonStackProps) {
        super(scope, id, props);

        ////////////////////////////////////////////////////////////
        // DynamoDB table for holding News data
        ////////////////////////////////////////////////////////////
        // Create a DynamoDB table for the API
        const table = new dynamodb.Table(this, `${props.constants.APP_NAME}-Table`, {
            tableName: `${props.constants.APP_NAME}-Table`,
            partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            timeToLiveAttribute: "ttl",
            removalPolicy: RemovalPolicy.DESTROY,
        });

        table.addLocalSecondaryIndex({
            indexName: "byItemHash",
            sortKey: { name: "item_hash", type: dynamodb.AttributeType.STRING },
        });

        table.addLocalSecondaryIndex({
            indexName: "byTop",
            sortKey: { name: "sk_top", type: dynamodb.AttributeType.STRING },
        });

        ////////////////////////////////////////////////////////////
        // Common Layer for lambda functions
        ////////////////////////////////////////////////////////////

        const commonLayer = new lambda.LayerVersion(this, `${props.constants.APP_NAME}-CommonLayer`, {
            compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
            code: lambda.Code.fromAsset(join(__dirname, "../../.layers/common")),
            removalPolicy: RemovalPolicy.RETAIN,
        });

        ////////////////////////////////////////////////////////////
        // Processed Queue for holding processed news
        ////////////////////////////////////////////////////////////

        const processedDLQ = new sqs.Queue(this, `${props.constants.APP_NAME}-ProcessedDLQ`, {
            queueName: `${props.constants.APP_NAME}-ProcessedDLQ`,
        });

        const summarisedDLQ = new sqs.Queue(this, `${props.constants.APP_NAME}-SummarisedDLQ`, {
            queueName: `${props.constants.APP_NAME}-SummarisedDLQ`,
        });

        const processedQueue = new sqs.Queue(this, `${props.constants.APP_NAME}-ProcessedQueue`, {
            queueName: `${props.constants.APP_NAME}-ProcessedQueue`,
            removalPolicy: RemovalPolicy.DESTROY,
            visibilityTimeout: Duration.seconds(180),
            deadLetterQueue: {
                maxReceiveCount: 1,
                queue: processedDLQ,
            },
        });

        const summarisedQueue = new sqs.Queue(this, `${props.constants.APP_NAME}-SummarisedQueue`, {
            queueName: `${props.constants.APP_NAME}-SummarisedQueue`,
            removalPolicy: RemovalPolicy.DESTROY,
            visibilityTimeout: Duration.seconds(180),
            deadLetterQueue: {
                maxReceiveCount: 1,
                queue: summarisedDLQ,
            },
        });

        ////////////////////////////////////////////////////////////
        // Create SSM parameters
        ////////////////////////////////////////////////////////////

        const tableNameParameter = new ssm.StringParameter(this, `${props.constants.APP_NAME}-TableName`, {
            parameterName: props.params.TABLE_NAME,
            stringValue: table.tableName,
            tier: ssm.ParameterTier.STANDARD,
            description: `The name of the DynamoDB table for ${props.constants.APP_NAME}`,
        });

        const commonLayerArnParameter = new ssm.StringParameter(this, `${props.constants.APP_NAME}-CommonLayerArn`, {
            parameterName: props.params.COMMON_LAYER_ARN,
            stringValue: commonLayer.layerVersionArn,
            tier: ssm.ParameterTier.STANDARD,
            description: `The ARN of the Common Layer for ${props.constants.APP_NAME}`,
        });

        const processedQueueArnParameter = new ssm.StringParameter(this, `${props.constants.APP_NAME}-ProcessedQueueArn`, {
            parameterName: props.params.PROCESSED_QUEUE_ARN,
            stringValue: processedQueue.queueArn,
            tier: ssm.ParameterTier.STANDARD,
            description: `The ARN of the Processed Queue for ${props.constants.APP_NAME}`,
        });

        const summarisedQueueArnParameter = new ssm.StringParameter(this, `${props.constants.APP_NAME}-SummarisedQueueArn`, {
            parameterName: props.params.SUMMARISED_QUEUE_ARN,
            stringValue: summarisedQueue.queueArn,
            tier: ssm.ParameterTier.STANDARD,
            description: `The ARN of the Summarised Queue for ${props.constants.APP_NAME}`,
        });
    }
}
