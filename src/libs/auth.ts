import axios from 'axios';
import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

type LoginResponse = {
    success: boolean;
    data: { accessToken: string; refreshToken: string; userId: string };
};

const decodeJwt = (token: string) => {
    const json = Buffer.from(token.split('.')[1] ?? '', 'base64url').toString(
        'utf8'
    );
    return JSON.parse(json) as { exp: number; email?: string };
};

async function refreshAccessToken(token: any) {
    try {
        const { data } = await axios.post<LoginResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/refresh-token`,
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
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(creds) {
                const { data: resp } = await axios.post<LoginResponse>(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/login`,
                    creds
                );
                if (!resp.success) return null;
                const { accessToken, refreshToken, userId } = resp.data;
                const { exp, email } = decodeJwt(accessToken);
                return {
                    id: userId,
                    email,
                    accessToken,
                    refreshToken,
                    exp,
                    role: 'user',
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = (user as any).id;
                token.accessToken = (user as any).accessToken;
                token.refreshToken = (user as any).refreshToken;
                token.accessTokenExpires = ((user as any).exp as number) * 1000;
                token.role = (user as any).role ?? 'user';
                return token;
            }
            if (Date.now() < (token.accessTokenExpires as number) - 60_000)
                return token;
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user = {
                ...(session.user ?? {}),
                id: token.userId as string,
            };
            (session as any).accessToken = token.accessToken as string;
            (session as any).role = (token.role as string) ?? 'user';
            (session as any).error = token.error;
            return session;
        },
    },
};
