import { ENV } from '@/config/env';
import axios, { AxiosError, isAxiosError } from 'axios';
import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

type LoginResponse = {
    success: boolean;
    data: { accessToken: string; refreshToken: string; userId: string };
};

const API = `${ENV.SERVER_API}/api`;
const decodeJwt = (token: string) => {
    const json = Buffer.from(token.split('.')[1] ?? '', 'base64url').toString(
        'utf8'
    );
    return JSON.parse(json) as { exp: number; email?: string };
};

async function refreshAccessToken(token: any) {
    try {
        const { data } = await axios.post<LoginResponse>(
            `${API}/Auth/refresh-token`,
            { refreshToken: token.refreshToken }
        );
        const { accessToken, refreshToken } = data.data;
        const { exp } = decodeJwt(accessToken);
        return {
            ...token,
            accessToken,
            refreshToken,
            accessTokenExpires: exp * 1000,
            error: undefined,
        };
    } catch {
        return { ...token, error: 'RefreshAccessTokenError' as const };
    }
}

export const authOptions: NextAuthOptions = {
    session: { strategy: 'jwt' },
    debug: process.env.NODE_ENV === 'development',
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(creds) {
                const url = `${API}/Auth/login`;
                try {
                    const { data: resp } = await axios.post<LoginResponse>(
                        url,
                        creds,
                        {
                            timeout: 15000,
                            validateStatus: () => true, // tự xử lý status
                        }
                    );

                    // Log nhẹ nhàng khi backend trả lỗi domain (success=false)
                    if (!resp?.success) {
                        console.warn('[Auth] domain-error', { url, resp });
                        return null;
                    }

                    const { accessToken, refreshToken, userId } = resp.data;
                    const { exp, email } = decodeJwt(accessToken) as any;
                    return {
                        id: userId,
                        email,
                        accessToken,
                        refreshToken,
                        exp,
                        role: 'user',
                    } as any;
                } catch (error) {
                    if (isAxiosError(error)) {
                        const err = error as AxiosError<any>;
                        const info = {
                            url,
                            method: err.config?.method,
                            status: err.response?.status ?? 'NO_STATUS',
                            data: err.response?.data,
                            code: err.code,
                            message: err.message,
                        };
                        console.error('[Auth] axios-error', info);

                        // Sai thông tin đăng nhập / không có quyền → trả null
                        if (
                            err.response &&
                            [401, 403].includes(err.response.status)
                        )
                            return null;

                        // Lỗi khác → ném ra để NextAuth chuyển hướng error page
                        throw new Error(`LoginFailed:${info.status}`);
                    }

                    // Non-axios error
                    console.error('[Auth] unknown-error', {
                        message: (error as Error).message,
                    });
                    throw new Error('LoginFailed:UNKNOWN');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Lúc login: map đầy đủ và clear error
            if (user) {
                token.userId = (user as any).id;
                token.accessToken = (user as any).accessToken;
                token.refreshToken = (user as any).refreshToken;
                token.accessTokenExpires = Number((user as any).exp) * 1000; // ms
                token.error = undefined;
                return token;
            }

            const exp = Number(token.accessTokenExpires ?? 0);
            // Nếu chưa có exp hợp lệ → giữ nguyên, đừng refresh bừa
            if (!exp || Number.isNaN(exp)) return token;

            // Chỉ refresh khi SẮP hết hạn (còn < 60s)
            const now = Date.now();
            if (now < exp - 60_000) return token;

            // Không có refreshToken thì không refresh
            if (!token.refreshToken) return token;

            const next = await refreshAccessToken(token);
            // Ghi log server để kiểm tra nhánh đang chạy
            if ((next as any).error) {
                console.warn('[JWT] refresh failed -> keep old token', {
                    now,
                    exp,
                    diff: exp - now,
                });
                // KHÔNG xoá accessToken hiện tại, chỉ gắn error để UI biết
                return { ...token, error: 'RefreshAccessTokenError' };
            }
            return next;
        },
        async session({ session, token }) {
            (session as any).accessToken = token.accessToken;
            (session as any).error = token.error;
            return session;
        },
    },
};
