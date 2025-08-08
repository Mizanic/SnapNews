import { QueryClient } from "@tanstack/react-query";

export const sharedQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, 
        },
        mutations: {
            retry: 3, 
        },
    },
});
