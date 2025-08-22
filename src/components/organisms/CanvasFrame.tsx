'use client';

import { Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Image as KonvaImage, Layer, Stage } from 'react-konva';

interface Slot {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface CanvasFrameProps {
    width: number;
    height: number;
    frameSrc: string;
    photos: (string | null)[];
    setPhoto: (i: number, url: string | null) => void;
    slots: Slot[];
}

const CanvasFrame: React.FC<CanvasFrameProps> = ({
    width,
    height,
    frameSrc,
    photos,
    setPhoto,
    slots,
}) => {
    const stageRef = useRef<any>(null);
    const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
    const [photoImages, setPhotoImages] = useState<(HTMLImageElement | null)[]>(
        []
    );

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = frameSrc;
        img.onload = () => setFrameImage(img);
    }, [frameSrc]);

    useEffect(() => {
        const loadPhotos = async () => {
            const imgs = await Promise.all(
                photos.map(
                    src =>
                        new Promise<HTMLImageElement | null>(resolve => {
                            if (!src) return resolve(null);
                            const img = new Image();
                            img.crossOrigin = 'anonymous';
                            img.src = src;
                            img.onload = () => resolve(img);
                        })
                )
            );
            setPhotoImages(imgs);
        };
        loadPhotos();
    }, [photos]);

    return (
        <div className='relative' style={{ width, height }}>
            <Stage width={width} height={height} ref={stageRef}>
                <Layer>
                    {frameImage && (
                        <KonvaImage
                            image={frameImage}
                            width={width}
                            height={height}
                        />
                    )}

                    {slots.map((slot, i) =>
                        photoImages[i] ? (
                            <KonvaImage
                                key={i}
                                image={photoImages[i]!}
                                x={slot.x}
                                y={slot.y}
                                width={slot.width}
                                height={slot.height}
                            />
                        ) : null
                    )}
                </Layer>
            </Stage>

            {slots.map((slot, i) =>
                photos[i] ? (
                    <button
                        key={i}
                        onClick={() => setPhoto(i, null)}
                        className='absolute flex items-center justify-center w-6 h-6 
                       bg-red-600 text-white rounded-full shadow 
                       hover:bg-red-700 transition'
                        style={{
                            left: slot.x + slot.width - 12,
                            top: slot.y - 12,
                        }}
                    >
                        <X className='w-4 h-4' />
                    </button>
                ) : (
                    <label
                        key={i}
                        className='absolute flex flex-col items-center justify-center 
                       text-amber-700 bg-amber-50/80 border-2 border-dashed 
                       border-amber-400 rounded-md cursor-pointer 
                       hover:bg-amber-100 transition'
                        style={{
                            left: slot.x,
                            top: slot.y,
                            width: slot.width,
                            height: slot.height,
                        }}
                    >
                        <Upload className='w-6 h-6 mb-1' />
                        <span className='text-sm font-medium'>
                            Thêm hình {i + 1}
                        </span>
                        <span className='text-[10px] text-amber-600'>
                            (JPG, PNG)
                        </span>
                        <input
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const url = URL.createObjectURL(file);
                                    setPhoto(i, url);
                                }
                            }}
                        />
                    </label>
                )
            )}
        </div>
    );
};

export default CanvasFrame;
