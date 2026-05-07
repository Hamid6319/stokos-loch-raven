import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "172.16.25.151",
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
     {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },

       {
        protocol: "https",
        hostname: "static.vecteezy.com",
      },




    ],
  },

  devIndicators: false,
};

export default nextConfig;