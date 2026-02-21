export function InfographicFinanzasVsContabilidad() {
    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            {/* Header */}
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Comparativo</p>
                <h3 className="text-xl font-black text-white tracking-tight">Finanzas vs. Contabilidad</h3>
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-2 divide-x divide-neutral-200">
                {/* Contabilidad */}
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-8 bg-neutral-400 inline-block" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Mira hacia</p>
                            <p className="text-lg font-black text-neutral-800">Contabilidad</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            "Registra lo que YA ocurrió",
                            "Obligación legal y fiscal",
                            "Genera estados financieros",
                            "Precisión sobre el pasado",
                            "Responde: ¿Cuánto ganamos?",
                        ].map((item) => (
                            <div key={item} className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-neutral-300 rounded-full flex-shrink-0" />
                                <p className="text-sm text-neutral-600 leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 border border-neutral-200 bg-neutral-50 px-4 py-3">
                        <p className="text-xs text-neutral-500 font-medium">Metáfora</p>
                        <p className="text-sm font-bold text-neutral-800 mt-0.5">🪞 El espejo retrovisor</p>
                    </div>
                </div>

                {/* Finanzas */}
                <div className="p-6 bg-neutral-50">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-8 bg-[#171717] inline-block" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Mira hacia</p>
                            <p className="text-lg font-black text-neutral-900">Finanzas</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            "Planea lo que VENDRÁ",
                            "Herramienta de decisión",
                            "Proyecta flujos y escenarios",
                            "Estrategia sobre el futuro",
                            "Responde: ¿Qué hacemos?",
                        ].map((item) => (
                            <div key={item} className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-[#171717] rounded-full flex-shrink-0" />
                                <p className="text-sm text-neutral-700 font-medium leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 border border-neutral-300 bg-white px-4 py-3">
                        <p className="text-xs text-neutral-500 font-medium">Metáfora</p>
                        <p className="text-sm font-bold text-neutral-900 mt-0.5">🔭 El parabrisas</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-3">
                <p className="text-xs text-neutral-500 text-center font-medium">
                    Necesitas <strong className="text-neutral-800">ambas</strong> para llegar a tu destino sin accidentes.
                </p>
            </div>
        </div>
    );
}
