import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "172.16.25.151",
    "*.ngrok-free.app",
    "*.ngrok-free.dev"
  ],
  devIndicators: false,
};

export default nextConfig;