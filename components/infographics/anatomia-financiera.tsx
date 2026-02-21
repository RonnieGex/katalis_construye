export function InfographicAnatonomiaFinanciera() {
    const estados = [
        {
            nombre: "Estado de Resultados",
            icon: "📈",
            alias: "P&L / Ganancias y Pérdidas",
            responde: "¿Ganaste o perdiste?",
            lineas: ["Ingresos", "− Costos", "− Gastos", "= Utilidad Neta"],
            dark: true,
        },
        {
            nombre: "Balance General",
            icon: "⚖️",
            alias: "Hoja de Balance",
            responde: "¿Cuánto tienes y cuánto debes?",
            lineas: ["Activos", "= Pasivos", "+ Capital Contable"],
            dark: false,
        },
        {
            nombre: "Flujo de Efectivo",
            icon: "💧",
            alias: "Cash Flow Statement",
            responde: "¿Cuánto efectivo entra y sale?",
            lineas: ["Flujo Operativo", "Flujo de Inversión", "Flujo de Financiamiento"],
            dark: false,
        },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Los 3 estados clave</p>
                <h3 className="text-xl font-black text-white tracking-tight">Anatomía de un Estado Financiero Saludable</h3>
            </div>

            <div className="p-6 grid md:grid-cols-3 gap-4 mb-5">
                {estados.map((e) => (
                    <div key={e.nombre} className={`border p-4 ${e.dark ? "bg-[#171717] border-[#171717]" : "border-neutral-200"}`}>
                        <div className="text-2xl mb-2">{e.icon}</div>
                        <p className={`font-black text-sm leadign-tight ${e.dark ? "text-white" : "text-neutral-900"}`}>{e.nombre}</p>
                        <p className={`text-[10px] font-bold mb-3 ${e.dark ? "text-white/40" : "text-neutral-400"}`}>{e.alias}</p>
                        <div className={`border-t pt-2 mb-3 ${e.dark ? "border-white/10" : "border-neutral-100"}`}>
                            <p className={`text-[10px] font-bold uppercase ${e.dark ? "text-white/30" : "text-neutral-400"}`}>Responde:</p>
                            <p className={`text-xs font-bold mt-0.5 ${e.dark ? "text-white/70" : "text-neutral-700"}`}>{e.responde}</p>
                        </div>
                        <ul className="space-y-0.5">
                            {e.lineas.map((l) => (
                                <li key={l} className={`text-[10px] font-mono ${e.dark ? "text-white/50" : "text-neutral-500"}`}>{l}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Health indicators */}
            <div className="border-t border-neutral-200 px-6 py-4 bg-neutral-50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Un negocio financieiramente sano muestra:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                        { label: "Utilidad positiva", check: "✓" },
                        { label: "Activos > Pasivos", check: "✓" },
                        { label: "Flujo positivo", check: "✓" },
                        { label: "Capital creciente", check: "✓" },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 border border-neutral-200 bg-white px-3 py-2">
                            <span className="text-xs font-black text-neutral-400">{item.check}</span>
                            <p className="text-xs text-neutral-600">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
