'use client';
import { BASE_BY_BP, getSlotsForBP } from '@/constants/slot';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { Spinner } from '../ui/spinner';
import type { CanvasFrameHandle } from './CanvasFrame';
import PhotoUploader from './PhotoUploader';

const CanvasFrame = dynamic(() => import('./CanvasFrame'), { ssr: false });

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

    const bp = useBreakpoint();
    const base = BASE_BY_BP[bp];
    const deviceSlots = getSlotsForBP(bp);
    const frameRef = useRef<CanvasFrameHandle>(null);

    useEffect(() => {
        if (frameRef.current && onBind) onBind(frameRef.current);
    }, [onBind, base]);

    if (!frameSrc) return <Spinner />;

    return (
        <div className='relative' style={{ width: base, height: base }}>
            <CanvasFrame
                ref={frameRef}
                width={base}
                height={base}
                frameSrc={frameSrc}
                photos={photos}
                slots={deviceSlots}
                stageScale={1}
            />
            {deviceSlots.map((s, i) =>
                !photos[i] ? (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: s.x,
                            top: s.y,
                            width: s.width,
                            height: s.height,
                            transform: `rotate(${s.rotation || 0}deg)`,
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
                ) : null
            )}
        </div>
    );
}
