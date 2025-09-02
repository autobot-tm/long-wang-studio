'use client';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SessionTokenSync } from '../atoms/admin/SessionTokenSync';
export default function AppSessionProvider({
    children,
    session,
}: {
    children: ReactNode;
    session: any;
}) {
    return (
        <SessionProvider
            session={session}
            refetchOnWindowFocus={false}
            refetchInterval={0}
        >
            <SessionTokenSync />
            {children}
        </SessionProvider>
    );
}
