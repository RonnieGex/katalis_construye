/**
 * HTML-based infographic registry for chapter illustrations.
 *
 * Each key maps to a React component that renders a styled infographic
 * matching the app's monochrome design system.
 */

import { InfographicFinanzasVsContabilidad } from "./infographics/finanzas-vs-contabilidad";
import { InfographicPuntoEquilibrio } from "./infographics/punto-equilibrio";
import { InfographicDesgloseCosgos } from "./infographics/desglose-costos-gastos";
import { InfographicCicloFlujoEfectivo } from "./infographics/ciclo-flujo-efectivo";
import { InfographicLtvCoca } from "./infographics/relacion-ltv-coca";
import { InfographicElementosPresupuesto } from "./infographics/elementos-presupuesto";
import { InfographicFuentesFinanciamiento } from "./infographics/fuentes-financiamiento";
import { InfographicIndicadoresDeuda } from "./infographics/indicadores-deuda";
import { InfographicIndicadoresRentabilidad } from "./infographics/indicadores-rentabilidad";
import { InfographicEstrategiaFinanciera } from "./infographics/estrategia-financiera";
import { InfographicMapaRiesgos } from "./infographics/mapa-riesgos";
import { InfographicConceptosBasicos } from "./infographics/conceptos-financieros-basicos";
import { InfographicTiposInversiones } from "./infographics/tipos-inversiones";
import { InfographicIndicadoresFinancieros } from "./infographics/indicadores-financieros";
import { InfographicCicloEcommerce } from "./infographics/ciclo-ecommerce";
import { InfographicMetricasSaas } from "./infographics/metricas-saas";
import { InfographicRiesgosInternacionales } from "./infographics/riesgos-internacionales";
import { InfographicCategoriasFIntech } from "./infographics/categorias-fintech";
import { InfographicMetodosValoracion } from "./infographics/metodos-valoracion";
import { InfographicPilaresResiliencia } from "./infographics/pilares-resiliencia";
// Infografías (previously image files)
import { InfographicAnatonomiaFinanciera } from "./infographics/anatomia-financiera";
import { InfographicCaminoRentabilidad } from "./infographics/camino-rentabilidad";
import { InfographicSalvavidasFlujo } from "./infographics/salvavidas-flujo-efectivo";
import { InfographicTableroControl } from "./infographics/tablero-control";

const INFOGRAPHIC_MAP: Record<string, React.ComponentType> = {
    // graficos/ — chapter diagram references
    "grafico_finanzas_vs_contabilidad.png": InfographicFinanzasVsContabilidad,
    "grafico_punto_equilibrio.png": InfographicPuntoEquilibrio,
    "grafico_desglose_costos_gastos.png": InfographicDesgloseCosgos,
    "grafico_ciclo_flujo_efectivo.png": InfographicCicloFlujoEfectivo,
    "grafico_relacion_ltv_coca.png": InfographicLtvCoca,
    "grafico_elementos_presupuesto.png": InfographicElementosPresupuesto,
    "grafico_fuentes_financiamiento.png": InfographicFuentesFinanciamiento,
    "grafico_indicadores_deuda.png": InfographicIndicadoresDeuda,
    "grafico_indicadores_rentabilidad.png": InfographicIndicadoresRentabilidad,
    "grafico_estrategia_financiera.png": InfographicEstrategiaFinanciera,
    "grafico_mapa_riesgos.png": InfographicMapaRiesgos,
    "grafico_conceptos_financieros_basicos.png": InfographicConceptosBasicos,
    "grafico_tipos_inversiones.png": InfographicTiposInversiones,
    "grafico_indicadores_financieros.png": InfographicIndicadoresFinancieros,
    "grafico_ciclo_ecommerce.png": InfographicCicloEcommerce,
    "grafico_metricas_saas.png": InfographicMetricasSaas,
    "grafico_riesgos_internacionales.png": InfographicRiesgosInternacionales,
    "grafico_categorias_fintech.png": InfographicCategoriasFIntech,
    "grafico_metodos_valoracion.png": InfographicMetodosValoracion,
    "grafico_pilares_resiliencia.png": InfographicPilaresResiliencia,
    // infografias/ — previously served as image files, now HTML components
    "infografia_anatomia_financiera.png": InfographicAnatonomiaFinanciera,
    "infografia_camino_rentabilidad.png": InfographicCaminoRentabilidad,
    "infografia_salvavidas_flujo_efectivo.png": InfographicSalvavidasFlujo,
    "infografia_tablero_control.png": InfographicTableroControl,
};

interface ChapterInfographicProps {
    src?: string;
    alt?: string;
}

export function ChapterInfographic({ src, alt }: ChapterInfographicProps) {
    if (!src) return null;

    const filename = src.split("/").pop() ?? "";
    const Component = INFOGRAPHIC_MAP[filename];

    if (!Component) {
        return (
            <figure className="my-6 border border-dashed border-neutral-300 bg-neutral-50 p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                    Ilustración
                </div>
                <div className="mt-1 text-sm text-neutral-600">{alt ?? filename}</div>
            </figure>
        );
    }

    return (
        <figure className="my-8" aria-label={alt}>
            <Component />
            {alt ? (
                <figcaption className="mt-3 text-center text-xs font-medium uppercase tracking-widest text-neutral-400">
                    {alt}
                </figcaption>
            ) : null}
        </figure>
    );
}
