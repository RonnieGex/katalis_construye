export function InfographicMetodosValoracion() {
  const metodos = [
    {
      nombre: "Múltiples de EBITDA",
      formula: "Valor = EBITDA x múltiplo del sector",
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
      formula: "Valor = Activos Totales - Pasivos",
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
    <div className="overflow-hidden border border-neutral-200 bg-white">
      <div className="bg-[#171717] px-6 py-4">
        <p className="text-xs font-bold uppercase tracking-widest text-white/50">Capítulo 18</p>
        <h3 className="text-xl font-black tracking-tight text-white">
          Métodos de Valoración de Empresas
        </h3>
      </div>
      <div className="grid gap-3 p-5 md:grid-cols-2">
        {metodos.map((metodo) => (
          <div
            key={metodo.nombre}
            className={`border p-4 ${metodo.dark ? "border-[#171717] bg-[#171717]" : "border-neutral-200"}`}
          >
            <p className={`mb-2 text-sm font-black ${metodo.dark ? "text-white" : "text-neutral-900"}`}>
              {metodo.nombre}
            </p>
            <p className={`mb-3 font-mono text-[10px] ${metodo.dark ? "text-white/50" : "text-neutral-500"}`}>
              {metodo.formula}
            </p>
            <div className={`border-t pt-2 ${metodo.dark ? "border-white/10" : "border-neutral-100"}`}>
              <p className={`text-[10px] font-bold uppercase ${metodo.dark ? "text-white/30" : "text-neutral-400"}`}>
                Usar cuando:
              </p>
              <p className={`mt-0.5 text-xs ${metodo.dark ? "text-white/60" : "text-neutral-600"}`}>
                {metodo.cuando}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
