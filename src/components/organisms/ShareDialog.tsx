'use client';
import ImageDialogContent from '@/components/molecules/ImageDialogContent';
import { Dialog } from '@/components/ui/dialog';
import { ArrowBigRight } from 'lucide-react';
import { useState } from 'react';
import ShareMiniPopup from '../molecules/ShareMiniPopup';
import { Button } from '../ui/button';

type Props = { open: boolean; onOpenChange: (v: boolean) => void };
export default function ShareDialog({ open, onOpenChange }: Props) {
    const [miniOpen, setMiniOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <ImageDialogContent src='/images/share-popup.jpg'>
                <Button
                    variant='cta'
                    size='lg'
                    className='text-[24px] md:text-[32px] font-extrabold'
                    onClick={() => setMiniOpen(!miniOpen)}
                >
                    Chia sẻ <ArrowBigRight className='size-6' fill='#fff' />
                </Button>
            </ImageDialogContent>
            <ShareMiniPopup
                open={miniOpen}
                onOpenChange={() => setMiniOpen(!miniOpen)}
            />
        </Dialog>
    );
}
