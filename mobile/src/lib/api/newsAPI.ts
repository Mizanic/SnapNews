import { NewsItem } from "@/lib/types/newsTypes";
import { API_ENDPOINT } from "globalConfig";

export interface NewsResponse {
    news: NewsItem[];
    page_key?: string;
}

export const fetchLatestNews = async (pageKey?: string): Promise<NewsResponse> => {
    let url = `${API_ENDPOINT}/feed/latest?country=IN&language=EN`;

    if (pageKey) {
        url += `&page_key=${pageKey}`;
    }

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }
    const data = await response.json();

    return {
        news: data?.body?.news || [],
        page_key: data?.body?.page_key,
    };
};

export const fetchHotNews = async (pageKey?: string): Promise<NewsResponse> => {
    let url = `${API_ENDPOINT}/feed/top?country=IN&language=EN`;

    if (pageKey) {
        url += `&page_key=${pageKey}`;
    }

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }

    const data = await response.json();

    return {
        news: data?.body?.news || [],
        page_key: data?.body?.page_key,
    };
};
