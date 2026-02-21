"use client";

import type { GuidanceTip } from "@/lib/guidance/tips";

interface MicrotipsPanelProps {
 tips: GuidanceTip[];
 onDismiss: (tipId: string) => void;
}

export function MicrotipsPanel({ tips, onDismiss }: MicrotipsPanelProps) {
 if (tips.length === 0) {
 return null;
 }

 return (
 <section className="panel p-5">
 <div className="flex items-center justify-between gap-3">
 <h2 className="section-title text-xl text-black">Microtips</h2>
 <p className="text-xs text-neutral-500">Consejos rapidos de esta etapa</p>
 </div>
 <div className="mt-3 space-y-3">
 {tips.map((tip) => (
 <article key={tip.id} className=" border border-[var(--stroke)] bg-[var(--panel-soft)] p-4">
 <h3 className="text-sm font-semibold text-[var(--foreground)]">{tip.title}</h3>
 <p className="mt-1 text-sm text-[var(--foreground)]/70">{tip.description}</p>
 <button
 type="button"
 className="btn-secondary mt-3"
 onClick={() => onDismiss(tip.id)}
 >
 Entendido
 </button>
 </article>
 ))}
 </div>
 </section>
 );
}
