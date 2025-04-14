import { App, Tags } from "aws-cdk-lib";
import { CommonStack } from "./src/Common";
import { AdminStack } from "./src/Admin";
import config from "../config.json";
import defaults from "./Defaults.json";
import { ReaderStack } from "./src/Reader";
import { ProcessStack } from "./src/Process";
import { UpdaterStack } from "./src/Updater";
////////////////////////////////////////////////////////////
// CONFIGURATION
////////////////////////////////////////////////////////////
const APP_NAME = config.PROJECT_NAME.trim().replace(/ /g, "");
const READ_SCHEDULE_HOURS = defaults.READ_SCHEDULE_HOURS;
const NEWS_TTL_DAYS = defaults.NEWS_TTL_DAYS;
const NEWS_FEED_BUCKET = defaults.NEWS_FEED_BUCKET;
const POWERTOOLS_LAYER_ARN = "arn:aws:lambda:us-east-1:017000801446:layer:AWSLambdaPowertoolsPythonV3-python312-x86_64:11";
////////////////////////////////////////////////////////////
// STACKS
////////////////////////////////////////////////////////////

const app = new App();

const common = new CommonStack(app, `${APP_NAME}-CommonStack`, {
    appName: APP_NAME,
    powertoolsLayerArn: POWERTOOLS_LAYER_ARN,
});

const LAYERS = {
    POWERTOOLS_ARN: POWERTOOLS_LAYER_ARN,
    COMMON_SSM_PARAMETER_NAME: `/${APP_NAME}/layers/common-layer-arn`,
};

const admin = new AdminStack(app, `${APP_NAME}-AdminStack`, {
    appName: APP_NAME,
    tableName: common.TableName,
    layers: LAYERS,
});

const reader = new ReaderStack(app, `${APP_NAME}-ReaderStack`, {
    appName: APP_NAME,
    bucketName: NEWS_FEED_BUCKET,
    layers: LAYERS,
    readSchedule: READ_SCHEDULE_HOURS,
});

const process = new ProcessStack(app, `${APP_NAME}-ProcessStack`, {
    appName: APP_NAME,
    bucketName: NEWS_FEED_BUCKET,
    tableName: common.TableName,
    processedQueueArn: common.ProcessedQueueArn,
    layers: LAYERS,
});

const updater = new UpdaterStack(app, `${APP_NAME}-UpdateStack`, {
    appName: APP_NAME,
    tableName: common.TableName,
    processedQueueArn: common.ProcessedQueueArn,
    layers: LAYERS,
    ttlDays: NEWS_TTL_DAYS,
});

admin.addDependency(common);
reader.addDependency(common);
process.addDependency(common);
updater.addDependency(common);

// Add tags to all resources

Tags.of(app).add("Project", APP_NAME);

app.synth();
