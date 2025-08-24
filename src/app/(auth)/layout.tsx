import Provider from '@/components/providers';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <Provider>{children}</Provider>;
};

export default Layout;
