interface InsightGlowCardProps {
    eyebrow?: string;
    title: string;
    description?: string;
    className?: string;
}

export function InsightGlowCard({
    eyebrow = "Account Insights",
    title,
    description,
    className,
}: InsightGlowCardProps) {
    return (
        <article className={`bg-[#171717] p-8 border border-neutral-700 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 ${className ?? ""}`}>
            <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-white">auto_awesome</span>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">{eyebrow}</p>
            </div>
            <h3 className="section-title text-3xl text-white font-black tracking-tight md:text-4xl">{title}</h3>
            {description ? <p className="mt-3 max-w-xl text-base font-medium text-white/75 leading-relaxed">{description}</p> : null}
        </article>
    );
}
