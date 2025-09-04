// utils/share.ts — cập nhật ưu tiên mở app Facebook trên mobile + Web Share với FILE
import { toast } from 'sonner';

const BASE =
    typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_BASE_URL
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || '';

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

async function fileFromImageUrl(
    url: string,
    fileName?: string
): Promise<File | undefined> {
    try {
        const res = await fetch(url, { mode: 'cors', cache: 'no-store' });
        if (!res.ok) return;
        const blob = await res.blob();
        const name =
            fileName || url.split('/').pop() || `image-${Date.now()}.jpg`;
        return new File([blob], name, { type: blob.type || 'image/jpeg' });
    } catch {
        return;
    }
}

type ShareOpts = {
    file?: File;
    imageUrl?: string;
    hashtags?: string[];
    preferApp?: boolean;
};

export async function shareToFacebook({
    file,
    imageUrl,
    hashtags,
    preferApp = true,
}: ShareOpts) {
    const permalink = imageUrl
        ? buildPermalink(toHttps(imageUrl), hashtags)
        : BASE;
    const sharer = buildSharer(permalink, hashtags);

    // MOBILE + FILE → share sheet (Facebook/Save Image)
    const canFileShare =
        // @ts-ignore
        isMobile() && file && navigator?.canShare?.({ files: [file] });
    if (canFileShare) {
        try {
            /* @ts-ignore */ await navigator.share({ files: [file] });
        } finally {
            copyHashtags(hashtags);
        } // chạy sau để không mất user gesture
        return true;
    }

    // ANDROID → mở app qua intent
    if (isAndroid() && isChrome() && preferApp) {
        const intent = `intent://facewebmodal/f?href=${encodeURIComponent(
            sharer
        )}#Intent;scheme=fb;package=com.facebook.katana;S.browser_fallback_url=${encodeURIComponent(
            sharer
        )};end`;
        window.location.href = intent;
        return true;
    }

    // iOS & các trường hợp khác → mở sharer (universal link)
    const w = 720,
        h = 640;
    isMobile()
        ? (window.location.href = sharer)
        : window.open(
              sharer,
              'fbshare',
              `noopener,noreferrer,width=${w},height=${h},left=${
                  (window.outerWidth - w) / 2
              },top=${(window.outerHeight - h) / 2}`
          );

    copyHashtags(hashtags);
    return true;
}
