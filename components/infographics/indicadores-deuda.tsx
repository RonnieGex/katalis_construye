export function InfographicIndicadoresDeuda() {
    const indicadores = [
        { name: "Razón Deuda/Capital", formula: "Deuda Total / Capital", healthy: "< 2.0", warning: "> 3.0" },
        { name: "Cobertura de Intereses", formula: "EBIT / Gastos Financieros", healthy: "> 3.0x", warning: "< 1.5x" },
        { name: "Deuda/EBITDA", formula: "Deuda Neta / EBITDA", healthy: "< 3x", warning: "> 5x" },
        { name: "Ratio de Endeudamiento", formula: "Deuda / Activos Tot.", healthy: "< 50%", warning: "> 70%" },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 8</p>
                <h3 className="text-xl font-black text-white tracking-tight">Indicadores de Deuda Saludable</h3>
            </div>

            <div className="p-6">
                <div className="space-y-3">
                    {indicadores.map((ind) => (
                        <div key={ind.name} className="border border-neutral-200 p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-sm font-black text-neutral-900">{ind.name}</p>
                                    <p className="text-xs text-neutral-500 font-mono mt-0.5">{ind.formula}</p>
                                </div>
                                <div className="flex gap-3 text-right flex-shrink-0">
                                    <div className="bg-neutral-100 border border-neutral-200 px-3 py-1.5">
                                        <p className="text-[9px] font-bold uppercase text-neutral-400">Sano</p>
                                        <p className="text-xs font-black text-neutral-800">{ind.healthy}</p>
                                    </div>
                                    <div className="bg-neutral-50 border border-neutral-300 px-3 py-1.5">
                                        <p className="text-[9px] font-bold uppercase text-neutral-400">Alerta</p>
                                        <p className="text-xs font-black text-neutral-600">{ind.warning}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 bg-[#171717] px-4 py-3">
                    <p className="text-xs text-white/70 font-medium">
                        La deuda no es mala. El problema es la deuda que no puedes pagar.
                    </p>
                </div>
            </div>
        </div>
    );
}
