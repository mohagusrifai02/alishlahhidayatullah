import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'facebook.com',
      },
    ],
  },
};

export default nextConfig;
