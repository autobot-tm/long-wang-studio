'use client';
import { useSession } from 'next-auth/react';
export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { status } = useSession();

    if (status === 'loading') return null;
    if (status === 'unauthenticated') {
        if (typeof window !== 'undefined') window.location.href = '/login';
        return null;
    }
    return <>{children}</>;
}
