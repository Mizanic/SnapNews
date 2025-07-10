import { NewsItem } from "../types";

export const fetchLatestNews = async (): Promise<NewsItem[]> => {
    const response = await fetch("https://5695pjsso7.execute-api.us-east-1.amazonaws.com/v1/feed/latest?country=IND&language=ENG", {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }
    const data = await response.json();
    return data?.body?.news || [];
};

export const fetchTopNews = async (): Promise<NewsItem[]> => {
    const response = await fetch("https://5695pjsso7.execute-api.us-east-1.amazonaws.com/v1/feed/top?country=IND&language=ENG", {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }
    const data = await response.json();
    return data?.body?.news || [];
};
