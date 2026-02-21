export function InfographicCicloFlujoEfectivo() {
    const steps = [
        { num: "01", label: "Ventas", desc: "El cliente compra tu producto o servicio", color: "bg-[#171717]", textColor: "text-white" },
        { num: "02", label: "Cobro", desc: "Recibes el dinero (efectivo o transferencia)", color: "bg-neutral-700", textColor: "text-white" },
        { num: "03", label: "Operación", desc: "Pagas proveedores, sueldos y gastos", color: "bg-neutral-500", textColor: "text-white" },
        { num: "04", label: "Inventario", desc: "Repones producto para el siguiente ciclo", color: "bg-neutral-300", textColor: "text-neutral-800" },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Flujo de caja</p>
                <h3 className="text-xl font-black text-white tracking-tight">Ciclo del Flujo de Efectivo</h3>
            </div>

            <div className="p-6">
                <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute left-8 top-8 bottom-8 w-px bg-neutral-200" />

                    <div className="space-y-4">
                        {steps.map((step, i) => (
                            <div key={step.num} className="flex items-start gap-4 relative">
                                <div className={`w-16 h-16 ${step.color} flex flex-col items-center justify-center flex-shrink-0 z-10`}>
                                    <span className={`text-xs font-bold ${step.textColor} opacity-60`}>{step.num}</span>
                                    <span className={`text-sm font-black ${step.textColor} tracking-tight`}>{step.label}</span>
                                </div>
                                <div className="flex-1 pt-2">
                                    <p className="text-sm text-neutral-700 leading-relaxed">{step.desc}</p>
                                    {i < steps.length - 1 && (
                                        <div className="mt-2 flex items-center gap-1 text-neutral-300">
                                            <div className="flex-1 h-px bg-neutral-200" />
                                            <span className="text-xs">↓</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Loop indicator */}
                <div className="mt-5 border border-dashed border-neutral-300 px-4 py-3">
                    <p className="text-xs text-center text-neutral-500 font-medium">
                        ↺ El ciclo se repite. Un ciclo sano = negocio vivo.
                    </p>
                </div>
            </div>
        </div>
    );
}
