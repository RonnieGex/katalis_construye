"use client";

import { useEffect, useMemo, useState } from "react";

import { CurrencyModeBadge } from "@/components/currency-mode-badge";
import { FieldGuideHint } from "@/components/field-guide-hint";
import { MicrotipsPanel } from "@/components/microtips-panel";
import { StageGuidanceCard } from "@/components/stage-guidance-card";
import { ToolPurposeCard } from "@/components/tool-purpose-card";
import { ToolStepper } from "@/components/tool-stepper";
import { computeBudgetLineTotals, computeVariance } from "@/lib/calculations/budget";
import { buildBudgetCsv } from "@/lib/csv/builders";
import { buildCsv, createCsvFilename, downloadCsv } from "@/lib/csv/core";
import { formatAmountByDisplayMode } from "@/lib/currency";
import { DEFAULT_PROGRESS, DEFAULT_SETTINGS } from "@/lib/defaults";
import type {
 AnnualBudget,
 AnnualBudgetLine,
 AppSettings,
 ProgressState,
 ToolSampleState,
} from "@/lib/domain";
import { getToolRecommendation } from "@/lib/guidance/recommendations";
import { getBudgetSample } from "@/lib/guidance/sample-data";
import { deriveGuidanceSummary, type GuidanceSummary } from "@/lib/guidance/summary";
import { getVisibleTips } from "@/lib/guidance/tips";
import {
 getDefaultStepId,
 getNextStepId,
 getStepById,
 resolveToolGuideSpec,
} from "@/lib/guidance/tool-guidance";
import { MONTH_LABELS_ES, currentYear } from "@/lib/months";
import { parseNumberInput } from "@/lib/number";
import {
 clearSampleDataForTool,
 completeToolStep,
 dismissGuideBlock,
 dismissTip,
 getBreakEvenModel,
 getBudget,
 getProgress,
 getSettings,
 listBudgets,
 listCashFlowEntries,
 listCostEntries,
 setToolCurrentStep,
 setToolSampleState,
 upsertBudget,
} from "@/lib/repo";

type BudgetSection = "incomeLines" | "expenseLines";
type BudgetValueKind = "plannedByMonth" | "actualByMonth";
type ExportState = "idle" | "exporting" | "success" | "error";

function ensureTwelve(values: number[]): number[] {
 const next = values.slice(0, 12);
 while (next.length < 12) {
 next.push(0);
 }
 return next;
}

function normalizeBudget(budget: AnnualBudget): AnnualBudget {
 return {
 ...budget,
 incomeLines: budget.incomeLines.map((line) => ({
 ...line,
 plannedByMonth: ensureTwelve(line.plannedByMonth),
 actualByMonth: ensureTwelve(line.actualByMonth),
 })),
 expenseLines: budget.expenseLines.map((line) => ({
 ...line,
 plannedByMonth: ensureTwelve(line.plannedByMonth),
 actualByMonth: ensureTwelve(line.actualByMonth),
 })),
 };
}

const BUDGET_GUIDE_SPEC = resolveToolGuideSpec({
 toolId: "budget",
 fieldKeys: ["year", "incomeLines", "expenseLines", "plannedByMonth", "actualByMonth", "variance"],
 resultKeys: ["netVariance", "incomeVariance", "expenseVariance"],
});

interface BudgetLineEditorProps {
 title: string;
 lines: AnnualBudgetLine[];
 onUpdateLineName: (lineIndex: number, nextName: string) => void;
 onUpdateValue: (
 lineIndex: number,
 kind: BudgetValueKind,
 monthIndex: number,
 nextValue: number,
 ) => void;
}

function BudgetLineEditor({
 title,
 lines,
 onUpdateLineName,
 onUpdateValue,
}: BudgetLineEditorProps) {
 return (
 <article className="panel p-5">
 <h2 className="section-title text-2xl text-black">{title}</h2>
 <div className="mt-4 space-y-5">
 {lines.map((line, lineIndex) => (
 <div
 key={`${title}-${line.name}-${lineIndex}`}
 className="space-y-3 border border-neutral-300 p-4"
 >
 <label className="space-y-1 text-sm text-neutral-700">
 Nombre de línea
 <input
 className="input-base"
 value={line.name}
 onChange={(event) => onUpdateLineName(lineIndex, event.target.value)}
 />
 </label>
 <div className="overflow-x-auto">
 <table className="min-w-[960px] border-collapse text-sm">
 <thead>
 <tr className="border-b border-neutral-300 text-left text-neutral-600">
 <th className="p-2">Tipo</th>
 {MONTH_LABELS_ES.map((month) => (
 <th key={`${line.name}-${month}`} className="p-2">
 {month}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 <tr className="border-b border-neutral-200">
 <td className="p-2 text-neutral-700">Plan</td>
 {line.plannedByMonth.map((value, monthIndex) => (
 <td key={`plan-${line.name}-${monthIndex}`} className="p-2">
 <input
 className="input-base min-w-24"
 type="number"
 step="0.01"
 value={value}
 onChange={(event) =>
 onUpdateValue(
 lineIndex,
 "plannedByMonth",
 monthIndex,
 parseNumberInput(event.target.value),
 )
 }
 />
 </td>
 ))}
 </tr>
 <tr>
 <td className="p-2 text-neutral-700">Real</td>
 {line.actualByMonth.map((value, monthIndex) => (
 <td key={`actual-${line.name}-${monthIndex}`} className="p-2">
 <input
 className="input-base min-w-24"
 type="number"
 step="0.01"
 value={value}
 onChange={(event) =>
 onUpdateValue(
 lineIndex,
 "actualByMonth",
 monthIndex,
 parseNumberInput(event.target.value),
 )
 }
 />
 </td>
 ))}
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 ))}
 </div>
 </article>
 );
}

export default function BudgetToolPage() {
 const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
 const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);
 const [guidance, setGuidance] = useState<GuidanceSummary | null>(null);
 const [sampleState, setSampleStateValue] = useState<ToolSampleState | undefined>(undefined);
 const [selectedYear, setSelectedYear] = useState(currentYear());
 const [budget, setBudget] = useState<AnnualBudget | null>(null);
 const [loading, setLoading] = useState(true);
 const [autosaveReady, setAutosaveReady] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [savedAt, setSavedAt] = useState<string | null>(null);
 const [exportState, setExportState] = useState<ExportState>("idle");
 const [exportMessage, setExportMessage] = useState<string | null>(null);

 async function refreshGuidance(
 overrideSettings?: AppSettings,
 overrideProgress?: ProgressState,
 overrideBudgets?: AnnualBudget[],
 ) {
 const [savedSettings, savedProgress, cashflow, costs, budgets, breakEven] = await Promise.all([
 overrideSettings ? Promise.resolve(overrideSettings) : getSettings(),
 overrideProgress ? Promise.resolve(overrideProgress) : getProgress(),
 listCashFlowEntries(),
 listCostEntries(),
 overrideBudgets ? Promise.resolve(overrideBudgets) : listBudgets(),
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
 const nextProgress = await setToolSampleState("budget", "consumed");
 setProgress(nextProgress);
 setSampleStateValue("consumed");
 await refreshGuidance(settings, nextProgress);
 }

 useEffect(() => {
 let active = true;
 setLoading(true);
 setAutosaveReady(false);

 const loadBudget = async () => {
 try {
 const [savedSettings, savedProgress, currentBudgets] = await Promise.all([
 getSettings(),
 getProgress(),
 listBudgets(),
 ]);

 let budgets = currentBudgets;
 let nextProgress = savedProgress;
 if (!savedProgress.toolStepProgress.budget?.currentStepId) {
 nextProgress = await setToolCurrentStep("budget", getDefaultStepId(BUDGET_GUIDE_SPEC));
 }
 const currentSampleState = savedProgress.toolSampleState.budget;
 const canSeedSample = currentSampleState !== "dismissed" && currentSampleState !== "consumed";

 if (budgets.length === 0 && canSeedSample) {
 const sample = getBudgetSample(selectedYear);
 await upsertBudget(sample);
 nextProgress = await setToolSampleState("budget", "active");
 budgets = await listBudgets();
 }

 const savedBudget = budgets.find((entry) => entry.year === selectedYear) ?? (await getBudget(selectedYear));

 if (!active) {
 return;
 }

 setSettings(savedSettings);
 setProgress(nextProgress);
 setSampleStateValue(nextProgress.toolSampleState.budget);
 setBudget(normalizeBudget(savedBudget));
 await refreshGuidance(savedSettings, nextProgress, budgets);
 } catch (budgetError) {
 if (!active) {
 return;
 }
 setError(budgetError instanceof Error ? budgetError.message : "No se pudo cargar presupuesto");
 } finally {
 if (active) {
 setLoading(false);
 setAutosaveReady(true);
 }
 }
 };

 void loadBudget();
 return () => {
 active = false;
 };
 }, [selectedYear]);

 useEffect(() => {
 if (!autosaveReady || !budget) {
 return;
 }

 const timeout = window.setTimeout(() => {
 void (async () => {
 try {
 await upsertBudget(budget);
 setSavedAt(new Date().toLocaleTimeString("es-MX"));
 await refreshGuidance(settings, progress);
 } catch (saveError) {
 setError(saveError instanceof Error ? saveError.message : "No se pudo guardar");
 }
 })();
 }, 600);

 return () => {
 window.clearTimeout(timeout);
 };
 }, [autosaveReady, budget, progress, settings]);

 const incomeTotals = useMemo(
 () =>
 budget
 ? computeBudgetLineTotals(budget.incomeLines)
 : { plannedTotal: 0, actualTotal: 0 },
 [budget],
 );
 const expenseTotals = useMemo(
 () =>
 budget
 ? computeBudgetLineTotals(budget.expenseLines)
 : { plannedTotal: 0, actualTotal: 0 },
 [budget],
 );
 const incomeVariance = useMemo(
 () => computeVariance(incomeTotals.plannedTotal, incomeTotals.actualTotal),
 [incomeTotals],
 );
 const expenseVariance = useMemo(
 () => computeVariance(expenseTotals.plannedTotal, expenseTotals.actualTotal),
 [expenseTotals],
 );
 const plannedNet = incomeTotals.plannedTotal - expenseTotals.plannedTotal;
 const actualNet = incomeTotals.actualTotal - expenseTotals.actualTotal;
 const netVariance = useMemo(() => computeVariance(plannedNet, actualNet), [plannedNet, actualNet]);
 const budgetCsvPreview = useMemo(() => (budget ? buildBudgetCsv(budget) : null), [budget]);
 const hasOnlySampleData = Boolean(budget && budget.seedSource === "sample");
 const hasExportableData = (budgetCsvPreview?.rows.length ?? 0) > 0 && !hasOnlySampleData;
 const hasActiveSample = sampleState === "active" && budget?.seedSource === "sample";
 const currentStepId =
  progress.toolStepProgress.budget?.currentStepId ?? getDefaultStepId(BUDGET_GUIDE_SPEC);
 const currentStep = getStepById(BUDGET_GUIDE_SPEC, currentStepId) ?? BUDGET_GUIDE_SPEC.steps[0];
 const completedStepIds = progress.toolStepProgress.budget?.completedStepIds ?? [];
 const purposeBlockId = "budget-purpose";

 const tips = useMemo(() => {
 if (!guidance) {
 return [];
 }
 return getVisibleTips({
 route: "budget",
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
  const nextProgress = await setToolCurrentStep("budget", stepId);
  setProgress(nextProgress);
 }

 async function handleCompleteStep(stepId: string) {
  const nextProgress = await completeToolStep("budget", stepId);
  setProgress(nextProgress);
 }

 async function handleNextStep() {
  const nextStepId = getNextStepId(BUDGET_GUIDE_SPEC, currentStepId);
  const nextProgress = await setToolCurrentStep("budget", nextStepId);
  setProgress(nextProgress);
 }

 async function handleExportCsv() {
 if (!budget) {
 return;
 }

 setExportState("exporting");
 setExportMessage(null);
 try {
 if (budget.seedSource === "sample") {
 setExportState("error");
 setExportMessage("Primero reemplaza o elimina el ejemplo para exportar datos reales.");
 return;
 }

 const rows = buildBudgetCsv(budget);
 if (rows.rows.length === 0) {
 setExportState("error");
 setExportMessage("No hay datos exportables para CSV.");
 return;
 }

 const csv = buildCsv(rows.headers, rows.rows);
 const filename = createCsvFilename(`budget-${selectedYear}`);
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

 async function handleClearSample() {
 await clearSampleDataForTool("budget");
 const nextProgress = await setToolSampleState("budget", "dismissed");
 const refreshed = await getBudget(selectedYear);
 const allBudgets = await listBudgets();

 setBudget(normalizeBudget(refreshed));
 setProgress(nextProgress);
 setSampleStateValue("dismissed");
 setExportState("success");
 setExportMessage("Datos de ejemplo eliminados.");
 await refreshGuidance(settings, nextProgress, allBudgets);
 }

 function updateLineName(section: BudgetSection, lineIndex: number, nextName: string) {
 setBudget((prev) => {
 if (!prev) {
 return prev;
 }
 return {
 ...prev,
 seedSource: "user",
 [section]: prev[section].map((line, index) =>
 index === lineIndex ? { ...line, name: nextName } : line,
 ),
 };
 });
 void markSampleConsumed();
 }

 function updateLineValue(
 section: BudgetSection,
 lineIndex: number,
 kind: BudgetValueKind,
 monthIndex: number,
 nextValue: number,
 ) {
 setBudget((prev) => {
 if (!prev) {
 return prev;
 }

 return {
 ...prev,
 seedSource: "user",
 [section]: prev[section].map((line, index) => {
 if (index !== lineIndex) {
 return line;
 }

 const nextMonthValues = line[kind].map((value, currentMonthIndex) =>
 currentMonthIndex === monthIndex ? nextValue : value,
 );
 return {
 ...line,
 [kind]: nextMonthValues,
 };
 }),
 };
 });
 void markSampleConsumed();
 }

 if (loading || !budget) {
 return <p className="text-sm text-neutral-500">Cargando herramienta...</p>;
 }

 return (
 <div className="space-y-6">
 <section className="panel-soft p-6">
 <div className="flex flex-wrap items-start justify-between gap-3">
 <div>
 <h1 className="section-title text-4xl text-black">Presupuesto anual</h1>
 <p className="mt-2 text-neutral-700">Compara plan vs real y detecta variaciones.</p>
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
        {savedAt ? <p className="mt-2 text-xs text-neutral-500">Último guardado: {savedAt}</p> : null}
 {exportMessage ? (
 <p
 className={`mt-2 text-xs ${exportState === "error" ? "text-red-700" : "text-emerald-700"
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
 note={getToolRecommendation("budget", guidance.currentStage, currentStep.title)}
 />
 ) : null}

 <ToolPurposeCard
 guide={BUDGET_GUIDE_SPEC}
 blockId={purposeBlockId}
 dismissed={progress.dismissedGuideBlocks.includes(purposeBlockId)}
 onDismiss={handleDismissPurpose}
 />

 <ToolStepper
 guide={BUDGET_GUIDE_SPEC}
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
 <label className="max-w-xs space-y-1 text-sm text-neutral-700">
 Ano
 <input
 className="input-base"
 type="number"
 value={selectedYear}
 onChange={(event) => setSelectedYear(parseNumberInput(event.target.value))}
 />
 </label>
 </section>

 <section className="grid gap-4 md:grid-cols-3">
 <article className="panel p-5">
 <h2 className="section-title text-xl text-black">Ingresos</h2>
 <p className="mt-2 text-sm text-neutral-700">
 Plan: {formatAmountByDisplayMode(incomeTotals.plannedTotal, settings)}
 </p>
 <p className="text-sm text-neutral-700">
 Real: {formatAmountByDisplayMode(incomeTotals.actualTotal, settings)}
 </p>
 <p className="text-sm text-neutral-700">
              Variación: {formatAmountByDisplayMode(incomeVariance.amount, settings)} (
 {incomeVariance.percent === null ? "N/A" : `${incomeVariance.percent.toFixed(2)}%`})
 </p>
 </article>

 <article className="panel p-5">
 <h2 className="section-title text-xl text-black">Egresos</h2>
 <p className="mt-2 text-sm text-neutral-700">
 Plan: {formatAmountByDisplayMode(expenseTotals.plannedTotal, settings)}
 </p>
 <p className="text-sm text-neutral-700">
 Real: {formatAmountByDisplayMode(expenseTotals.actualTotal, settings)}
 </p>
 <p className="text-sm text-neutral-700">
              Variación: {formatAmountByDisplayMode(expenseVariance.amount, settings)} (
 {expenseVariance.percent === null ? "N/A" : `${expenseVariance.percent.toFixed(2)}%`})
 </p>
 </article>

 <article className="panel p-5">
 <h2 className="section-title text-xl text-black">Resultado neto</h2>
 <p className="mt-2 text-sm text-neutral-700">
 Plan: {formatAmountByDisplayMode(plannedNet, settings)}
 </p>
 <p className="text-sm text-neutral-700">Real: {formatAmountByDisplayMode(actualNet, settings)}</p>
 <p className="text-sm text-neutral-700">
              Variación: {formatAmountByDisplayMode(netVariance.amount, settings)} (
 {netVariance.percent === null ? "N/A" : `${netVariance.percent.toFixed(2)}%`})
 </p>
 </article>
 </section>

 <BudgetLineEditor
 title="Lineas de ingreso"
 lines={budget.incomeLines}
 onUpdateLineName={(lineIndex, nextName) => updateLineName("incomeLines", lineIndex, nextName)}
 onUpdateValue={(lineIndex, kind, monthIndex, nextValue) =>
 updateLineValue("incomeLines", lineIndex, kind, monthIndex, nextValue)
 }
 />

 <BudgetLineEditor
 title="Lineas de egreso"
 lines={budget.expenseLines}
 onUpdateLineName={(lineIndex, nextName) =>
 updateLineName("expenseLines", lineIndex, nextName)
 }
 onUpdateValue={(lineIndex, kind, monthIndex, nextValue) =>
 updateLineValue("expenseLines", lineIndex, kind, monthIndex, nextValue)
 }
 />

 <MicrotipsPanel tips={tips} onDismiss={handleDismissTip} />

 {error ? <p className="text-sm text-red-700">{error}</p> : null}
 </div>
 );
}



