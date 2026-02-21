export function InfographicTiposInversiones() {
    const tipos = [
        { tipo: "Expansión", desc: "Abrir nuevas sucursales, mercados o canales de venta", retorno: "Alto", plazo: "Largo" },
        { tipo: "Tecnología", desc: "Software, automatización, mejora de procesos internos", retorno: "Medio-Alto", plazo: "Medio" },
        { tipo: "Capital Humano", desc: "Capacitación y retención del equipo clave", retorno: "Intangible", plazo: "Largo" },
        { tipo: "Inventario", desc: "Stock estratégico para aprovechar temporadas o descuentos", retorno: "Rápido", plazo: "Corto" },
        { tipo: "Activos Fijos", desc: "Maquinaria, equipo, bienes raíces productivos", retorno: "Estable", plazo: "Largo" },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 13</p>
                <h3 className="text-xl font-black text-white tracking-tight">Tipos de Inversiones Estratégicas</h3>
            </div>
            <div className="divide-y divide-neutral-100">
                {tipos.map((t, i) => (
                    <div key={t.tipo} className={`px-6 py-4 flex items-center gap-4 ${i === 0 ? "bg-neutral-50" : ""}`}>
                        <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center text-[10px] font-black ${i === 0 ? "bg-[#171717] text-white" : "bg-neutral-200 text-neutral-600"}`}>
                            {String(i + 1).padStart(2, "0")}
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-sm text-neutral-900">{t.tipo}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{t.desc}</p>
                        </div>
                        <div className="text-right flex-shrink-0 space-y-0.5">
                            <p className="text-[9px] text-neutral-400 uppercase font-bold">Retorno: <span className="text-neutral-700">{t.retorno}</span></p>
                            <p className="text-[9px] text-neutral-400 uppercase font-bold">Plazo: <span className="text-neutral-700">{t.plazo}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
