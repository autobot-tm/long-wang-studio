'use client';

import Image from 'next/image';
import { FC, useState } from 'react';
import LoginForm, { Column } from './Form';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';

const LoginColumns: Column[] = [
    {
        label: 'Tài khoản',
        placeholder: 'Email hoặc số điện thoại',
        type: 'text',
        name: 'username',
    },
    {
        label: 'Mật khẩu',
        placeholder: 'Nhập mật khẩu',
        type: 'password',
        name: 'password',
    },
];

const RegisterColumns: Column[] = [
    {
        label: 'Tài khoản',
        placeholder: 'Email hoặc số điện thoại',
        type: 'text',
        name: 'username',
    },
    {
        label: 'Mật khẩu',
        placeholder: 'Nhập mật khẩu',
        type: 'password',
        name: 'password',
    },
    {
        label: 'Nhập lại mật khẩu',
        placeholder: 'Nhập lại mật khẩu',
        type: 'password',
        name: 'confirmPassword',
    },
];

const Form = () => {
    const [isLogin, setIsLogin] = useState(true);
    return (
        <div className='flex w-full flex-col items-center gap-6'>
            <div className='w-full'>
                {isLogin ? (
                    <LoginForm
                        title='Chào mừng quay trở lại!'
                        columns={LoginColumns}
                        textButton='Đăng nhập'
                    />
                ) : (
                    <LoginForm
                        title='Hãy đăng ký tài khoản'
                        columns={RegisterColumns}
                        textButton='Tạo tài khoản'
                    />
                )}
                {isLogin ? (
                    <div className='flex justify-center gap-2 items-center'>
                        <Label className='font-normal text-[12px] '>
                            Bạn chưa có tài khoản?
                        </Label>
                        <Button
                            onClick={() => setIsLogin(false)}
                            className='bg-transparent p-0 text-[12px] text-[#005841] font-semibold  hover:bg-transparent hover:text-[#005841]'
                        >
                            Đăng ký ngay
                        </Button>
                    </div>
                ) : (
                    <div className='flex justify-center gap-2 items-center'>
                        <Label className='font-normal text-[12px] '>
                            Bạn đã có tài khoản?
                        </Label>
                        <Button
                            onClick={() => setIsLogin(true)}
                            className='bg-transparent p-0 text-[12px] text-[#005841] font-semibold hover:bg-transparent hover:text-[#005841]'
                        >
                            Đăng nhập ngay
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Form;
