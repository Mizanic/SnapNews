export interface NewsItem {
    summary: string;
    published: string;
    url_hash: string;
    media: {
      image_url: string;
      video_url: string | null;
    };
    headline: string;
    news_url: string;
    ttl: string;
    sk: string;
    source: string;
    pk: string;
  }
  