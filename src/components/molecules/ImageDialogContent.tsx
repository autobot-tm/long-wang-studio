'use client';

import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

type Props = {
    src: string;
    alt?: string;
    baseWidth?: number;
    baseHeight?: number;
    children?: React.ReactNode;
};

export default function ImageDialogContent({
    src,
    alt = 'Dialog background',
    baseWidth = 960,
    baseHeight = 1280,
    children,
}: Props) {
    const [ratio, setRatio] = React.useState(baseWidth / baseHeight); // w/h
    const [box, setBox] = React.useState<{ w: number; h: number }>({
        w: 0,
        h: 0,
    });

    const computeSize = React.useCallback(() => {
        const vw = window.innerWidth * 0.9;
        const vh = window.innerHeight * 0.9;
        const maxW = Math.min(960, vw);
        const maxH = Math.min(1280, vh);
        if (maxW / ratio > maxH) {
            const h = maxH;
            const w = h * ratio;
            setBox({ w, h });
        } else {
            const w = maxW;
            const h = w / ratio;
            setBox({ w, h });
        }
    }, [ratio]);

    React.useEffect(() => {
        computeSize();
        window.addEventListener('resize', computeSize);
        return () => window.removeEventListener('resize', computeSize);
    }, [computeSize]);

    return (
        <DialogContent
            showCloseButton={false}
            fitContent
            centerByGrid
            className='p-0 border-0 bg-transparent shadow-none w-auto max-w-none'
        >
            <div
                className='relative overflow-hidden mx-auto'
                style={{ width: box.w, height: box.h }}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority
                    sizes='(max-width: 960px) 90vw, 960px'
                    className='object-contain'
                    onLoadingComplete={img => {
                        const r = img.naturalWidth / img.naturalHeight;
                        if (Number.isFinite(r) && r > 0) setRatio(r);
                    }}
                />
                <DialogClose asChild>
                    <button
                        aria-label='Đóng'
                        className='absolute top-2 right-2 z-10 inline-flex size-8 items-center justify-center
                       rounded-full bg-black/30 text-white hover:bg-black/40 cursor-pointer'
                    >
                        <X className='size-4' />
                    </button>
                </DialogClose>
                <div className='absolute inset-x-0 bottom-6 px-6 pointer-events-none flex justify-center'>
                    <div className='pointer-events-auto'>{children}</div>
                </div>
            </div>
        </DialogContent>
    );
}
