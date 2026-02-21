"use client";

import { useEffect, useMemo, useState } from "react";
import {
 Bar,
 BarChart,
 CartesianGrid,
 Cell,
 Pie,
 PieChart,
 Tooltip,
 XAxis,
 YAxis,
} from "recharts";

import { CurrencyModeBadge } from "@/components/currency-mode-badge";
import { FieldGuideHint } from "@/components/field-guide-hint";
import { MicrotipsPanel } from "@/components/microtips-panel";
import { StableResponsiveChart } from "@/components/stable-responsive-chart";
import { StageGuidanceCard } from "@/components/stage-guidance-card";
import { ToolPurposeCard } from "@/components/tool-purpose-card";
import { ToolStepper } from "@/components/tool-stepper";
import { buildCostsCsv } from "@/lib/csv/builders";
import { buildCsv, createCsvFilename, downloadCsv } from "@/lib/csv/core";
import { formatAmountByDisplayMode } from "@/lib/currency";
import { DEFAULT_PROGRESS, DEFAULT_SETTINGS } from "@/lib/defaults";
import type {
 AppSettings,
 CostExpenseEntry,
 CostType,
 ProgressState,
 ToolSampleState,
} from "@/lib/domain";
import { getToolRecommendation } from "@/lib/guidance/recommendations";
import { getCostsSampleEntries } from "@/lib/guidance/sample-data";
import { deriveGuidanceSummary, type GuidanceSummary } from "@/lib/guidance/summary";
import { getVisibleTips } from "@/lib/guidance/tips";
import {
 getDefaultStepId,
 getNextStepId,
 getStepById,
 resolveToolGuideSpec,
} from "@/lib/guidance/tool-guidance";
import { parseNumberInput } from "@/lib/number";
import {
 addCostEntries,
 addCostEntry,
 clearSampleDataForTool,
 completeToolStep,
 deleteCostEntry,
 dismissGuideBlock,
 dismissTip,
 getBreakEvenModel,
 getProgress,
 getSettings,
 listBudgets,
 listCashFlowEntries,
 listCostEntries,
 setToolCurrentStep,
 setToolSampleState,
} from "@/lib/repo";
import { chartTheme } from "@/lib/theme";

const TYPE_LABELS: Record<CostType, string> = {
 fixed_cost: "Costo fijo",
 variable_cost: "Costo variable",
 expense: "Gasto",
};

const CHART_COLORS = [chartTheme.chartPrimary, chartTheme.chartAccent, chartTheme.chartMuted];
type ExportState = "idle" | "exporting" | "success" | "error";

function todayIsoDate(): string {
 return new Date().toISOString().slice(0, 10);
}

const COSTS_GUIDE_SPEC = resolveToolGuideSpec({
 toolId: "costs",
 fieldKeys: ["date", "type", "amount", "description", "category", "notes", "distribution"],
 resultKeys: ["overallTotal", "totalsByType"],
});

export default function CostsExpensesToolPage() {
 const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
 const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);
 const [guidance, setGuidance] = useState<GuidanceSummary | null>(null);
 const [sampleState, setSampleStateValue] = useState<ToolSampleState | undefined>(undefined);
 const [entries, setEntries] = useState<CostExpenseEntry[]>([]);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [exportState, setExportState] = useState<ExportState>("idle");
 const [exportMessage, setExportMessage] = useState<string | null>(null);
 const [draft, setDraft] = useState<CostExpenseEntry>({
 date: todayIsoDate(),
 description: "",
 amount: 0,
 type: "fixed_cost",
 category: "general",
 notes: "",
 seedSource: "user",
 });

 async function refreshGuidance(
 overrideSettings?: AppSettings,
 overrideProgress?: ProgressState,
 overrideCosts?: CostExpenseEntry[],
 ) {
 const [savedSettings, savedProgress, cashflow, costs, budgets, breakEven] = await Promise.all([
 overrideSettings ? Promise.resolve(overrideSettings) : getSettings(),
 overrideProgress ? Promise.resolve(overrideProgress) : getProgress(),
 listCashFlowEntries(),
 overrideCosts ? Promise.resolve(overrideCosts) : listCostEntries(),
 listBudgets(),
 getBreakEvenModel(),
 ]);

 setSettings(savedSettings);
 setProgress(savedProgress);
 setGuidance(
 deriveGuidanceSummary({
 settings: savedSettings,
 progress: savedProgress,
 cashflow,
 costs,
 budgets,
 breakEven,
 }),
 );
 }

 async function markSampleConsumed() {
 if (sampleState !== "active") {
 return;
 }

 const nextProgress = await setToolSampleState("costs", "consumed");
 setProgress(nextProgress);
 setSampleStateValue("consumed");
 await refreshGuidance(settings, nextProgress);
 }

 useEffect(() => {
 let active = true;
 const load = async () => {
 try {
 const [savedSettings, savedProgress] = await Promise.all([getSettings(), getProgress()]);
 let savedEntries = await listCostEntries();
 let nextProgress = savedProgress;
 if (!savedProgress.toolStepProgress.costs?.currentStepId) {
 nextProgress = await setToolCurrentStep("costs", getDefaultStepId(COSTS_GUIDE_SPEC));
 }
 const currentSampleState = savedProgress.toolSampleState.costs;
 const canSeedSample = currentSampleState !== "dismissed" && currentSampleState !== "consumed";

 if (savedEntries.length === 0 && canSeedSample) {
 await addCostEntries(getCostsSampleEntries());
 nextProgress = await setToolSampleState("costs", "active");
 savedEntries = await listCostEntries();
 }

 if (!active) {
 return;
 }

 setSettings(savedSettings);
 setProgress(nextProgress);
 setSampleStateValue(nextProgress.toolSampleState.costs);
 setEntries(savedEntries);
 await refreshGuidance(savedSettings, nextProgress, savedEntries);
 } catch (loadError) {
 if (!active) {
 return;
 }
 setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar datos");
 } finally {
 if (active) {
 setLoading(false);
 }
 }
 };

 void load();
 return () => {
 active = false;
 };
 }, []);

 async function refreshEntries() {
 const savedEntries = await listCostEntries();
 setEntries(savedEntries);
 await refreshGuidance(settings, progress, savedEntries);
 return savedEntries;
 }

 async function handleAddEntry() {
 setError(null);
 setSaving(true);
 try {
 if (!draft.description.trim()) {
 throw new Error("La descripcion es obligatoria");
 }
 if (draft.amount <= 0) {
 throw new Error("El monto debe ser mayor que cero");
 }

 await addCostEntry({
 ...draft,
 description: draft.description.trim(),
 category: draft.category.trim() || "general",
 seedSource: "user",
 });
 await markSampleConsumed();
 await refreshEntries();
 setDraft({
 date: todayIsoDate(),
 description: "",
 amount: 0,
 type: draft.type,
 category: draft.category,
 notes: "",
 seedSource: "user",
 });
 } catch (addError) {
 setError(addError instanceof Error ? addError.message : "No se pudo agregar movimiento");
 } finally {
 setSaving(false);
 }
 }

 async function handleDelete(id?: number) {
 if (typeof id !== "number") {
 return;
 }

 await deleteCostEntry(id);
 await markSampleConsumed();
 await refreshEntries();
 }

 async function handleClearSample() {
 await clearSampleDataForTool("costs");
 const nextProgress = await setToolSampleState("costs", "dismissed");
 const nextEntries = await listCostEntries();
 setEntries(nextEntries);
 setProgress(nextProgress);
 setSampleStateValue("dismissed");
 setExportState("success");
 setExportMessage("Datos de ejemplo eliminados.");
 await refreshGuidance(settings, nextProgress, nextEntries);
 }

 const totalsByType = useMemo(() => {
 const totals: Record<CostType, number> = {
 fixed_cost: 0,
 variable_cost: 0,
 expense: 0,
 };

 for (const entry of entries) {
 totals[entry.type] += entry.amount;
 }

 return totals;
 }, [entries]);

 const overallTotal = totalsByType.fixed_cost + totalsByType.variable_cost + totalsByType.expense;

 const pieData = useMemo(
 () =>
 [
 { name: TYPE_LABELS.fixed_cost, value: totalsByType.fixed_cost },
 { name: TYPE_LABELS.variable_cost, value: totalsByType.variable_cost },
 { name: TYPE_LABELS.expense, value: totalsByType.expense },
 ].filter((item) => item.value > 0),
 [totalsByType],
 );

 const monthlyTrend = useMemo(() => {
 const grouped = new Map<string, number>();
 for (const entry of entries) {
 const month = entry.date.slice(0, 7);
 grouped.set(month, (grouped.get(month) ?? 0) + entry.amount);
 }
 return Array.from(grouped.entries())
 .sort((a, b) => a[0].localeCompare(b[0]))
 .map(([month, total]) => ({ month, total }));
 }, [entries]);

 const hasOnlySampleData = entries.length > 0 && entries.every((entry) => entry.seedSource === "sample");
 const hasExportableData = entries.length > 0 && !hasOnlySampleData;
 const hasActiveSample =
 sampleState === "active" && entries.some((entry) => entry.seedSource === "sample");
 const currentStepId =
  progress.toolStepProgress.costs?.currentStepId ?? getDefaultStepId(COSTS_GUIDE_SPEC);
 const currentStep = getStepById(COSTS_GUIDE_SPEC, currentStepId) ?? COSTS_GUIDE_SPEC.steps[0];
 const completedStepIds = progress.toolStepProgress.costs?.completedStepIds ?? [];
 const purposeBlockId = "costs-purpose";

 const tips = useMemo(() => {
 if (!guidance) {
 return [];
 }
 return getVisibleTips({
 route: "costs",
 stage: guidance.currentStage,
 dismissedTipIds: progress.dismissedTipIds,
 limit: 2,
 });
 }, [guidance, progress.dismissedTipIds]);

 async function handleDismissTip(tipId: string) {
 const nextProgress = await dismissTip(tipId);
 setProgress(nextProgress);
 await refreshGuidance(settings, nextProgress);
 }

 async function handleDismissPurpose(blockId: string) {
  const nextProgress = await dismissGuideBlock(blockId);
  setProgress(nextProgress);
 }

 async function handleSelectStep(stepId: string) {
  const nextProgress = await setToolCurrentStep("costs", stepId);
  setProgress(nextProgress);
 }

 async function handleCompleteStep(stepId: string) {
  const nextProgress = await completeToolStep("costs", stepId);
  setProgress(nextProgress);
 }

 async function handleNextStep() {
  const nextStepId = getNextStepId(COSTS_GUIDE_SPEC, currentStepId);
  const nextProgress = await setToolCurrentStep("costs", nextStepId);
  setProgress(nextProgress);
 }

 async function handleExportCsv() {
 setExportState("exporting");
 setExportMessage(null);
 try {
 if (hasOnlySampleData) {
 setExportState("error");
 setExportMessage("Primero reemplaza o elimina el ejemplo para exportar datos reales.");
 return;
 }

 const rows = buildCostsCsv(entries);
 if (rows.rows.length === 0) {
 setExportState("error");
 setExportMessage("No hay datos exportables para CSV.");
 return;
 }

 const csv = buildCsv(rows.headers, rows.rows);
 const filename = createCsvFilename("costs-expenses");
 downloadCsv(filename, csv);
 setExportState("success");
 setExportMessage("CSV exportado correctamente.");
 } catch (exportError) {
 setExportState("error");
 setExportMessage(
 exportError instanceof Error ? exportError.message : "No se pudo exportar CSV.",
 );
 }
 }

 if (loading) {
 return <p className="text-sm text-neutral-500">Cargando herramienta...</p>;
 }

 return (
 <div className="space-y-6">
 <section className="panel-soft p-6">
 <div className="flex flex-wrap items-start justify-between gap-3">
 <div>
 <h1 className="section-title text-4xl text-black">Costos vs Gastos</h1>
 <p className="mt-2 text-neutral-700">
 Registra movimientos y analiza composicion de costos de tu negocio.
 </p>
 <CurrencyModeBadge settings={settings} />
 </div>
 <div className="flex flex-wrap gap-2">
 {hasActiveSample ? (
 <button type="button" className="btn-secondary" onClick={() => void handleClearSample()}>
 Eliminar ejemplo
 </button>
 ) : null}
 <button
 type="button"
 className="btn-secondary"
 onClick={() => void handleExportCsv()}
 disabled={!hasExportableData || exportState === "exporting"}
 >
 {exportState === "exporting" ? "Exportando..." : "Exportar CSV"}
 </button>
 </div>
 </div>
 {exportMessage ? (
 <p
 className={`mt-2 text-xs ${
 exportState === "error" ? "text-red-700" : "text-emerald-700"
 }`}
 >
 {exportMessage}
 </p>
 ) : null}
 {!hasExportableData ? (
 <p className="mt-2 text-xs text-neutral-500">
 {hasOnlySampleData
 ? "Primero reemplaza o elimina el ejemplo para exportar datos reales."
 : "No hay datos exportables por ahora."}
 </p>
 ) : null}
 </section>

 {guidance ? (
 <StageGuidanceCard
 guidance={guidance}
 compact
 note={getToolRecommendation("costs", guidance.currentStage, currentStep.title)}
 />
 ) : null}

 <ToolPurposeCard
 guide={COSTS_GUIDE_SPEC}
 blockId={purposeBlockId}
 dismissed={progress.dismissedGuideBlocks.includes(purposeBlockId)}
 onDismiss={handleDismissPurpose}
 />

 <ToolStepper
 guide={COSTS_GUIDE_SPEC}
 currentStepId={currentStepId}
 completedStepIds={completedStepIds}
 onSelectStep={handleSelectStep}
 onCompleteStep={handleCompleteStep}
 onNextStep={handleNextStep}
 />

 <section className="panel p-5">
 <h2 className="section-title text-2xl text-black">{currentStep.title}</h2>
 <p className="mt-1 text-sm text-neutral-700">{currentStep.objective}</p>
 <div className="mt-3 grid gap-3 md:grid-cols-2">
 {currentStep.fields.map((field) => (
 <FieldGuideHint key={field.fieldKey} guide={field} />
 ))}
 </div>
 </section>

 <section className="panel p-5">
 <h2 className="section-title text-2xl text-black">Nuevo movimiento</h2>
 <div className="mt-4 grid gap-3 md:grid-cols-2">
 <label className="space-y-1 text-sm text-neutral-700">
 Fecha
 <input
 className="input-base"
 type="date"
 value={draft.date}
 onChange={(event) => setDraft((prev) => ({ ...prev, date: event.target.value }))}
 />
 </label>

 <label className="space-y-1 text-sm text-neutral-700">
 Monto
 <input
 className="input-base"
 type="number"
 step="0.01"
 value={draft.amount}
 onChange={(event) =>
 setDraft((prev) => ({ ...prev, amount: parseNumberInput(event.target.value) }))
 }
 />
 </label>

 <label className="space-y-1 text-sm text-neutral-700 md:col-span-2">
 Descripcion
 <input
 className="input-base"
 value={draft.description}
 onChange={(event) =>
 setDraft((prev) => ({ ...prev, description: event.target.value }))
 }
 />
 </label>

 <label className="space-y-1 text-sm text-neutral-700">
 Tipo
 <select
 className="input-base"
 value={draft.type}
 onChange={(event) =>
 setDraft((prev) => ({ ...prev, type: event.target.value as CostType }))
 }
 >
 <option value="fixed_cost">{TYPE_LABELS.fixed_cost}</option>
 <option value="variable_cost">{TYPE_LABELS.variable_cost}</option>
 <option value="expense">{TYPE_LABELS.expense}</option>
 </select>
 </label>

 <label className="space-y-1 text-sm text-neutral-700">
          Categoría
 <input
 className="input-base"
 value={draft.category}
 onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
 />
 </label>

 <label className="space-y-1 text-sm text-neutral-700 md:col-span-2">
 Notas (opcional)
 <input
 className="input-base"
 value={draft.notes ?? ""}
 onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
 />
 </label>
 </div>

 <div className="mt-4">
 <button type="button" className="btn-primary" onClick={() => void handleAddEntry()}>
 {saving ? "Guardando..." : "Agregar movimiento"}
 </button>
 </div>
 {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
 </section>

 <section className="grid gap-4 md:grid-cols-2">
 <article className="panel p-5">
 <h2 className="section-title text-2xl text-black">Totales</h2>
 <div className="mt-3 space-y-2 text-sm text-neutral-700">
 <p>{TYPE_LABELS.fixed_cost}: {formatAmountByDisplayMode(totalsByType.fixed_cost, settings)}</p>
 <p>
 {TYPE_LABELS.variable_cost}:{" "}
 {formatAmountByDisplayMode(totalsByType.variable_cost, settings)}
 </p>
 <p>{TYPE_LABELS.expense}: {formatAmountByDisplayMode(totalsByType.expense, settings)}</p>
 <p className="font-semibold">
 Total general: {formatAmountByDisplayMode(overallTotal, settings)}
 </p>
 </div>
 </article>

 <article className="panel p-5">
 <h2 className="section-title text-2xl text-black">Distribucion por tipo</h2>
 <div className="mt-3 h-64">
 {pieData.length > 0 ? (
 <StableResponsiveChart
 minWidth={320}
 minHeight={220}
                    fallback={<p className="text-sm text-neutral-500">Cargando gráfico...</p>}
 >
 <PieChart>
 <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
 {pieData.map((entry, index) => (
 <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
 ))}
 </Pie>
 <Tooltip />
 </PieChart>
 </StableResponsiveChart>
 ) : (
 <p className="text-sm text-neutral-500">
              Agrega al menos un movimiento para ver gráfico.
 </p>
 )}
 </div>
 </article>
 </section>

 <section className="panel p-5">
 <h2 className="section-title text-2xl text-black">Tendencia mensual</h2>
 <div className="mt-3 h-64">
 <StableResponsiveChart
 minWidth={320}
 minHeight={220}
                    fallback={<p className="text-sm text-neutral-500">Cargando gráfico...</p>}
 >
 <BarChart data={monthlyTrend}>
 <CartesianGrid stroke={chartTheme.chartGrid} strokeDasharray="3 3" />
 <XAxis dataKey="month" />
 <YAxis />
 <Tooltip />
 <Bar dataKey="total" fill={chartTheme.chartPrimary} name="Total por mes" />
 </BarChart>
 </StableResponsiveChart>
 </div>
 </section>

 <section className="panel p-5">
 <h2 className="section-title text-2xl text-black">Registro</h2>
 <div className="mt-3 overflow-x-auto">
 <table className="min-w-full border-collapse text-sm">
 <thead>
 <tr className="border-b border-neutral-300 text-left text-neutral-600">
 <th className="p-2">Fecha</th>
 <th className="p-2">Descripcion</th>
 <th className="p-2">Tipo</th>
                  <th className="p-2">Categoría</th>
 <th className="p-2">Monto</th>
 <th className="p-2">Acciones</th>
 </tr>
 </thead>
 <tbody>
 {entries.map((entry) => (
 <tr
 key={entry.id ?? `${entry.date}-${entry.description}`}
 className="border-b border-neutral-200"
 >
 <td className="p-2">{entry.date}</td>
 <td className="p-2">{entry.description}</td>
 <td className="p-2">{TYPE_LABELS[entry.type]}</td>
 <td className="p-2">{entry.category}</td>
 <td className="p-2">{formatAmountByDisplayMode(entry.amount, settings)}</td>
 <td className="p-2">
 <button
 type="button"
 className="btn-secondary"
 onClick={() => void handleDelete(entry.id)}
 >
 Eliminar
 </button>
 </td>
 </tr>
 ))}
 {entries.length === 0 ? (
 <tr>
 <td colSpan={6} className="p-3 text-center text-neutral-500">
 Sin movimientos todavia.
 </td>
 </tr>
 ) : null}
 </tbody>
 </table>
 </div>
 </section>

 <MicrotipsPanel tips={tips} onDismiss={handleDismissTip} />
 </div>
 );
}



