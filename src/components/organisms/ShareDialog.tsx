'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SLOT_SHARE } from '@/constants/slot';
import { downloadOrOpen } from '@/utils/device';
import { shareToFacebook } from '@/utils/share';
import Konva from 'konva';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Image as KImage, Layer, Stage } from 'react-konva';
import { Spinner } from '../ui/spinner';

const SLOT_BASE = { w: 960, h: 1280 } as const;
const isIOS = () =>
    typeof navigator !== 'undefined' &&
    /iP(hone|ad|od)|iOS/.test(navigator.userAgent);

const loadImage = (src?: string) =>
    new Promise<HTMLImageElement | null>(resolve => {
        if (!src) return resolve(null);
        const sameOrigin =
            typeof window !== 'undefined' &&
            (src.startsWith('/') || src.startsWith(window.location.origin));
        const tryLoad = (xo?: 'anonymous') => {
            const i = new Image();
            if (xo) i.crossOrigin = xo;
            i.decoding = 'async';
            i.src = src;
            i.onload = () => resolve(i);
            i.onerror = () => (xo ? tryLoad(undefined) : resolve(null));
        };
        sameOrigin ? tryLoad(undefined) : tryLoad('anonymous');
    });

const cover = (bw: number, bh: number, iw: number, ih: number) => {
    const s = Math.max(bw / iw, bh / ih);
    const w = iw * s;
    const h = ih * s;
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
        let alive = true;
        loadImage(frameSrc).then(img => alive && setFrameImg(img));
        return () => {
            alive = false;
        };
    }, [frameSrc]);

    useEffect(() => {
        let alive = true;
        loadImage(photo).then(img => alive && setOverlayImg(img));
        return () => {
            alive = false;
        };
    }, [photo]);

    const FW = frameImg?.naturalWidth ?? SLOT_BASE.w;
    const FH = frameImg?.naturalHeight ?? SLOT_BASE.h;

    // Tính kích thước hiển thị (không scale Stage bằng transform)
    const [display, setDisplay] = useState({ w: FW, h: FH });
    useEffect(() => {
        const calc = () => {
            const vw =
                (window.visualViewport?.width ?? window.innerWidth) * 0.9;
            const vh =
                (window.visualViewport?.height ?? window.innerHeight) * 0.9;
            const scale = Math.min(vw / FW, vh / FH, 1);
            setDisplay({
                w: Math.round(FW * scale),
                h: Math.round(FH * scale),
            });
        };
        calc();
        const onR = () => calc();
        window.addEventListener('resize', onR, { passive: true });
        window.addEventListener('orientationchange', onR, { passive: true });
        window.visualViewport?.addEventListener('resize', onR, {
            passive: true,
        });
        return () => {
            window.removeEventListener('resize', onR);
            window.removeEventListener('orientationchange', onR);
            window.visualViewport?.removeEventListener('resize', onR);
        };
    }, [FW, FH]);

    // DPR an toàn (nét nhưng không bể canvas trên iOS)
    const DPR = useMemo(() => {
        const dev =
            typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        return isIOS() ? Math.min(2, dev) : Math.min(3, dev);
    }, []);
    useEffect(() => {
        // ảnh hưởng export & hit-canvas; Konva tự nhân DPR nội bộ
        Konva.pixelRatio = DPR;
    }, [DPR]);

    // Root group scale theo tỷ lệ hiển thị để giữ toạ độ base chuẩn
    const rootScaleX = display.w / FW;
    const rootScaleY = display.h / FH;

    const rx = FW / SLOT_BASE.w;
    const ry = FH / SLOT_BASE.h;
    const slotW = SLOT_SHARE.w * rx;
    const slotH = SLOT_SHARE.h * ry;
    const cx = SLOT_SHARE.x * rx + slotW / 2;
    const cy = SLOT_SHARE.y * ry + slotH / 2;
    const rot = SLOT_SHARE.rotation ?? 0;

    const fit = overlayImg
        ? cover(slotW, slotH, overlayImg.naturalWidth, overlayImg.naturalHeight)
        : null;

    const stageRef = useRef<any>(null);
    const setSmoothingAndRedraw = useCallback(() => {
        const stage = stageRef.current as
            | import('konva/lib/Stage').Stage
            | undefined;
        if (!stage) return;
        stage.getLayers().forEach(l => {
            // @ts-ignore
            l.getContext()._context.imageSmoothingEnabled = true;
            // @ts-ignore
            l.getContext()._context.imageSmoothingQuality = 'high';
        });
        requestAnimationFrame(() => stage.batchDraw());
    }, []);
    useEffect(() => {
        setSmoothingAndRedraw();
    }, [setSmoothingAndRedraw, display.w, display.h, overlayImg, DPR]);

    const BLEED = 2;
    const bx = (fit ? fit.x : 0) - slotW / 2 - BLEED / 2;
    const by = (fit ? fit.y : 0) - slotH / 2 - BLEED / 2;
    const bw = (fit ? fit.w : 0) + BLEED;
    const bh = (fit ? fit.h : 0) + BLEED;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className='p-0 border-0 shadow-none w-auto max-w-none'
                fitContent
                centerByGrid
                showCloseButton
            >
                {overlayImg && fit ? (
                    <div
                        className='relative mx-auto z-[5]'
                        style={{
                            width: display.w,
                            height: display.h,
                            isolation: 'isolate',
                        }}
                    >
                        <Stage
                            ref={stageRef}
                            width={display.w}
                            height={display.h}
                            listening={false}
                            perfectDrawEnabled={false}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'block',
                                zIndex: 2,
                            }}
                        >
                            <Layer listening={false} hitGraphEnabled={false}>
                                <Group scaleX={rootScaleX} scaleY={rootScaleY}>
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
                                    {frameImg && (
                                        <KImage
                                            image={frameImg}
                                            x={0}
                                            y={0}
                                            width={FW}
                                            height={FH}
                                        />
                                    )}
                                </Group>
                            </Layer>
                        </Stage>

                        <div className='absolute inset-x-0 bottom-10 flex justify-center gap-3 z-[5] pointer-events-auto'>
                            <Button
                                variant='cta'
                                size='xl'
                                className='text-[#fff]'
                                onClick={() =>
                                    downloadOrOpen(photo, 'mien-ky-uc.jpg')
                                }
                            >
                                Tải xuống
                            </Button>
                            <Button
                                variant='cta'
                                size='xl'
                                className='text-[#fff]'
                                onClick={() =>
                                    shareToFacebook({
                                        imageUrl: photo,
                                        hashtags: ['MienKyUc', 'LongWang'],
                                        text: 'Chia sẻ khoảnh khắc Miền Ký Ức',
                                    })
                                }
                            >
                                Chia sẻ
                            </Button>
                        </div>
                        <div className='h-16' />
                    </div>
                ) : (
                    <Spinner size={54} />
                )}
            </DialogContent>
        </Dialog>
    );
}
