from boto3 import client, resource
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key


def main() -> None:
    dynamodb = resource("dynamodb")
    table = dynamodb.Table("SnapNews-Table")

    # Get all items in table that start with SOURCE#IND
    response = table.query(KeyConditionExpression=Key("pk").eq("SOURCE#IND"))
    # Get all items with pk = SOURCE#IND
    response = table.query(KeyConditionExpression=Key("pk").eq("SOURCE#IND"))
    # Get all items with pk = SOURCE#IND and sk = SOURCE#IND and sk ending with NDTV
    response = table.query(KeyConditionExpression=Key("pk").eq("SOURCE#IND") & Key("sk").begins_with("NDTV"))

    print(response)


if __name__ == "__main__":
    main()
