export function InfographicConceptosBasicos() {
    const conceptos = [
        { term: "Capital de Trabajo", def: "Activos Circulantes − Pasivos Circulantes. Lo que tienes para operar hoy." },
        { term: "EBITDA", def: "Ganancias antes de intereses, impuestos, depreciación y amortización." },
        { term: "Flujo de Caja Libre", def: "Efectivo que queda después de cubrir operación e inversiones." },
        { term: "Apalancamiento", def: "Uso de deuda para amplificar la capacidad operativa o de inversión." },
        { term: "Depreciación", def: "Distribución del costo de un activo a lo largo de su vida útil." },
        { term: "Activo vs. Pasivo", def: "Lo que tienes vs. lo que debes. La diferencia es tu patrimonio neto." },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 12</p>
                <h3 className="text-xl font-black text-white tracking-tight">Conceptos Financieros Básicos</h3>
            </div>
            <div className="divide-y divide-neutral-100">
                {conceptos.map((c, i) => (
                    <div key={c.term} className={`px-6 py-4 flex gap-4 ${i === 0 ? "bg-neutral-50" : ""}`}>
                        <div className={`w-6 h-6 flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-black ${i === 0 ? "bg-[#171717] text-white" : "bg-neutral-200 text-neutral-600"}`}>
                            {i + 1}
                        </div>
                        <div>
                            <p className="text-sm font-black text-neutral-900">{c.term}</p>
                            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{c.def}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
