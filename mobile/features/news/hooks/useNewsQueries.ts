import { useQuery } from "@tanstack/react-query";
import { fetchLatestNews, fetchTopNews } from "@/features/news/api/newsAPI";

export const useLatestNews = () => {
    return useQuery({
        queryKey: ["latestNews"],
        queryFn: fetchLatestNews,
    });
};

export const useTopNews = () => {
    return useQuery({
        queryKey: ["topNews"],
        queryFn: fetchTopNews,
    });
};
