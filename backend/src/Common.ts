import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { aws_dynamodb as dynamodb } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface CommonStackProps extends StackProps {
    appName: string;
}

export class CommonStack extends Stack {
    public readonly TableName: string;
    constructor(scope: Construct, id: string, props: CommonStackProps) {
        super(scope, id, props);

        // Create a DynamoDB table for the API
        const Table = new dynamodb.Table(this, `${props.appName}-Table`, {
            partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            timeToLiveAttribute: "ttl",
            removalPolicy: RemovalPolicy.DESTROY,
        });

        Table.addLocalSecondaryIndex({
            indexName: "byUrlHash",
            sortKey: { name: "url_hash", type: dynamodb.AttributeType.STRING },
        });

        this.TableName = Table.tableName;
    }
}
