# type: ignore  # noqa: PGH003
import re

from boto3 import resource
from google import genai
from google.genai import types
from newspaper import Article

## Get the GEMINI_API_KEY from dynamodb
dynamodb = resource("dynamodb")
table = dynamodb.Table("SnapNews-Table")


## Get item with pk: APP#DATA and sk: GEMINI
item = table.get_item(Key={"pk": "APP#DATA", "sk": "SECRETS"})

GEMINI_API_KEY = item["Item"]["GEMINI_API_KEY"]
MODEL_NAME = "gemma-3-27b-it"
# MODEL_NAME = "gemma-3-1b-it"

# To run this code you need to install the following dependencies:
# pip install google-genai


def generate(article: str, headline: str) -> str:
    client = genai.Client(
        api_key=GEMINI_API_KEY,
    )

    prompt = (
        """Summarize the following article, the summary should be:
        1. 99 words.
        2. Compelling and engaging for the reader.
        3. reorgnised to address the headline of the article first, context second, and conclusion third.
        Only provide the summary, no other text.\n"""
        f"Article: {article}\n" + f"Headline: {headline}"
    )

    model = MODEL_NAME
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

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if chunk.text:
            summary += chunk.text
            # print(chunk.text, end="")
    return summary


def get_article(url: str) -> str:
    article = Article(url)
    article.download()
    article.parse()

    return article.text, article.title


def _remove_html_tags(text: str) -> str:
    """Remove HTML tags from a given string."""
    clean = re.compile("<.*?>")
    return re.sub(clean, "", text)


def santise_content(content: str) -> str:
    """
    This function santises the content
    """
    # Remove HTML tags
    content = _remove_html_tags(content)

    # Remove newlines
    content = content.replace("\n", "")

    # Remove multiple spaces
    content = re.sub(" +", " ", content)

    return content


if __name__ == "__main__":
    # url = "https://www.ndtv.com/india-news/pm-narendra-modi-greets-defence-minister-rajnath-singh-on-his-birthday-today-8852566"
    url = "https://sports.ndtv.com/england-vs-india-2025/india-used-vaseline-in-5th-test-ex-pakistan-stars-ball-tampering-claims-gets-brutal-rebuttal-9032269"
    article, headline = get_article(url)
    # print(article)
    # summary = generate(article)
    summary = str(generate(article, headline))
    print("=" * 100)
    print(summary)
