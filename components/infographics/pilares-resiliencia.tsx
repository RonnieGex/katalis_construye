export function InfographicPilaresResiliencia() {
    const pilares = [
        { num: "01", pilar: "Reserva de Emergencia", desc: "3–6 meses de gastos fijos siempre líquidos y disponibles" },
        { num: "02", pilar: "Diversificación de Ingresos", desc: "No depender de un solo cliente, producto o canal de ventas" },
        { num: "03", pilar: "Control del Endeudamiento", desc: "Deuda estructurada, con capacidad de pago demostrada" },
        { num: "04", pilar: "Gestión de Costos", desc: "Estructura de costos eficiente que sobreviva caídas de ventas" },
        { num: "05", pilar: "Visibilidad Financiera", desc: "Información en tiempo real para tomar decisiones rápidas" },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 19</p>
                <h3 className="text-xl font-black text-white tracking-tight">Pilares de la Resiliencia Financiera</h3>
            </div>
            <div className="p-6 space-y-3">
                {pilares.map((p, i) => (
                    <div key={p.pilar} className="flex items-start gap-4">
                        <div className={`w-12 h-12 flex-shrink-0 flex flex-col items-center justify-center ${i === 0 ? "bg-[#171717]" : "bg-neutral-100 border border-neutral-200"}`}>
                            <span className={`text-[9px] font-bold ${i === 0 ? "text-white/40" : "text-neutral-400"}`}>{p.num}</span>
                        </div>
                        <div className="flex-1 pt-1">
                            <p className="font-black text-sm text-neutral-900">{p.pilar}</p>
                            <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{p.desc}</p>
                        </div>
                        <div className={`w-1 self-stretch flex-shrink-0 ${i === 0 ? "bg-[#171717]" : "bg-neutral-200"}`} />
                    </div>
                ))}
            </div>
            <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-3">
                <p className="text-xs text-center text-neutral-500">
                    Una empresa resiliente no evita las crisis — las <strong className="text-neutral-800">sobrevive</strong>.
                </p>
            </div>
        </div>
    );
}
