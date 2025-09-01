'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function AppQueryProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: 1,
                        staleTime: 60_000,
                    },
                },
            })
    );
    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
}
