import { NewsItem } from "@/lib/types/newsTypes";

export interface BookmarkState {
    [key: string]: NewsItem;
}
