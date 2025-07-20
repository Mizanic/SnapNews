"""
# --*-- coding: utf-8 --*--
This Module is used to scrape the content from NDTV
"""

# ==================================================================================================
# Python imports
from newspaper import Article

# ==================================================================================================
# Module imports

# ==================================================================================================


class NDTV:
    """
    This class is used to scrape the content from NDTV
    """

    def get_article(self, url: str) -> str:
        article = Article(url)
        article.download()
        article.parse()

        return article.text
