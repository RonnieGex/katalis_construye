export function InfographicCategoriasFIntech() {
    const categorias = [
        { cat: "Pagos y Cobros", ejemplos: ["Mercado Pago", "Stripe", "Clip"], icon: "💳" },
        { cat: "Financiamiento", ejemplos: ["Konfio", "Fundbox", "Kubo"], icon: "💸" },
        { cat: "Contabilidad", ejemplos: ["Contpaq", "QuickBooks", "Alegra"], icon: "📊" },
        { cat: "Tesorería", ejemplos: ["Vixio", "Float", "Rho"], icon: "🏦" },
        { cat: "Nómina y RRHH", ejemplos: ["Nomilinea", "Gusto", "Worky"], icon: "👥" },
        { cat: "Análisis / BI", ejemplos: ["Tableau", "Looker", "DashThis"], icon: "🔍" },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 17</p>
                <h3 className="text-xl font-black text-white tracking-tight">Categorías de Tecnología Financiera</h3>
            </div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                {categorias.map((c, i) => (
                    <div key={c.cat} className={`border p-4 ${i === 0 ? "bg-[#171717] border-[#171717]" : "border-neutral-200"}`}>
                        <div className="text-xl mb-2">{c.icon}</div>
                        <p className={`text-xs font-black uppercase tracking-wide ${i === 0 ? "text-white" : "text-neutral-800"}`}>{c.cat}</p>
                        <div className="mt-2 space-y-0.5">
                            {c.ejemplos.map((e) => (
                                <p key={e} className={`text-[10px] ${i === 0 ? "text-white/50" : "text-neutral-400"}`}>{e}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
