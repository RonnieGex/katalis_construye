export function InfographicIndicadoresRentabilidad() {
    const metrics = [
        { name: "Margen Bruto", formula: "(Ingresos − COGS) / Ingresos", ref: "> 40%", desc: "Rentabilidad antes de gastos operativos" },
        { name: "Margen EBITDA", formula: "EBITDA / Ingresos", ref: "> 15%", desc: "Rentabilidad operativa real del negocio" },
        { name: "Margen Neto", formula: "Utilidad Neta / Ingresos", ref: "> 10%", desc: "Lo que queda después de todo" },
        { name: "ROE", formula: "Utilidad Neta / Capital", ref: "> 15%", desc: "Retorno sobre inversión de los dueños" },
        { name: "ROA", formula: "Utilidad Neta / Activos Tot.", ref: "> 5%", desc: "Eficiencia con que usas tus recursos" },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 9</p>
                <h3 className="text-xl font-black text-white tracking-tight">Indicadores de Rentabilidad</h3>
            </div>

            <div className="divide-y divide-neutral-100">
                {metrics.map((m, i) => (
                    <div key={m.name} className={`px-6 py-4 flex items-center gap-4 ${i === 0 ? "bg-neutral-50" : ""}`}>
                        <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 font-black text-sm ${i === 0 ? "bg-[#171717] text-white" : "bg-neutral-200 text-neutral-700"}`}>
                            #{i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-sm text-neutral-900">{m.name}</p>
                            <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{m.formula}</p>
                            <p className="text-xs text-neutral-500 mt-1">{m.desc}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                            <p className="text-[9px] font-bold uppercase text-neutral-400">Ref.</p>
                            <p className="text-sm font-black text-neutral-800">{m.ref}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
