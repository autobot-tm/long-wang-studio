import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { auth, handlers, signIn, signOut } = NextAuth({
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: { username: {}, password: {} },
            async authorize(creds) {
                // TODO: replace call API fact
                if (
                    creds?.username === 'admin' &&
                    creds?.password === '123456'
                ) {
                    return {
                        id: '1',
                        name: 'Admin',
                        email: 'admin@example.com',
                        role: 'admin',
                    };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = (user as any).role ?? 'user';
            return token;
        },
        async session({ session, token }) {
            (session as any).role = token.role;
            return session;
        },
    },
});
