'use client';
import { Card, CardContent } from '@/components/ui/card';
import { useBackgroundAssets } from '@/hooks/useBackgroundAssets';
import { useTaggedFrames } from '@/hooks/useTaggedFrames';
import { Asset } from '@/services/api/media.service';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import SectionHeader from '../../molecules/admin/SectionHeader';

export default function AssetSection({
    title,
    type,
    onPickBg,
}: {
    title: string;
    type: 'background' | 'frame' | 'popup';
    onPickBg?: (u: string) => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [selected, setSelected] = useState<string | null>(null);

    if (type === 'background') {
        const bg = useBackgroundAssets();
        const [changing, setChanging] = useState(false);
        const arr = (bg as any)?.data?.data ?? (bg as any)?.data ?? [];
        const current: Asset | undefined = arr[0];
        const currentUrl = current?.url ?? '/images/landing-background.png';
        const onUpload = async (files: FileList) => {
            const f = files?.[0];
            if (!f || changing) return;
            setChanging(true);
            const preview = URL.createObjectURL(f);
            onPickBg?.(preview);
            try {
                const prevId = current?.id;
                if (prevId) await bg.remove.mutateAsync(prevId);
                const uploaded: Asset | void = await bg.uploadNew.mutateAsync(
                    f
                );
                if ((uploaded as any)?.url) onPickBg?.((uploaded as any).url);
            } catch {
                onPickBg?.(currentUrl);
            } finally {
                setTimeout(() => URL.revokeObjectURL(preview), 1500);
                setChanging(false);
            }
        };

        const isTemp =
            currentUrl.startsWith('blob:') || currentUrl.startsWith('data:');
        return (
            <section>
                <SectionHeader
                    title={title}
                    hint='Bạn thay đổi hình background tại đây'
                    onChangeClick={() => !changing && fileRef.current?.click()}
                />
                <input
                    ref={fileRef}
                    type='file'
                    hidden
                    accept='image/*'
                    onChange={e =>
                        e.currentTarget.files && onUpload(e.currentTarget.files)
                    }
                />
                <div className='relative w-full overflow-hidden rounded-[20px] border border-[#C9B08A] bg-white/50'>
                    <div className='relative w-full pt-[25%]'>
                        <Image
                            src={currentUrl}
                            alt=''
                            fill
                            sizes='100vw'
                            className='object-cover object-center'
                            unoptimized={isTemp}
                        />
                    </div>
                </div>
            </section>
        );
    }

    const tag = type === 'popup' ? 'popup' : 'frame';
    const h = useTaggedFrames(tag);
    const data = h.data ?? [];

    const currentPublicId = useMemo(
        () => data.find((it: Asset) => it.isPublic)?.id ?? null,
        [data]
    );
    const selectedId = selected ?? currentPublicId;
    const handleSelect = async (id: string) => {
        try {
            await h.select.mutateAsync(id); // gọi API set isPublic = true
            toast.success('Đã cập nhật thành công');
        } catch (err) {
            console.error('Select error', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xoá hình này?')) return;
        await h.remove.mutateAsync(id);
        if (selected === id) setSelected(null);
    };

    return (
        <section>
            <SectionHeader
                title={title}
                hint='Thêm hình ảnh của bạn vào đây và bạn có thể tải lên tối đa 5 file'
                onChangeClick={() => {
                    if (selectedId) handleSelect(selectedId);
                }}
            />
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
                {data.map((it: Asset) => (
                    <Card
                        key={it.id}
                        className={`group relative overflow-hidden rounded-[20px] border-[#C9B08A] transition hover:ring-2 hover:ring-[#AA8143] ${
                            selectedId === it.id ? 'ring-2 ring-[#AA8143]' : ''
                        }`}
                        onClick={() => setSelected(it.id)}
                    >
                        {/* nút X xoá */}
                        <button
                            type='button'
                            aria-label='Xoá'
                            disabled={h.remove.isPending}
                            onClick={e => {
                                e.stopPropagation();
                                handleDelete(it.id);
                            }}
                            className='absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1 shadow
                                        transition hover:bg-white focus:outline-none
                                        opacity-0 group-hover:opacity-100 cursor-pointer'
                        >
                            <X size={16} />
                        </button>

                        <CardContent className='p-0'>
                            <div className='relative w-full pt-[100%]'>
                                <Image
                                    src={it.thumb ?? it.url}
                                    alt=''
                                    fill
                                    sizes='300px'
                                    className='object-cover'
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <div
                    onClick={() => fileRef.current?.click()}
                    className='flex aspect-square cursor-pointer items-center justify-center rounded-[20px] border border-[#C9B08A] bg-white/50 text-[#AA8143] hover:bg-[#AA8143]/5'
                >
                    <Plus size={32} />
                </div>

                <input
                    ref={fileRef}
                    type='file'
                    hidden
                    multiple
                    accept='image/*'
                    onChange={e =>
                        e.currentTarget.files &&
                        h.uploadMany.mutate(e.currentTarget.files)
                    }
                />
            </div>
        </section>
    );
}
