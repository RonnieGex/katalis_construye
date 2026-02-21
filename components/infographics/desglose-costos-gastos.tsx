export function InfographicDesgloseCosgos() {
    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Estructura</p>
                <h3 className="text-xl font-black text-white tracking-tight">Desglose de Costos y Gastos</h3>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
                {/* Costos */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-[#171717] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-black">C</span>
                        </div>
                        <div>
                            <p className="font-black text-neutral-900">Costos</p>
                            <p className="text-xs text-neutral-500">Ligados a la producción</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {[
                            { name: "Materias primas", pct: "35%" },
                            { name: "Mano de obra directa", pct: "30%" },
                            { name: "Empaque y envío", pct: "15%" },
                            { name: "Costos de manufactura", pct: "20%" },
                        ].map((item) => (
                            <div key={item.name} className="flex items-center gap-3">
                                <div className="flex-1 h-7 bg-neutral-100 relative">
                                    <div className="h-full bg-neutral-700" style={{ width: item.pct }} />
                                    <span className="absolute inset-0 flex items-center px-2 text-xs font-bold text-neutral-800">
                                        {item.name}
                                    </span>
                                </div>
                                <span className="text-xs font-mono font-bold text-neutral-600 w-8 text-right">{item.pct}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 bg-neutral-50 border border-neutral-200 px-3 py-2">
                        <p className="text-xs text-neutral-500">
                            Varían <strong>con el volumen</strong> de producción
                        </p>
                    </div>
                </div>

                {/* Gastos */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-neutral-300 flex items-center justify-center flex-shrink-0">
                            <span className="text-neutral-800 text-xs font-black">G</span>
                        </div>
                        <div>
                            <p className="font-black text-neutral-900">Gastos</p>
                            <p className="text-xs text-neutral-500">Operativos e indirectos</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {[
                            { name: "Renta y servicios", pct: "40%" },
                            { name: "Sueldos administrativos", pct: "35%" },
                            { name: "Marketing", pct: "15%" },
                            { name: "Otros gastos fijos", pct: "10%" },
                        ].map((item) => (
                            <div key={item.name} className="flex items-center gap-3">
                                <div className="flex-1 h-7 bg-neutral-100 relative">
                                    <div className="h-full bg-neutral-300" style={{ width: item.pct }} />
                                    <span className="absolute inset-0 flex items-center px-2 text-xs font-bold text-neutral-700">
                                        {item.name}
                                    </span>
                                </div>
                                <span className="text-xs font-mono font-bold text-neutral-500 w-8 text-right">{item.pct}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 bg-neutral-50 border border-neutral-200 px-3 py-2">
                        <p className="text-xs text-neutral-500">
                            Son relativamente <strong>fijos</strong> independientemente de ventas
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-neutral-200 px-6 py-3 bg-neutral-50">
                <p className="text-xs text-center text-neutral-500 font-medium">
                    <strong className="text-neutral-800">Utilidad</strong> = Ingresos − Costos − Gastos
                </p>
            </div>
        </div>
    );
}
