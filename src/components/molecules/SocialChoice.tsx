import { cn } from '@/libs/utils';
import Image from 'next/image';

type Platform = 'instagram' | 'facebook' | 'tiktok';
const ICONS: Record<Platform, string> = {
    instagram: '/images/instagram.png',
    facebook: '/images/facebook.png',
    tiktok: '/images/tiktok.png',
};

export function SocialChoice({
    platform,
    selected,
    onClick,
    label,
    className,
}: {
    platform: Platform;
    selected?: boolean;
    onClick: () => void;
    label: string;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            aria-pressed={!!selected}
            className='flex flex-col items-center gap-2'
        >
            <span
                className={cn(
                    'relative rounded-full bg-white overflow-hidden',
                    'border-2 border-[#AA8143]',
                    'shadow-[inset_0_2px_4px_rgba(0,0,0,.12),0_6px_14px_rgba(0,0,0,.18)]',
                    'transition-transform duration-150',
                    'w-16 h-16 md:w-20 md:h-20',
                    className,
                    selected && 'ring-4 ring-[#B6843A] scale-105'
                )}
                aria-label={label}
                role='img'
            >
                <Image
                    src={ICONS[platform]}
                    alt={label}
                    fill
                    sizes='80px'
                    className='object-contain'
                    style={{ transform: 'scale(1.06)' }}
                />
            </span>

            <span className={cn('text-[18px]')}>{label}</span>
        </button>
    );
}
