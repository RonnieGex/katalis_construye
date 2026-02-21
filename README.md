# Katalis Construye - Web Book (MVP+)

Web app/PWA de aprendizaje financiero en espanol, sin login y local-first.  
Combina lectura guiada del libro + herramientas practicas con guardado local.

## Estado Actual (2026-02-21)

Este `README` incluye los cambios recientes que faltaban por documentar:

- Branding Katalis integrado en layout, landing, offline y not-found.
- Fuente local `Lufga` instalada (`next/font/local`) para soporte correcto de acentos y `n`.
- Footer completo con links de plataforma, redes y legal.
- Captura de leads con modal + endpoint local (`/api/leads`).
- Ruta guiada extendida por capas (`Base`, `Intermedia`, `Avanzada`) para capitulos 1-19.
- Indice interactivo por capas (acordeones) en la pagina del indice.
- Reemplazo de imagenes markdown por infografias HTML mapeadas por archivo.
- 18 herramientas activas (5 core + 13 avanzadas).
- Guia por pasos en herramientas (proposito, stepper, ayudas de campo, interpretacion).
- Registro de formulas con trazabilidad de fuente (capitulo, celda Excel, VBA critico).
- Persistencia y migraciones en `schemaVersion = 4`.

## Stack Tecnico

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Dexie (IndexedDB)
- Zod (validacion de schemas e import)
- React Markdown + `remark-gfm`
- Recharts
- `next-pwa`
- Vitest

## Comandos

```bash
npm run dev
npm run test
npm run lint
npm run build
npm run start
```

## Mapa De Rutas

- Contenido:
  - `/` landing principal del web book
  - `/learn` ruta guiada por etapas/capas
  - `/library` biblioteca de capitulos
  - `/chapter/[slug]` lectura de capitulo/documento
- Herramientas:
  - `/tools` catalogo agrupado por etapa/capitulo
  - `/tools/*` 18 herramientas
- Configuracion y sistema:
  - `/onboarding`
  - `/settings`
  - `/offline`
  - `/not-found`
- Legal:
  - `/aviso-de-privacidad`
  - `/terminos-y-condiciones`
  - `/politica-de-cookies`
- API local:
  - `POST /api/leads` (guarda en `../data/leads.json`)

## Experiencia De Aprendizaje

- Carga canonica desde `../elementos_estructurales/`.
- Capitulos detectados por patron `capitulo{N}_internacional.md`.
- Documentos estructurales activos:
  - `prefacio_internacional.md`
  - `indice_internacional.md`
  - `glosario_internacional.md`
- Introduccion sintetica agregada en runtime (`introduccion_internacional`).
- Ruta por capas en `web/lib/learn.ts`:
  - `base`: capitulos 1-6
  - `intermediate`: capitulos 7-13
  - `advanced`: capitulos 14-19
- En `indice_internacional`, la vista usa `InteractiveIndex` (acordeones por capa).
- Vista de capitulo incluye:
  - controles de progreso local (completado/marcador)
  - herramientas relacionadas por capitulo
  - bloque Aprende/Aplica/Verifica
  - siguiente paso recomendado

## Render De Markdown E Infografias

- Markdown con GFM (tablas incluidas).
- Todas las referencias `graficos/*` y `infografias/*` se resuelven a componentes HTML via:
  - `web/components/chapter-infographic.tsx`
  - `web/components/infographics/*`
- Si no existe mapeo, se renderiza placeholder visual consistente.

## Herramientas Financieras

### Core (5)

- `/tools/cash-flow`
- `/tools/costs-expenses`
- `/tools/budget`
- `/tools/break-even`
- `/tools/kpis`

### Avanzadas (13)

- `/tools/unit-economics`
- `/tools/financing-options`
- `/tools/debt-manager`
- `/tools/profitability-analyzer`
- `/tools/financial-strategy-planner`
- `/tools/contingency-planner`
- `/tools/financial-education-kit`
- `/tools/investment-evaluator`
- `/tools/business-model-analyzer`
- `/tools/international-finance-manager`
- `/tools/fintech-evaluator`
- `/tools/valuation-calculator`
- `/tools/resilience-evaluator`

### UX Guiada De Herramientas

- Datos demo iniciales por herramienta.
- Boton visible `Eliminar ejemplo` (solo borra `seedSource=sample`).
- Recomendaciones por etapa y microtips descartables.
- Stepper por pasos con progreso persistido.
- Bloques de proposito, ayudas de campo e interpretacion de resultados.
- Panel de formulas usadas con trazabilidad.

## Formulas Y Trazabilidad

- Registro central de formulas:
  - `web/lib/formulas/registry.ts`
- Fuente de formula por entrada:
  - `book-chapter`
  - `excel-cell`
  - `vba-module`
- Reglas VBA criticas portadas y documentadas:
  - `web/lib/formulas/vba-critical.ts`
- Implementaciones de calculo por herramienta avanzada:
  - `web/lib/calculations/advanced/*`

## Moneda, Persistencia Y Respaldo

- Moneda visible unica: `base` o `usd` (`currencyDisplayMode`).
- DB local en IndexedDB (Dexie), sin backend para datos de negocio.
- Snapshot de respaldo JSON versionado.
- Migraciones legacy soportadas hasta `CURRENT_SCHEMA_VERSION = 4`.
- Restauracion y reset seguro desde `Settings`.

## Export CSV

Disponible en:

- `cash-flow`
- `costs-expenses`
- `budget`
- herramientas avanzadas (via `AdvancedToolPage` cuando tienen `buildRows`)

Estandar CSV:

- delimitador `,`
- line break `\r\n`
- UTF-8 BOM
- escaping compatible con RFC4180

## Branding, Tipografia Y Shell

- Componente de marca: `web/components/brand-logo.tsx`
- Assets: `web/public/brand/katalis-logo-*.png`
- Fuente local: `web/app/fonts/lufga/*`
- Layout incluye:
  - header con navegacion principal
  - skip link a contenido
  - `LeadCaptureModal`
  - `Footer`

## Leads (Captura Local)

- Modal cliente: `web/components/lead-capture-modal.tsx`
- Trigger: primer scroll del usuario (si no envio antes).
- Persistencia de envio en `localStorage`.
- Endpoint: `web/app/api/leads/route.ts`
- Almacenamiento local servidor: `../data/leads.json`

## PWA / Offline

- Manifest en `web/app/manifest.ts` (`start_url: "/"`).
- Iconos PWA de marca en `/public/brand`.
- Fallback offline en `/offline`.
- Integracion `next-pwa` para service worker/runtime caching.

## Pruebas

Cobertura de tests en `web/tests/*`:

- calculos core (`cashflow`, `budget`, `breakeven`, `kpi`)
- calculos avanzados (`advanced-calculations`)
- CSV (`csv-core`, `csv-builders`, `csv-builders-advanced`)
- moneda y guia (`currency-display`, `guidance-rules`, `tool-guidance-spec`, `result-interpretation`)
- migraciones y respaldo (`backup`, `guide-progress-migration`)
- ciclo de demo (`sample-lifecycle`)
- ruta de aprendizaje (`learn-path`)
- glosario (`glossary-terms`)

Verificacion recomendada:

- `npm test`
- `npm run lint`
- `npm run build`

## Pendientes Conocidos

- Corregir texto con caracteres mal codificados en algunos archivos de UI/copy.
- Ejecutar auditoria visual final responsive y documentarla con capturas.
- Consolidar documentacion de OpenSpec para cada bloque reciente antes de archivo final.
