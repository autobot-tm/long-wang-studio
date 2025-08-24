'use client';

import { useState } from 'react';
import LoginForm from './views';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className='grid w-full min-h-screen grid-cols-1 lg:grid-cols-3'>
            <div
                className='hidden lg:block lg:col-span-2 bg-cover bg-center bg-no-repeat'
                style={{ backgroundImage: "url('/images/login.png')" }}
            />
            <div className='flex w-full items-center justify-center p-6 lg:p-12 lg:col-span-1'>
                <div className='flex w-full max-w-md'>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
