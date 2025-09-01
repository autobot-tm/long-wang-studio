'use client';

import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from '../auth/LogoutButton';

export default function Navbar() {
    return (
        <header className='sticky top-0 z-20 px-7'>
            <div className='bg-[#FFEED6] mx-auto flex max-w-[1284px] items-center justify-between rounded-b-[20px] border border-l-[#AA8413] border-r-[#AA8413] border-b-[#AA8413] px-6 py-3 shadow-sm'>
                <Link
                    href='/'
                    className='flex items-center gap-2 cursor-pointer'
                >
                    <Image
                        src='/images/logo.png'
                        alt='Logo'
                        width={160}
                        height={50}
                        priority
                        className='h-auto w-auto'
                    />
                </Link>

                <div className='flex items-center gap-6 font-semibold'>
                    <Link
                        href='/'
                        className='text-base font-medium text-neutral-800 hover:text-primary cursor-pointer'
                    >
                        Trang chủ
                    </Link>
                    <Link
                        href='/admin'
                        className='text-base font-medium text-neutral-800 hover:text-primary cursor-pointer'
                    >
                        Kho Frame
                    </Link>

                    <LogoutButton />
                </div>
            </div>
        </header>
    );
}
