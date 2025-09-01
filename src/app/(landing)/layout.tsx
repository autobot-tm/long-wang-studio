import AppQueryProvider from '@/components/providers/query-client';

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AppQueryProvider>{children}</AppQueryProvider>;
}
