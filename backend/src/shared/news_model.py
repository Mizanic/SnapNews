"""
# --*-- coding: utf-8 --*--
# THis module defines the datamodels for the news feed
"""

from typing import Optional

from pydantic import BaseModel


class NewsMediaModel(BaseModel):
    """
    This class defines the data model for the media object in the news feed
    """

    image_url: str
    video_url: Optional[str]


class NewsItemModel(BaseModel):
    """
    This class defines the data model for the news feed
    """

    # Computed metadata
    pk: str
    sk: str
    url_hash: str
    ttl: int

    # News content
    source: str
    news_url: str
    headline: str
    published: int
    summary: str
    # content: str #This will be added later. Not being used to save space in DynamoDB  # noqa: ERA001
    media: NewsMediaModel


class NewsFeedModel(BaseModel):
    """
    This class defines the data model for the news feed
    """

    feed: list[NewsItemModel]
