'use client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useEffect, useMemo, useState } from 'react';
import Cropper from 'react-easy-crop';

type CropArea = {
    width: number;
    height: number;
    x: number;
    y: number;
};
const useIsMobile = () => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isTouch =
        typeof window !== 'undefined' &&
        ('ontouchstart' in window || (navigator as any).maxTouchPoints > 0);
    return /Mobi|Android|iPhone|iPad|iPod/i.test(ua) || isTouch;
};

export default function CropDialog({
    open,
    file,
    onClose,
    onDone,
    aspect = 1,
    outWidth,
    outHeight,
}: {
    open: boolean;
    file: File | null;
    onClose: () => void;
    onDone: (url: string) => void;
    aspect?: number;
    outWidth?: number;
    outHeight?: number;
}) {
    const isMobile = useIsMobile();
    const allowRotate = !isMobile;
    const [zoom, setZoom] = useState(1);
    const [rot, setRot] = useState(0);
    const [area, setArea] = useState<CropArea | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [submitting, setSubmitting] = useState(false);

    const imgUrl = useMemo(
        () => (file ? URL.createObjectURL(file) : ''),
        [file]
    );

    useEffect(() => {
        setZoom(1);
        setRot(0);
        setCrop({ x: 0, y: 0 });
        setArea(null);
        setSubmitting(false);
    }, [imgUrl]);

    useEffect(() => {
        return () => {
            if (imgUrl?.startsWith('blob:')) URL.revokeObjectURL(imgUrl);
        };
    }, [imgUrl]);

    async function handleDone() {
        if (submitting || !file || !area) return;
        setSubmitting(true);

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const i = new Image();
            i.decoding = 'async';
            i.src = imgUrl;
            i.onload = () => resolve(i);
            i.onerror = reject;
        });

        const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
        const targetW = Math.round((outWidth ?? area.width) * dpr);
        const targetH = Math.round((outHeight ?? area.height) * dpr);

        const c = document.createElement('canvas');
        c.width = targetW;
        c.height = targetH;
        const ctx = c.getContext('2d')!;
        // @ts-ignore
        ctx.imageSmoothingEnabled = true;
        // @ts-ignore
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            img,
            area.x,
            area.y,
            area.width,
            area.height,
            0,
            0,
            targetW,
            targetH
        );

        onDone(c.toDataURL('image/jpeg', 0.92));
        setSubmitting(false);
    }
    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent
                className='w-[340px] sm:w-[400px] md:w-[540px]'
                aria-labelledby='crop-title'
                aria-describedby='crop-desc'
                zIndex={380}
                centerByGrid
            >
                <p id='crop-desc' className='sr-only'>
                    Chỉnh, phóng to/thu nhỏ ảnh trước khi dùng.
                </p>
                <div className='flex flex-col gap-3 max-h-[85dvh] sm:max-h-[80vh]'>
                    <DialogHeader>
                        <DialogTitle id='crop-title'>Chỉnh ảnh</DialogTitle>
                    </DialogHeader>
                    <div className='relative flex-1 min-h-[320px] rounded-xs overflow-hidden bg-[#F6F2D7]'>
                        <Cropper
                            image={imgUrl}
                            aspect={aspect}
                            crop={crop}
                            onCropChange={setCrop}
                            zoom={zoom}
                            rotation={allowRotate ? rot : 0}
                            onZoomChange={z => setZoom(z)}
                            onRotationChange={
                                allowRotate ? r => setRot(r) : undefined
                            }
                            restrictPosition
                            onCropComplete={(_, px) => setArea(px as CropArea)}
                        />
                    </div>
                    <div className='space-y-2'>
                        <div className='text-sm'>Zoom</div>
                        <Slider
                            min={1}
                            max={3}
                            step={0.01}
                            value={[zoom]}
                            onValueChange={v => setZoom(v[0])}
                        />
                    </div>
                    <div
                        className='sticky bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur 
                       border-t pt-3 pb-[max(10px,env(safe-area-inset-bottom))]'
                    >
                        <div className='flex justify-end gap-3'>
                            <Button
                                variant='outline'
                                size='sm'
                                fullMobile
                                className='text-[#000]'
                                onClick={onClose}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant='cta'
                                size='sm'
                                fullMobile
                                className='text-[#fff]'
                                disabled={submitting || !area}
                                onClick={handleDone}
                            >
                                {submitting ? 'Đang xử lý...' : 'Dùng ảnh này'}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
