export function InfographicEstrategiaFinanciera() {
    const pilares = [
        { num: "01", label: "Liquidez", desc: "Siempre tener efectivo para operar. Flujo sano antes que utilidad contable." },
        { num: "02", label: "Rentabilidad", desc: "Márgenes que te dejen crecer. Cada venta debe generar excedente real." },
        { num: "03", label: "Eficiencia", desc: "Hacer más con lo mismo. Costos bajo control sin sacrificar calidad." },
        { num: "04", label: "Crecimiento", desc: "Inversión con criterio. Crecer cuando los números lo sostienen." },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 10</p>
                <h3 className="text-xl font-black text-white tracking-tight">Elementos de Estrategia Financiera</h3>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-4">
                {pilares.map((p, i) => (
                    <div key={p.label} className={`p-5 border ${i === 0 ? "bg-[#171717] border-[#171717]" : "border-neutral-200"}`}>
                        <p className={`text-4xl font-black leading-none mb-2 ${i === 0 ? "text-white/20" : "text-neutral-200"}`}>{p.num}</p>
                        <p className={`font-black text-base tracking-tight ${i === 0 ? "text-white" : "text-neutral-900"}`}>{p.label}</p>
                        <p className={`text-xs mt-2 leading-relaxed ${i === 0 ? "text-white/60" : "text-neutral-500"}`}>{p.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
