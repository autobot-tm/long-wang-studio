import Provider from '@/components/providers';
import AuthGuard from '@/hocs/AuthGuard';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider>
            <AuthGuard>{children}</AuthGuard>
        </Provider>
    );
};

export default Layout;
