import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchLatestNews, fetchTopNews, NewsResponse } from "@/features/news/api/newsAPI";

export const useLatestNews = () => {
    return useInfiniteQuery<NewsResponse>({
        queryKey: ["latestNews"],
        queryFn: ({ pageParam }) => fetchLatestNews(pageParam as string | undefined),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.page_key,
    });
};

export const useTopNews = () => {
    return useInfiniteQuery<NewsResponse>({
        queryKey: ["topNews"],
        queryFn: ({ pageParam }) => fetchTopNews(pageParam as string | undefined),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.page_key,
    });
};
