// HOC Imports
import GuestOnlyRoute from '@/hocs/GuestOnlyRoute';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <GuestOnlyRoute>{children}</GuestOnlyRoute>;
};

export default Layout;
