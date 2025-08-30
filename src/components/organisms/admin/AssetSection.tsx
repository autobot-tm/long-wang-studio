'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
    Asset,
    MediaType,
    listAssets,
    setActiveAsset,
    uploadAsset,
} from '@/services/api/media.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import SectionHeader from '../../molecules/admin/SectionHeader';

export default function AssetSection({
    title,
    type,
    onPickBg,
}: {
    title: string;
    type: MediaType;
    onPickBg?: (url: string) => void;
}) {
    const qc = useQueryClient();
    const { data = [] } = useQuery({
        queryKey: ['assets', type],
        queryFn: () => listAssets(type),
        enabled: type !== 'background', // ❗ Background không fetch list
    });
    const [selected, setSelected] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const up = useMutation({
        mutationFn: (files: FileList) => uploadAsset(type, files),
        onSuccess: async (_, files) => {
            if (type === 'background') {
                const file = files[0];
                if (file) {
                    const url = URL.createObjectURL(file);
                    onPickBg?.(url); // đổi background ngay lập tức
                }
            } else {
                qc.invalidateQueries({ queryKey: ['assets', type] });
            }
        },
    });
    const activate = useMutation({
        mutationFn: (id: string) => setActiveAsset(type, id),
        onSuccess: (_, id) => {
            qc.invalidateQueries({ queryKey: ['assets', type] });
            const item = data.find(x => x.id === id);
            if (type === 'background' && item) onPickBg?.(item.url);
        },
    });

    const hint =
        'Thêm hình ảnh của bạn vào đây và bạn có thể tải lên tối đa 5 file';

    // Background → chỉ render banner + input
    if (type === 'background') {
        return (
            <section>
                <SectionHeader
                    title={title}
                    hint={'Bạn thay đổi hình background tại đây'}
                    onChangeClick={() => fileRef.current?.click()}
                />
                <input
                    ref={fileRef}
                    type='file'
                    hidden
                    accept='image/*'
                    onChange={e =>
                        e.currentTarget.files &&
                        up.mutate(e.currentTarget.files)
                    }
                />

                {/* Wrapper chỉ 1 border */}
                <div className='relative w-full overflow-hidden rounded-[20px] border border-[#C9B08A] bg-white/50'>
                    <div className='relative w-full pt-[25%]'>
                        <Image
                            src={'/images/landing-background.png'}
                            alt=''
                            fill
                            sizes='100vw'
                            className='object-cover object-center'
                        />
                    </div>
                </div>
            </section>
        );
    }

    // Frame / Popup → render grid
    return (
        <section>
            <SectionHeader
                title={title}
                hint={hint}
                onChangeClick={() => selected && activate.mutate(selected)}
            />
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
                {data.map((it: Asset) => (
                    <Card
                        key={it.id}
                        className={`overflow-hidden rounded-[20px] border-[#C9B08A] transition hover:ring-2 hover:ring-[#AA8143]${
                            selected === it.id ? 'ring-2 ring-[#AA8143]' : ''
                        }`}
                        onClick={() => setSelected(it.id)}
                    >
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

                {/* Placeholder “+” */}
                <div
                    onClick={() => fileRef.current?.click()}
                    className='flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#C9B08A] bg-white/50 text-[#AA8143] hover:bg-[#AA8143]/5'
                >
                    <Plus size={32} />
                </div>
                <input
                    ref={fileRef}
                    type='file'
                    hidden
                    multiple
                    onChange={e =>
                        e.currentTarget.files &&
                        up.mutate(e.currentTarget.files)
                    }
                />
            </div>
        </section>
    );
}
