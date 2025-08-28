'use client';
import clsx from 'clsx';
import { Image as IconImage } from 'lucide-react';
import { useCallback, useState } from 'react';
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
    slot: Slot; // ⚠️ x,y đã nhân scale ở parent
    index: number;
    onSet: (i: number, url: string) => void;
    scale?: number; // scale toàn bộ UI uploader
}) {
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);

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
                    // kích thước gốc (px) không đổi để không méo chi tiết
                    width: slot.width,
                    height: slot.height,
                    // scale + rotate toàn khối để đồng nhất mọi thành phần
                    transform: `translateZ(0) rotate(${rot}deg) scale(${scale})`,
                    transformOrigin: 'top left',
                    willChange: 'transform',
                    zIndex: 30,
                }}
            >
                {/* hit area */}
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

                {/* nền */}
                <div className='absolute inset-0 bg-[#FFEED6] pointer-events-none' />

                {/* nét đứt */}
                <div
                    className={clsx(
                        'absolute inset-6 rounded-2xl border-2 border-dashed pointer-events-none',
                        isDragActive ? 'border-amber-600' : 'border-[#AA8143]'
                    )}
                />

                {/* nội dung */}
                <div className='relative z-10 h-full w-full flex flex-col items-center justify-center gap-3 pointer-events-none text-[#AA8143]'>
                    <div className='px-3 py-1.5 rounded-full bg-[#FFEED6] border border-[#AA8143] inline-flex items-center gap-2 text-[14px] font-medium'>
                        <IconImage className='w-4 h-4' /> Thêm 01 ảnh
                    </div>
                    <div className='text-center text-[12px] leading-4 opacity-80 font-gilroy'>
                        định dạng PNG/JPG, tối đa 2&nbsp;MB
                        <br />
                        <span className='text-[#6D6D6D]'>
                            kích thước cạnh &lt;= 1080px
                        </span>
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
            />
        </>
    );
}
