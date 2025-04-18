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


class NDTV:
    """
    This class is used to read RSS feeds from NDTV
    """

    def parse_feed(self, xml_root: Element) -> list:
        """
        This function parses the XML root and returns a JSON object
        """
        feed = []
        for item in xml_root.findall("./channel/item"):
            data = {}
            try:
                data["source"] = "NDTV"
                data["news_url"] = item.findtext("link")
                data["headline"] = item.findtext("title")
                data["published"] = time_to_unix(item.findtext("pubDate"))
                data["summary"] = item.findtext("description")
                # content_text = item.findtext(
                #     "content:encoded", namespaces={"content": "http://purl.org/rss/1.0/modules/content/"}
                # )
                # data["content"] = santise_content(content_text) if content_text is not None else None

                media_content = item.find("media:content", namespaces={"media": "http://search.yahoo.com/mrss/"})
                if media_content is not None:
                    data["media"] = {
                        "image_url": media_content.attrib["url"],
                        "video_url": None,
                    }
                else:
                    data["media"] = {
                        "image_url": None,
                        "video_url": None,
                    }
            except AttributeError:
                # In future, we can identify the exact error and put in a queue for scraping
                continue
            feed.append(data)
        return feed
