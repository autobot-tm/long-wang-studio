'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function LandingTemplate() {
    const bgDesktop = '/images/landing-background.png';

    return (
        <section className='relative min-h-dvh w-full overflow-hidden'>
            <Image
                src={bgDesktop}
                alt=''
                fill
                priority
                sizes='100vw'
                className='object-cover object-bottom -z-10'
            />

            <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 -z-10' />

            <div className='container mx-auto px-4 py-8 md:py-12'>
                <header className='mb-8 md:mb-12'>
                    <h1 className='text-center text-3xl md:text-5xl font-semibold text-emerald-900 drop-shadow-[0_1px_0_rgba(0,0,0,0.05)]'>
                        MIỀN KÝ ỨC
                    </h1>
                    <p className='mt-3 text-center text-sm md:text-base text-neutral-700'>
                        Ngày tái ngộ đáng nhớ bên người thân yêu
                    </p>
                </header>

                <div className='mx-auto flex max-w-4xl flex-col items-center gap-4 md:gap-6'>
                    <Button size='lg' className='rounded-full px-8 shadow'>
                        Bắt đầu tạo
                    </Button>
                </div>
            </div>
        </section>
    );
}
