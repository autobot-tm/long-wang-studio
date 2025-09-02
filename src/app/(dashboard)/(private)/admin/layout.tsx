import AppQueryProvider from '@/components/providers/query-client';
import AppSessionProvider from '@/components/providers/session';
import AuthGuard from '@/hocs/AuthGuard';
import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);

    return (
        <AppSessionProvider session={session}>
            <AppQueryProvider>
                <AuthGuard>{children}</AuthGuard>
            </AppQueryProvider>
        </AppSessionProvider>
    );
};

export default Layout;
