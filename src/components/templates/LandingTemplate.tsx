'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import Logo from '../atoms/Logo';

const CanvasFrame = dynamic(
    () => import('@/components/organisms/CanvasFrame'),
    { ssr: false }
);

export default function LandingTemplate() {
    const [photo1, setPhoto1] = useState<string | null>(null);
    const [photo2, setPhoto2] = useState<string | null>(null);

    return (
        <section className='relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden'>
            <Image
                src='/images/landing-background.png'
                alt='Background'
                fill
                priority
                className='object-cover -z-10'
            />

            <div className='max-w-6xl w-full px-4 py-12 flex flex-col items-center'>
                <Logo />
                <h1
                    className='text-emerald-900 text-4xl md:text-[154px] font-bold tracking-wide font-americana'
                    style={{
                        background:
                            'linear-gradient(90deg, #005841 0%, #017255 38%, #005841 75%, #017255 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    MIỀN KÝ ỨC
                </h1>
                <p className='text-[52px] text-[#AA8143] mt-2 font-gilroy max-w-[637px] text-center'>
                    Ngày tái ngộ đáng nhớ từ hoài niệm thân thương
                </p>

                <div className='mt-10 shadow-xl border border-amber-200'>
                    <CanvasFrame
                        width={800}
                        height={800}
                        frameSrc='/images/frame.png'
                        photos={[photo1, photo2]}
                        setPhoto={(i, url) => {
                            if (i === 0) setPhoto1(url);
                            if (i === 1) setPhoto2(url);
                        }}
                        slots={[
                            { x: 110, y: 230, width: 260, height: 340 },
                            { x: 450, y: 180, width: 260, height: 340 },
                        ]}
                    />
                </div>

                {/* <div className='flex gap-6 mt-8'>
                    <Button
                        className='font-semibold text-[40px] px-5 py-4 w-[100%]'
                        size={'lg'}
                    >
                        Tải xuống
                    </Button>
                    <Button
                        className='font-semibold text-[40px] px-5 py-4 w-[100%]'
                        size={'lg'}
                    >
                        Chia sẻ
                    </Button>
                </div> */}
            </div>
        </section>
    );
}
