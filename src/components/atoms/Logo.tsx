'use client';

import Image from 'next/image';

export interface LogoProps {
    width?: number;
    height?: number;
}
export default function Logo({ width = 745, height = 142 }: LogoProps) {
    return (
        <Image
            src='/images/logo.png'
            alt='Logo'
            width={width}
            height={height}
            className='inline-block'
        />
    );
}
