'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

import LoginForm from '@/components/organisms/LoginForm';
import RegisterForm from '@/components/organisms/RegisterForm';
import { Field } from '../molecules/FieldGroup';

const loginFields: Field[] = [
    {
        name: 'email',
        label: 'Tài khoản',
        placeholder: 'Email',
    },
    {
        name: 'password',
        label: 'Mật khẩu',
        type: 'password',
        placeholder: 'Nhập mật khẩu',
    },
];

const registerFields: Field[] = [
    {
        name: 'email',
        label: 'Tài khoản',
        placeholder: 'Email',
    },
    {
        name: 'password',
        label: 'Mật khẩu',
        type: 'password',
        placeholder: 'Nhập mật khẩu',
    },
    {
        name: 'confirmPassword',
        label: 'Nhập lại mật khẩu',
        type: 'password',
        placeholder: 'Nhập lại mật khẩu',
    },
];

export default function WrapperLoginForm() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className='flex w-full flex-col items-center gap-6'>
            <div className='w-full'>
                {isLogin ? (
                    <LoginForm
                        title='Chào mừng quay trở lại!'
                        fields={loginFields}
                        submitText='Đăng nhập'
                    />
                ) : (
                    <RegisterForm fields={registerFields} />
                )}

                <div className='flex justify-center gap-2 items-center'>
                    <Label className='font-normal text-[12px] '>
                        {isLogin
                            ? 'Bạn chưa có tài khoản?'
                            : 'Bạn đã có tài khoản?'}
                    </Label>
                    <Button
                        onClick={() => setIsLogin(v => !v)}
                        className='bg-transparent p-0 text-[12px] text-[#005841] font-semibold hover:bg-transparent hover:text-[#005841]'
                    >
                        {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
