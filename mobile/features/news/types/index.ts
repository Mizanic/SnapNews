import { z } from "zod";

export const MetricsSchema = z.object({
    views: z.number(),
    likes: z.number(),
    shares: z.number(),
    bookmarks: z.number(),
});

export const NewsItemSchema = z.object({
    pk: z.string(),
    sk: z.string(),
    item_hash: z.string(),
    ttl: z.string(),
    source_name: z.string(),
    source_id: z.string(),
    country: z.string(),
    language: z.string(),
    news_url: z.string(),
    headline: z.string(),
    published: z.string(),
    summary: z.string(),
    media: z.object({
        image_url: z.string(),
        video_url: z.string().optional(),
    }),
    categories: z.array(z.string()),
    metrics: MetricsSchema,
});

export type NewsItem = z.infer<typeof NewsItemSchema>;
