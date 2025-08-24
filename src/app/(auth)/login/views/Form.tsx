// components/auth/LoginForm.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

export interface Column {
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'tel';
    name?: string;
}

interface LoginProps {
    title: string;
    columns: Column[];
    textButton: string;
    onSubmit?: (values: Record<string, string>) => void;
    showRememberMe?: boolean;
}

const LoginForm: FC<LoginProps> = ({
    title,
    columns,
    textButton,
    onSubmit,
    showRememberMe = true,
}) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values: Record<string, string> = {};
        columns.forEach(c => {
            if (c.name) {
                values[c.name] = formData.get(c.name)?.toString() || '';
            }
        });
        console.log('Form values:', values);
        onSubmit?.(values);
    };

    return (
        <div className='flex flex-col gap-12'>
            <Image
                src='/images/logo.png'
                alt='logo'
                width={1000}
                height={1000}
                className='w-full h-auto'
            />
            <form
                className='flex w-full gap-8 flex-col'
                onSubmit={handleSubmit}
            >
                <div className='flex flex-col gap-6'>
                    <p className='text-start text-[24px] font-bold text-[#005841] '>
                        {title}
                    </p>
                    <div className='flex flex-col gap-5'>
                        <div className='w-full flex flex-col gap-4'>
                            {columns.map(c => (
                                <div
                                    key={c.name}
                                    className='flex flex-col gap-2'
                                >
                                    <Label
                                        htmlFor={c.name}
                                        className='block text-sm font-medium'
                                    >
                                        {c.label}
                                    </Label>
                                    <Input
                                        id={c.name}
                                        name={c.name}
                                        type={c.type}
                                        placeholder={c.placeholder}
                                        required
                                        className='w-full rounded-lg border px-3 py-2 outline-none  placeholder:text-[#86A99B] placeholder:font-regular placeholder:text-[14px]'
                                    />
                                </div>
                            ))}
                        </div>
                        {showRememberMe && (
                            <div className='flex justify-between'>
                                <div className='flex items-center space-x-2'>
                                    <Switch id='remember' />
                                    <Label htmlFor='remember'>
                                        Nhớ tài khoản
                                    </Label>
                                </div>
                                <Link
                                    href='/forgot-password'
                                    className='text-[#005841] font-semibold text-[14px]'
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    type='submit'
                    className='w-full rounded-[10px] px-4 py-2 font-medium bg-[#005841] text-white text-[14px] font-bold border'
                >
                    {textButton}
                </button>
                <hr className='border-[0.5px] border-[#E5E5E5] ' />
            </form>
        </div>
    );
};

export default LoginForm;
