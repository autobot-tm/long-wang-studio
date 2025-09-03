import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BASE =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://long-wang-studio.vercel.app';

const normalize = (u?: string) => {
    if (!u) return '';
    try {
        const x = new URL(u);
        x.protocol = 'https:';
        return x.toString();
    } catch {
        return u;
    }
};

type PageProps = { searchParams?: { img?: string } };

export async function generateMetadata({
    searchParams,
}: PageProps): Promise<Metadata> {
    const raw = searchParams?.img ?? '';
    const img = normalize(raw);
    const pageUrl = `${BASE}/share?img=${encodeURIComponent(raw)}`;
    const title = 'Chia sẻ ảnh';
    const description = 'Ảnh được tạo từ hệ thống';

    return {
        title,
        description,
        metadataBase: new URL(BASE),
        openGraph: {
            title,
            description,
            url: pageUrl,
            type: 'article',
            images: img ? [{ url: img, width: 1200, height: 630 }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: img ? [img] : [],
        },
        alternates: { canonical: pageUrl },
    };
}

export default function Page({ searchParams }: PageProps) {
    const img = normalize(searchParams?.img ?? '');
    return img ? (
        <img
            src={img}
            alt='Shared'
            style={{ maxWidth: 800, width: '100%', borderRadius: 8 }}
        />
    ) : (
        <p>Không có ảnh để hiển thị.</p>
    );
}
