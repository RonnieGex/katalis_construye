export function InfographicElementosPresupuesto() {
    const elementos = [
        { icon: "📥", title: "Ingresos Proyectados", desc: "Cuánto esperas vender cada mes" },
        { icon: "📤", title: "Gastos Fijos", desc: "Renta, sueldos, servicios que no cambian" },
        { icon: "📊", title: "Gastos Variables", desc: "Materiales, comisiones, que varían con ventas" },
        { icon: "💰", title: "Utilidad Estimada", desc: "Ingresos menos todos los gastos proyectados" },
        { icon: "🔁", title: "Real vs. Planeado", desc: "Comparativo mensual para ajustar el rumbo" },
        { icon: "🎯", title: "Metas Anuales", desc: "Los objetivos que guían todo el presupuesto" },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Estructura</p>
                <h3 className="text-xl font-black text-white tracking-tight">Elementos de un Presupuesto</h3>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                {elementos.map((el, i) => (
                    <div key={el.title} className={`border p-4 ${i === 4 ? "border-[#171717] bg-neutral-50" : "border-neutral-200"}`}>
                        <div className="text-2xl mb-2">{el.icon}</div>
                        <p className="text-xs font-black uppercase tracking-wide text-neutral-800">{el.title}</p>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{el.desc}</p>
                    </div>
                ))}
            </div>

            <div className="border-t border-neutral-200 px-6 py-3 bg-neutral-50">
                <p className="text-xs text-neutral-500 text-center">
                    Un presupuesto sin seguimiento mensual no sirve de nada.
                </p>
            </div>
        </div>
    );
}
