import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep these packages using native Node.js streams instead of being
  // bundled by Next.js — avoids the Node 20 Web Streams / undici conflict
  // that causes "controller[kState].transformAlgorithm is not a function".
  serverExternalPackages: ["cloudinary", "mongodb"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dgzvoqywg/**",
      },
    ],
  },
};

export default nextConfig;
