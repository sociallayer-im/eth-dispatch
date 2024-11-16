import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverComponentsExternalPackages: ["@xmtp/wasm-bindings"]
};

export default nextConfig;
