import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface ReaderStackProps extends StackProps {
    readerName: string;
}

export class ReaderStack extends Stack {
    constructor(scope: Construct, id: string, props: ReaderStackProps) {
        super(scope, id, props);

        // Create a new RestApi
    }
}
