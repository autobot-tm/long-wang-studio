export type MediaType = 'background' | 'frame' | 'popup';
export type Asset = {
    id: string;
    url: string;
    thumb?: string;
    isActive?: boolean;
    createdAt: string;
};

const base = (t: MediaType) => `/api/assets?type=${t}`;

export async function listAssets(type: MediaType): Promise<Asset[]> {
    const r = await fetch(base(type), { cache: 'no-store' });
    if (!r.ok) throw new Error('fetch assets failed');
    return r.json();
}
export async function uploadAsset(type: MediaType, files: FileList) {
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('files', f));
    const r = await fetch(base(type), { method: 'POST', body: fd });
    if (!r.ok) throw new Error('upload failed');
}
export async function setActiveAsset(type: MediaType, id: string) {
    const r = await fetch(`${base(type)}&active=${id}`, { method: 'PUT' });
    if (!r.ok) throw new Error('set active failed');
}
