import { uploadImage } from '@/services/api/image.service';
import { AppError } from '@/utils/errors';
import { hashPhoto, persistCache, shareCache } from '@/utils/share-upload-once';
import { toast } from 'sonner';

export async function ensureUploadedUrl(dataUrl: string, blob: Blob) {
    try {
        const key = await hashPhoto(dataUrl);
        const cached = shareCache.get(key);
        if (cached) {
            console.info('cache-hit', cached);
            return cached;
        }

        const file = new File([blob], 'mien-ky-uc.jpg', { type: 'image/jpeg' });
        const res = await uploadImage(file, {
            tags: 'landing-download',
            isPublic: true,
        });
        if (!res?.success || !res.data?.url)
            throw new AppError(
                'UPLOAD_FAILED',
                res?.message ?? 'Upload API failed',
                { api: res }
            );

        shareCache.set(key, res.data.url);
        persistCache();
        return res.data.url as string;
    } catch (e: any) {
        const msg = e?.message || '';
        toast.error(
            `Upload lỗi: ${msg}. iOS có thể do CORS/mixed-content/body-limit. Hãy kiểm Network tab.`
        );
        if (e?.name === 'AbortError')
            throw new AppError('ABORTED', 'User aborted');
        if (e?.message?.startsWith?.('HTTP_'))
            throw new AppError('HTTP_ERROR', e.message);
        if (e?.name === 'TypeError')
            throw new AppError('NETWORK_OR_CORS', e.message);
        throw e;
    } finally {
        console.timeEnd('ensureUploadedUrl');
    }
}
