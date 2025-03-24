/**
 * This contains the type definition for a news item and a collection of news items.
 */

import { z } from "zod";

export const NewsItemSchema = z.object({
    imageUrl: z.string(),
    headline: z.string(),
    content: z.string(),
    newsUrl: z.string(),
    urlHash: z.string(),
    publishedOn: z.string(),
});

export const NewsCollectionSchema = z.object({
    items: z.array(NewsItemSchema),
});

export type NewsItem = z.infer<typeof NewsItemSchema>;
export type NewsCollection = z.infer<typeof NewsCollectionSchema>;
