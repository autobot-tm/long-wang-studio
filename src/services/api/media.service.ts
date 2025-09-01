'use client';

import axiosClient from '@/libs/axios/instance.client';

export type MediaType = 'background' | 'frame' | 'popup';

export type Asset = {
    id: string;
    url: string;
    thumb?: string;
    tags?: string;
    createdAt: string;
};

// ===== Backgrounds =====
export async function listBackgrounds(): Promise<Asset[]> {
    const { data } = await axiosClient.get<Asset[]>('/api/backgrounds', {
        params: {},
    });
    return data;
}

export async function uploadBackground(file: File): Promise<Asset> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', 'background');
    fd.append('isPublic', 'true');

    const { data } = await axiosClient.post<Asset>(
        '/api/backgrounds/upload',
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
}

export async function deleteBackground(id: string): Promise<void> {
    await axiosClient.delete(`/api/backgrounds/${id}`);
}

// ===== Frames (dùng chung cho frame/popup) =====
export async function listAllFrames(): Promise<Asset[]> {
    const { data } = await axiosClient.get<Asset[]>('/api/frames/frames');
    return data;
}

export async function listFramesByTag(
    tag: 'frame' | 'popup'
): Promise<Asset[]> {
    const all = await listAllFrames();
    const t = tag.toLowerCase();
    return all.filter(x => (x.tags ?? '').toLowerCase().includes(t));
}

export async function uploadFramesWithTag(
    files: FileList,
    tag: 'frame' | 'popup',
    ratio?: string
): Promise<Asset[]> {
    const tasks = Array.from(files).map(async f => {
        const fd = new FormData();
        fd.append('file', f);
        fd.append('name', tag);
        fd.append('tags', tag);
        fd.append('isPublic', 'true');
        if (ratio) fd.append('ratio', ratio);

        const { data } = await axiosClient.post<Asset>(
            '/api/frames/upload',
            fd,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        return data;
    });
    return Promise.all(tasks);
}

export async function deleteFrame(id: string): Promise<void> {
    await axiosClient.delete(`/api/frames/${id}`);
}
