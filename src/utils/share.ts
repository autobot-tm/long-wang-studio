let _opening = false;

function openSharerWeb(url: string) {
    window.open(url, 'fbshare', 'noopener,noreferrer,width=720,height=640');
}

const isIOS = () =>
    /iPhone|iPod|iPad/i.test(navigator.userAgent) ||
    (/Macintosh/i.test(navigator.userAgent) &&
        (navigator as any).maxTouchPoints > 1);

const isAndroid = () => /Android/i.test(navigator.userAgent);

export async function shareImageOrDeepLink(opts: {
    imageUrl: string;
    text?: string;
    hashtags?: string[];
    permalink?: string;
}) {
    if (_opening) return;
    _opening = true;
    try {
        // 1) Native Share trước (nếu hỗ trợ)
        try {
            const res = await fetch(opts.imageUrl, { mode: 'cors' });
            const blob = await res.blob();
            const file = new File([blob], 'share.jpg', {
                type: blob.type || 'image/jpeg',
            });
            if (navigator.canShare?.({ files: [file] })) {
                const tags = (opts.hashtags ?? []).map(
                    t => '#' + t.replace(/^#/, '').replace(/\s+/g, '')
                );
                const text = [opts.text, ...tags]
                    .filter(Boolean)
                    .join(' ')
                    .trim();
                await (navigator as any).share({ files: [file], text });
                return true;
            }
        } catch {
            /* ignore */
        }

        // 2) Fallback web (chỉ 1 tab)
        const link = opts.permalink ?? opts.imageUrl;
        const primary = (opts.hashtags?.[0] ?? '')
            .replace(/^#/, '')
            .replace(/\s+/g, '');
        const sharer = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            link
        )}${primary ? `&hashtag=${encodeURIComponent('#' + primary)}` : ''}`;

        if (isAndroid()) {
            // mở app FB nếu có, KHÔNG mở tab phụ
            const intent =
                `intent://facewebmodal/f?href=${encodeURIComponent(
                    sharer
                )}#Intent;scheme=fb;package=com.facebook.katana;` +
                `S.browser_fallback_url=${encodeURIComponent(sharer)};end`;
            window.location.href = intent;
            return true;
        }

        if (isIOS()) {
            // iOS: deep-link -> fallback cùng tab
            const deep = `fb://facewebmodal/f?href=${encodeURIComponent(
                sharer
            )}`;
            const t = Date.now();
            window.location.href = deep;
            setTimeout(() => {
                if (Date.now() - t < 1600) window.location.assign(sharer);
            }, 1200);
            return true;
        }

        // Desktop/khác: MỞ DUY NHẤT 1 CỬA SỔ
        openSharerWeb(sharer);
        return true;
    } finally {
        _opening = false;
    }
}
