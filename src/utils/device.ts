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

async function fetchAsBlob(url: string): Promise<Blob> {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    return await res.blob();
}

export async function downloadOrOpen(
    publicUrl: string,
    filename = 'mien-ky-uc.jpg'
) {
    if (isIOSLike()) {
        // iOS: mở tab để user “Save Image”
        const w = window.open(publicUrl, '_blank');
        if (!w) throw new Error('POPUP_BLOCKED');
        return;
    }

    try {
        // ✅ ép tải bằng blob + object URL (same-origin)
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
