'use client';

const envBase = process.env.NEXT_PUBLIC_BASE_URL;
const BASE =
    typeof window !== 'undefined' && !envBase
        ? window.location.origin
        : envBase || 'https://your-domain.com';

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isAndroid = () => /Android/i.test(navigator.userAgent);

const normalizeHttps = (u: string) => {
    try {
        const x = new URL(u);
        x.protocol = 'https:';
        return x.toString();
    } catch {
        return u;
    }
};

const buildPermalink = (imageUrl: string) =>
    `${BASE}/share?img=${encodeURIComponent(imageUrl)}`;

const buildSharer = (permalink: string, text?: string, hashtags?: string[]) => {
    const tags = (hashtags ?? []).map(
        t => '#' + t.replace(/^#/, '').replace(/\s+/g, '')
    );
    const primary = tags[0] ?? '';
    const quote = [text, ...tags.slice(1)].filter(Boolean).join(' ').trim();
    let u = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        permalink
    )}`;
    if (primary) u += `&hashtag=${encodeURIComponent(primary)}`;
    if (quote) u += `&quote=${encodeURIComponent(quote)}`;
    return u;
};

export async function shareToFacebook(opts: {
    imageUrl: string;
    text?: string;
    hashtags?: string[];
}) {
    if (!opts.imageUrl) throw new Error('imageUrl is required');
    const img = normalizeHttps(opts.imageUrl);
    const permalink = buildPermalink(img);
    const sharer = buildSharer(permalink, opts.text, opts.hashtags);

    if (isMobile() && 'share' in navigator) {
        try {
            await (navigator as any).share({ url: permalink, text: opts.text });
            return true;
        } catch {}
    }
    if (isMobile() && isAndroid()) {
        const deep = `fb://facewebmodal/f?href=${encodeURIComponent(
            permalink
        )}`;
        window.location.href = deep;
        setTimeout(() => {
            window.location.href = sharer;
        }, 800);
        return true;
    }
    if (isMobile()) {
        window.location.href = sharer;
    } else {
        window.open(
            sharer,
            'fbshare',
            'noopener,noreferrer,width=720,height=640'
        );
    }
    return true;
}
