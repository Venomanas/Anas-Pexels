import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**'
      },
    ],
    unoptimized : true,
  },
  async headers() {
    return [
      {
      source: '/:path*',
      headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
      ],
    },
    ];
  },
};

export default nextConfig;
