import axiosClient from '@/libs/axios/instance.client';
import type { ApiResponse } from '@/types/common/api.type';

export type UploadResult = { url: string; fileName: string; size: number };

export async function uploadImage(
    file: File,
    opts?: {
        tags?: string;
        isPublic?: boolean;
        onProgress?: (p: number) => void;
    }
): Promise<ApiResponse<UploadResult>> {
    const form = new FormData();
    form.append('File', file);
    if (opts?.tags) form.append('Tags', opts.tags);

    try {
        const res = await axiosClient.post<ApiResponse<UploadResult>>(
            '/images/upload',
            form,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: e => {
                    if (opts?.onProgress && e.total)
                        opts.onProgress(Math.round((e.loaded * 100) / e.total));
                },
            }
        );
        return res.data;
    } catch (e: any) {
        return {
            success: false,
            message: e?.response?.data?.message ?? 'Upload thất bại',
        };
    }
}
