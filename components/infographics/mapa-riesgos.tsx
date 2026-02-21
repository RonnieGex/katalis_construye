export function InfographicMapaRiesgos() {
    const riesgos = [
        { cat: "Liquidez", items: ["Quedarse sin efectivo", "Deudas vencidas", "Cobranza lenta"] },
        { cat: "Mercado", items: ["Caída en ventas", "Competencia agresiva", "Cambio en demanda"] },
        { cat: "Operativo", items: ["Falla en proveedores", "Pérdida de personal clave", "Costos fuera de control"] },
        { cat: "Legal/Fiscal", items: ["Incumplimiento SAT", "Contratos sin protección", "Multas y sanciones"] },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 11</p>
                <h3 className="text-xl font-black text-white tracking-tight">Mapa de Riesgos Financieros</h3>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-3">
                {riesgos.map((r, i) => (
                    <div key={r.cat} className={`border p-4 ${i === 0 ? "border-[#171717] bg-neutral-50" : "border-neutral-200"}`}>
                        <p className={`text-xs font-black uppercase tracking-widest mb-2 ${i === 0 ? "text-[#171717]" : "text-neutral-500"}`}>{r.cat}</p>
                        <ul className="space-y-1">
                            {r.items.map((item) => (
                                <li key={item} className="text-xs text-neutral-600 flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 bg-neutral-400 rounded-full flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-3">
                <p className="text-xs text-center text-neutral-500">
                    Identificar el riesgo es el primer paso para controlarlo.
                </p>
            </div>
        </div>
    );
}
