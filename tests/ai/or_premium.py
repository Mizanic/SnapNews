# type: ignore  # noqa: PGH003
import re

from newspaper import Article
from openai import OpenAI

OPENROUTER_API_KEY = "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"
MODEL_NAME = [
    "openai/gpt-5-nano",
    "openai/gpt-5-mini",
    "openai/gpt-4o",
    "openai/gpt-oss-20b:free",
    "openai/gpt-oss-120b",
    "moonshotai/kimi-k2:free",
    "qwen/qwen3-4b:free",
]
SELECTION = 2  # Starting from 1, selection of the model to use

# To run this code you need to install the following dependencies:
# pip install google-genai


def generate(article: str, headline: str) -> str:
    """
    This function generates a summary of the article using the OpenRouter API.
    """

    prompt = (
        """Summarize the following article, the summary should be:
        1. 99 words.
        2. Compelling and engaging for the reader.
        3. Reorgnised to address the headline of the article first, context second, and conclusion third.
        Don't provide any other text, only the summary.\n"""
        f"Article: {article}\n" + f"Headline: {headline}"
    )

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
    )

    completion = client.chat.completions.create(
        extra_headers={
            "HTTP-Referer": "https://mizanic.com",  # Optional. Site URL for rankings on openrouter.ai.
            "X-Title": "Mizanic",  # Optional. Site title for rankings on openrouter.ai.
        },
        model=MODEL_NAME[SELECTION - 1],
        messages=[{"role": "user", "content": prompt}],
    )

    return completion.choices[0].message.content


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
    summary = str(generate(article, headline))
    print("API: OpenRouter")
    print(f"Model: {MODEL_NAME[SELECTION - 1]}")
    print("=" * 100)
    print(summary)
