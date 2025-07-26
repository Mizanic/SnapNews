"""
# --*-- coding: utf-8 --*--
This Module is used to scrape the content from TOI
"""

# ==================================================================================================
# Python imports
from newspaper import Article

# ==================================================================================================
# Module imports
from shared.content import santise_content

# ==================================================================================================


class TOI:
    """
    This class is used to scrape the content from TOI
    """

    def get_article(self, url: str) -> str:
        article = Article(url)
        article.download()
        article.parse()

        return santise_content(article.text)
