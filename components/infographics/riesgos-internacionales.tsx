export function InfographicRiesgosInternacionales() {
    const riesgos = [
        { tipo: "Cambiario", desc: "Fluctuación en tipo de cambio que afecta márgenes", mitigacion: "Cobertura (hedging), precios en USD" },
        { tipo: "Arancelario", desc: "Impuestos sobre importaciones/exportaciones", mitigacion: "Tratados de libre comercio, localización" },
        { tipo: "Regulatorio", desc: "Diferencias legales y fiscales entre países", mitigacion: "Asesoría local, estructura legal correcta" },
        { tipo: "Político", desc: "Inestabilidad, cambios de gobierno, sanciones", mitigacion: "Diversificación geográfica de clientes" },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 16</p>
                <h3 className="text-xl font-black text-white tracking-tight">Riesgos Financieros Internacionales</h3>
            </div>
            <div className="divide-y divide-neutral-100">
                {riesgos.map((r, i) => (
                    <div key={r.tipo} className={`px-6 py-4 ${i === 0 ? "bg-neutral-50" : ""}`}>
                        <div className="flex items-start gap-4">
                            <div className={`px-3 py-1 text-xs font-black flex-shrink-0 ${i === 0 ? "bg-[#171717] text-white" : "bg-neutral-200 text-neutral-700"}`}>
                                {r.tipo}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-neutral-700 font-medium">{r.desc}</p>
                                <p className="text-xs text-neutral-400 mt-1">✓ {r.mitigacion}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
