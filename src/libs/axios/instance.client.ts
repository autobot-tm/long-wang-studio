'use client';
import axios from 'axios';
import { getSession, signIn } from 'next-auth/react';

// ✅ Không bao giờ rỗng, luôn bắt đầu bằng '/'
const RAW = process.env.NEXT_PUBLIC_API_BASE || '/_api';
const API_BASE = RAW.startsWith('/') ? RAW : `/${RAW}`;

let cachedToken: string | null = null;
let lastFetch = 0;

export const axiosClient = axios.create({ baseURL: API_BASE, timeout: 15000 });

axiosClient.interceptors.request.use(async config => {
    const now = Date.now();
    if (!cachedToken || now - lastFetch > 5000) {
        const session = await getSession();
        cachedToken = (session as any)?.accessToken ?? null;
        lastFetch = now;
    }
    if (cachedToken) {
        config.headers = {
            ...(config.headers ?? {}),
            Authorization: `Bearer ${cachedToken}`,
        };
    }
    return config;
});

axiosClient.interceptors.response.use(
    r => r,
    async err => {
        if (err?.response?.status === 401) {
            cachedToken = null;
            await signIn();
        }
        return Promise.reject(err);
    }
);

export default axiosClient;
