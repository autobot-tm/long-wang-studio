'use client';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
    const handleLogout = async () => {
        signOut({ callbackUrl: '/' });
    };
    return (
        <Button
            onClick={handleLogout}
            variant='ghost'
            className='px-5 rounded-full border border-[#AA8413] text-[#AA8413] bg-[#FAF2E0] hover:bg-[#AA8413]/10'
        >
            Đăng xuất
        </Button>
    );
}
