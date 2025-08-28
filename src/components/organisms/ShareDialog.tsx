'use client';
import { Dialog } from '@/components/ui/dialog';
import { uploadImage } from '@/services/api/image.service';
import { dataUrlToFile } from '@/utils/dataUrlToFile';
import { buildShareUrl, tryNativeShare } from '@/utils/share';
import {
    hashPhoto,
    loadCacheFromStorage,
    persistCache,
    shareCache,
} from '@/utils/share-upload-once';
import { ArrowBigRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import FrameDialogContent from '../molecules/FrameDialogContent';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

export default function ShareDialog({
    open,
    onOpenChange,
    photo,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    photo: string;
}) {
    const BASE_W = 960,
        BASE_H = 1280;
    const SLOT = { x: 124, y: 457, w: 498, h: 498, rotation: -4 };
    const pct = (v: number, base: number) => `${(v / base) * 100}%`;
    const [loading, setLoading] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const overlay = useMemo(
        () =>
            !photo ? null : (
                <div
                    className='absolute overflow-hidden'
                    style={{
                        left: pct(SLOT.x, BASE_W),
                        top: pct(SLOT.y, BASE_H),
                        width: pct(SLOT.w, BASE_W),
                        height: pct(SLOT.h, BASE_H),
                        transform: `rotate(${SLOT.rotation}deg)`,
                        transformOrigin: 'top left',
                    }}
                >
                    <img
                        src={photo}
                        alt=''
                        className='w-full h-full object-cover'
                    />
                </div>
            ),
        [photo]
    );

    useEffect(() => {
        loadCacheFromStorage();
        return () => {
            // đóng dialog -> hủy upload
            abortRef.current?.abort();
            abortRef.current = null;
        };
    }, []);

    const shareFacebook = async (url: string) => {
        if (!url) return;

        const link = buildShareUrl('facebook', url);
        if (link) {
            // Mở cửa sổ Facebook share
            window.open(link, '_blank', 'noopener,noreferrer');
            return;
        }

        // fallback: Web Share API (native mobile)
        await tryNativeShare(url);
    };

    const handleShare = async () => {
        if (!photo || loading) return;
        setLoading(true);
        try {
            const key = await hashPhoto(photo);
            const cached = shareCache.get(key);
            if (cached) {
                await shareFacebook(cached);
                return;
            }

            const controller = new AbortController();
            abortRef.current = controller;

            const file = await dataUrlToFile(photo, 'share.png');
            const res = await uploadImage(file, {
                tags: 'landing-share',
                isPublic: true,
                // signal: controller.signal
            });

            if (res.success && res.data?.url) {
                shareCache.set(key, res.data.url);
                persistCache();
                await shareFacebook(res.data.url);
            } else {
                toast.error(res.message ?? 'Upload ảnh thất bại.');
            }
        } catch {
            toast.error('Có lỗi không xác định trong quá trình chia sẻ.');
        } finally {
            setLoading(false);
            abortRef.current = null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <FrameDialogContent
                frameSrc='/images/share-frame.png'
                // baseWidth={960}
                // baseHeight={1280}
                zIndex={70}
                overlay={overlay}
            >
                <Button
                    variant='cta'
                    size='xl'
                    className='flex items-center gap-2 text-[#F6F2D7]'
                    onClick={handleShare}
                    disabled={!photo || loading}
                >
                    <span>{loading ? <Spinner size={32} /> : 'Chia sẻ'}</span>
                    {!loading && <ArrowBigRight size={40} fill='#F6F2D7' />}
                </Button>
            </FrameDialogContent>
        </Dialog>
    );
}
