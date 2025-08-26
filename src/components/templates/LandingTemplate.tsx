'use client';

import { ArrowBigDown, ArrowBigRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import Logo from '../atoms/Logo';

import PhotoUploader from '../organisms/photo-uploader';
import ShareDialog from '../organisms/ShareDialog';
import { Button } from '../ui/button';

const CanvasFrame = dynamic(
    () => import('@/components/organisms/CanvasFrame'),
    { ssr: false }
);

const slots = [
    {
        x: 490,
        y: 90,
        width: 280,
        height: 280,
        rotation: 8, // nghiêng nhẹ sang phải
        cornerRadius: 16,
        scale: 0.68,
    },
    {
        x: 95, // tọa độ góc trái trên
        y: 190,
        width: 280, // chiều rộng vùng ảnh
        height: 280,
        rotation: -9, // nghiêng nhẹ sang trái
        cornerRadius: 16, // bo góc nhẹ
        scale: 0.68,
    },
];

export default function LandingTemplate() {
    const [isAction, setIsAction] = useState(false);
    const [photo1, setPhoto1] = useState<string | null>(null);
    const [photo2, setPhoto2] = useState<string | null>(null);
    const [openShare, setOpenShare] = useState(false);

    const handleSetPhoto = useCallback((i: number, url: string | null) => {
        if (i === 0) setPhoto1(url);
        else if (i === 1) setPhoto2(url);
    }, []);

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
                    className='text-emerald-900 text-[54px] md:text-[154px] font-bold tracking-wide font-americana text-center'
                    style={{
                        background:
                            'linear-gradient(90deg, #005841 0%, #017255 38%, #005841 75%, #017255 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    MIỀN KÝ ỨC
                </h1>
                <p className='text-[24px] md:text-[52px] text-[#AA8143] mt-2 font-gilroy max-w-[637px] text-center'>
                    Ngày tái ngộ đáng nhớ từ hoài niệm thân thương
                </p>

                <div className='mt-10 shadow-xl border border-amber-200'>
                    {isAction ? (
                        <div
                            className='relative'
                            style={{ width: 800, height: 800 }}
                        >
                            <CanvasFrame
                                width={800}
                                height={800}
                                frameSrc='/images/frame-test.png'
                                photos={[photo1, photo2]}
                                setPhoto={(i, u) => {
                                    if (i === 0) setPhoto1(u);
                                    if (i === 1) setPhoto2(u);
                                }}
                                slots={slots}
                            />
                            {!photo1 && (
                                <PhotoUploader
                                    slot={slots[0]}
                                    index={0}
                                    onSet={handleSetPhoto}
                                />
                            )}
                            {!photo2 && (
                                <PhotoUploader
                                    slot={slots[1]}
                                    index={1}
                                    onSet={handleSetPhoto}
                                />
                            )}
                        </div>
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
                                Tải xuống
                                <ArrowBigDown className='size-10' fill='#fff' />
                            </Button>
                            <Button
                                variant='cta'
                                size='xl'
                                className='text-[40px] font-extrabold'
                                onClick={() => setOpenShare(!openShare)}
                            >
                                Chia sẻ{' '}
                                <ArrowBigRight
                                    className='size-10'
                                    fill='#fff'
                                />
                            </Button>
                            <ShareDialog
                                open={openShare}
                                onOpenChange={setOpenShare}
                            />
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
