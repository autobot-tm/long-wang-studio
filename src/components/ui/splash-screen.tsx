'use client';

import Image from 'next/image';

export default function SplashScreen() {
    return (
        <div className='fixed inset-0 z-[999] grid place-items-center bg-background'>
            <div className='flex flex-col items-center gap-3'>
                <div className='grid place-items-center animate-[pulse_1.6s_ease-in-out_infinite]'>
                    <Image
                        src='/images/logo.png'
                        alt='Logo'
                        width={300}
                        height={300}
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
