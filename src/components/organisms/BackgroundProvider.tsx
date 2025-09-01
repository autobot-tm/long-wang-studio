'use client';
import React, { useMemo } from 'react';

type Props<T extends React.ElementType = 'div'> = {
    as?: T;
    bg: string;
    paint?: boolean;
    fixed?: boolean;
    className?: string;
    children: React.ReactNode;
    fadeIn?: boolean; // NEW: bật fade-in
    ready?: boolean; // NEW: trạng thái đã tải ảnh
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export default function BackgroundProvider<
    T extends React.ElementType = 'div'
>({
    as,
    bg,
    paint = true,
    fixed,
    className,
    children,
    fadeIn,
    ready = true,
    ...rest
}: Props<T>) {
    const Comp = (as || 'div') as React.ElementType;
    const style = useMemo(() => {
        const s: React.CSSProperties = { ['--page-bg' as any]: bg };
        if (paint) {
            s.backgroundImage = 'var(--page-bg)' as any;
            s.backgroundSize = 'cover';
            s.backgroundPosition = 'center';
            s.backgroundRepeat = 'no-repeat';
            if (fixed) s.backgroundAttachment = 'fixed';
        }
        return s;
    }, [bg, paint, fixed]);

    return (
        <Comp
            style={style}
            className={[
                className,
                fadeIn
                    ? `transition-opacity duration-500 ${
                          ready ? 'opacity-100' : 'opacity-0'
                      }`
                    : '',
            ].join(' ')}
            {...rest}
        >
            {children}
        </Comp>
    );
}
