export function InfographicFuentesFinanciamiento() {
    const fuentes = [
        {
            tipo: "Capital Propio",
            icon: "👤",
            ejemplos: ["Ahorros personales", "Reinversión de utilidades"],
            costo: "Sin interés",
            riesgo: "Bajo",
            dark: true,
        },
        {
            tipo: "Deuda Bancaria",
            icon: "🏦",
            ejemplos: ["Crédito PyME", "Línea de crédito revolvente"],
            costo: "8–25% anual",
            riesgo: "Medio",
            dark: false,
        },
        {
            tipo: "Inversionistas",
            icon: "🤝",
            ejemplos: ["Ángeles inversionistas", "Capital de riesgo (VC)"],
            costo: "Participación accionaria",
            riesgo: "Alto (control)",
            dark: false,
        },
        {
            tipo: "Gobierno / Fondos",
            icon: "🏛️",
            ejemplos: ["INADEM / NAFIN", "Fondos de innovación"],
            costo: "Bajo o sin costo",
            riesgo: "Burocrático",
            dark: false,
        },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 7</p>
                <h3 className="text-xl font-black text-white tracking-tight">Fuentes de Financiamiento</h3>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-3">
                {fuentes.map((f) => (
                    <div key={f.tipo} className={`border p-4 ${f.dark ? "bg-[#171717] border-[#171717]" : "border-neutral-200"}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{f.icon}</span>
                            <p className={`font-black text-sm tracking-tight ${f.dark ? "text-white" : "text-neutral-900"}`}>{f.tipo}</p>
                        </div>
                        <ul className="space-y-1 mb-3">
                            {f.ejemplos.map((e) => (
                                <li key={e} className={`text-xs ${f.dark ? "text-white/60" : "text-neutral-500"} flex items-center gap-1`}>
                                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${f.dark ? "bg-white/30" : "bg-neutral-300"}`} />
                                    {e}
                                </li>
                            ))}
                        </ul>
                        <div className={`flex gap-4 pt-2 border-t ${f.dark ? "border-white/10" : "border-neutral-100"}`}>
                            <div>
                                <p className={`text-[9px] font-bold uppercase ${f.dark ? "text-white/30" : "text-neutral-400"}`}>Costo</p>
                                <p className={`text-xs font-bold ${f.dark ? "text-white/70" : "text-neutral-700"}`}>{f.costo}</p>
                            </div>
                            <div>
                                <p className={`text-[9px] font-bold uppercase ${f.dark ? "text-white/30" : "text-neutral-400"}`}>Riesgo</p>
                                <p className={`text-xs font-bold ${f.dark ? "text-white/70" : "text-neutral-700"}`}>{f.riesgo}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
