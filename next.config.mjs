/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.flowstateproject.in",
            },
        ],
    },
}

export default nextConfig
