"""
# --*-- coding: utf-8 --*--
This Module is used to read RSS feeds from Times of India
"""

# ==================================================================================================
# Python imports
from urllib.parse import urlsplit, urlunsplit
from xml.etree.ElementTree import Element

from pydantic import ValidationError

# ==================================================================================================
# Module imports
from shared.content import santise_content
from shared.logger import logger
from shared.news_model import NewsMediaModel, SourceNewsFeedModel, SourceNewsItemModel
from shared.time import time_to_iso

# ==================================================================================================


class TOI:
    """
    This class is used to read RSS feeds from Times of India
    """

    def parse_feed(self, xml_root: Element, category: str, language: str, country: str) -> SourceNewsFeedModel:
        """
        This method is used to read RSS feeds from Times of India
        """
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
                continue

        logger.info(f"Parsed {parsed_item_count} items out of {item_count} for {category} in {language} for {country}")

        return SourceNewsFeedModel(feed=feed)

    def __parse_item(self, item: Element, category: str, language: str, country: str) -> dict:
        """
        This function parses an a single XML item and returns a SourceNewsItemModel
        """
        image_url = None
        media_content = item.find("enclosure")
        if media_content is not None:
            image_url = media_content.attrib.get("url", None)
            logger.info(f"Found Image content: {image_url}")
        else:
            logger.info("No image content found")

        media = NewsMediaModel(image_url=image_url, video_url=None)

        # Clean the summary content to remove HTML tags
        raw_summary = item.findtext("description")
        logger.info(f"Raw summary: {raw_summary}")
        clean_summary = santise_content(raw_summary) if raw_summary else None
        if clean_summary == "":
            clean_summary = None

        logger.info(f"Clean summary: {clean_summary}")

        # Sanitise the url to remove fragments
        url = item.findtext("link")
        url_parts = urlsplit(url)
        sanitised_url = urlunsplit(url_parts._replace(fragment=""))

        data = {
            "source_name": "Times Of India",
            "source_id": "TOI",
            "country": country,
            "language": language,
            "news_url": sanitised_url,
            "headline": item.findtext("title"),
            "published": time_to_iso(item.findtext("pubDate")),
            "summary": clean_summary,
            "categories": [category],
            "media": media,
        }

        return data


class TimesOfIndia(TOI):
    """
    This class is used to read RSS feeds from Times of India.
    This is a wrapper around the TOI class.
    This is to have a consistent naming convention.
    """

    pass
