'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // ❌ chặn fetch khi focus lại window
            retry: 1, // có thể config thêm
            staleTime: 1000 * 60, // dữ liệu coi như fresh trong 1 phút
        },
    },
});

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
}
