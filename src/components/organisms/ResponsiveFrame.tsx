'use client';

import { BASE_BY_BP, getSlotsForBP } from '@/constants/slot';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { X as XIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CanvasFrameHandle } from './CanvasFrame';
import PhotoUploader from './PhotoUploader';

const CanvasFrame = dynamic(() => import('./CanvasFrame'), { ssr: false });

const imgCache = new Map<string, Promise<HTMLImageElement>>();
function preloadImage(src: string) {
    if (!src) return Promise.resolve(null as any);
    if (imgCache.has(src)) return imgCache.get(src)!;
    const p = new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.src = src.startsWith('http')
            ? src.replace(/^http:/, 'https:')
            : src;
        img.decode
            ? img
                  .decode()
                  .then(() => resolve(img))
                  .catch(() => resolve(img))
            : (img.onload = () => resolve(img));
        img.onerror = reject;
    });
    imgCache.set(src, p);
    return p;
}

export type CaptureOptions = {
    pixelRatio?: number;
    mimeType?: string;
    quality?: number;
};

export default function ResponsiveFrame(props: {
    frameSrc: string;
    photos: (string | null)[];
    setPhoto: (i: number, u: string | null) => void;
    onBind?: (api: {
        capture: () => string | null;
        captureSlot: (i: number) => string | null;
        captureBlob: (opts?: CaptureOptions) => Promise<Blob | null>;
    }) => void;
}) {
    const { frameSrc, photos, setPhoto, onBind } = props;
    const [dpr, setDpr] = useState(1);
    const bp = useBreakpoint();
    const base = useMemo(() => BASE_BY_BP[bp], [bp]);
    const deviceSlots = useMemo(() => getSlotsForBP(bp), [bp]);
    const containerStyle = useMemo<React.CSSProperties>(
        () => ({ width: base, height: base }),
        [base]
    );

    const frameRef = useRef<CanvasFrameHandle>(null);
    const boundOnce = useRef(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let alive = true;
        setReady(false);
        preloadImage(frameSrc)
            .then(() => alive && setReady(true))
            .catch(() => alive && setReady(true));
        return () => {
            alive = false;
        };
    }, [frameSrc]);

    useEffect(() => {
        if (!boundOnce.current && frameRef.current && onBind) {
            boundOnce.current = true;
            onBind(frameRef.current);
        }
    }, [onBind]);

    useEffect(() => {
        const on = () =>
            setDpr(Math.min(2, Math.max(1, window.devicePixelRatio || 1)));
        on();
        window.addEventListener('resize', on, { passive: true });
        window.visualViewport?.addEventListener('resize', on, {
            passive: true,
        });
        return () => {
            window.removeEventListener('resize', on);
            window.visualViewport?.removeEventListener('resize', on);
        };
    }, []);

    return (
        <div className='relative' style={containerStyle}>
            <CanvasFrame
                ref={frameRef}
                width={base}
                height={base}
                frameSrc={frameSrc}
                photos={photos}
                slots={deviceSlots}
                stageScale={1}
            />

            {deviceSlots.map((s, i) => {
                const rot = s.rotation || 0;

                if (photos[i]) {
                    return (
                        <div
                            key={`close-${i}`}
                            style={{
                                position: 'absolute',
                                left: s.x,
                                top: s.y,
                                width: s.width,
                                height: s.height,
                                transform: `rotate(${rot}deg)`,
                                transformOrigin: 'top left',
                                zIndex: 40,
                            }}
                        >
                            <button
                                type='button'
                                aria-label={`Xóa ảnh ${i + 1}`}
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setPhoto(i, null);
                                }}
                                className='absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full border shadow-sm
                           bg-white/70 text-black/70 border-white/80 hover:bg-white/80 hover:text-black cursor-pointer
                           backdrop-blur-sm transition-opacity'
                                style={{
                                    width: 28,
                                    height: 28,
                                    WebkitTapHighlightColor: 'transparent',
                                }}
                            >
                                <XIcon className='w-4 h-4' />
                            </button>
                        </div>
                    );
                }

                return (
                    <div
                        key={`uploader-${i}`}
                        style={{
                            position: 'absolute',
                            left: s.x,
                            top: s.y,
                            width: s.width,
                            height: s.height,
                            transform: `rotate(${rot}deg)`,
                            transformOrigin: 'top left',
                        }}
                    >
                        <PhotoUploader
                            slot={{
                                x: 0,
                                y: 0,
                                width: s.width,
                                height: s.height,
                                rotation: 0,
                            }}
                            index={i}
                            onSet={(idx, url) => setPhoto(idx, url)}
                            scale={1}
                        />
                    </div>
                );
            })}
        </div>
    );
}
