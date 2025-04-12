import { App } from "aws-cdk-lib";
import { CommonStack } from "./src/Common";
import { AdminStack } from "./src/Admin";
import config from "../config.json";
import defaults from "./Defaults.json";
import { ReaderStack } from "./src/Reader";

////////////////////////////////////////////////////////////
// CONFIGURATION
////////////////////////////////////////////////////////////
const APP_NAME = config.PROJECT_NAME.trim().replace(/ /g, "");
const READ_SCHEDULE_HOURS = defaults.READ_SCHEDULE_HOURS;
const NEWS_TTL_DAYS = defaults.NEWS_TTL_DAYS;
const NEWS_FEED_BUCKET = defaults.NEWS_FEED_BUCKET;

const LAYERS = {
    POWERTOOLS: "arn:aws:lambda:us-east-1:017000801446:layer:AWSLambdaPowertoolsPythonV3-python312-x86_64:11",
};

////////////////////////////////////////////////////////////
// STACKS
////////////////////////////////////////////////////////////

const app = new App();

const common = new CommonStack(app, `${APP_NAME}-CommonStack`, {
    appName: APP_NAME,
});

const admin = new AdminStack(app, `${APP_NAME}-AdminStack`, {
    appName: APP_NAME,
    tableName: common.TableName,
    layers: LAYERS,
});

admin.addDependency(common);

const reader = new ReaderStack(app, `${APP_NAME}-ReaderStack`, {
    appName: APP_NAME,
    bucketName: NEWS_FEED_BUCKET,
    layers: LAYERS,
    readSchedule: READ_SCHEDULE_HOURS,
});

app.synth();
