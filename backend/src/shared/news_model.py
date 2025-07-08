"""
# --*-- coding: utf-8 --*--
# THis module defines the datamodels for the news feed
"""

# ==================================================================================================
# Python imports
from typing import Optional

from pydantic import BaseModel, Field

# ==================================================================================================
# Data models


class NewsMediaModel(BaseModel):
    """
    This class defines the data model for the media object in the news feed
    """

    image_url: str
    video_url: Optional[str] = Field(default=None)


class MetricsModel(BaseModel):
    """
    This class defines the data model for the metrics object in the news feed
    """

    views: int
    likes: int
    bookmarks: int
    shares: int


class SourceNewsItemModel(BaseModel):
    """
    This class defines the data model for the default object in the news feed
    """

    source_name: str
    source_id: str
    country: str
    language: str
    news_url: str
    headline: str
    published: str
    summary: str
    # content: str # This will be added later. Not being used to save space in DynamoDB
    categories: list[str]
    media: NewsMediaModel


class SourceNewsFeedModel(BaseModel):
    """
    This class defines the data model for the news feed
    """

    feed: list[SourceNewsItemModel]


class ProcessedNewsItemModel(SourceNewsItemModel):
    """
    This class defines the data model for the news feed
    """

    # Computed metadata
    pk: str
    sk: str
    ttl: int
    item_hash: str

    # News metrics
    metrics: MetricsModel

    # Computed keys
    sk_top: str


class ProcessedNewsFeedModel(BaseModel):
    """
    This class defines the data model for the news feed
    """

    feed: list[ProcessedNewsItemModel]
