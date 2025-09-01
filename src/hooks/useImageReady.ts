'use client';
import { useEffect, useState } from 'react';

export function useImageReady(src?: string) {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (!src) return setReady(true);
        let live = true;
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
        img.onload = () => live && setReady(true);
        img.onerror = () => live && setReady(true);
        return () => {
            live = false;
        };
    }, [src]);
    return ready;
}
