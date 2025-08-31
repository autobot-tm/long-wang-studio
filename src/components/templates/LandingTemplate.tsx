'use client';

import { ArrowBigRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import Logo from '../atoms/Logo';
import MaskedIcon from '../atoms/MaskedIcon';
import BackgroundProvider from '../organisms/BackgroundProvider';
import ResponsiveFrame from '../organisms/ResponsiveFrame';
import { ensureUploadedUrl } from '../organisms/ShareDownloadOnce';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

const ShareDialog = dynamic(() => import('../organisms/ShareDialog'), {
    ssr: false,
    loading: () => <Spinner size={24} />,
});

type CaptureAPI = {
    capture: () => string | null;
    captureSlot: (i: number) => string | null;
    captureBlob: (opts?: {
        pixelRatio?: number;
        mimeType?: string;
        quality?: number;
    }) => Promise<Blob | null>;
};

export default function LandingTemplate() {
    const [isAction, setIsAction] = useState(false);
    const [photo1, setPhoto1] = useState<string | null>(null);
    const [photo2, setPhoto2] = useState<string | null>(null);
    const [openShare, setOpenShare] = useState(false);
    const [sharePhoto, setSharePhoto] = useState<string | null>(null);
    const [isPreparing, setIsPreparing] = useState(false);
    const apiRef = useRef<CaptureAPI | null>(null);

    const handleSetPhoto = useCallback((i: number, url: string | null) => {
        if (i === 0) setPhoto1(url);
        else if (i === 1) setPhoto2(url);
    }, []);

    async function handleOpenShare() {
        setIsPreparing(true);
        try {
            const dataUrl = apiRef.current?.capture();
            const blob = await apiRef.current?.captureBlob?.({
                pixelRatio: Math.max(window.devicePixelRatio || 2, 2),
                mimeType: 'image/jpeg',
                quality: 0.92,
            });
            if (!dataUrl || !blob) throw new Error('capture failed');

            const publicUrl = await ensureUploadedUrl(dataUrl, blob);
            setSharePhoto(publicUrl);
            setOpenShare(true);
        } catch (e) {
            console.warn('prepare share failed', e);
        } finally {
            setIsPreparing(false);
        }
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
                <Image
                    src='/images/header.png'
                    alt='header-landing'
                    width={800}
                    height={600}
                    className='object-cover'
                    priority
                />
                <p className='text-[24px] md:text-[42px] text-[#AA8143] mt-4 font-gilroy max-w-[500px] text-center leading-[1.3] md:leading-[1.15]'>
                    Ngày tái ngộ đáng nhớ từ hoài niệm thân thương
                </p>

                <div className='mt-10 shadow-xl border border-amber-200'>
                    {isAction ? (
                        <div className='relative width-[800px] height-[800px]'>
                            <ResponsiveFrame
                                frameSrc='/images/frame-section.png'
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
                            <div className='flex gap-6 relative z-20'>
                                <Button
                                    variant='cta'
                                    size='xl'
                                    textBg='var(--page-bg)'
                                    disabled={!photo1 || !photo2 || isPreparing}
                                    onClick={handleOpenShare}
                                    className='flex items-center gap-2 [touch-action:manipulation]'
                                >
                                    <span className='text-fill-pagebg !text-transparent'>
                                        {isPreparing
                                            ? 'Đang chuẩn bị…'
                                            : 'Chia sẻ'}
                                    </span>
                                    {!isPreparing && (
                                        <MaskedIcon
                                            Icon={ArrowBigRight}
                                            sizeCSS='1em'
                                            className='ml-2'
                                        />
                                    )}
                                </Button>
                            </div>

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
                            onClick={() => setIsAction(true)}
                        >
                            <span className='text-fill-pagebg !text-transparent'>
                                Bắt đầu tạo
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
