'use client';

import { ArrowBigDown, ArrowBigRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '../atoms/Logo';
import { Button } from '../ui/button';

const CanvasFrame = dynamic(
    () => import('@/components/organisms/CanvasFrame'),
    { ssr: false }
);

export default function LandingTemplate() {
    const router = useRouter();

    const [isAction, setIsAction] = useState(false);
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
                    {isAction ? (
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
                    ) : (
                        <Image
                            src='/images/landing-page-frame-preview.png'
                            alt='Demo'
                            width={800}
                            height={800}
                            className='object-cover'
                            priority
                        />
                    )}
                </div>

                <div className='flex gap-6 mt-16'>
                    {isAction ? (
                        <>
                            <Button
                                variant='cta'
                                size='xl'
                                className='text-[40px] font-extrabold'
                            >
                                Tải xuống <ArrowBigDown className='size-10' />
                            </Button>
                            <Button
                                variant='cta'
                                size='xl'
                                className='text-[40px] font-extrabold'
                            >
                                Chia sẻ <ArrowBigRight className='size-10' />
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant='cta'
                            size='xl'
                            className='w-full text-[40px] leading-none tracking-tight font-extrabold'
                            onClick={() => setIsAction(!isAction)}
                        >
                            BẮT ĐẦU TẠO
                        </Button>
                    )}
                </div>

                <div className='flex gap-6 mt-41 w-[100%]'>
                    <p className='text-3xl text-center font-medium text-accent'>
                        Mùa trăng tròn viên mãn là khi được trở về, gặp gỡ những
                        gương mặt thân quen, gửi gắm bao điều tử tế, tốt lành -
                        chúc phúc ngày đoàn viên thêm đong đầy.
                    </p>
                </div>
            </div>
        </section>
    );
}
