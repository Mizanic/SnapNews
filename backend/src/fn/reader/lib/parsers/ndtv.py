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
from shared.news_model import NewsMediaModel, SourceNewsFeedModel, SourceNewsItemModel

from .utils import santise_content, time_to_iso

# ==================================================================================================


class NDTV:
    """
    This class is used to read RSS feeds from NDTV
    """

    def parse_feed(self, xml_root: Element, category: str, language: str, country: str) -> SourceNewsFeedModel:
        """
        Parses the XML root and returns a list of validated news items as dicts.
        """
        logger.info(f"Parsing feed for {category} in {language} for {country}")

        feed: list[SourceNewsItemModel] = []
        item_count = 0
        parsed_item_count = 0
        for item in xml_root.findall("./channel/item"):
            item_count += 1
            try:
                parsed_item = self.__parse_item(item, category, language, country)
                news_item = SourceNewsItemModel.model_validate(parsed_item)
                feed.append(news_item)
                parsed_item_count += 1
            except (AttributeError, ValidationError) as e:
                logger.debug(f"Error parsing feed for {category} in {language} for {country}: {e}", exc_info=e)
                logger.debug(f"Error Item: {item}")
                # In future, we can identify the exact error and put in a queue for scraping
                continue

        logger.info(f"Parsed {parsed_item_count} items out of {item_count} for {category} in {language} for {country}")

        return SourceNewsFeedModel(feed=feed)

    def __parse_item(self, item: Element, category: str, language: str, country: str) -> dict:
        """
        This function parses an a single XML item and returns a SourceNewsItemModel
        """
        image_url = None
        media_content = item.find("media:content", namespaces={"media": "http://search.yahoo.com/mrss/"})
        if media_content is not None:
            image_url = media_content.attrib["url"]
            logger.info(f"Found Image content: {image_url}")
        else:
            logger.info("No image content found")

        media = NewsMediaModel(image_url=image_url, video_url=None)

        # Clean the summary content to remove HTML tags
        raw_summary = item.findtext("description")
        clean_summary = santise_content(raw_summary) if raw_summary else None
        if clean_summary == "":
            clean_summary = None

        data = {
            "source_name": "NDTV",
            "source_id": "NDTV",
            "country": country,
            "language": language,
            "news_url": item.findtext("link"),
            "headline": item.findtext("title"),
            "published": time_to_iso(item.findtext("pubDate")),
            "summary": clean_summary,
            "categories": [category],
            "media": media,
        }
        logger.info(f"Data: {data}")

        return data
