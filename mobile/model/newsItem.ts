export interface NewsItem {
    pk: string;
    sk: string;
    item_hash: string;
    ttl: string;
    source_name: string;
    source_id: string;
    category: string;
    country: string;
    language: string;
    news_url: string;
    headline: string;
    published: string;
    summary: string;
    media: {
        image_url: string;
        video_url: string | null;
    };
    tags: string[];
}
