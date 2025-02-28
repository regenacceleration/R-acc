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
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
        return config;
    },
};

export default nextConfig;
