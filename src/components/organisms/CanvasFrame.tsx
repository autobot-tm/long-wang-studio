'use client';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { Group, Image as KImage, Layer, Stage } from 'react-konva';

type Slot = {
    x: number;
    y: number;
    width: number;
    height: number;
    cornerRadius?: number | number[];
    rotation?: number;
};
interface Props {
    width: number;
    height: number;
    frameSrc: string;
    photos: (string | null)[];
    slots: Slot[];
    stageScale?: number;
}
export type CanvasFrameHandle = {
    capture: () => string | null;
    captureBlob: () => Promise<Blob | null>;
    captureSlot: (i: number) => string | null;
};

function getCoverRect(bw: number, bh: number, iw: number, ih: number) {
    const s = Math.max(bw / iw, bh / ih);
    const w = iw * s,
        h = ih * s;
    return { x: (bw - w) / 2, y: (bh - h) / 2, w, h };
}

const CanvasFrame = forwardRef<CanvasFrameHandle, Props>(
    ({ width, height, frameSrc, photos, slots, stageScale = 1 }, ref) => {
        const stageRef = useRef<any>(null);
        const [frameImg, setFrameImg] = useState<HTMLImageElement | null>(null);
        const [imgs, setImgs] = useState<(HTMLImageElement | null)[]>([]);

        useEffect(() => {
            const i = new Image();
            i.crossOrigin = 'anonymous';
            i.src = frameSrc;
            i.onload = () => setFrameImg(i);
        }, [frameSrc]);

        useEffect(() => {
            Promise.all(
                photos.map(
                    src =>
                        new Promise<HTMLImageElement | null>(res => {
                            if (!src) return res(null);
                            const i = new Image();
                            i.crossOrigin = 'anonymous';
                            i.src = src;
                            i.onload = () => res(i);
                        })
                )
            ).then(setImgs);
        }, [photos]);

        useImperativeHandle(
            ref,
            () => ({
                capture: () => {
                    stageRef.current?.batchDraw();
                    const pr = 1 / (stageScale || 1); // trả về ảnh gốc 800×800
                    return (
                        stageRef.current?.toDataURL({ pixelRatio: pr }) ?? null
                    );
                },
                captureBlob: async () => {
                    stageRef.current?.batchDraw();
                    const uri = stageRef.current?.toDataURL({
                        pixelRatio: 1 / (stageScale || 1),
                    });
                    if (!uri) return null;
                    const res = await fetch(uri);
                    return await res.blob();
                },
                captureSlot: (i: number) => {
                    const img = imgs[i];
                    const s = slots[i];
                    if (!img || !s) return null;
                    const fit = getCoverRect(
                        s.width,
                        s.height,
                        img.naturalWidth,
                        img.naturalHeight
                    );
                    const c = document.createElement('canvas');
                    c.width = s.width;
                    c.height = s.height;
                    const ctx = c.getContext('2d')!;
                    ctx.drawImage(img, fit.x, fit.y, fit.w, fit.h);
                    return c.toDataURL('image/png');
                },
            }),
            [imgs, slots, stageScale]
        );

        return (
            <Stage
                ref={stageRef}
                width={width}
                height={height}
                scaleX={stageScale}
                scaleY={stageScale}
            >
                <Layer>
                    {frameImg && (
                        <KImage
                            image={frameImg}
                            width={width}
                            height={height}
                        />
                    )}
                    {slots.map((slot, i) => {
                        const img = imgs[i];
                        if (!img) return null;
                        const fit = getCoverRect(
                            slot.width,
                            slot.height,
                            img.naturalWidth,
                            img.naturalHeight
                        );
                        return (
                            <Group
                                key={i}
                                x={slot.x}
                                y={slot.y}
                                rotation={slot.rotation ?? 0}
                                clipFunc={ctx => {
                                    const r = slot.cornerRadius ?? 18,
                                        w = slot.width,
                                        h = slot.height,
                                        rr = Array.isArray(r)
                                            ? r
                                            : [r, r, r, r];
                                    const [tl, tr, br, bl] = rr;
                                    ctx.beginPath();
                                    ctx.moveTo(tl, 0);
                                    ctx.lineTo(w - tr, 0);
                                    ctx.quadraticCurveTo(w, 0, w, tr);
                                    ctx.lineTo(w, h - br);
                                    ctx.quadraticCurveTo(w, h, w - br, h);
                                    ctx.lineTo(bl, h);
                                    ctx.quadraticCurveTo(0, h, 0, h - bl);
                                    ctx.lineTo(0, tl);
                                    ctx.quadraticCurveTo(0, 0, tl, 0);
                                    ctx.closePath();
                                    ctx.clip();
                                }}
                            >
                                <KImage
                                    image={img}
                                    x={fit.x}
                                    y={fit.y}
                                    width={fit.w}
                                    height={fit.h}
                                />
                            </Group>
                        );
                    })}
                </Layer>
            </Stage>
        );
    }
);
export default CanvasFrame;
