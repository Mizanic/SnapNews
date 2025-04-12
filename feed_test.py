
from backend.src.fn.reader.lib.feed_handler import get_feed_from_rss

news_source = "TimesOfIndia"
news_url = "https://timesofindia.indiatimes.com/rssfeedstopstories.cms"

news_source = "NDTV"
news_url = "https://feeds.feedburner.com/ndtvnews-top-stories"


feed = get_feed_from_rss(news_source, news_url)
print(feed) # noqa: T201
