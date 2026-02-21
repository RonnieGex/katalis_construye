import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Katalis Construye",
    short_name: "Katalis Construye",
    description: "Web book interactivo para aprender finanzas y aplicarlas en tu negocio",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    lang: "es-MX",
    icons: [
      {
        src: "/brand/katalis-logo-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/brand/katalis-logo-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/brand/katalis-logo-64.png",
        sizes: "64x64",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
