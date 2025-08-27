export const shareCache = new Map<string, string>();

function fnv1a(buffer: ArrayBuffer): string {
    const data = new Uint8Array(buffer);
    let hash = 0x811c9dc5; // offset basis
    for (let i = 0; i < data.length; i++) {
        hash ^= data[i];
        hash = (hash >>> 0) * 0x01000193; // 32-bit FNV prime
    }
    return ('00000000' + (hash >>> 0).toString(16)).slice(-8);
}

async function digestSHA1(buf: ArrayBuffer): Promise<string | null> {
    try {
        const subtle = globalThis?.crypto?.subtle;
        if (!subtle) return null;
        const dig = await subtle.digest('SHA-1', buf);
        return Array.from(new Uint8Array(dig))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    } catch {
        return null;
    }
}

export async function hashPhoto(src: string): Promise<string> {
    // Chỉ chạy client
    if (typeof window === 'undefined') return 'srv';
    // Lấy blob từ ảnh (data: URL hoặc HTTP/blob:)
    const resp = await fetch(src);
    const blob = await resp.blob();
    const buf = await blob.arrayBuffer();

    // Ưu tiên SHA-1, fallback FNV-1a
    const sha1 = await digestSHA1(buf);
    return sha1 ?? `fnv_${fnv1a(buf)}`;
}

export function loadCacheFromStorage() {
    try {
        const raw = localStorage.getItem('share_uploaded_cache');
        if (!raw) return;
        const obj = JSON.parse(raw) as Record<string, string>;
        Object.entries(obj).forEach(([k, v]) => shareCache.set(k, v));
    } catch {}
}
export function persistCache() {
    try {
        const obj = Object.fromEntries(shareCache.entries());
        localStorage.setItem('share_uploaded_cache', JSON.stringify(obj));
    } catch {}
}
