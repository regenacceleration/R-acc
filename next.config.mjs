/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
                port: "",
                pathname: "**",
            },
        ],
    },
    experimental: {
        optimizePackageImports: [
            "@uniswap/widgets",
            "@dex-swap/widgets"
        ],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
                ws: false // Prevents WebSocket issues in client-side code
            };
        }
        return config;
    },
    eslint: {
        ignoreDuringBuilds: true, // Prevents ESLint from failing the build on Vercel
    },
    typescript: {
        ignoreBuildErrors: true, // Prevents TypeScript errors from failing the build
    },
};

export default nextConfig;