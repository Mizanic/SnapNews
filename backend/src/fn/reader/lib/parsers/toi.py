"""
# --*-- coding: utf-8 --*--
This Module is used to read RSS feeds from Times of India
"""

# ==================================================================================================
# Python imports
from xml.etree.ElementTree import Element

from pydantic import ValidationError

# ==================================================================================================
# Module imports
from shared.logger import logger
from shared.news_model import NewsMediaModel, SourceNewsModel

from .utils import time_to_iso

# ==================================================================================================


class TOI:
    """
    This class is used to read RSS feeds from Times of India
    """

    def parse_feed(self, xml_root: Element, category: str, language: str, country: str) -> list[SourceNewsModel]:
        """
        This method is used to read RSS feeds from Times of India
        """
        feed: list[SourceNewsModel] = []
        for item in xml_root.findall("./channel/item"):

            try:

                ## Find the media content
                media_content = item.find("enclosure")
                if media_content is not None:
                    media = NewsMediaModel(image_url=media_content.attrib.get("url", None), video_url=None)
                else:
                    media = NewsMediaModel(image_url=None, video_url=None)

                data = SourceNewsModel(
                    source_name="Times Of India",
                    source_id="TOI",
                    country=country,
                    language=language,
                    news_url=item.findtext("link"),
                    headline=item.findtext("title"),
                    published=time_to_iso(item.findtext("pubDate")),
                    summary=item.findtext("description"),
                    categories=[category],
                    media=media,
                )

                ## Validate the data
                SourceNewsModel.model_validate(data)

                feed.append(data.model_dump())
            except (AttributeError, ValidationError) as e:
                logger.error(f"Error parsing feed for {category} in {language} for {country}: {e}", exc_info=e)
                logger.error(f"Error Item: {item}")
                # In future, we can identify the exact error and put in a queue for scraping
                continue

        return feed
