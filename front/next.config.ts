import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  productionBrowserSourceMaps: process.env.NEXT_PUBLIC_DEBUG === "1",
};

export default nextConfig;
