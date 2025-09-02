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
    const { data } = await axiosClient.get<Asset[]>('/backgrounds');

    return data;
}
export async function uploadBackground(file: File): Promise<Asset> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', 'background');
    fd.append('isPublic', 'true');
    const { data } = await axiosClient.post<Asset>('/backgrounds/upload', fd);
    return data;
}
export async function deleteBackground(id: string) {
    await axiosClient.delete(`/backgrounds/${id}`);
}

// ===== Frames / Popup =====
export async function listFramesByTag(
    tag: 'frame' | 'popup'
): Promise<Asset[]> {
    const { data } = await axiosClient.get<Asset[]>('/frames/frames', {
        params: { tags: tag },
    });
    return data;
}
export async function uploadFramesWithTag(
    files: FileList,
    tag: 'frame' | 'popup',
    ratio?: string
) {
    const tasks = Array.from(files).map(async f => {
        const fd = new FormData();
        fd.append('file', f);
        fd.append('name', tag);
        fd.append('tags', tag);
        fd.append('isPublic', 'true');
        if (ratio) fd.append('ratio', ratio);
        const { data } = await axiosClient.post<Asset>('/frames/upload', fd);
        return data;
    });
    return Promise.all(tasks);
}
export async function deleteFrame(id: string) {
    await axiosClient.delete(`/frames/${id}`);
}
