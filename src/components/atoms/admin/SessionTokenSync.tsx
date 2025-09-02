'use client';
import { tokenStore } from '@/libs/token-store';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function SessionTokenSync() {
    const { data } = useSession();
    useEffect(() => {
        tokenStore.set((data as any)?.accessToken ?? null);
    }, [data]);
    return null;
}
