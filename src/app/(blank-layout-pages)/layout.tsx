import AppQueryProvider from '@/components/providers/query-client';
import AppSessionProvider from '@/components/providers/session';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppSessionProvider>
            <AppQueryProvider>{children}</AppQueryProvider>
        </AppSessionProvider>
    );
};

export default Layout;
