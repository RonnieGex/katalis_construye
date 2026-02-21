export function InfographicCicloEcommerce() {
    const etapas = [
        { num: "01", title: "Atracción", desc: "Publicidad digital, SEO, redes sociales" },
        { num: "02", title: "Conversión", desc: "Carrito, pago, checkout sin fricción" },
        { num: "03", title: "Fulfillment", desc: "Inventario, empaque, envío al cliente" },
        { num: "04", title: "Post-venta", desc: "Devoluciones, soporte, reseñas" },
        { num: "05", title: "Retención", desc: "Email, loyalty programs, recompra" },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 15</p>
                <h3 className="text-xl font-black text-white tracking-tight">Ciclo Financiero del E-commerce</h3>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-0 mb-6 overflow-hidden">
                    {etapas.map((e, i) => (
                        <div key={e.num} className="flex items-center flex-1 min-w-0">
                            <div className={`flex-1 py-3 px-2 text-center ${i === 0 ? "bg-[#171717]" : i % 2 === 0 ? "bg-neutral-700" : "bg-neutral-500"}`}>
                                <p className="text-[9px] font-bold text-white/40">{e.num}</p>
                                <p className="text-[10px] font-black text-white leading-tight">{e.title}</p>
                            </div>
                            {i < etapas.length - 1 && (
                                <div className="w-0 h-0 border-t-[20px] border-b-[20px] border-l-[8px] border-t-transparent border-b-transparent flex-shrink-0"
                                    style={{ borderLeftColor: i === 0 ? '#171717' : i % 2 === 0 ? '#404040' : '#737373' }} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-5 gap-1">
                    {etapas.map((e) => (
                        <div key={e.num} className="text-center">
                            <p className="text-[9px] text-neutral-400 leading-tight">{e.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
