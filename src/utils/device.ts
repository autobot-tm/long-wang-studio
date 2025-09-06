export function isIOSLike() {
    const ua = navigator.userAgent ?? '';
    const plat = (navigator.platform ?? '').toLowerCase();
    const m = (navigator as any).maxTouchPoints ?? 0;
    const ch =
        (navigator as any).userAgentData?.platform?.toLowerCase?.() ?? '';
    return (
        /iphone|ipad|ipod/i.test(ua) ||
        (plat === 'macintel' && m > 1) ||
        ch.includes('ios')
    );
}

function buildHashtagText(tags: string[]) {
    return tags
        .filter(Boolean)
        .map(t => (t.startsWith('#') ? t : `#${t}`))
        .join(' ');
}

async function copyText(text: string) {
    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {}

    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '0';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus({ preventScroll: true });
        ta.select();
        try {
            ta.setSelectionRange(0, ta.value.length);
        } catch {}
        const ok = document.execCommand?.('copy');
        document.body.removeChild(ta);
        return !!ok;
    } catch {
        return false;
    }
}

async function fetchAsBlob(url: string): Promise<Blob> {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    return await res.blob();
}

export async function downloadOrOpen(
    publicUrl: string,
    filename = 'mien-ky-uc.jpg',
    hashtags: string[] = ['LONGWANG', 'MienKyUc']
) {
    try {
        const text = buildHashtagText(hashtags);
        await copyText(text);
    } catch {}

    if (isIOSLike()) {
        const w = window.open(publicUrl, '_blank');
        if (!w) throw new Error('POPUP_BLOCKED');
        return;
    }

    try {
        const blob = await fetchAsBlob(publicUrl);
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
    } catch (e) {
        // Fallback cuối: nếu fetch/CORS fail, mở tab cho người dùng tự lưu
        const w = window.open(publicUrl, '_blank');
        if (!w) throw new Error('POPUP_BLOCKED');
    }
}
