'use client';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/libs/utils';
import { buildShareUrl, SharePlatform, tryNativeShare } from '@/utils/share';
import { ArrowBigRight, Check, Copy, Link2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { SocialChoice } from './SocialChoice';

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    defaultUrl?: string;
    title?: string;
    bgSrc?: string;
};

export default function ShareMiniPopup({
    open,
    onOpenChange,
    defaultUrl,
    title = 'Chọn Nền Tảng Chia Sẻ',
    bgSrc = '/images/landing-background.png',
}: Props) {
    const [platform, setPlatform] = useState<SharePlatform | null>(null);
    const [copied, setCopied] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const url = useMemo(
        () =>
            defaultUrl ??
            (typeof window !== 'undefined' ? window.location.href : ''),
        [defaultUrl]
    );

    async function copyToClipboard(text: string) {
        try {
            if (navigator.clipboard?.writeText)
                await navigator.clipboard.writeText(text);
            else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {}
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                centerByGrid
                zIndex={80}
                fitContent
                className='p-0 bg-transparent border-0 shadow-none'
            >
                <div
                    className='relative overflow-hidden rounded-2xl border-2 border-[#AA8143] shadow-[0_12px_40px_rgba(0,0,0,.28)] p-5'
                    style={{
                        width: 'min(566px, 90vw)',
                        aspectRatio: '566 / 424',
                        backgroundImage: `url(${bgSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <DialogHeader>
                        <DialogTitle className='text-center text-emerald-900 text-[32px] font-semibold font-americana mt-5'>
                            {title}
                        </DialogTitle>
                    </DialogHeader>

                    {/* --- Copy Link strip --- */}
                    <div className='mt-5'>
                        <div className='mt-2 flex items-center gap-2 bg-white/85 backdrop-blur rounded-full px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,.12)] border-1 border-[#AA8143]'>
                            <Link2 className='size-4 opacity-70' />
                            <input
                                ref={inputRef}
                                readOnly
                                value={url}
                                onClick={() => {
                                    inputRef.current?.select();
                                    copyToClipboard(url);
                                }}
                                className='flex-1 bg-transparent outline-none text-sm text-slate-800'
                            />
                            <button
                                type='button'
                                onClick={() => copyToClipboard(url)}
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold',
                                    copied
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-900 text-white hover:bg-slate-800'
                                )}
                            >
                                {copied ? (
                                    <Check className='size-4' />
                                ) : (
                                    <Copy className='size-4' />
                                )}
                                {copied ? 'Đã sao chép' : 'Copy'}
                            </button>
                        </div>
                        <div
                            className={cn(
                                'mt-1 text-center text-xs transition-opacity',
                                copied
                                    ? 'opacity-100 text-emerald-700'
                                    : 'opacity-0'
                            )}
                        >
                            Đã sao chép liên kết vào clipboard
                        </div>
                    </div>

                    <div className='mt-5 grid grid-cols-3 gap-3'>
                        <SocialChoice
                            className='w-16 md:w-20 mx-auto'
                            platform='instagram'
                            label='Instagram'
                            selected={platform === 'instagram'}
                            onClick={() => setPlatform('instagram')}
                        />
                        <SocialChoice
                            className='w-16 md:w-20 mx-auto'
                            platform='facebook'
                            label='Facebook'
                            selected={platform === 'facebook'}
                            onClick={() => setPlatform('facebook')}
                        />
                        <SocialChoice
                            className='w-16 md:w-20 mx-auto'
                            platform='tiktok'
                            label='TikTok'
                            selected={platform === 'tiktok'}
                            onClick={() => setPlatform('tiktok')}
                        />
                    </div>

                    <Button
                        variant='cta'
                        size='lg'
                        disabled={!platform}
                        onClick={async () => {
                            if (!platform) return;
                            const link = buildShareUrl(platform, url, title);
                            if (link)
                                window.open(
                                    link,
                                    '_blank',
                                    'noopener,noreferrer'
                                );
                            else if (!(await tryNativeShare(url, title)))
                                await copyToClipboard(url);
                        }}
                        className={cn(
                            'mt-5 w-full rounded-full bg-[#B6843A] py-3 text-white text-[22px] md:text-[24px] font-extrabold'
                        )}
                    >
                        Chia sẻ{' '}
                        <ArrowBigRight
                            className='ml-2 size-6'
                            fill={'#F6F2D7'}
                        />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
