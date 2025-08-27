'use client';
import { useEffect, useState } from 'react';
export type BP = 'mobile' | 'tablet' | 'desktop';
export function useBreakpoint(): BP {
    const get = () => {
        if (typeof window === 'undefined') return 'desktop';
        const vw = window.innerWidth;
        if (vw < 640) return 'mobile';
        if (vw < 1024) return 'tablet';
        return 'desktop';
    };
    const [bp, setBp] = useState<BP>(get);
    useEffect(() => {
        const on = () => setBp(get());
        window.addEventListener('resize', on);
        return () => window.removeEventListener('resize', on);
    }, []);
    return bp;
}
