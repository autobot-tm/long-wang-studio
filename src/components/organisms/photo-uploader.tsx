'use client';
import { Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
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
}: {
    slot: Slot;
    index: number;
    onSet: (i: number, url: string) => void;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // chỉ dùng cho drag & drop
    const onDrop = useCallback((files: File[]) => {
        const f = files?.[0];
        if (!f) return;
        setFile(f);
        setOpen(true);
    }, []);
    const { getRootProps } = useDropzone({
        accept: { 'image/*': [] },
        multiple: false,
        noClick: true,
        onDrop,
    });

    const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setOpen(true);
        // reset để lần sau chọn lại cùng 1 file vẫn kích hoạt
        e.target.value = '';
    };

    return (
        <>
            <div
                {...getRootProps()}
                className='absolute flex flex-col items-center justify-center border-2 border-dashed
                   border-amber-400 bg-amber-50/80 rounded-[18px] text-amber-700'
                style={{
                    left: slot.x,
                    top: slot.y,
                    width: slot.width,
                    height: slot.height,
                    transform: `rotate(${slot.rotation ?? 0}deg)`,
                    transformOrigin: 'top left',
                    zIndex: 50,
                    pointerEvents: 'auto',
                }}
            >
                {/* Input click: KHÔNG display:none để iOS cho phép */}
                <input
                    ref={inputRef}
                    type='file'
                    accept='image/*'
                    onChange={pick}
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                    aria-label={`Thêm hình ${index + 1}`}
                />
                <Upload className='w-6 h-6 mb-1 pointer-events-none' />
                <span className='text-sm pointer-events-none'>
                    Thêm hình {index + 1}
                </span>
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
