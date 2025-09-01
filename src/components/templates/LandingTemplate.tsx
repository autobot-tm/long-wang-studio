'use client';

import { useBackgroundAssets } from '@/hooks/useBackgroundAssets';
import { useImageReady } from '@/hooks/useImageReady';
import { ArrowBigRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Logo from '../atoms/Logo';
import MaskedIcon from '../atoms/MaskedIcon';
import BackgroundProvider from '../organisms/BackgroundProvider';
import { ensureUploadedUrl } from '../organisms/ShareDownloadOnce';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import SplashScreen from '../ui/splash-screen';

const ShareDialog = dynamic(() => import('../organisms/ShareDialog'), {
    ssr: false,
    loading: () => '',
});
const ResponsiveFrame = dynamic(() => import('../organisms/ResponsiveFrame'), {
    ssr: false,
    loading: () => (
        <div className='w-[320px] h-[320px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] flex items-center justify-center'>
            <Spinner size={32} />
        </div>
    ),
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

const DEFAULT_BG = '/images/landing-background.png';

export default function LandingTemplate() {
    const [isAction, setIsAction] = useState(false);
    const [photo1, setPhoto1] = useState<string | null>(null);
    const [photo2, setPhoto2] = useState<string | null>(null);
    const [openShare, setOpenShare] = useState(false);
    const [sharePhoto, setSharePhoto] = useState<string | null>(null);
    const [isPreparing, setIsPreparing] = useState(false);
    const [resolvedBg, setResolvedBg] = useState(DEFAULT_BG);
    const apiRef = useRef<CaptureAPI | null>(null);

    // 1) Lấy background từ API
    const bgQ = useBackgroundAssets();
    const serverBg = bgQ?.data?.data?.[0]?.url ?? null;
    const bgSrc = useMemo(() => serverBg ?? DEFAULT_BG, [serverBg]);

    // 2) Preload ảnh
    const serverReady = useImageReady(serverBg || '');
    const headerReady = useImageReady('/images/header.png');
    const previewReady = useImageReady(
        '/images/landing-page-frame-preview.png'
    );

    useEffect(() => {
        if (serverBg && serverReady) setResolvedBg(serverBg);
    }, [serverBg, serverReady]);

    // App sẵn sàng khi ảnh tĩnh đã sẵn sàng + nếu có serverBg thì chờ preload xong
    const appReady = headerReady && previewReady && (!serverBg || serverReady);

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
        } finally {
            setIsPreparing(false);
        }
    }

    return (
        <>
            {!appReady && <SplashScreen />}
            <BackgroundProvider
                as='section'
                bg={`url('${resolvedBg}')`}
                paint
                fixed
                fadeIn
                ready={appReady}
                className='relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden'
            >
                <div className='max-w-6xl w-full px-7 py-12 flex flex-col items-center'>
                    <Logo />
                    <Image
                        src='/images/header.png'
                        alt='header-landing'
                        width={600}
                        height={600}
                        className='object-cover'
                        priority
                    />
                    <p className='text-[20px] md:text-[36px] text-[#AA8143] mt-4 font-gilroy max-w-[70%] md:max-w-[40%] text-center leading-[1.15]'>
                        Ngày tái ngộ đáng nhớ từ hoài niệm thân thương
                    </p>

                    <div className='mt-5 shadow-xl border border-[#AA8143]'>
                        {isAction ? (
                            <div className='relative width-[800px] height-[800px]'>
                                <ResponsiveFrame
                                    frameSrc='/images/frame-section.png'
                                    photos={[photo1, photo2]}
                                    setPhoto={handleSetPhoto}
                                    onBind={api => (apiRef.current = api)}
                                />
                            </div>
                        ) : (
                            <Image
                                src='/images/landing-page-frame-preview.png'
                                alt='Demo'
                                width={700}
                                height={700}
                                className='object-cover'
                                priority
                            />
                        )}
                    </div>

                    <div className='flex gap-6 mt-10'>
                        {isAction ? (
                            <>
                                <div className='flex gap-6 relative z-20'>
                                    <Button
                                        variant='cta'
                                        size='xl'
                                        textBg='var(--page-bg)'
                                        disabled={
                                            !photo1 || !photo2 || isPreparing
                                        }
                                        onClick={handleOpenShare}
                                        className='flex items-center gap-2 [touch-action:manipulation]'
                                    >
                                        {isPreparing
                                            ? 'Đang chuẩn bị…'
                                            : 'Chia sẻ'}
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
                                BẮT ĐẦU TẠO
                            </Button>
                        )}
                    </div>

                    <div className='flex gap-6 md:mt-15 mt-10 w-full'>
                        <p className='md:text-[28px] text-[14px] text-center font-medium text-accent font-gilroy'>
                            Mùa trăng tròn viên mãn là khi được trở về, gặp gỡ
                            những gương mặt thân quen, gửi gắm bao điều tử tế,
                            tốt lành - chúc phúc ngày đoàn viên thêm đong đầy.
                        </p>
                    </div>
                </div>
            </BackgroundProvider>
        </>
    );
}
