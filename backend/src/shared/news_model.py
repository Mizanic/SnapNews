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
    item_hash: str
    ttl: int

    # News content
    source_name: str
    source_id: str
    category: str
    country: str
    language: str
    news_url: str
    headline: str
    published: int
    summary: str

    # content: str #This will be added later. Not being used to save space in DynamoDB
    media: NewsMediaModel


class NewsFeedModel(BaseModel):
    """
    This class defines the data model for the news feed
    """

    feed: list[NewsItemModel]
