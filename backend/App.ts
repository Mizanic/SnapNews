import { App, Tags } from "aws-cdk-lib";
import { CommonStack } from "./src/Common";
import { AdminStack } from "./src/Admin";
import { ReaderStack } from "./src/Reader";
import { ProcessStack } from "./src/Process";
import { UpdaterStack } from "./src/Updater";
import { ApiStack } from "./src/Api";
import { PARAMS, CONSTANTS } from "./constants";

////////////////////////////////////////////////////////////
// STACKS
////////////////////////////////////////////////////////////

const app = new App();

const APP_NAME = CONSTANTS.APP_NAME;

const common = new CommonStack(app, `${APP_NAME}-CommonStack`, {
    constants: CONSTANTS,
    params: PARAMS,
});

const admin = new AdminStack(app, `${APP_NAME}-AdminStack`, {
    constants: CONSTANTS,
    params: PARAMS,
});

const reader = new ReaderStack(app, `${APP_NAME}-ReaderStack`, {
    constants: CONSTANTS,
    params: PARAMS,
});

const process = new ProcessStack(app, `${APP_NAME}-ProcessStack`, {
    constants: CONSTANTS,
    params: PARAMS,
});

const updater = new UpdaterStack(app, `${APP_NAME}-UpdateStack`, {
    constants: CONSTANTS,
    params: PARAMS,
});

const api = new ApiStack(app, `${APP_NAME}-ApiStack`, {
    constants: CONSTANTS,
    params: PARAMS,
});

// admin.addDependency(common);
// reader.addDependency(common);
// process.addDependency(common);
// updater.addDependency(common);
// api.addDependency(common);

// Add tags to all resources

Tags.of(app).add("Project", APP_NAME);

app.synth();
