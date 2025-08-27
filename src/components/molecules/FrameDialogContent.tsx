// components/molecules/FrameDialogContent.tsx
'use client';
import { DialogContent } from '@/components/ui/dialog';
import * as React from 'react';

type Props = {
    frameSrc: string;
    overlay?: React.ReactNode;
    children?: React.ReactNode;
    zIndex?: number;
};

export default function FrameDialogContent({
    frameSrc,
    overlay,
    children,
    zIndex = 70,
}: Props) {
    const [natural, setNatural] = React.useState<{ w: number; h: number }>({
        w: 960,
        h: 1280,
    });
    const [box, setBox] = React.useState<{ w: number; h: number }>({
        w: 960,
        h: 1280,
    });

    // Load kích thước thật của frame
    React.useEffect(() => {
        let alive = true;
        const img = new Image();
        img.onload = () => {
            if (!alive) return;
            const w = img.naturalWidth || 960;
            const h = img.naturalHeight || 1280;
            setNatural({ w, h });
        };
        img.src = frameSrc;
        return () => {
            alive = false;
        };
    }, [frameSrc]);

    // Tính box theo viewport & kích thước ảnh thật
    const compute = React.useCallback(() => {
        const maxW = Math.min(window.innerWidth * 0.9, natural.w);
        const maxH = Math.min(window.innerHeight * 0.9, natural.h);
        const ratio = natural.w / natural.h;

        // Fit-in theo 2 chiều
        let w = maxW,
            h = w / ratio;
        if (h > maxH) {
            h = maxH;
            w = h * ratio;
        }
        setBox({ w: Math.floor(w), h: Math.floor(h) });
    }, [natural.w, natural.h]);

    React.useEffect(() => {
        compute();
        window.addEventListener('resize', compute, { passive: true });
        return () => window.removeEventListener('resize', compute);
    }, [compute]);

    return (
        <DialogContent
            showCloseButton
            fitContent
            centerByGrid
            zIndex={zIndex}
            className='p-0 bg-transparent border-0 shadow-none w-auto max-w-none'
        >
            <div
                className='relative overflow-hidden mx-auto'
                style={{
                    width: `${box.w}px`,
                    height: `${box.h}px`,
                    isolation: 'isolate',
                }}
            >
                <div
                    className='absolute inset-0'
                    style={{ zIndex: 10, pointerEvents: 'none' }}
                >
                    {overlay}
                </div>

                <div
                    className='absolute inset-0 bg-no-repeat bg-center bg-contain'
                    style={{
                        zIndex: 20,
                        pointerEvents: 'none',
                        backgroundImage: `url(${frameSrc})`,
                    }}
                />

                <div
                    className='absolute inset-x-0 bottom-10 px-6 flex justify-center'
                    style={{ zIndex: 30, pointerEvents: 'none' }}
                >
                    <div className='pointer-events-auto'>{children}</div>
                </div>
            </div>
        </DialogContent>
    );
}
