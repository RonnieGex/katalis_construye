import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { OfflineHint } from "@/components/offline-hint";

export default function NotFound() {
 return (
 <div className="space-y-6">
 <section className="panel-soft p-6">
 <div className="mb-4 inline-flex items-center gap-3">
 <BrandLogo size={36} className="h-9 w-9 object-cover" />
 <span className="text-sm font-semibold text-neutral-700">Katalis Construye</span>
 </div>
 <h1 className="section-title text-4xl text-black">Pagina no encontrada</h1>
 <p className="mt-2 text-neutral-700">La ruta solicitada no existe.</p>
 <OfflineHint />
 </section>
 <section className="panel p-5">
 <div className="flex flex-wrap gap-2">
 <Link href="/learn" className="btn-primary">
 Ir a Ruta
 </Link>
 <Link href="/library" className="btn-secondary">
 Ir a Biblioteca
 </Link>
 </div>
 </section>
 </div>
 );
}
