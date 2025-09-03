'use client';

const envBase = process.env.NEXT_PUBLIC_BASE_URL;
const BASE =
    typeof window !== 'undefined' && !envBase
        ? window.location.origin
        : envBase || '';

const isAndroid = () => /Android/i.test(navigator.userAgent);
const isChrome = () =>
    /Chrome\/\d+/i.test(navigator.userAgent) &&
    !/Edge|OPR/i.test(navigator.userAgent);

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

    // 1) Native share sheet (nếu có)
    if ('share' in navigator) {
        try {
            await (navigator as any).share({ url: permalink, text: opts.text });
            return true;
        } catch {}
    }

    // 2) Android Chrome: dùng INTENT URL (không spam lỗi fb://)
    if (isAndroid() && isChrome()) {
        const intent = `intent://facewebmodal/f?href=${encodeURIComponent(
            permalink
        )}#Intent;scheme=fb;package=com.facebook.katana;S.browser_fallback_url=${encodeURIComponent(
            sharer
        )};end`;
        window.location.href = intent;
        return true;
    }

    // 3) Fallback: web sharer
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) window.location.href = sharer;
    else
        window.open(
            sharer,
            'fbshare',
            'noopener,noreferrer,width=720,height=640'
        );
    return true;
}
