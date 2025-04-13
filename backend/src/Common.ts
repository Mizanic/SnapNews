import { Stack, StackProps } from "aws-cdk-lib";
import { aws_dynamodb as dynamodb, aws_lambda as lambda, RemovalPolicy, aws_sqs as sqs, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";

export interface CommonStackProps extends StackProps {
    appName: string;
}

export class CommonStack extends Stack {
    public readonly TableName: string;
    public readonly CommonLayer: lambda.LayerVersion;
    public readonly ProcessedQueueArn: string;

    constructor(scope: Construct, id: string, props: CommonStackProps) {
        super(scope, id, props);

        // Create a DynamoDB table for the API
        const Table = new dynamodb.Table(this, `${props.appName}-Table`, {
            partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            timeToLiveAttribute: "ttl",
            removalPolicy: RemovalPolicy.RETAIN,
        });

        Table.addLocalSecondaryIndex({
            indexName: "byUrlHash",
            sortKey: { name: "url_hash", type: dynamodb.AttributeType.STRING },
        });

        this.TableName = Table.tableName;

        // Create a Common Layer
        const CommonLayer = new lambda.LayerVersion(this, `${props.appName}-CommonLayer`, {
            compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
            code: lambda.Code.fromAsset(join(__dirname, "../../.layers/common")),
            removalPolicy: RemovalPolicy.RETAIN,
        });

        this.CommonLayer = CommonLayer;

        // Create a Processed Queue
        const ProcessedQueue = new sqs.Queue(this, `${props.appName}-ProcessedQueue`, {
            visibilityTimeout: Duration.seconds(180),
        });

        this.ProcessedQueueArn = ProcessedQueue.queueArn;
    }
}
