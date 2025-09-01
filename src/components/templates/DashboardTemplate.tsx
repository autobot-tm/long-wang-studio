'use client';
import BackgroundProvider from '@/components/organisms/BackgroundProvider';
import { useBackgroundAssets } from '@/hooks/useBackgroundAssets';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import Navbar from '../molecules/admin/Navbar';
import AssetSection from '../organisms/admin/AssetSection';
import SplashScreen from '../ui/splash-screen';

const DEFAULT_BG = '/images/landing-background.png';

export default function DashboardTemplate() {
    const [localBg, setLocalBg] = useState<string | null>(null);
    const bgQ = useBackgroundAssets();
    const serverBg = bgQ?.data?.data?.[0]?.url ?? null;
    const bg = useMemo(
        () => localBg ?? serverBg ?? DEFAULT_BG,
        [localBg, serverBg]
    );

    return (
        <>
            {!bgQ.isSuccess && <SplashScreen />}
            <BackgroundProvider
                bg={`url('${bg}')`}
                fadeIn
                ready={bgQ.isSuccess}
            >
                <Navbar />
                <div className='mx-auto max-w-[1284px] space-y-6 px-7 mt-[60px] pb-[60px]'>
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
                            onPickBg={setLocalBg}
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
