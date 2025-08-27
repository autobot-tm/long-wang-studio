export async function dataUrlToFile(
    src: string,
    fileName = 'share.png'
): Promise<File> {
    if (src.startsWith('data:')) {
        const [meta, b64] = src.split(',');
        const mime = meta.match(/data:(.*);base64/)?.[1] ?? 'image/png';
        const bin = atob(b64);
        const u8 = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        return new File([u8], fileName, { type: mime });
    }
    const resp = await fetch(src);
    const blob = await resp.blob();
    const type = blob.type || 'image/png';
    return new File([blob], fileName, { type });
}
