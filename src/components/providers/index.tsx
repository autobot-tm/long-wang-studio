'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

export default function Provider({ children }: { children: React.ReactNode }) {
    const [client] = useState(() => new QueryClient());
    return (
        <SessionProvider>
            <QueryClientProvider client={client}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
}
