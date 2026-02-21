export function InfographicMetodosValoracion() {
    const metodos = [
        {
            nombre: "Múltiplos de EBITDA",
            formula: "Valor = EBITDA × Múltiplo del sector",
            cuando: "Empresas rentables con EBITDA positivo",
            dark: true,
        },
        {
            nombre: "Flujo de Caja Descontado",
            formula: "Valor = FCL proyectado / Tasa de descuento",
            cuando: "Proyecciones sólidas a 5 años",
            dark: false,
        },
        {
            nombre: "Valor en Libros",
            formula: "Valor = Activos Totales − Pasivos",
            cuando: "Empresas con muchos activos tangibles",
            dark: false,
        },
        {
            nombre: "Comparables de mercado",
            formula: "Valor = Precio/Ventas similar al sector",
            cuando: "Existen empresas similares comparables",
            dark: false,
        },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 18</p>
                <h3 className="text-xl font-black text-white tracking-tight">Métodos de Valoración de Empresas</h3>
            </div>
            <div className="p-5 grid md:grid-cols-2 gap-3">
                {metodos.map((m) => (
                    <div key={m.nombre} className={`border p-4 ${m.dark ? "bg-[#171717] border-[#171717]" : "border-neutral-200"}`}>
                        <p className={`font-black text-sm mb-2 ${m.dark ? "text-white" : "text-neutral-900"}`}>{m.nombre}</p>
                        <p className={`text-[10px] font-mono mb-3 ${m.dark ? "text-white/50" : "text-neutral-500"}`}>{m.formula}</p>
                        <div className={`border-t pt-2 ${m.dark ? "border-white/10" : "border-neutral-100"}`}>
                            <p className={`text-[10px] font-bold uppercase ${m.dark ? "text-white/30" : "text-neutral-400"}`}>Usar cuando:</p>
                            <p className={`text-xs mt-0.5 ${m.dark ? "text-white/60" : "text-neutral-600"}`}>{m.cuando}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
