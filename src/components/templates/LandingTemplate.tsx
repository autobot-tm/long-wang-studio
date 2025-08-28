'use client';

import { ArrowBigDown, ArrowBigRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import Logo from '../atoms/Logo';

import MaskedIcon from '../atoms/MaskedIcon';
import BackgroundProvider from '../organisms/BackgroundProvider';
import ResponsiveFrame from '../organisms/ResponsiveFrame';
import ShareDialog from '../organisms/ShareDialog';
import { Button } from '../ui/button';

const slots = [
    {
        x: 88,
        y: 335,
        width: 275,
        height: 280,
        rotation: 4.2,
        cornerRadius: 0,
        scale: 0.68,
    },
    {
        x: 405,
        y: 150,
        width: 288,
        height: 285,
        rotation: -5.8,
        cornerRadius: 0,
        scale: 0.68,
    },
];

export default function LandingTemplate() {
    const [isAction, setIsAction] = useState(false);
    const [photo1, setPhoto1] = useState<string | null>(null);
    const [photo2, setPhoto2] = useState<string | null>(null);
    const [openShare, setOpenShare] = useState(false);
    const [sharePhoto, setSharePhoto] = useState<string | null>(null);
    const apiRef = useRef<{
        capture: () => string | null;
        captureSlot: (i: number) => string | null;
        captureBlob: () => Promise<Blob | null>;
    } | null>(null);

    const handleSetPhoto = useCallback((i: number, url: string | null) => {
        if (i === 0) setPhoto1(url);
        else if (i === 1) setPhoto2(url);
    }, []);

    async function handleDownload() {
        const blob = await apiRef.current?.captureBlob();
        if (!blob) return;

        const file = new File([blob], 'mien-ky-uc.png', { type: 'image/png' });

        // A. Mobile: Web Share (nếu hỗ trợ chia sẻ file)
        if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title: 'Miền Ký Ức' });
            return;
        }

        // B. Fallback: download bằng <a download>
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mien-ky-uc.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    return (
        <BackgroundProvider
            as='section'
            bg={`url('/images/landing-background.png')`}
            paint
            fixed
            className='relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden'
        >
            <div className='max-w-6xl w-full px-4 py-12 flex flex-col items-center'>
                <Logo />
                {/* <h1
                    className='text-emerald-900 text-[74px] md:text-[154px] font-bold tracking-wide font-americana text-center mt-[18px]'
                    style={{
                        background:
                            'linear-gradient(90deg, #005841 0%, #017255 38%, #005841 75%, #017255 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    MIỀN KÝ ỨC
                </h1> */}
                <Image
                    src='/images/header.png'
                    alt='header-landing'
                    width={800}
                    height={600}
                    className='object-cover'
                    priority
                />
                <p
                    className='
                                text-[24px] md:text-[42px]
                                text-[#AA8143] mt-4 font-gilroy
                                max-w-[500px] text-center
                                leading-[1.3] md:leading-[1.15]
                            '
                >
                    Ngày tái ngộ đáng nhớ từ hoài niệm thân thương
                </p>

                <div className='mt-10 shadow-xl border border-amber-200'>
                    {isAction ? (
                        <div className='relative width-[800px] height-[800px]'>
                            <ResponsiveFrame
                                frameSrc='/images/frame-section.png'
                                slots={slots}
                                photos={[photo1, photo2]}
                                setPhoto={handleSetPhoto}
                                onBind={api => {
                                    apiRef.current = api;
                                }}
                            />
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
                                textBg='var(--page-bg)'
                                disabled={!photo1 || !photo2}
                                onClick={handleDownload}
                            >
                                <span className='text-fill-pagebg !text-transparent'>
                                    Tải xuống
                                </span>
                                <MaskedIcon
                                    Icon={ArrowBigDown}
                                    sizeCSS='1em'
                                    className='ml-2'
                                />
                            </Button>
                            <Button
                                variant='cta'
                                size='xl'
                                className='flex items-center gap-2'
                                textBg='var(--page-bg)'
                                disabled={!photo1 || !photo2}
                                onClick={() => {
                                    const url = apiRef.current?.capture();

                                    if (url) {
                                        setSharePhoto(url);
                                        setOpenShare(true);
                                    }
                                }}
                            >
                                <span className='text-fill-pagebg !text-transparent'>
                                    Chia sẻ{' '}
                                </span>
                                <MaskedIcon
                                    Icon={ArrowBigRight}
                                    sizeCSS='1em'
                                    className='ml-2'
                                />
                            </Button>
                            <ShareDialog
                                photo={sharePhoto || ''}
                                open={openShare}
                                onOpenChange={setOpenShare}
                            />
                        </>
                    ) : (
                        <Button
                            variant='cta'
                            size='xl'
                            textBg='var(--page-bg)'
                            onClick={() => setIsAction(!isAction)}
                        >
                            <span className='text-fill-pagebg !text-transparent'>
                                BẮT ĐẦU TẠO
                            </span>
                        </Button>
                    )}
                </div>

                <div className='flex gap-6 md:mt-20 mt-10 w-[100%]'>
                    <p className='md:text-[28px] text-[14px] text-center font-medium text-accent font-gilroy'>
                        Mùa trăng tròn viên mãn là khi được trở về, gặp gỡ những
                        gương mặt thân quen, gửi gắm bao điều tử tế, tốt lành -
                        chúc phúc ngày đoàn viên thêm đong đầy.
                    </p>
                </div>
            </div>
        </BackgroundProvider>
    );
}
