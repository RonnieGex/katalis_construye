import Link from "next/link";

import type { GuidanceSummary } from "@/lib/guidance/summary";

interface StageGuidanceCardProps {
    guidance: GuidanceSummary;
    compact?: boolean;
    note?: string;
}

export function StageGuidanceCard({ guidance, compact = false, note }: StageGuidanceCardProps) {
    return (
        <section className={`hover-lift border border-neutral-300 bg-[var(--panel-light)] transition-all ${compact ? "p-6" : "p-8"}`}>
            <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-white bg-[#171717] p-1">map</span>
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Tu Etapa Actual</p>
            </div>
            <h2 className="text-3xl font-black text-[#171717] tracking-tight">
                {guidance.stageMeta.title}
            </h2>
            <p className="mt-3 text-base font-medium text-neutral-600">{guidance.stageMeta.description}</p>
            {note ? <p className="mt-3 text-sm font-bold text-white bg-[#171717] inline-block px-3 py-1">{note}</p> : null}

            <div className="mt-6 bg-[#171717] p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Siguiente Acción Recomendada</p>
                <p className="mt-2 text-lg font-bold text-white">{guidance.recommendation.description}</p>
                <Link href={guidance.recommendation.actionHref} className="btn-primary mt-4 inline-flex items-center gap-2">
                    {guidance.recommendation.actionLabel}
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
            </div>
        </section>
    );
}
