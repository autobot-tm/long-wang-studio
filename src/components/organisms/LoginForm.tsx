'use client';
import AuthTitle from '@/components/atoms/AuthTitle';
import ErrorText from '@/components/atoms/ErrorText';
import FieldGroupList from '@/components/molecules/FieldGroupList';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Field } from '../molecules/FieldGroup';

export default function LoginForm({
    fields,
    title,
    submitText = 'Đăng nhập',
    callbackUrl = '/admin',
}: {
    fields: Field[];
    title: string;
    submitText?: string;
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
        const payload = Object.fromEntries(
            fields.map(f => [f.name, String(fd.get(f.name) ?? '')])
        );
        const res = await signIn('credentials', {
            ...payload,
            redirect: false,
            callbackUrl,
        });
        setLoading(false);
        if (res?.ok) {
            router.push(res.url ?? callbackUrl);
            router.refresh();
        } else {
            setError('Đăng nhập thất bại, vui lòng thử lại.');
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
                    <AuthTitle>{title}</AuthTitle>
                    <div className='flex flex-col gap-5'>
                        <FieldGroupList fields={fields} />
                        {/* <RememberMeBlock /> */}
                    </div>
                    <ErrorText msg={error} />
                </div>
                <Button
                    type='submit'
                    disabled={loading}
                    className='w-full rounded-[10px] font-bold'
                >
                    {loading ? 'Đang đăng nhập...' : submitText}
                </Button>
                <hr className='border-[0.5px] border-[#E5E5E5]' />
            </form>
        </div>
    );
}
