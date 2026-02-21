"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
 { href: "/", label: "Inicio" },
 { href: "/learn", label: "Ruta" },
 { href: "/tools", label: "Herramientas" },
 { href: "/library", label: "Biblioteca" },
 { href: "/settings", label: "Ajustes" },
];

export function AppNav() {
 const pathname = usePathname();
 const [mobileOpen, setMobileOpen] = useState(false);

 useEffect(() => {
  setMobileOpen(false);
 }, [pathname]);

 return (
 <div className="relative">
  <nav className="hidden md:flex flex-wrap items-center gap-2 p-1.5 bg-[var(--panel-soft)] border border-[var(--stroke)] shadow-sm" aria-label="Navegacion principal">
   {LINKS.map((link) => {
    const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}`));
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

  <div className="md:hidden">
   <button
    type="button"
    aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
    aria-expanded={mobileOpen}
    aria-controls="mobile-main-nav"
    onClick={() => setMobileOpen((open) => !open)}
    className="inline-flex h-11 w-11 items-center justify-center border border-[var(--stroke)] bg-[var(--panel-soft)] text-[var(--foreground)]"
   >
    <span className="material-symbols-outlined text-[22px]">
     {mobileOpen ? "close" : "menu"}
    </span>
   </button>

   {mobileOpen ? (
    <nav
     id="mobile-main-nav"
     aria-label="Navegacion principal movil"
     className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[220px] border border-[var(--stroke)] bg-white p-2 shadow-lg"
    >
     {LINKS.map((link) => {
      const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}`));
      return (
       <Link
        key={`mobile-${link.href}`}
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={`block px-4 py-3 text-sm font-semibold transition-colors ${active ? "bg-[#171717] text-white" : "text-[#171717] hover:bg-[var(--panel-soft)]"
         }`}
       >
        {link.label}
       </Link>
      );
     })}
    </nav>
   ) : null}
  </div>
 </div>
 );
}
