'use client';
import { Button } from '@/components/ui/button';

export default function SectionHeader({
    title,
    hint,
    onChangeClick,
}: {
    title: string;
    hint: string;
    onChangeClick?: () => void;
}) {
    return (
        <div className='mb-[20px] flex items-start justify-between gap-3'>
            <div>
                <h3 className='text-[28px] font-semibold'>{title}</h3>
                <p className='text-[16px] text-neutral-500'>{hint}</p>
            </div>
            <Button
                onClick={onChangeClick}
                variant='ghost'
                className='rounded-[10px] border border-[#AA8143] text-[white] hover:bg-[#AA8143] bg-[#CA9F68] h-8 px-4'
            >
                Thay đổi {title.split(' ')[0]}
            </Button>
        </div>
    );
}
