from boto3 import client

## Get the reader arn using CFN Outputs
STACK_NAME = "SnapNews-ReaderStack"
# READER_EXPORT_NAME = "SnapNews-ReaderArn"

# cfn_output = client("cloudformation").describe_stacks(StackName=READER_STACK_NAME)["Stacks"][0]["Outputs"]
# reader_arn = next(output["ExportName"] for output in cfn_output if output["ExportName"] == READER_EXPORT_NAME)

# # get the rule arn using CFN Outputs
# RULE_STACK_NAME = "SnapNews-SchedulerStack"
# RULE_EXPORT_NAME = "SnapNews-SchedulerArn"

# cfn_output = client("cloudformation").describe_stacks(StackName=RULE_STACK_NAME)["Stacks"][0]["Outputs"]
# rule_arn = next(output["ExportName"] for output in cfn_output if output["ExportName"] == RULE_EXPORT_NAME)

# get teh rule and attach new target
rule = client("events").describe_rule(Name=STACK_NAME)["Rule"]

print(rule)