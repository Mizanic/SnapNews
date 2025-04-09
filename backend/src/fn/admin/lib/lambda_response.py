from .cors import HEADERS


def RESPONSE(body: dict, status_code: int = 200, headers: dict = HEADERS) -> dict:  # noqa: N802
    return {
        'statusCode': status_code,  # noqa: Q000
        'headers': headers,  # noqa: Q000
        'body': body,  # noqa: Q000
    }
