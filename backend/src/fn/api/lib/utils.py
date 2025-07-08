def get_query_params(event: dict) -> dict:
    """
    Get the query parameters from the event
    """
    return event["queryStringParameters"]
