// components/PopupSlide.tsx (GuideDialog) — khung auto theo ảnh
'use client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type GuideDialogProps = {
    images: string[];
    captions: string[];
    title?: string;
    triggerLabel?: string;
    bgUrl?: string;
    parentSize?: { w: number; h: number }; // nhận từ ShareDialog
};

type Dim = { w: number; h: number };

export default function GuideDialog({
    images,
    captions,
    title = 'Hướng dẫn sử dụng',
    triggerLabel = 'Xem hướng dẫn',
    bgUrl = '/images/landing-background.png',
    parentSize,
}: GuideDialogProps) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const [dims, setDims] = useState<Dim[]>([]);

    // preload ảnh để lấy đúng kích thước gốc
    useEffect(() => {
        Promise.all(
            images.map(
                src =>
                    new Promise<Dim>(resolve => {
                        const i = new window.Image();
                        i.onload = () =>
                            resolve({
                                w: i.naturalWidth || 800,
                                h: i.naturalHeight || 600,
                            });
                        i.onerror = () => resolve({ w: 800, h: 600 });
                        i.src = src;
                    })
            )
        ).then(setDims);
    }, [images]);

    const size = useMemo(() => {
        if (parentSize) return parentSize;
        const vw =
            (typeof window !== 'undefined' ? window.innerWidth : 360) * 0.9;
        const vh =
            (typeof window !== 'undefined' ? window.innerHeight : 640) * 0.9;
        const s = Math.min(vw / 960, vh / 1280, 1);
        return { w: Math.round(960 * s), h: Math.round(1280 * s) };
    }, [parentSize]);

    const maxW = Math.round(size.w * 0.8); // khung tối đa chiếm 80% chiều rộng dialog

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={'ghost'}
                    size={'xl'}
                    className='text-[#AA8143]'
                >
                    {triggerLabel}
                </Button>
            </DialogTrigger>

            <DialogContent
                className='p-0 border-0 shadow-none bg-transparent w-auto max-w-none'
                centerByGrid
                showCloseButton={false}
                overlayClassName='bg-black/50 backdrop-blur-sm'
            >
                {/* Nền dialog */}
                <div
                    className='relative mx-auto'
                    style={{ width: size.w, maxWidth: '92vw' }}
                >
                    <div className='relative border border-[#AA8143] shadow-2xl overflow-hidden'>
                        <Image
                            src={bgUrl}
                            alt='BG'
                            fill
                            className='object-cover'
                            priority
                        />

                        {/* nút Close */}
                        <DialogClose asChild>
                            <button
                                aria-label='Đóng'
                                className='absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/45 z-[5]'
                            >
                                <X className='h-5 w-5' />
                            </button>
                        </DialogClose>

                        {/* Title */}
                        <div className='relative z-[2] px-4 pt-5 pb-2'>
                            <h3 className='text-center text-emerald-700 font-bold text-lg sm:text-xl font-gilroy'>
                                {title}
                            </h3>
                        </div>

                        {/* KHUNG ẢNH: khớp tỉ lệ ảnh, không ép 9:16 */}
                        <div className='relative z-[2] w-full flex justify-center pb-15'>
                            <div className='w-full flex justify-center'>
                                <div
                                    className='rounded-[16px] border border-[#AA8143] bg-white shadow-[0_6px_24px_rgba(0,0,0,.15)] overflow-hidden'
                                    style={{
                                        width: 'min(100%, ' + maxW + 'px)',
                                    }}
                                >
                                    <Swiper
                                        modules={[
                                            Navigation,
                                            Pagination,
                                            Keyboard,
                                        ]}
                                        navigation
                                        pagination={{ clickable: true }}
                                        keyboard={{ enabled: true }}
                                        autoHeight
                                        onSlideChange={s =>
                                            setActive(s.activeIndex)
                                        }
                                    >
                                        {images.map((src, i) => {
                                            const d = dims[i] || { w: 4, h: 3 };
                                            return (
                                                <SwiperSlide key={i}>
                                                    <div className='w-full flex justify-center bg-white'>
                                                        {/* width/height giữ đúng tỉ lệ, CSS scale theo chiều ngang */}
                                                        <Image
                                                            src={src}
                                                            alt={`Slide ${
                                                                i + 1
                                                            }`}
                                                            width={d.w}
                                                            height={d.h}
                                                            style={{
                                                                width: '100%',
                                                                height: 'auto',
                                                                display:
                                                                    'block',
                                                            }}
                                                            priority={i === 0}
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            );
                                        })}
                                    </Swiper>
                                </div>
                            </div>
                        </div>

                        {/* Caption theo slide */}
                        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 z-[2] w-full px-4'>
                            <p className='mx-auto max-w-[85%] text-center text-[11px] md:text-sm sm:text-xs text-[#AA8143] font-bold px-2 py-1 font-gilroy'>
                                {captions[active] ?? ''}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
