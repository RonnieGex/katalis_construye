export function InfographicSalvavidasFlujo() {
    const consejos = [
        {
            accion: "Cobra más rápido",
            como: "Ofrece 2% de descuento por pago anticipado",
            impacto: "Reduce días de cobro pendientes",
            icon: "⚡",
        },
        {
            accion: "Paga más lento",
            como: "Negocia 45–60 días con proveedores",
            impacto: "Más tiempo para usar el efectivo",
            icon: "🕐",
        },
        {
            accion: "Ten colchón de emergencia",
            como: "Reserva 3 meses de gastos fijos",
            impacto: "Sobrevives crisis sin préstamos de emergencia",
            icon: "🛡️",
        },
        {
            accion: "Revisión semanal",
            como: "Monitorea entradas y salidas cada lunes",
            impacto: "Detectas problemas antes de que duelan",
            icon: "📅",
        },
        {
            accion: "Proyecta escenarios",
            como: "¿Qué pasa si solo cobro el 50%?",
            impacto: "Siempre tienes un plan B listo",
            icon: "🔮",
        },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">5 tácticas esenciales</p>
                <h3 className="text-xl font-black text-white tracking-tight">Salvavidas para tu Flujo de Efectivo</h3>
            </div>

            <div className="divide-y divide-neutral-100">
                {consejos.map((c, i) => (
                    <div key={c.accion} className={`px-6 py-4 flex gap-4 ${i === 0 ? "bg-neutral-50" : ""}`}>
                        <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center text-lg ${i === 0 ? "bg-[#171717]" : "bg-neutral-100"}`}>
                            {c.icon}
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-sm text-neutral-900">{c.accion}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{c.como}</p>
                        </div>
                        <div className="flex-shrink-0 max-w-[140px] text-right">
                            <p className="text-[9px] font-bold uppercase text-neutral-400">Efecto</p>
                            <p className="text-xs text-neutral-600 mt-0.5 leading-tight">{c.impacto}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-3">
                <p className="text-xs text-center font-medium text-neutral-500">
                    Puedes sobrevivir meses sin ganancias. <strong className="text-neutral-800">No puedes sobrevivir un día sin efectivo.</strong>
                </p>
            </div>
        </div>
    );
}
