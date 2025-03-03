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
        config.resolve.fallback = { fs: false,ws:false };
        return config;
    },
};

export default nextConfig;
