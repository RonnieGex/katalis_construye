export function InfographicMetricasSaas() {
    const metricas = [
        { name: "MRR", full: "Monthly Recurring Revenue", def: "Ingresos recurrentes mensuales garantizados por suscripciones activas" },
        { name: "ARR", full: "Annual Recurring Revenue", def: "MRR × 12. La base del negocio de suscripción anualizada" },
        { name: "Churn", full: "Tasa de cancelación", def: "% de clientes que cancelan cada mes. Debe ser < 2% mensual" },
        { name: "ARPU", full: "Avg. Revenue Per User", def: "MRR dividido entre número de clientes activos" },
        { name: "NRR", full: "Net Revenue Retention", def: "Ingresos retenidos + expansión. > 100% = crecimiento sin nuevos clientes" },
    ];

    return (
        <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-[#171717] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 15</p>
                <h3 className="text-xl font-black text-white tracking-tight">Métricas Clave para Suscripción / SaaS</h3>
            </div>
            <div className="divide-y divide-neutral-100">
                {metricas.map((m, i) => (
                    <div key={m.name} className={`px-6 py-4 flex gap-4 ${i === 0 ? "bg-neutral-50" : ""}`}>
                        <div className={`flex-shrink-0 px-2 py-1 font-black text-sm ${i === 0 ? "bg-[#171717] text-white" : "bg-neutral-100 text-neutral-800"}`}>
                            {m.name}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-neutral-700">{m.full}</p>
                            <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{m.def}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
