import AuthGuard from '@/components/templates/AuthGuard';
import { SessionProvider } from 'next-auth/react';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <AuthGuard>{children}</AuthGuard>
        </SessionProvider>
    );
};

export default Layout;
