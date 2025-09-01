'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useEffect, useMemo, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';

type CropArea = { width: number; height: number; x: number; y: number };

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
}: {
    open: boolean;
    file: File | null;
    onClose: () => void;
    onDone: (url: string) => void;
    aspect?: number;
}) {
    const isMobile = useIsMobile();
    const allowRotate = !isMobile; // ⛔ chặn rotate trên mobile

    const [zoom, setZoom] = useState(1);
    const [rot, setRot] = useState(0);
    const [area, setArea] = useState<CropArea | null>(null);
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const objectUrlRef = useRef<string | null>(null);
    const imgUrl = useMemo(() => {
        if (!file) return '';
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        return url;
    }, [file]);

    useEffect(() => {
        // reset khi mở ảnh mới
        setZoom(1);
        setRot(0);
        setCrop({ x: 0, y: 0 });
        setArea(null);
    }, [imgUrl]);

    useEffect(() => {
        // cleanup objectURL khi đóng/đổi ảnh
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, [imgUrl]);

    async function handleDone() {
        if (!file || !area) return;

        const img = await new Promise<HTMLImageElement>(resolve => {
            const i = new Image();
            i.crossOrigin = 'anonymous';
            i.decoding = 'async';
            i.src = imgUrl;
            i.onload = () => resolve(i);
        });

        const { width, height, x, y } = area;

        // Canvas xuất ảnh đã crop
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d')!;
        c.width = Math.round(width);
        c.height = Math.round(height);

        // ⛔ Chặn rotate trên mobile (rotation = 0)
        const rotation = allowRotate ? rot : 0;

        if (rotation) {
            ctx.translate(c.width / 2, c.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-c.width / 2, -c.height / 2);
        }

        // Vẽ phần đã crop
        ctx.imageSmoothingEnabled = true;
        // @ts-ignore
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, x, y, width, height, 0, 0, c.width, c.height);

        onDone(c.toDataURL('image/jpeg', 0.92));
    }

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent
                className='w-[340px] sm:w-[400px] md:w-[540px]'
                zIndex={380}
                centerByGrid
            >
                <DialogHeader>
                    <DialogTitle>Chỉnh ảnh</DialogTitle>
                </DialogHeader>

                <div className='relative h-[360px] rounded-xs overflow-hidden bg-[#F6F2D7]'>
                    <Cropper
                        image={imgUrl}
                        aspect={aspect}
                        crop={crop}
                        onCropChange={setCrop}
                        zoom={zoom}
                        rotation={allowRotate ? rot : 0} // ⛔ cố định 0 trên mobile
                        onZoomChange={z => setZoom(z)}
                        onRotationChange={
                            allowRotate ? r => setRot(r) : undefined
                        } // ⛔ không cho đổi rotation
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
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleDone}>Dùng ảnh này</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
