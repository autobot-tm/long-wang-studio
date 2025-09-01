'use client';
import BackgroundProvider from '@/components/organisms/BackgroundProvider';
import { useImageReady } from '@/hooks/useImageReady';
import Image from 'next/image';
import { useState } from 'react';
import Navbar from '../molecules/admin/Navbar';
import AssetSection from '../organisms/admin/AssetSection';
import SplashScreen from '../ui/splash-screen';

export default function DashboardTemplate() {
    const [bgUrl, setBgUrl] = useState<string>('');
    const bg = bgUrl || '/images/landing-background.png';
    const bgReady = useImageReady(bg);

    return (
        <>
            {!bgReady && <SplashScreen />}
            <BackgroundProvider
                as='main'
                bg={`url('${bg}')`}
                paint
                fadeIn
                ready={bgReady}
                className='min-h-screen'
            >
                <Navbar />
                <div className='mx-auto max-w-[1284px] space-y-6 px-2 mt-[60px] pb-[60px]'>
                    <div className='flex items-center justify-center w-full mx-auto'>
                        <Image
                            src='/images/khoanh.png'
                            alt='Kho ảnh'
                            width={300}
                            height={300}
                            className='inline-block'
                        />
                    </div>
                    <div className='mt-[60px] space-y-[40px] rounded-[20px] border border-[#AA8143] bg-[#FAF2E0]/60 p-[40px] shadow-sm'>
                        <AssetSection
                            title='Background'
                            type='background'
                            onPickBg={setBgUrl}
                        />
                        <AssetSection
                            title='Khung hình hiển thị'
                            type='frame'
                        />
                        <AssetSection title='Popup hiển thị' type='popup' />
                    </div>
                </div>
            </BackgroundProvider>
        </>
    );
}
