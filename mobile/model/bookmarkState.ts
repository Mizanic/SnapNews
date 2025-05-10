import { NewsItem } from "./newsItem";

export interface BookmarkState {
  [key: string]: NewsItem;
}