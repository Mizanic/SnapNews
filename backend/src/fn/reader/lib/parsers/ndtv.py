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


class NDTV:
    """
    This class is used to read RSS feeds from NDTV
    """

    def parse_feed(self, xml_root: Element, category: str, language: str, country: str) -> list[SourceNewsModel]:
        """
        This function parses the XML root and returns a JSON object
        """
        logger.info(f"Parsing feed for {category} in {language} for {country}")
        feed: list[SourceNewsModel] = []
        for item in xml_root.findall("./channel/item"):

            try:
                ## Find the media content
                media_content = item.find("media:content", namespaces={"media": "http://search.yahoo.com/mrss/"})
                if media_content is not None:
                    logger.info(f"Media content: {media_content.attrib['url']}")
                    media = NewsMediaModel(image_url=media_content.attrib["url"])
                else:
                    media = NewsMediaModel()

                # content_text = item.findtext(
                #     "content:encoded", namespaces={"content": "http://purl.org/rss/1.0/modules/content/"}
                # )
                # data.content = santise_content(content_text) if content_text is not None else None

                data = SourceNewsModel(
                    source_name="NDTV",
                    source_id="NDTV",
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
