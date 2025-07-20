"""
# --*-- coding: utf-8 --*--
This Module is used to santise the content
"""

# ==================================================================================================
# Python imports

from google import genai
from google.genai.types import Content, GenerateContentConfig, Part

# ==================================================================================================
# Module imports
from shared.logger import logger

# ==================================================================================================
# Global declarations


class GEMINI:
    def __init__(
        self,
        api_key: str,
        model_name: str,
    ) -> None:
        self.client = genai.Client(api_key=api_key)
        self.model = model_name

    def generate_summary(self, article: str) -> str:
        prompt = "Summarize the following article in 180 - 200 words: \n" + article
        logger.info(f"Prompt: {prompt}")

        contents = [
            Content(
                role="user",
                parts=[
                    Part.from_text(text=prompt),
                ],
            ),
        ]
        generate_content_config = GenerateContentConfig(
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
