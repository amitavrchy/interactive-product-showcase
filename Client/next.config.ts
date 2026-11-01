import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Interactive 3D / Redux app — avoid blocking prerender of client stores */
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
