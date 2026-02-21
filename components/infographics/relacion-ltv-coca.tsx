export function InfographicLtvCoca() {
    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Unit economics</p>
                <h3 className="text-xl font-black text-white tracking-tight">Relación LTV / COCA</h3>
            </div>

            <div className="p-6">
                {/* Metric cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#171717] p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">LTV</p>
                        <p className="text-3xl font-black text-white leading-none">$1,500</p>
                        <p className="text-xs text-white/50 mt-2">Valor de vida del cliente</p>
                        <p className="text-xs text-white/40 mt-1">Lo que genera en toda su relación contigo</p>
                    </div>
                    <div className="bg-neutral-100 border border-neutral-200 p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">COCA</p>
                        <p className="text-3xl font-black text-neutral-800 leading-none">$300</p>
                        <p className="text-xs text-neutral-500 mt-2">Costo de adquisición</p>
                        <p className="text-xs text-neutral-400 mt-1">Lo que cuesta conseguir un cliente nuevo</p>
                    </div>
                </div>

                {/* Ratio */}
                <div className="border-2 border-[#171717] px-5 py-4 mb-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Ratio LTV:COCA</p>
                            <p className="text-4xl font-black text-[#171717] mt-1">5:1</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-neutral-700">✓ Negocio sano</p>
                            <p className="text-xs text-neutral-400 mt-1">El mínimo recomendado es 3:1</p>
                        </div>
                    </div>
                </div>

                {/* Scale */}
                <div className="space-y-2">
                    {[
                        { label: "Crítico", range: "< 1:1", bg: "bg-neutral-200 w-[20%]", status: "Perdes dinero por cliente" },
                        { label: "Riesgo", range: "1:1 – 3:1", bg: "bg-neutral-400 w-[50%]", status: "Margen muy ajustado" },
                        { label: "Saludable", range: "3:1 – 5:1", bg: "bg-neutral-600 w-[75%]", status: "Negocio sostenible" },
                        { label: "Óptimo", range: "> 5:1", bg: "bg-[#171717] w-full", status: "Escale con confianza" },
                    ].map((s) => (
                        <div key={s.label} className="flex items-center gap-3">
                            <div className="w-20 text-right flex-shrink-0">
                                <p className="text-[10px] font-bold uppercase text-neutral-500">{s.label}</p>
                            </div>
                            <div className="flex-1 h-5 bg-neutral-100">
                                <div className={`h-full ${s.bg}`} />
                            </div>
                            <div className="w-28 flex-shrink-0">
                                <p className="text-[10px] text-neutral-500">{s.range}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
