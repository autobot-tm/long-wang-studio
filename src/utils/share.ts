let _opening = false;

function openSharerWeb(url: string) {
    const w = window.open(
        url,
        'fbshare',
        'noopener,noreferrer,width=720,height=640'
    );
}

function buildFbSharerFromImage(
    imageUrl: string,
    text?: string,
    hashtags?: string[]
) {
    const tags = (hashtags ?? []).map(
        t => '#' + t.replace(/^#/, '').replace(/\s+/g, '')
    );
    const primary = tags[0] ?? '';
    const quote = [text, ...tags.slice(1)].filter(Boolean).join(' ').trim();

    let url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        imageUrl
    )}`;
    if (primary) url += `&hashtag=${encodeURIComponent(primary)}`;
    if (quote) url += `&quote=${encodeURIComponent(quote)}`;
    return url;
}

export async function shareToFacebook(opts: {
    imageUrl: string;
    text?: string;
    hashtags?: string[];
}) {
    if (_opening) return;
    _opening = true;
    try {
        if (!opts.imageUrl) throw new Error('imageUrl is required');
        const sharer = buildFbSharerFromImage(
            opts.imageUrl,
            opts.text,
            opts.hashtags
        );
        openSharerWeb(sharer);
        return true;
    } finally {
        _opening = false;
    }
}
