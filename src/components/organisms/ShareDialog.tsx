'use client';
import { Dialog } from '@/components/ui/dialog';
import { ArrowBigRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import FrameDialogContent from '../molecules/FrameDialogContent';
import ShareMiniPopup from '../molecules/ShareMiniPopup';
import { Button } from '../ui/button';

export default function ShareDialog({
    open,
    onOpenChange,
    photo,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    photo: string;
}) {
    const BASE_W = 960,
        BASE_H = 1280;
    const SLOT = { x: 124, y: 457, w: 498, h: 498, rotation: -4 };
    const pct = (v: number, base: number) => `${(v / base) * 100}%`;
    const [miniOpen, setMiniOpen] = useState(false);

    const overlay = useMemo(
        () =>
            !photo ? null : (
                <div
                    className='absolute overflow-hidden'
                    style={{
                        left: pct(SLOT.x, BASE_W),
                        top: pct(SLOT.y, BASE_H),
                        width: pct(SLOT.w, BASE_W),
                        height: pct(SLOT.h, BASE_H),
                        transform: `rotate(${SLOT.rotation}deg)`,
                        transformOrigin: 'top left',
                    }}
                >
                    <img
                        src={photo}
                        alt=''
                        className='w-full h-full object-cover'
                    />
                </div>
            ),
        [photo]
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <FrameDialogContent
                frameSrc='/images/share-frame.png'
                // baseWidth={960}
                // baseHeight={1280}
                zIndex={70}
                overlay={overlay /* như bạn đã tính pct/rotation */}
            >
                <Button
                    variant='cta'
                    size='xl'
                    className='flex items-center gap-2 text-[#F6F2D7]'
                    onClick={() => setMiniOpen(true)}
                    disabled={!photo}
                >
                    <span>Chia sẻ</span>
                    <ArrowBigRight size={40} fill='#F6F2D7' />
                </Button>
            </FrameDialogContent>

            {/* Dialog con nên cao hơn */}
            <ShareMiniPopup open={miniOpen} onOpenChange={setMiniOpen} />
        </Dialog>
    );
}
