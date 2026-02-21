import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const STEPS = [
  {
    title: "Parte de cero, sin excusas",
    description:
      "Define tu moneda, tu modelo y tus parámetros en minutos. Sin plantillas vacías, sin tecnicismos innecesarios.",
  },
  {
    title: "Avanza con dirección",
    description:
      "Una ruta clara te dice qué aprender primero y por qué. Cada etapa desbloquea la siguiente.",
  },
  {
    title: "Toma decisiones reales",
    description:
      "Herramientas que funcionan con tus números. No simulaciones: tu caja, tu margen, tu equilibrio.",
  },
];

const TOOLS = [
  "Flujo de caja",
  "Costos vs Gastos",
  "Presupuesto anual",
  "Punto de equilibrio",
  "Dashboard KPI",
  "Unit Economics",
];

export default function Home() {
  return (
    <div className="space-y-12 pb-16">
      <section className="py-12 md:py-24">
        <div className="mx-auto max-w-4xl text-left">
          <div className="inline-flex items-center gap-3">
            <BrandLogo size={44} className="h-11 w-11 object-cover" priority />
            <p className="text-sm font-bold uppercase tracking-widest text-[#171717] opacity-60">
              Katalis Construye
            </p>
          </div>
          <h1 className="section-title mt-4 text-5xl leading-[0.95] text-[var(--foreground)] md:text-7xl lg:text-[5.5rem]">
            Finanzas que se entienden. Decisiones que se toman.
          </h1>
          <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-[#171717]">
            Un libro interactivo que no te deja atorado en teoría. Aprendes con
            una ruta que tiene sentido, aplicas de inmediato y ves el impacto en
            tu negocio esta semana, no en seis meses.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/onboarding" className="btn-primary px-8 py-4 text-xl">
              Empezar ahora
            </Link>
            <Link href="/learn" className="btn-secondary px-8 py-4 text-xl">
              Ver la ruta
            </Link>
          </div>
          <div className="mt-8">
            <span className="inline-flex items-center border border-[var(--stroke)] bg-[var(--panel-soft)] px-4 py-2 text-sm font-semibold text-[#171717]">
              Recurso gratuito y público para emprendedores.
            </span>
          </div>
        </div>
      </section>

      <section className="panel-soft mt-8 p-8 md:p-12">
        <div className="max-w-3xl space-y-4">
          <h2 className="section-title text-4xl text-[var(--foreground)]">Katalis Construye</h2>
          <p className="text-lg leading-relaxed text-[var(--foreground)]/80">
            No es un curso. No es un manual. Es una plataforma que te acompaña
            mientras administras tu negocio real. Cada herramienta conecta con
            lo que aprendes. Cada lectura tiene aplicación inmediata. Todo este
            contenido y sus herramientas están disponibles sin costo.
          </p>
          <p className="text-base leading-relaxed text-[var(--foreground)]/70">
            Hecha para fundadores, directores y dueños de empresa que necesitan
            criterio, no solo datos. Que quieren entender lo que miran, no solo
            reportarlo.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => {
          const isDark = index % 2 !== 0;
          return (
            <article
              key={step.title}
              className={`hover-lift flex min-h-[320px] flex-col justify-between border border-neutral-200 p-8 transition-all duration-400 ease-out lg:p-10 ${
                isDark ? "bg-[#171717] text-white" : "bg-white text-[#171717]"
              }`}
            >
              <p className="text-5xl font-bold opacity-30">{String(index + 1).padStart(2, "0")}</p>
              <div className="mt-12">
                <h3 className="mb-4 text-3xl font-bold leading-tight tracking-tighter">{step.title}</h3>
                <p className={`text-base font-medium leading-relaxed ${isDark ? "text-white/60" : "text-black/60"}`}>
                  {step.description}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="panel-soft hover-lift mt-12 p-8 md:p-12">
        <div className="mb-8 max-w-2xl">
          <h2 className="section-title text-4xl text-[var(--foreground)]">Herramientas incluidas</h2>
          <p className="mt-4 text-lg font-medium text-[var(--foreground)]/60">
            Cada una arranca con un ejemplo listo. Editas, ajustas y ya es tuya.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <div
              key={tool}
              className="group cursor-pointer border border-[var(--stroke)] bg-white px-6 py-4 text-center text-lg font-bold text-[#171717] shadow-sm transition-all hover-lift hover:bg-[#171717] hover:text-white"
            >
              {tool}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link href="/tools" className="btn-secondary">
            Ver todas las herramientas
          </Link>
        </div>
      </section>
    </div>
  );
}
