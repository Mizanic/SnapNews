import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_lambda as lambda, aws_s3 as s3, aws_logs as logs } from "aws-cdk-lib";
import { join } from "path";

export interface ReaderStackProps extends StackProps {
    appName: string;
    readerName: string;
    bucketName: string;
    layers: Record<string, string>;
}

export class ReaderStack extends Stack {
    public readonly ReaderFunction: lambda.Function;
    constructor(scope: Construct, id: string, props: ReaderStackProps) {
        super(scope, id, props);

        // Configure the Admin Lambda
        const readerLayer = new lambda.LayerVersion(this, `${props.appName}-ReaderLayer`, {
            compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
            code: lambda.Code.fromAsset(join(__dirname, "../../.layers/reader")),
            removalPolicy: RemovalPolicy.RETAIN,
        });

        const powertoolsLayer = lambda.LayerVersion.fromLayerVersionArn(this, `${props.appName}-PowertoolsLayer`, props.layers.POWERTOOLS);

        this.ReaderFunction = new lambda.Function(this, `${props.appName}-Reader`, {
            functionName: `${props.appName}-Reader`,
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "app.main",
            code: lambda.Code.fromAsset(join(__dirname, "fn/reader")),
            layers: [readerLayer, powertoolsLayer],
            environment: {
                NEWS_FEED_BUCKET: props.bucketName,
            },
        });

        const bucket = s3.Bucket.fromBucketName(this, `${props.appName}-NewsFeedBucket`, props.bucketName);
        bucket.grantReadWrite(this.ReaderFunction);

        new logs.LogGroup(this, `${props.appName}-ReaderLogGroup`, {
            logGroupName: `/aws/lambda/${props.appName}-Reader`,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.TWO_WEEKS,
        });
    }
}
