'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GuestOnlyRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') router.replace('/admin');
    }, [status, router]);

    if (status === 'loading') return null;
    if (status === 'authenticated') return null;
    return <>{children}</>;
}
