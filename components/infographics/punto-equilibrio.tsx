export function InfographicPuntoEquilibrio() {
    const bars = [
        { label: "Costos Fijos", value: 40, color: "bg-neutral-300", text: "text-neutral-600" },
        { label: "Costos Variables", value: 60, color: "bg-neutral-500", text: "text-neutral-700" },
        { label: "Ingresos", value: 85, color: "bg-[#171717]", text: "text-neutral-900" },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Concepto clave</p>
                <h3 className="text-xl font-black text-white tracking-tight">Punto de Equilibrio</h3>
            </div>

            <div className="p-6">
                {/* Bar chart visual */}
                <div className="space-y-4 mb-6">
                    {bars.map((bar) => (
                        <div key={bar.label}>
                            <div className="flex justify-between mb-1">
                                <span className={`text-xs font-bold uppercase tracking-wide ${bar.text}`}>{bar.label}</span>
                                <span className={`text-xs font-mono font-bold ${bar.text}`}>{bar.value}%</span>
                            </div>
                            <div className="h-6 bg-neutral-100 w-full">
                                <div className={`h-full ${bar.color} transition-all`} style={{ width: `${bar.value}%` }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Equilibrium line */}
                <div className="border-2 border-dashed border-[#171717] px-4 py-3 mb-6 relative">
                    <div className="absolute -top-3 left-4 bg-white px-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#171717]">Punto de equilibrio</span>
                    </div>
                    <p className="text-sm text-neutral-700 font-medium">
                        Ni ganas, ni pierdes. <strong>Ingresos = Costos Totales</strong>
                    </p>
                </div>

                {/* Three zones */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { zone: "Pérdida", desc: "Ventas < Equilibrio", bg: "bg-neutral-100", border: "border-neutral-300" },
                        { zone: "Equilibrio", desc: "Ventas = Equilibrio", bg: "bg-neutral-200", border: "border-neutral-400" },
                        { zone: "Ganancia", desc: "Ventas > Equilibrio", bg: "bg-[#171717]", border: "border-[#171717]", white: true },
                    ].map((z) => (
                        <div key={z.zone} className={`${z.bg} border ${z.border} p-3 text-center`}>
                            <p className={`text-xs font-black uppercase tracking-wide ${z.white ? "text-white" : "text-neutral-700"}`}>
                                {z.zone}
                            </p>
                            <p className={`text-[10px] mt-1 ${z.white ? "text-white/60" : "text-neutral-500"}`}>{z.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
