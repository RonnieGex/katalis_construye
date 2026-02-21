"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
 { href: "/", label: "Inicio" },
 { href: "/learn", label: "Ruta" },
 { href: "/tools", label: "Herramientas" },
 { href: "/library", label: "Biblioteca" },
 { href: "/settings", label: "Ajustes" },
];

export function AppNav() {
 const pathname = usePathname();

 return (
 <nav className="hidden md:flex flex-wrap items-center gap-2 p-1.5 bg-[var(--panel-soft)] border border-[var(--stroke)] shadow-sm" aria-label="Navegacion principal">
 {LINKS.map((link) => {
 const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}`));
 return (
 <Link
 key={link.href}
 href={link.href}
 aria-current={active ? "page" : undefined}
 className={`chip-nav block px-5 py-2 text-sm transition-all ${active ? "active shadow-[0_4px_12px_rgba(0,0,0,0.1)]" : "hover:bg-[rgba(0,0,0,0.05)] hover-lift"
 }`}
 >
 {link.label}
 </Link>
 );
 })}
 </nav>
 );
}
