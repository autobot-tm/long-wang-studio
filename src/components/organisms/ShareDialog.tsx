'use client';
import { Dialog } from '@/components/ui/dialog';
import { uploadImage } from '@/services/api/image.service';
import { dataUrlToFile } from '@/utils/dataUrlToFile';
import {
    hashPhoto,
    loadCacheFromStorage,
    persistCache,
    shareCache,
} from '@/utils/share-upload-once';
import { ArrowBigRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import FrameDialogContent from '../molecules/FrameDialogContent';
import ShareMiniPopup from '../molecules/ShareMiniPopup';
import { Button } from '../ui/button';

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
    const [miniOpen, setMiniOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
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

    const handleShare = async () => {
        if (!photo || loading) return;
        setLoading(true);
        try {
            const key = await hashPhoto(photo);
            const cached = shareCache.get(key);
            if (cached) {
                setShareUrl(cached);
                setMiniOpen(true);
                return;
            }

            const controller = new AbortController();
            abortRef.current = controller;

            const file = await dataUrlToFile(photo, 'share.png');
            const res = await uploadImage(file, {
                tags: 'landing-share',
                isPublic: true /*, signal: controller.signal*/,
            });
            if (res.success && res.data) {
                shareCache.set(key, res.data.url);
                persistCache();
                setShareUrl(res.data.url);
                setMiniOpen(true);
            } else alert(res.message ?? 'Upload ảnh thất bại');
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
                overlay={overlay /* như bạn đã tính pct/rotation */}
            >
                <Button
                    variant='cta'
                    size='xl'
                    className='flex items-center gap-2 text-[#F6F2D7]'
                    onClick={handleShare}
                    disabled={!photo || loading}
                >
                    <span>{loading ? 'Đang tải...' : 'Chia sẻ'}</span>
                    <ArrowBigRight size={40} fill='#F6F2D7' />
                </Button>
            </FrameDialogContent>

            {/* Dialog con nên cao hơn */}
            <ShareMiniPopup
                open={miniOpen}
                onOpenChange={setMiniOpen}
                defaultUrl={shareUrl ?? ''}
            />
        </Dialog>
    );
}
