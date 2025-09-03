import { toast } from 'sonner';

const BASE =
    typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_BASE_URL
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || '';

async function copyHashtags(tags?: string[]) {
    const line = normalizeTags(tags)
        .map(t => `#${t}`)
        .join(' ');
    if (!line) return;
    try {
        await navigator.clipboard.writeText(line);
        toast.success('Đã copy hashtag. Hãy dán vào caption.');
    } catch {}
}

const isAndroid = () => /Android/i.test(navigator.userAgent);
const isIOS = () =>
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (/Macintosh/i.test(navigator.userAgent) &&
        (navigator as any).maxTouchPoints > 2);
const isChrome = () =>
    /Chrome\/\d+/i.test(navigator.userAgent) &&
    !/Edge|OPR/i.test(navigator.userAgent);
const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const toHttps = (u: string) => {
    try {
        const x = new URL(u);
        x.protocol = 'https:';
        return x.toString();
    } catch {
        return u;
    }
};
const normalizeTags = (tags?: string[]) =>
    (tags ?? [])
        .map(t => t.replace(/^#/, '').replace(/\s+/g, ''))
        .filter(Boolean);

const buildPermalink = (imageUrl: string, tags?: string[]) => {
    const normTags = normalizeTags(tags);
    const q = new URLSearchParams({ img: imageUrl });
    if (normTags.length) q.set('tags', normTags.join(','));
    return `${BASE}/share?${q.toString()}`;
};

const buildSharer = (permalink: string, tags?: string[]) => {
    const normTags = normalizeTags(tags);
    const primary = normTags[0] ? `#${normTags[0]}` : '';
    let url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        permalink
    )}`;
    if (primary) url += `&hashtag=${encodeURIComponent(primary)}`;
    return url;
};

function openWithFallback(appUrl: string, webUrl: string, delay = 1000) {
    const t = setTimeout(() => (window.location.href = webUrl), delay);
    if (isIOS()) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appUrl;
        document.body.appendChild(iframe);
        setTimeout(() => {
            document.body.removeChild(iframe);
            clearTimeout(t);
        }, delay - 50);
    } else {
        window.location.href = appUrl;
    }
}

export async function shareToFacebook(opts: {
    imageUrl: string;
    hashtags?: string[];
}) {
    if (!opts.imageUrl) throw new Error('imageUrl is required');

    copyHashtags(opts.hashtags);
    const permalink = buildPermalink(toHttps(opts.imageUrl), opts.hashtags);
    const sharer = buildSharer(permalink, opts.hashtags);

    if ('share' in navigator && isMobile()) {
        try {
            // Chỉ URL, text để trống → tránh lệ thuộc UI share; hashtag đã nằm trong OG
            await (navigator as any).share({
                url: permalink,
                title: 'Chia sẻ ảnh',
            });
            return true;
        } catch {}
    }

    if (isAndroid() && isChrome()) {
        const intent = `intent://facewebmodal/f?href=${encodeURIComponent(
            sharer
        )}#Intent;scheme=fb;package=com.facebook.katana;S.browser_fallback_url=${encodeURIComponent(
            sharer
        )};end`;
        window.location.href = intent;
        return true;
    }

    if (isMobile()) {
        const appUrl = `fb://facewebmodal/f?href=${encodeURIComponent(sharer)}`;
        openWithFallback(appUrl, sharer, 1100);
        return true;
    }

    const w = 720,
        h = 640;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    window.open(
        sharer,
        'fbshare',
        `noopener,noreferrer,width=${w},height=${h},left=${left},top=${top}`
    );
    return true;
}
