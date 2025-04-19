"""
# --*-- coding: utf-8 --*--
This Module is used to read RSS feeds from Times of India
"""

# ==================================================================================================
# Python imports
from xml.etree.ElementTree import Element

# ==================================================================================================
# Module imports
from .utils import time_to_unix

# ==================================================================================================


class TOI:
    """
    This class is used to read RSS feeds from Times of India
    """

    def parse_feed(self, xml_root: Element, category: str, language: str, country: str) -> list:
        """
        This method is used to read RSS feeds from Times of India
        """
        feed = []
        for item in xml_root.findall("./channel/item"):
            data = {}
            try:
                data["source_name"] = "Times Of India"
                data["source_id"] = "TOI"
                data["category"] = category
                data["language"] = language
                data["country"] = country
                data["news_url"] = item.findtext("link")
                data["headline"] = item.findtext("title")
                data["published"] = time_to_unix(item.findtext("pubDate"))
                data["summary"] = item.findtext("description")
                # data["content"] = item.findtext("description")
                media_content = item.find("enclosure")
                if media_content is not None:
                    data["media"] = {
                        "image_url": media_content.attrib.get("url", None),
                        "video_url": None,
                    }
            except AttributeError:
                # In future, we can identify the exact error and put in a queue for scraping
                continue

            feed.append(data)

        return feed
