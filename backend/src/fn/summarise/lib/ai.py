"""
# --*-- coding: utf-8 --*--
This Module is used to santise the content
"""

# ==================================================================================================
# Python imports
import time
from typing import Optional

from google import genai
from google.genai.errors import ClientError
from google.genai.types import Content, GenerateContentConfig, Part

# ==================================================================================================
# Module imports
from shared.logger import logger

# ==================================================================================================
# Global declarations
ERROR_CODE_RATE_LIMIT = 429


def is_rate_limit_error(exception: Exception) -> bool:
    """Check if the exception is a rate limit error from Google GenAI."""
    try:
        return isinstance(exception, ClientError) and exception.status_code == ERROR_CODE_RATE_LIMIT
    except ImportError:
        return False


def extract_retry_delay(exception: Exception) -> Optional[int]:
    """Extract retry delay from Google GenAI rate limit error response."""
    try:
        if hasattr(exception, "response_json") and exception.response_json:
            error_details = exception.response_json.get("error", {}).get("details", [])
            for detail in error_details:
                if detail.get("@type") == "type.googleapis.com/google.rpc.RetryInfo":
                    retry_delay_str = detail.get("retryDelay", "20s")
                    # Extract number from string like "20s"
                    delay_seconds = int(retry_delay_str.rstrip("s"))
                    return delay_seconds
    except (AttributeError, KeyError, ValueError, TypeError) as e:
        logger.error("Error extracting retry delay from Google GenAI rate limit error response", exc_info=e)
    return None


class GEMINI:
    def __init__(
        self,
        api_key: str,
        model_name: str,
        max_retries: int = 3,
        rate_limit_delay: int = 60,
    ) -> None:
        self.client = genai.Client(api_key=api_key)
        self.model = model_name
        self.max_retries = max_retries
        self.rate_limit_delay = rate_limit_delay

    def generate_summary(self, article: str) -> str:
        prompt = "Summarize the following article in 99 words. Only provide the summary, no other text. \n" + article
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

        # Retry logic for rate limiting
        for attempt in range(self.max_retries + 1):
            try:
                logger.info(f"Generating summary (attempt {attempt + 1})")
                summary = ""

                for chunk in self.client.models.generate_content_stream(
                    model=self.model,
                    contents=contents,
                    config=generate_content_config,
                ):
                    if chunk.text:
                        summary += chunk.text
                return summary

            except Exception as e:
                if is_rate_limit_error(e):
                    if attempt < self.max_retries:
                        logger.warning(f"Rate limit error on attempt {attempt + 1}. Retrying in {self.rate_limit_delay} seconds...")
                        time.sleep(self.rate_limit_delay)
                        continue
                    logger.error(f"Rate limit error after {self.max_retries + 1} attempts. Giving up.")
                    raise
                # For non-rate-limit errors, raise immediately
                logger.error("Non-rate-limit error in generate_summary", exc_info=e)
                raise

        # This should never be reached, but just in case
        msg = "Unexpected end of retry loop"
        raise Exception(msg)
