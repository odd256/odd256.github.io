import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isProduction && { output: "export" as const }),
  images: {
    unoptimized: true,
  },
  basePath: process.env.PAGES_BASE_PATH || "",
};

export default nextConfig;
