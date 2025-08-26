import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    eslint: { ignoreDuringBuilds: true },
    allowedDevOrigins: ['localhost:3000', '172.21.208.1:3000'],
};

export default nextConfig;
