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
# MODEL_NAME = "gemini-embedding-001"

# To run this code you need to install the following dependencies:
# pip install google-genai


def generate(article: str) -> None:
    client = genai.Client(
        api_key=GEMINI_API_KEY,
    )

    prompt = "Summarize the following article in 80 words: \n" + article

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
            print(chunk.text, end="")
    return summary


def get_article(url: str) -> str:
    article = Article(url)
    article.download()
    article.parse()

    return article.text


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
    url = "https://timesofindia.indiatimes.com/india/-manifests-savarn-and-shudras-mp-hc-flags-caste-system-in-judiciary-calls-out-feudal-mindset/articleshow/122918371.cms"
    article = get_article(url)
    # print(article)
    # summary = generate(article)
    summary = str(generate(article))
    print("\n\n")
    print("=" * 100)
    print(summary)
