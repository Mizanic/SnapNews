import { Stack, StackProps } from "aws-cdk-lib";
import {
    aws_lambda as lambda,
    aws_s3 as s3,
    aws_events as events,
    aws_logs as logs,
    aws_events_targets as targets,
    aws_ssm as ssm,
    aws_dynamodb as dynamodb,
    Duration,
    RemovalPolicy,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { readFileSync } from "fs";
import { join } from "path";
import { ConstantsType, ParamsType } from "../constants";

export interface ReaderStackProps extends StackProps {
    constants: ConstantsType;
    params: ParamsType;
}

export class ReaderStack extends Stack {
    constructor(scope: Construct, id: string, props: ReaderStackProps) {
        super(scope, id, props);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // SSM parameters
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const tableName = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-TableName`, {
            parameterName: props.params.TABLE_NAME,
        });

        // Configure the Layer
        const commonLayerArn = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-CommonLayerArn`, {
            parameterName: props.params.COMMON_LAYER_ARN,
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

        // Configure the News Table
        const newsTable = dynamodb.Table.fromTableName(this, `${props.constants.APP_NAME}-NewsTable`, tableName.stringValue);

        // Configure the Reader Lambda
        const readerFn = new lambda.Function(this, `${props.constants.APP_NAME}-Reader`, {
            functionName: `${props.constants.APP_NAME}-Reader`,
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "app.main",
            code: lambda.Code.fromAsset(join(__dirname, "fn/reader")),
            layers: [commonLayer, powertoolsLayer],
            timeout: Duration.seconds(120),
            environment: {
                NEWS_FEED_BUCKET: props.constants.NEWS_FEED_BUCKET,
                NEWS_TABLE_NAME: tableName.stringValue,
            },
        });

        const bucket = s3.Bucket.fromBucketName(this, `${props.constants.APP_NAME}-NewsFeedBucket`, props.constants.NEWS_FEED_BUCKET);
        bucket.grantReadWrite(readerFn);
        newsTable.grantReadData(readerFn);
        const rule = new events.Rule(this, `${props.constants.APP_NAME}-ReaderSchedulerRule`, {
            ruleName: `${props.constants.APP_NAME}-ReaderSchedulerRule`,
            schedule: events.Schedule.rate(Duration.hours(props.constants.READ_SCHEDULE_HOURS)),
        });

        const newsSources = JSON.parse(readFileSync(join(__dirname, "../../NewsSources.json"), "utf8"));

        for (const source of newsSources.Sources) {
            rule.addTarget(
                new targets.LambdaFunction(readerFn, {
                    event: events.RuleTargetInput.fromObject({
                        NewsSource: source.Name.Short,
                    }),
                })
            );
        }

        new logs.LogGroup(this, `${props.constants.APP_NAME}-ReaderLogGroup`, {
            logGroupName: `/aws/lambda/${props.constants.APP_NAME}-Reader`,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.TWO_WEEKS,
        });
    }
}
