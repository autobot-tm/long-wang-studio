import type { NextConfig } from 'next';

const apiServer = process.env.API_SERVER_URL || 'http://backend:5000';
const apiHost = process.env.NEXT_PUBLIC_API_HOST || 'dev-note.online';

const nextConfig: NextConfig = {
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    images: {
        unoptimized: true, // đảm bảo ảnh trong /public hiển thị đúng
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'backend',
                port: '5000',
                pathname: '/uploads/**',
            },
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
            },
            {
                protocol: 'https',
                hostname: 'dev-note.online',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: apiHost,
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: apiHost,
                pathname: '/uploads/**',
            },
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
                destination: `${apiServer}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;
