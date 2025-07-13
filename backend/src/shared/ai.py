"""
# --*-- coding: utf-8 --*--
This Module is used to santise the content
"""

# ==================================================================================================
# Python imports

from boto3 import resource
from botocore.exceptions import ClientError
from google import genai
from google.genai import types

# ==================================================================================================
# Module imports
from shared.logger import logger

# ==================================================================================================
# Global declarations


def get_gemini_api_key() -> str:
    """
    This function gets the GEMINI API key from dynamodb
    """
    try:
        dynamodb = resource("dynamodb")
        table = dynamodb.Table("SnapNews-Table")

        # Get item with pk: APP#DATA and sk: GEMINI
        item = table.get_item(Key={"pk": "APP#DATA", "sk": "GEMINI"})

        return item["Item"]["API_KEY"]
    except ClientError as dynamodb_error:
        logger.error(dynamodb_error)
        raise dynamodb_error


GEMINI_API_KEY = get_gemini_api_key()
GEMINI_MODEL_NAME = "gemma-3-27b-it"


class GEMINI:
    def __init__(
        self,
        api_key: str = GEMINI_API_KEY,
        model_name: str = GEMINI_MODEL_NAME,
    ) -> None:
        self.client = genai.Client(api_key=api_key)
        self.model = model_name

    def generate_summary(self, article: str) -> str:
        prompt = "Summarize the following article in 80 words: \n" + article

        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=prompt),
                ],
            ),
        ]
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
        )

        summary = ""

        for chunk in self.client.models.generate_content_stream(
            model=self.model,
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.text:
                summary += chunk.text
        return summary
