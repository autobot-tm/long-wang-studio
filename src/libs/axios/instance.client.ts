'use client';

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { signIn } from 'next-auth/react';
import { tokenStore } from '../token-store';

const RAW = process.env.NEXT_PUBLIC_API_BASE || '/_api';
const API_BASE = RAW.startsWith('/') ? RAW : `/${RAW}`;

type Cfg = InternalAxiosRequestConfig & { _retry?: boolean };

export const axiosClient = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
});

axiosClient.interceptors.request.use((cfg: Cfg) => {
    const token = tokenStore.get();

    if (token) {
        cfg.headers = {
            ...(cfg.headers ?? {}),
            Authorization: `Bearer ${token}`,
        };
    }
    return cfg;
});

let signingIn: Promise<void> | null = null;
const ensureSignIn = () => {
    if (!signingIn) {
        signingIn = signIn(undefined, {
            callbackUrl: window.location.href,
        }).finally(() => (signingIn = null));
    }
    return signingIn;
};

axiosClient.interceptors.response.use(
    r => r,
    async (error: AxiosError) => {
        const status = error.response?.status;
        const cfg = (error.config || {}) as Cfg;

        const isFromApi =
            typeof cfg.baseURL === 'string' && (cfg.url ?? '').startsWith('/');

        if (status === 401 && isFromApi && !cfg._retry) {
            cfg._retry = true;
            tokenStore.set(null);
            await ensureSignIn();
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
