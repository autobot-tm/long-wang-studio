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
import { useMemo, useState } from 'react';
import Cropper from 'react-easy-crop';

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
    const [zoom, setZoom] = useState(1);
    const [rot, setRot] = useState(0);
    const [area, setArea] = useState<any>();
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const imgUrl = useMemo(
        () => (file ? URL.createObjectURL(file) : ''),
        [file]
    );
    async function handleDone() {
        if (!file || !area) return;
        const img = await new Promise<HTMLImageElement>(r => {
            const i = new Image();
            i.crossOrigin = 'anonymous';
            i.src = imgUrl;
            i.onload = () => r(i);
        });
        const { width, height, x, y } = area;
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d')!;
        c.width = width;
        c.height = height;
        ctx.translate(width / 2, height / 2);
        ctx.rotate((rot * Math.PI) / 180);
        ctx.translate(-width / 2, -height / 2);
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        onDone(c.toDataURL('image/jpeg', 0.9));
        URL.revokeObjectURL(imgUrl);
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
                <div className='relative h-[360px] rounded-xs overflow-hidden  bg-[#F6F2D7]'>
                    <Cropper
                        image={imgUrl}
                        aspect={aspect}
                        crop={crop}
                        onCropChange={setCrop}
                        zoom={zoom}
                        rotation={rot}
                        onZoomChange={z => setZoom(z)}
                        onRotationChange={r => setRot(r)}
                        onCropComplete={(_, px) => setArea(px)}
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
