import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BASE = process.env.NEXT_PUBLIC_BASE_URL!;

const norm = (u?: string) => {
    if (!u) return '';
    try {
        const x = new URL(u);
        x.protocol = 'https:';
        return x.toString();
    } catch {
        return u;
    }
};
const parseTags = (raw?: string) =>
    (raw ?? '')
        .split(',')
        .map(s => s.trim().replace(/^#/, '').replace(/\s+/g, ''))
        .filter(Boolean);

type PageProps = { searchParams?: { img?: string; tags?: string } };

export async function generateMetadata({
    searchParams,
}: PageProps): Promise<Metadata> {
    const raw = searchParams?.img ?? '';
    const img = norm(raw);
    const tags = parseTags(searchParams?.tags);
    const hashLine = tags
        .map(t => `#${t}`)
        .join(' ')
        .trim();
    const pageUrl = `${BASE}/share?img=${encodeURIComponent(raw)}${
        tags.length ? `&tags=${encodeURIComponent(tags.join(','))}` : ''
    }`;

    const title = `Chia sẻ khoảnh khắc Miền Ký Ức`;
    const descBase = 'Long Wang Studio';
    const ogDesc = (descBase + (hashLine ? ` · ${hashLine}` : '')).slice(
        0,
        280
    );

    return {
        title,
        description: ogDesc,
        metadataBase: new URL(BASE),
        openGraph: {
            title: (title + (tags[0] ? ` · #${tags[0]}` : '')).slice(0, 95),
            description: ogDesc,
            url: pageUrl,
            type: 'article',
            images: img
                ? [{ url: img, width: 1200, height: 1200, alt: 'Shared Image' }]
                : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: ogDesc,
            images: img ? [img] : [],
        },
        alternates: { canonical: pageUrl },
    };
}

export default function Page({ searchParams }: PageProps) {
    const img = norm(searchParams?.img ?? '');
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
