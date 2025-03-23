import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface UpdateStackProps extends StackProps {
  updateName: string;
}


export class UpdateStack extends Stack {
  constructor(scope: Construct, id: string, props: UpdateStackProps) {
    super(scope, id, props);

    // Create a new RestApi

  }
}
