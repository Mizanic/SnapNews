import config from "../config.json";
import defaults from "./Defaults.json";

////////////////////////////////////////////////////////////
// CONFIGURATION
////////////////////////////////////////////////////////////
const APP_NAME = config.PROJECT_NAME.trim().replace(/ /g, "");
const READ_SCHEDULE_HOURS = defaults.READ_SCHEDULE_HOURS;
const NEWS_TTL_DAYS = defaults.NEWS_TTL_DAYS;
const NEWS_FEED_BUCKET = defaults.NEWS_FEED_BUCKET;
const ARN_POWERTOOLS_LAYER = "arn:aws:lambda:us-east-1:017000801446:layer:AWSLambdaPowertoolsPythonV3-python312-x86_64:11";

const LOG_LEVEL = "DEBUG";

export const CONSTANTS = {
    APP_NAME,
    READ_SCHEDULE_HOURS,
    NEWS_TTL_DAYS,
    NEWS_FEED_BUCKET,
    ARN_POWERTOOLS_LAYER,
    LOG_LEVEL,
};

export type ConstantsType = typeof CONSTANTS;

export const PARAMS = {
    TABLE_NAME: `/${APP_NAME}/common/table-name`,
    COMMON_LAYER_ARN: `/${APP_NAME}/common/common-layer-arn`,
    PROCESSED_QUEUE_ARN: `/${APP_NAME}/common/processed-queue-arn`,
};

export type ParamsType = typeof PARAMS;
