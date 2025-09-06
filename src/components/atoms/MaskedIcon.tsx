'use client';
import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export default function MaskedIcon({
    Icon,
    sizeCSS = '1em',
    strokeWidth = 2,
    className,
}: {
    Icon: LucideIcon;
    sizeCSS?: string;
    size?: number;
    strokeWidth?: number;
    className?: string;
}) {
    const maskUrl = useMemo(() => {
        const svg = renderToStaticMarkup(
            <Icon size={24} strokeWidth={strokeWidth} fill='#F6F2D7' />
        );
        return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
    }, [Icon, strokeWidth]);

    return (
        <span
            aria-hidden
            className={className}
            style={{
                display: 'inline-block',
                width: sizeCSS,
                height: sizeCSS,
                backgroundImage: 'var(--page-bg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                WebkitMaskImage: maskUrl,
                maskImage: maskUrl,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                verticalAlign: 'middle',
            }}
        />
    );
}
