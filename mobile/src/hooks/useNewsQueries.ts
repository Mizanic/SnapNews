import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchHotNews, fetchLatestNews, NewsResponse } from "@/lib/api/newsAPI";

export const useLatestNews = () => {
    return useInfiniteQuery<NewsResponse>({
        queryKey: ["latestNews"],
        queryFn: ({ pageParam }) => fetchLatestNews(pageParam as string | undefined),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.page_key,
    });
};

export const useHotNews = () => {
    return useInfiniteQuery<NewsResponse>({
        queryKey: ["hotNews"],
        queryFn: ({ pageParam }) => fetchHotNews(pageParam as string | undefined),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.page_key,
    });
};
