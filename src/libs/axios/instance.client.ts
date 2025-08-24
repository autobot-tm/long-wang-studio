'use client';
import axios from 'axios';
import { getSession } from 'next-auth/react';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
    timeout: 10000,
});

axiosClient.interceptors.request.use(async config => {
    const session = await getSession();
    const token = (session as any)?.accessToken;
    if (token) {
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;
