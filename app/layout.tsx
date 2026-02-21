/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Link from "next/link";

import { AppNav } from "@/components/app-nav";
import { BrandLogo } from "@/components/brand-logo";
import { Footer } from "@/components/footer";
import { LeadCaptureModal } from "@/components/lead-capture-modal";
import { FlipWords } from "@/components/ui/flip-words";
import "./globals.css";

const lufga = localFont({
    variable: "--font-lufga",
    display: "swap",
    src: [
        { path: "./fonts/lufga/LufgaLight.ttf", weight: "300", style: "normal" },
        { path: "./fonts/lufga/LufgaRegular.ttf", weight: "400", style: "normal" },
        { path: "./fonts/lufga/LufgaMedium.ttf", weight: "500", style: "normal" },
        { path: "./fonts/lufga/LufgaSemiBold.ttf", weight: "600", style: "normal" },
        { path: "./fonts/lufga/LufgaBold.ttf", weight: "700", style: "normal" },
        { path: "./fonts/lufga/LufgaExtraBold.ttf", weight: "800", style: "normal" },
        { path: "./fonts/lufga/LufgaBlack.ttf", weight: "900", style: "normal" },
    ],
});

export const metadata: Metadata = {
    title: {
        default: "Katalis Construye | Finanzas Inteligentes",
        template: "%s | Katalis Construye",
    },
    description:
        "Web-book interactivo de finanzas para emprendedores. Detecta fugas, optimiza márgenes y toma el control de tu caja con herramientas reales.",
    manifest: "/manifest.webmanifest",
    metadataBase: new URL("https://construye.katalishq.com"),
    openGraph: {
        type: "website",
        locale: "es_MX",
        url: "https://construye.katalishq.com",
        title: "Katalis Construye | Finanzas para Emprendedores",
        description: "Aprende finanzas de verdad con herramientas interactivas. Sin tecnicismos, solo impacto en tu caja.",
        siteName: "Katalis Construye",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Katalis Construye - Finanzas que se entienden",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Katalis Construye | Finanzas Inteligentes",
        description: "El libro interactivo que te enseña a controlar los números de tu negocio.",
        images: ["/og-image.png"],
        creator: "@katalishq",
    },
    icons: {
        icon: [
            { url: "/brand/katalis-logo-64.png", sizes: "64x64", type: "image/png" },
            { url: "/brand/katalis-logo-192.png", sizes: "192x192", type: "image/png" },
            { url: "/brand/katalis-logo-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [{ url: "/brand/katalis-logo-180.png", sizes: "180x180", type: "image/png" }],
        shortcut: "/brand/katalis-logo-64.png",
    },
    appleWebApp: {
        capable: true,
        title: "Katalis Construye",
    },
};

export const viewport: Viewport = {
    themeColor: "#171717",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/brand/katalis-logo-64.png" sizes="64x64" type="image/png" />
                <link rel="shortcut icon" href="/brand/katalis-logo-64.png" type="image/png" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
            </head>
            <body suppressHydrationWarning className={`${lufga.variable} antialiased font-sans bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col`}>
                <LeadCaptureModal />
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black">
                    Saltar al contenido
                </a>
                <header className="sticky top-0 z-50 border-b border-[var(--stroke)] bg-[var(--background)]/90 backdrop-blur-md">
                    <div className="mx-auto flex w-full max-w-[1440px] h-20 items-center justify-between px-6 lg:px-12">
                        <Link href="/" className="flex items-center gap-1">
                            <BrandLogo size={40} className="h-10 w-10 object-cover" priority />
                            <span className="text-[var(--foreground)] text-xl font-bold tracking-tight whitespace-nowrap">Katalis</span>
                            <div className="w-[138px] sm:w-[150px] flex items-center">
                                <FlipWords
                                    words={["Crea", "Construye", "Sueña"]}
                                    className="text-xl font-bold tracking-tight text-[var(--foreground)]"
                                    duration={2500}
                                />
                            </div>
                        </Link>
                        <AppNav />
                    </div>
                </header>
                <main id="main-content" className="flex-1 w-full max-w-[1440px] mx-auto p-4 lg:p-8">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
