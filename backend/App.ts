import { App } from "aws-cdk-lib";
import { CommonStack } from "./src/Common";
import { AdminStack } from "./src/Admin";

const APP_NAME = "SnapNews";

const LAYERS = {
    POWERTOOLS: "arn:aws:lambda:us-east-1:017000801446:layer:AWSLambdaPowertoolsPythonV3-python312-x86_64:11",
};

const app = new App();

const common = new CommonStack(app, `${APP_NAME}-CommonStack`, {
    appName: APP_NAME,
});

const admin = new AdminStack(app, `${APP_NAME}-AdminStack`, {
    appName: APP_NAME,
    tableName: common.TableName,
    layers: LAYERS,
});

app.synth();
