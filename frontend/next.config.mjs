/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true
    },
    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn']
        } : false,
    },
    // Optimize production builds
    productionBrowserSourceMaps: false,
    // Reduce bundle size
    experimental: {
        optimizePackageImports: ['lucide-react', 'recharts'],
    },
};

export default nextConfig;
