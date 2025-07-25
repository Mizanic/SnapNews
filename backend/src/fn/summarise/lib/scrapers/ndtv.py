"""
# --*-- coding: utf-8 --*--
This Module is used to scrape the content from NDTV
"""

# ==================================================================================================
# Python imports
from newspaper import Article

# ==================================================================================================
# Module imports
from shared.content import santise_content

# ==================================================================================================


class NDTV:
    """
    This class is used to scrape the content from NDTV
    """

    def get_article(self, url: str) -> str:
        article = Article(url)
        article.download()
        article.parse()

        return santise_content(article.text)
