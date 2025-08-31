'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SLOT_SHARE } from '@/constants/slot';
import { downloadOrOpen } from '@/utils/device';
import { buildSharer } from '@/utils/share';
import { useEffect, useRef, useState } from 'react';
import { Group, Image as KImage, Layer, Stage } from 'react-konva';

const SLOT_BASE = { w: 960, h: 1280 } as const;

const loadImage = (src?: string) =>
    new Promise<HTMLImageElement | null>(r => {
        if (!src) return r(null);
        const i = new Image();
        i.crossOrigin = 'anonymous';
        i.decoding = 'async';
        i.src = src;
        i.onload = () => r(i);
        i.onerror = () => r(null);
    });

const cover = (bw: number, bh: number, iw: number, ih: number) => {
    const s = Math.max(bw / iw, bh / ih);
    const w = iw * s,
        h = ih * s;
    return { x: (bw - w) / 2, y: (bh - h) / 2, w, h };
};

export default function ShareDialog({
    open,
    onOpenChange,
    photo,
    frameSrc = '/images/frame-share.png',
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    photo: string;
    frameSrc?: string;
}) {
    const [frameImg, setFrameImg] = useState<HTMLImageElement | null>(null);
    const [overlayImg, setOverlayImg] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        loadImage(frameSrc).then(setFrameImg);
    }, [frameSrc]);
    useEffect(() => {
        loadImage(photo).then(setOverlayImg);
    }, [photo]);

    const FW = frameImg?.naturalWidth ?? SLOT_BASE.w;
    const FH = frameImg?.naturalHeight ?? SLOT_BASE.h;

    const [scale, setScale] = useState(1);
    useEffect(() => {
        const calc = () => {
            const vw =
                (window.visualViewport?.width ?? window.innerWidth) * 0.9;
            const vh =
                (window.visualViewport?.height ?? window.innerHeight) * 0.9;
            setScale(Math.min(vw / FW, vh / FH));
        };
        calc();
        const onR = () => calc();
        window.addEventListener('resize', onR, { passive: true });
        window.visualViewport?.addEventListener('resize', onR, {
            passive: true,
        });
        return () => {
            window.removeEventListener('resize', onR);
            window.visualViewport?.removeEventListener('resize', onR);
        };
    }, [FW, FH]);

    const rx = FW / SLOT_BASE.w,
        ry = FH / SLOT_BASE.h;
    const slotW = SLOT_SHARE.w * rx,
        slotH = SLOT_SHARE.h * ry;
    const cx = SLOT_SHARE.x * rx + slotW / 2;
    const cy = SLOT_SHARE.y * ry + slotH / 2;
    const rot = SLOT_SHARE.rotation ?? 0;

    const fit = overlayImg
        ? cover(slotW, slotH, overlayImg.naturalWidth, overlayImg.naturalHeight)
        : null;

    const stageRef = useRef<any>(null);
    useEffect(() => {
        stageRef.current?.batchDraw();
    }, [FW, FH, scale, overlayImg, rx, ry]);

    const BLEED = 2;
    const bx = (fit ? fit.x : 0) - slotW / 2 - BLEED / 2;
    const by = (fit ? fit.y : 0) - slotH / 2 - BLEED / 2;
    const bw = (fit ? fit.w : 0) + BLEED;
    const bh = (fit ? fit.h : 0) + BLEED;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className='p-0 bg-transparent border-0 shadow-none w-auto max-w-none'
                fitContent
                centerByGrid
            >
                <div
                    className='relative mx-auto'
                    style={{ width: FW * scale, height: FH * scale }}
                >
                    <div
                        style={{
                            width: FW,
                            height: FH,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                        }}
                    >
                        <Stage
                            ref={stageRef}
                            width={FW}
                            height={FH}
                            listening={false}
                            style={{ display: 'block' }}
                        >
                            <Layer listening={false} hitGraphEnabled={false}>
                                {overlayImg && fit && (
                                    <Group
                                        x={cx}
                                        y={cy}
                                        rotation={rot}
                                        offsetX={slotW / 2}
                                        offsetY={slotH / 2}
                                        clipX={-slotW / 2}
                                        clipY={-slotH / 2}
                                        clipWidth={slotW}
                                        clipHeight={slotH}
                                    >
                                        <KImage
                                            image={overlayImg}
                                            x={bx}
                                            y={by}
                                            width={bw}
                                            height={bh}
                                        />
                                    </Group>
                                )}
                            </Layer>

                            <Layer listening={false} hitGraphEnabled={false}>
                                {frameImg && (
                                    <KImage
                                        image={frameImg}
                                        x={0}
                                        y={0}
                                        width={FW}
                                        height={FH}
                                    />
                                )}
                            </Layer>
                        </Stage>
                    </div>

                    <div className='absolute inset-x-0 bottom-10 flex justify-center gap-3 z-[5] pointer-events-auto'>
                        <Button
                            variant='cta'
                            size='xl'
                            onClick={() =>
                                downloadOrOpen(photo, 'mien-ky-uc.jpg')
                            }
                        >
                            Tải xuống
                        </Button>
                        <Button
                            variant='cta'
                            size='xl'
                            onClick={() => {
                                const u = buildSharer(photo);
                                const p = window.open(
                                    '_blank',
                                    'noopener,noreferrer'
                                );
                                if (p) p.location.href = u;
                                else window.location.href = u;
                            }}
                        >
                            Chia sẻ
                        </Button>
                    </div>
                    <div className='h-16' />
                </div>
            </DialogContent>
        </Dialog>
    );
}
