from shared.url_hasher import hasher

news_source = "TimesOfIndia"
news_url = "https://timesofindia.indiatimes.com/rssfeedstopstories.cms"

news_source = "NDTV"
news_url = "https://feeds.feedburner.com/ndtvnews-top-stories"


hashed_url = hasher(news_url)
print(hashed_url)
