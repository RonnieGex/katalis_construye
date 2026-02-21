export function InfographicCaminoRentabilidad() {
    const etapas = [
        {
            num: "01",
            titulo: "Conoce tu estructura",
            desc: "Separa costos de gastos. Saber qué es qué es el punto de partida.",
            estado: "Base",
        },
        {
            num: "02",
            titulo: "Calcula tu margen real",
            desc: "¿Cuánto te queda de cada venta después de costos directos?",
            estado: "Análisis",
        },
        {
            num: "03",
            titulo: "Encuentra el equilibrio",
            desc: "Calcula cuánto debes vender para cubrir todo. Sin sorpresas.",
            estado: "Control",
        },
        {
            num: "04",
            titulo: "Optimiza y escala",
            desc: "Reduce costos sin bajar calidad. Aumenta precio donde el mercado lo permite.",
            estado: "Crecimiento",
        },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Ruta</p>
                <h3 className="text-xl font-black text-white tracking-tight">El Camino hacia la Rentabilidad</h3>
            </div>

            <div className="p-6">
                {/* Road metaphor */}
                <div className="relative mb-6">
                    {/* Dashed connecting line */}
                    <div className="absolute left-6 top-6 bottom-6 w-px border-l-2 border-dashed border-neutral-300 -z-0" />

                    <div className="space-y-5 relative z-10">
                        {etapas.map((e, i) => (
                            <div key={e.num} className="flex gap-5 items-start">
                                {/* Step circle */}
                                <div className={`w-12 h-12 flex-shrink-0 flex flex-col items-center justify-center ${i === etapas.length - 1 ? "bg-[#171717]" : "bg-white border-2 border-neutral-300"}`}>
                                    <span className={`text-[9px] font-bold ${i === etapas.length - 1 ? "text-white/40" : "text-neutral-400"}`}>{e.num}</span>
                                </div>
                                <div className="flex-1 pt-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className={`font-black text-sm ${i === etapas.length - 1 ? "text-[#171717]" : "text-neutral-800"}`}>{e.titulo}</p>
                                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase border ${i === etapas.length - 1 ? "border-[#171717] text-[#171717]" : "border-neutral-300 text-neutral-400"}`}>{e.estado}</span>
                                    </div>
                                    <p className="text-xs text-neutral-500 leading-relaxed">{e.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Result */}
                <div className="bg-[#171717] px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Resultado</p>
                            <p className="text-lg font-black text-white mt-1">Negocio rentable y sostenible</p>
                        </div>
                        <span className="text-3xl">🏆</span>
                    </div>
                    <p className="text-xs text-white/50 mt-2">La rentabilidad no es suerte — es consecuencia de entender y controlar tus números.</p>
                </div>
            </div>
        </div>
    );
}
