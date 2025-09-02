export const ENV = {
    API_BASE: process.env.NEXT_PUBLIC_API_BASE || '/_api',
    SERVER_API: process.env.API_SERVER_URL!, // dùng cho NextAuth/route handlers
};
