import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    turbopackChunking: {
      generateComponentChunks: true,
      minComponentChunkSize: 0,
    },
  },
};

export default nextConfig;
