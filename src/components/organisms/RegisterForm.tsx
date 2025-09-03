'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import AuthTitle from '@/components/atoms/AuthTitle';
import ErrorText from '@/components/atoms/ErrorText';
import type { Field } from '@/components/molecules/FieldGroup';
import FieldGroupList from '@/components/molecules/FieldGroupList';
import { Button } from '@/components/ui/button';

export default function RegisterForm({
    fields = [],
    callbackUrl = '/admin',
}: {
    fields?: Field[];
    callbackUrl?: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const fd = new FormData(e.currentTarget);
        const email = String(fd.get('email') ?? '');
        const password = String(fd.get('password') ?? '');
        const confirmPassword = String(fd.get('confirmPassword') ?? '');

        if (password !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/register`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        password,
                        fullName: 'admin',
                    }),
                }
            );
            if (!res.ok) throw new Error(await res.text());

            const s = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl,
            });
            if (s?.ok) {
                router.push(s.url ?? callbackUrl);
                router.refresh();
            } else setError('Đăng ký thành công nhưng đăng nhập thất bại.');
        } catch (err: any) {
            setError('Đăng ký thất bại, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-12 w-full'>
            <Image
                src='/images/logo.png'
                alt='logo'
                width={1000}
                height={1000}
                className='w-full h-auto'
            />
            <form className='flex w-full gap-8 flex-col' onSubmit={onSubmit}>
                <div className='flex flex-col gap-6'>
                    <AuthTitle>Hãy đăng ký tài khoản</AuthTitle>
                    <FieldGroupList fields={fields} />
                    <ErrorText msg={error} />
                </div>
                <Button
                    type='submit'
                    disabled={loading}
                    className='w-full rounded-[10px] font-bold'
                >
                    {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
                </Button>
                <hr className='border-[0.5px] border-[#E5E5E5]' />
            </form>
        </div>
    );
}
