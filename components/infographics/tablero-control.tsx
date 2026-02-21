export function InfographicTableroControl() {
    const metricas = [
        { label: "Punto de Equilibrio", value: "1,000 u.", estado: "Meta", trend: "→" },
        { label: "Margen de Contribución", value: "42%", estado: "Sano", trend: "↑" },
        { label: "EBITDA", value: "$15,000", estado: "OK", trend: "↑" },
        { label: "LTV", value: "$7,680", estado: "Bueno", trend: "↑" },
        { label: "COCA", value: "$50", estado: "Óptimo", trend: "↓" },
        { label: "Ratio LTV:COCA", value: "153:1", estado: "Excelente", trend: "↑" },
        { label: "Flujo de Efectivo", value: "+$40,000", estado: "Positivo", trend: "↑" },
        { label: "Apalancamiento", value: "1.4x", estado: "Controlado", trend: "→" },
    ];

    const frecuencias = [
        { periodo: "Diario", metricas: "Efectivo disponible, ventas del día" },
        { periodo: "Semanal", metricas: "Flujo de caja, pipeline de cobros" },
        { periodo: "Mensual", metricas: "P&L completo, métricas vs. metas" },
        { periodo: "Trimestral", metricas: "Evaluación estratégica, ajuste de plan" },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Dashboard financiero</p>
                <h3 className="text-xl font-black text-white tracking-tight">Tablero de Control Financiero</h3>
            </div>

            {/* Metric cards grid */}
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-2 mb-1">
                {metricas.map((m, i) => (
                    <div key={m.label} className={`border p-3 ${i === 0 ? "bg-[#171717] border-[#171717]" : "border-neutral-200"}`}>
                        <p className={`text-[9px] font-bold uppercase tracking-wide mb-1 ${i === 0 ? "text-white/40" : "text-neutral-400"}`}>
                            {m.label}
                        </p>
                        <div className="flex items-end justify-between">
                            <p className={`text-base font-black leading-none ${i === 0 ? "text-white" : "text-neutral-900"}`}>{m.value}</p>
                            <span className={`text-sm ${i === 0 ? "text-white/50" : "text-neutral-400"}`}>{m.trend}</span>
                        </div>
                        <p className={`text-[9px] mt-1 font-bold ${i === 0 ? "text-white/30" : "text-neutral-400"}`}>{m.estado}</p>
                    </div>
                ))}
            </div>

            {/* Review frequency guide */}
            <div className="border-t border-neutral-200 px-5 pb-5 pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">Frecuencia de revisión recomendada</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {frecuencias.map((f, i) => (
                        <div key={f.periodo} className={`border px-3 py-2 ${i === 0 ? "border-neutral-900 bg-neutral-50" : "border-neutral-200"}`}>
                            <p className={`text-[10px] font-black uppercase ${i === 0 ? "text-neutral-900" : "text-neutral-500"}`}>{f.periodo}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">{f.metricas}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
