import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    eslint: { ignoreDuringBuilds: true },
    allowedDevOrigins: ['localhost:3000', '172.21.208.1:3000'],
    images: {
        // Bắt buộc dùng remotePatterns nếu có port hoặc http
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'dev-note.online',
                port: '5000',
                pathname: '/uploads/**', // đúng prefix API của anh
            },
        ],
        // Optional: tối ưu thêm
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [320, 600, 768, 1024, 1280],
        imageSizes: [64, 96, 128, 256, 384],
    },
};

export default nextConfig;
