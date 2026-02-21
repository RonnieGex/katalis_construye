import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /\/(_next\/static|_next\/image|fonts|icons)\//i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "app-shell-assets",
        expiration: {
          maxEntries: 120,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /\/(learn|library|chapter|tools|settings|onboarding)(\/.*)?$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "runtime-pages",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 120,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
      },
    },
  ],
  fallbacks: {
    document: "/offline",
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
