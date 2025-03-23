import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface CommonStackProps extends StackProps {
    apiName: string;
}

export class CommonStack extends Stack {
    constructor(scope: Construct, id: string, props: CommonStackProps) {
        super(scope, id, props);
    }
}
