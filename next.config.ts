import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'dev-note.online',
                port: '5000',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'dev-note.online',
                pathname: '/uploads/**',
            }, // không port
            {
                protocol: 'https',
                hostname: 'dev-note.online',
                pathname: '/uploads/**',
            }, // https
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [320, 600, 768, 1024, 1280],
        imageSizes: [64, 96, 128, 256, 384],
    },
    async rewrites() {
        return [
            { source: '/api/auth/:path*', destination: '/api/auth/:path*' },
            {
                source: '/_api/:path*',
                destination: `${process.env.API_SERVER_URL}/api/:path*`,
            },
        ];
    },
};
export default nextConfig;
