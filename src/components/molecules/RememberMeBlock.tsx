'use client';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

export default function RememberMeBlock() {
    return (
        <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
                <Switch id='remember' />
                <Label htmlFor='remember'>Nhớ tài khoản</Label>
            </div>
            <Link
                href='/forgot-password'
                className='text-[#005841] font-semibold text-sm'
            >
                Quên mật khẩu?
            </Link>
        </div>
    );
}
