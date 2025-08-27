'use client';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';
import type { CanvasFrameHandle } from './CanvasFrame';
import PhotoUploader from './photo-uploader';

const CanvasFrame = dynamic(() => import('./CanvasFrame'), { ssr: false });
const BASE = 800;
const SIZES = { mobile: 320, tablet: 600, desktop: 800 };

export default function ResponsiveFrame(props: {
    frameSrc: string;
    slots: any[];
    photos: (string | null)[];
    setPhoto: (i: number, u: string | null) => void;
    onBind?: (api: {
        capture: () => string | null;
        captureSlot: (i: number) => string | null;
        captureBlob: () => Promise<Blob | null>;
    }) => void;
}) {
    const { frameSrc, slots, photos, setPhoto, onBind } = props;
    const bp = useBreakpoint();
    const W = SIZES[bp];
    const scale = useMemo(() => W / BASE, [W]);
    const frameRef = useRef<CanvasFrameHandle>(null);

    useEffect(() => {
        if (onBind && frameRef.current) {
            onBind({
                capture: () => frameRef.current!.capture(),
                captureSlot: i => frameRef.current!.captureSlot(i),
                captureBlob: () => frameRef.current!.captureBlob(),
            });
        }
    }, [onBind]);

    return (
        <div className='relative' style={{ width: W, height: W }}>
            <CanvasFrame
                ref={frameRef}
                width={BASE}
                height={BASE}
                frameSrc={frameSrc}
                photos={photos}
                slots={slots}
                stageScale={scale}
            />
            {slots.map((s, i) =>
                !photos[i] ? (
                    <PhotoUploader
                        key={i}
                        // vị trí vẫn nhân scale để đặt đúng tọa độ
                        slot={{
                            x: s.x * scale,
                            y: s.y * scale,
                            width: s.width,
                            height: s.height,
                            rotation: s.rotation,
                        }}
                        scale={scale} // ✅ scale toàn bộ UI bên trong
                        index={i}
                        onSet={(idx, url) => setPhoto(idx, url)}
                    />
                ) : null
            )}
        </div>
    );
}
