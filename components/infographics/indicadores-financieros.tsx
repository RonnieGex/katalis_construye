export function InfographicIndicadoresFinancieros() {
    const grupos = [
        {
            grupo: "Liquidez",
            indicadores: [
                { name: "Razón Corriente", formula: "Activo Circulante / Pasivo Circulante", ref: "> 1.5" },
                { name: "Prueba Ácida", formula: "(AC − Inventario) / PC", ref: "> 1.0" },
            ],
        },
        {
            grupo: "Rentabilidad",
            indicadores: [
                { name: "Margen Neto", formula: "Utilidad Neta / Ingresos", ref: "> 10%" },
                { name: "ROE", formula: "Utilidad / Capital Propio", ref: "> 15%" },
            ],
        },
        {
            grupo: "Eficiencia",
            indicadores: [
                { name: "Rotación de Inventario", formula: "COGS / Inventario Prom.", ref: "> 6x" },
                { name: "Período de Cobro", formula: "CxC / (Ventas / 365)", ref: "< 45 días" },
            ],
        },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 14</p>
                <h3 className="text-xl font-black text-white tracking-tight">Indicadores Financieros Clave</h3>
            </div>
            <div className="divide-y divide-neutral-200">
                {grupos.map((g, gi) => (
                    <div key={g.grupo} className={`p-5 ${gi === 0 ? "bg-neutral-50" : ""}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${gi === 0 ? "text-[#171717]" : "text-neutral-400"}`}>{g.grupo}</p>
                        <div className="grid md:grid-cols-2 gap-2">
                            {g.indicadores.map((ind) => (
                                <div key={ind.name} className="border border-neutral-200 px-3 py-2 bg-white">
                                    <p className="text-xs font-black text-neutral-800">{ind.name}</p>
                                    <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{ind.formula}</p>
                                    <p className="text-xs font-bold text-neutral-600 mt-1">Referencia: {ind.ref}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
