import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface ProcessStackProps extends StackProps {
    processName: string;
}

export class ProcessStack extends Stack {
    constructor(scope: Construct, id: string, props: ProcessStackProps) {
        super(scope, id, props);

        // Create a new RestApi
    }
}
