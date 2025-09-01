import AppQueryProvider from '@/components/providers/query-client';
import AppSessionProvider from '@/components/providers/session';
import AuthGuard from '@/hocs/AuthGuard';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <AppSessionProvider>
            <AppQueryProvider>
                <AuthGuard>{children}</AuthGuard>
            </AppQueryProvider>
        </AppSessionProvider>
    );
};

export default Layout;
