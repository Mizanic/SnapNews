import { NewsItem } from "../types";

export interface NewsResponse {
    news: NewsItem[];
    page_key?: string;
}

export const fetchLatestNews = async (pageKey?: string): Promise<NewsResponse> => {
    let url = "https://5695pjsso7.execute-api.us-east-1.amazonaws.com/v1/feed/latest?country=IN&language=EN";

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

export const fetchTopNews = async (pageKey?: string): Promise<NewsResponse> => {
    let url = "https://5695pjsso7.execute-api.us-east-1.amazonaws.com/v1/feed/top?country=IN&language=EN";

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
