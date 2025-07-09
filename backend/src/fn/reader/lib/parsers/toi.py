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


class TOI:
    """
    This class is used to read RSS feeds from Times of India
    """

    def parse_feed(self, xml_root: Element, category: str, language: str, country: str) -> SourceNewsFeedModel:
        """
        This method is used to read RSS feeds from Times of India
        """
        feed: list[SourceNewsItemModel] = []
        for item in xml_root.findall("./channel/item"):

            try:
                news_item = self.__parse_item(item, category, language, country)
                feed.append(news_item)

            except (AttributeError, ValidationError) as e:
                logger.error(f"Error parsing feed for {category} in {language} for {country}: {e}", exc_info=e)
                logger.error(f"Error Item: {item}")
                continue

        logger.info(f"Parsed {len(feed)} items for {category} in {language} for {country}")

        return SourceNewsFeedModel(feed=feed)

    def __parse_item(self, item: Element, category: str, language: str, country: str) -> SourceNewsItemModel:
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

        params = {
            "source_name": "Times Of India",
            "source_id": "TOI",
            "country": country,
            "language": language,
            "news_url": item.findtext("link"),
            "headline": item.findtext("title"),
            "published": time_to_iso(item.findtext("pubDate")),
            "summary": clean_summary,
            "categories": [category],
            "media": media,
        }

        logger.info(f"Params: {params}")

        data = SourceNewsItemModel(
            source_name="Times Of India",
            source_id="TOI",
            country=country,
            language=language,
            news_url=item.findtext("link"),
            headline=item.findtext("title"),
            published=time_to_iso(item.findtext("pubDate")),
            summary=clean_summary,
            categories=[category],
            media=media,
        )

        return data
