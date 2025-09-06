'use client';
import clsx from 'clsx';
import { Image as IconImage } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CropDialog from '../molecules/CropDialog';

type Slot = {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
};

export default function PhotoUploader({
    slot,
    index,
    onSet,
    scale = 1,
}: {
    slot: Slot;
    index: number;
    onSet: (i: number, url: string) => void;
    scale?: number;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);

    const dpr = useMemo(
        () => Math.min(2, Math.max(1, window.devicePixelRatio || 1)),
        []
    );
    const outW = Math.round(slot.width * dpr);
    const outH = Math.round(slot.height * dpr);

    const onDrop = useCallback((files: File[]) => {
        const f = files?.[0];
        if (!f) return;
        setFile(f);
        setOpen(true);
    }, []);

    const { getRootProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        multiple: false,
        noClick: true,
        onDrop,
    });

    const rot = slot.rotation ?? 0;

    return (
        <>
            <div
                {...getRootProps()}
                className='absolute'
                style={{
                    left: slot.x,
                    top: slot.y,
                    width: slot.width,
                    height: slot.height,
                    transform: `translateZ(0) rotate(${rot}deg) scale(${scale})`,
                    transformOrigin: 'top left',
                    willChange: 'transform',
                    zIndex: 30,
                }}
            >
                <input
                    type='file'
                    accept='image/*'
                    onChange={e => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setFile(f);
                        setOpen(true);
                        e.currentTarget.value = '';
                    }}
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20'
                    aria-label={`Thêm hình ${index + 1}`}
                />

                <div className='absolute inset-0 bg-[#FFEED6] pointer-events-none' />

                <div className='relative z-10 h-full w-full flex flex-col items-center justify-center gap-3 pointer-events-none text-[#AA8143] text-[8px] sm:text-[12px] lg:text-[16px] px-1.5 py-2'>
                    <div
                        className={clsx(
                            'flex flex-col items-center justify-center inset-6 rounded-2xl border-1 border-dashed pointer-events-none w-full h-full',
                            isDragActive
                                ? 'border-amber-600'
                                : 'border-[#AA8143]'
                        )}
                    >
                        <div className='mb-1 px-2.5 py-1 rounded-full bg-[#FFEED6] border border-[#AA8143] inline-flex items-center gap-2  font-medium'>
                            <IconImage className='w-3 h-3' />
                            Thêm 01 ảnh
                        </div>
                    </div>
                </div>
            </div>

            <CropDialog
                open={open}
                file={file}
                aspect={slot.width / slot.height}
                onClose={() => setOpen(false)}
                onDone={url => {
                    onSet(index, url);
                    setOpen(false);
                }}
                outWidth={outW} // NEW
                outHeight={outH}
            />
        </>
    );
}
