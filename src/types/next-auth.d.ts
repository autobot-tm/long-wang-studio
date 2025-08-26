import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        accessToken?: string;
        role?: string;
        error?: 'RefreshAccessTokenError';
        user: { id: string } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId?: string;
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        role?: string;
        error?: 'RefreshAccessTokenError';
    }
}
