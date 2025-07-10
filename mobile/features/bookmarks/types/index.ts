import { NewsItem } from "@/features/news/types";

export interface BookmarkState {
    [key: string]: NewsItem;
}
