import type { NextConfig } from "next";

const FASTAPI_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || "http://localhost:8000";
const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_SPRING_BACKEND_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/generate-description",
        destination: `${FASTAPI_URL}/generate-description`,
      },
      {
        source: "/api/chat",
        destination: `${FASTAPI_URL}/api/chat`,
      },
      {
        source: "/api/:path*",
        destination: `${SPRING_BOOT_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;