export type SharePlatform = 'facebook' | 'instagram' | 'tiktok';

export const buildShareUrl = (
    platform: SharePlatform,
    url: string,
    text?: string
) => {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(text ?? '');
    switch (platform) {
        case 'facebook':
            return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
        case 'instagram':
        case 'tiktok':
        default:
            return null;
    }
};

export const tryNativeShare = async (url: string, text?: string) => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
        try {
            await (navigator as any).share({ url, text });
            return true;
        } catch {
            /* ignore */
        }
    }
    return false;
};
