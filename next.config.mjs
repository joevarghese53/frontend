/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.flowstateproject.in",
            },
            {
                protocol: "https",
                hostname: "pub-76a6f77545ae4699ab1bd77db99183ce.r2.dev",
            },
        ],
    },
}

export default nextConfig
