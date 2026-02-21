"use client";

import { useEffect, useMemo, useState } from "react";
import {
 Bar,
 BarChart,
 CartesianGrid,
 Legend,
 Line,
 LineChart,
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
import { computeMonthCashFlow } from "@/lib/calculations/cashflow";
import { buildCashFlowCsv } from "@/lib/csv/builders";
import { buildCsv, createCsvFilename, downloadCsv } from "@/lib/csv/core";
import { formatAmountByDisplayMode } from "@/lib/currency";
import { DEFAULT_PROGRESS, DEFAULT_SETTINGS } from "@/lib/defaults";
import type {
 AppSettings,
 CashFlowEntry,
 CashFlowLine,
 ProgressState,
 ToolSampleState,
} from "@/lib/domain";
import { getToolRecommendation } from "@/lib/guidance/recommendations";
import { getCashFlowSampleEntries } from "@/lib/guidance/sample-data";
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
 clearSampleDataForTool,
 completeToolStep,
 dismissGuideBlock,
 dismissTip,
 getBreakEvenModel,
 getCashFlowEntry,
 getProgress,
 getSettings,
 listBudgets,
 listCashFlowEntries,
 listCostEntries,
 setToolCurrentStep,
 setToolSampleState,
 upsertCashFlowEntries,
 upsertCashFlowEntry,
} from "@/lib/repo";

type CashFlowSection = "inflows" | "outflows";
type CashFlowLineField = "name" | "projected" | "actual";
type ExportState = "idle" | "exporting" | "success" | "error";

function currentMonthIso(): string {
 return new Date().toISOString().slice(0, 7);
}

function createEmptyLine(): CashFlowLine {
 return {
 name: "",
 projected: 0,
 actual: 0,
 };
}

function createEntry(month: string): CashFlowEntry {
 return {
 month,
 startingBalance: 0,
 inflows: [createEmptyLine()],
 outflows: [createEmptyLine()],
 seedSource: "user",
 };
}

function upsertLine(
 lines: CashFlowLine[],
 index: number,
 field: CashFlowLineField,
 value: string,
): CashFlowLine[] {
 return lines.map((line, lineIndex) => {
 if (lineIndex !== index) {
 return line;
 }

 if (field === "name") {
 return { ...line, name: value };
 }

 return { ...line, [field]: parseNumberInput(value) };
 });
}

const CASHFLOW_GUIDE_SPEC = resolveToolGuideSpec({
 toolId: "cashflow",
 fieldKeys: ["startingBalance", "inflows", "outflows", "closing-balance"],
 resultKeys: ["projectedEndingBalance", "actualEndingBalance"],
});

export default function CashFlowToolPage() {
 const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
 const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);
 const [guidance, setGuidance] = useState<GuidanceSummary | null>(null);
 const [sampleState, setSampleStateValue] = useState<ToolSampleState | undefined>(undefined);
 const [selectedMonth, setSelectedMonth] = useState(currentMonthIso());
 const [entry, setEntry] = useState<CashFlowEntry>(() => createEntry(currentMonthIso()));
 const [history, setHistory] = useState<CashFlowEntry[]>([]);
 const [loading, setLoading] = useState(true);
 const [autosaveReady, setAutosaveReady] = useState(false);
 const [savedAt, setSavedAt] = useState<string | null>(null);
 const [exportState, setExportState] = useState<ExportState>("idle");
 const [exportMessage, setExportMessage] = useState<string | null>(null);

 async function refreshGuidance(
 overrideSettings?: AppSettings,
 overrideProgress?: ProgressState,
 overrideCashflow?: CashFlowEntry[],
 ) {
 const [savedSettings, savedProgress, cashflow, costs, budgets, breakEven] = await Promise.all([
 overrideSettings ? Promise.resolve(overrideSettings) : getSettings(),
 overrideProgress ? Promise.resolve(overrideProgress) : getProgress(),
 overrideCashflow ? Promise.resolve(overrideCashflow) : listCashFlowEntries(),
 listCostEntries(),
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

 const nextProgress = await setToolSampleState("cashflow", "consumed");
 setProgress(nextProgress);
 setSampleStateValue("consumed");
 await refreshGuidance(settings, nextProgress);
 }

 useEffect(() => {
 let active = true;

 const loadSettings = async () => {
 try {
 const saved = await getSettings();
 if (!active) {
 return;
 }
 setSettings(saved);
 } catch (settingsError) {
 if (!active) {
 return;
 }
 console.error(
 settingsError instanceof Error
 ? settingsError.message
 : "No se pudieron cargar ajustes",
 );
 }
 };

 void loadSettings();
 return () => {
 active = false;
 };
 }, []);

 useEffect(() => {
 let active = true;
 setLoading(true);
 setAutosaveReady(false);

 const loadMonth = async () => {
 try {
 const [savedProgress, savedEntry] = await Promise.all([
 getProgress(),
 getCashFlowEntry(selectedMonth),
 ]);

 let historyRows = await listCashFlowEntries();
 let nextProgress = savedProgress;
 if (!savedProgress.toolStepProgress.cashflow?.currentStepId) {
 nextProgress = await setToolCurrentStep("cashflow", getDefaultStepId(CASHFLOW_GUIDE_SPEC));
 }
 const currentSampleState = savedProgress.toolSampleState.cashflow;
 const canSeedSample = currentSampleState !== "dismissed" && currentSampleState !== "consumed";

 if (historyRows.length === 0 && canSeedSample) {
 await upsertCashFlowEntries(getCashFlowSampleEntries());
 nextProgress = await setToolSampleState("cashflow", "active");
 historyRows = await listCashFlowEntries();
 }

 if (!active) {
 return;
 }

 const monthEntry =
 historyRows.find((row) => row.month === selectedMonth) ?? savedEntry ?? createEntry(selectedMonth);
 setEntry(monthEntry);
 setHistory(historyRows);
 setProgress(nextProgress);
 setSampleStateValue(nextProgress.toolSampleState.cashflow);

 await refreshGuidance(undefined, nextProgress, historyRows);
 } catch (monthError) {
 if (!active) {
 return;
 }
 console.error(monthError instanceof Error ? monthError.message : "No se pudo cargar el mes");
 } finally {
 if (active) {
 setLoading(false);
 setAutosaveReady(true);
 }
 }
 };

 void loadMonth();
 return () => {
 active = false;
 };
 }, [selectedMonth]);

 useEffect(() => {
 if (!autosaveReady || loading) {
 return;
 }

 const timeout = window.setTimeout(() => {
 void (async () => {
 try {
 await upsertCashFlowEntry(entry);
 const savedHistory = await listCashFlowEntries();
 setHistory(savedHistory);
 setSavedAt(new Date().toLocaleTimeString("es-MX"));
 await refreshGuidance(settings, progress, savedHistory);
 } catch (saveError) {
 console.error(saveError instanceof Error ? saveError.message : "No se pudo guardar");
 }
 })();
 }, 500);

 return () => {
 window.clearTimeout(timeout);
 };
 }, [autosaveReady, entry, loading, progress, settings]);

 const monthSummary = useMemo(() => computeMonthCashFlow(entry), [entry]);

 const monthBars = useMemo(
 () => [
 {
 name: "Ingresos",
 projected: monthSummary.projectedTotalInflows,
 actual: monthSummary.actualTotalInflows,
 },
 {
 name: "Egresos",
 projected: monthSummary.projectedTotalOutflows,
 actual: monthSummary.actualTotalOutflows,
 },
 ],
 [monthSummary],
 );

 const trendSeries = useMemo(
 () =>
 [...history]
 .sort((a, b) => a.month.localeCompare(b.month))
 .map((item) => {
 const totals = computeMonthCashFlow(item);
 return {
 month: item.month,
 projectedEnding: totals.projectedEndingBalance,
 actualEnding: totals.actualEndingBalance,
 };
 }),
 [history],
 );

 const hasOnlySampleData = history.length > 0 && history.every((item) => item.seedSource === "sample");
 const exportPreview = useMemo(() => buildCashFlowCsv(history), [history]);
 const hasExportableData = exportPreview.rows.length > 0 && !hasOnlySampleData;
 const hasActiveSample =
 sampleState === "active" && history.some((item) => item.seedSource === "sample");
 const currentStepId =
  progress.toolStepProgress.cashflow?.currentStepId ?? getDefaultStepId(CASHFLOW_GUIDE_SPEC);
 const currentStep = getStepById(CASHFLOW_GUIDE_SPEC, currentStepId) ?? CASHFLOW_GUIDE_SPEC.steps[0];
 const completedStepIds = progress.toolStepProgress.cashflow?.completedStepIds ?? [];
 const purposeBlockId = "cashflow-purpose";

 const tips = useMemo(() => {
 if (!guidance) {
 return [];
 }
 return getVisibleTips({
 route: "cashflow",
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
  const nextProgress = await setToolCurrentStep("cashflow", stepId);
  setProgress(nextProgress);
 }

 async function handleCompleteStep(stepId: string) {
  const nextProgress = await completeToolStep("cashflow", stepId);
  setProgress(nextProgress);
 }

 async function handleNextStep() {
  const nextStepId = getNextStepId(CASHFLOW_GUIDE_SPEC, currentStepId);
  const nextProgress = await setToolCurrentStep("cashflow", nextStepId);
  setProgress(nextProgress);
 }

 async function handleExportCsv() {
 setExportState("exporting");
 setExportMessage(null);

 try {
 const entries = await listCashFlowEntries();
 const onlySample = entries.length > 0 && entries.every((row) => row.seedSource === "sample");
 if (onlySample) {
 setExportState("error");
 setExportMessage("Primero reemplaza o elimina el ejemplo para exportar datos reales.");
 return;
 }

 const csvRows = buildCashFlowCsv(entries);
 if (csvRows.rows.length === 0) {
 setExportState("error");
 setExportMessage("No hay datos exportables para CSV.");
 return;
 }

 const csv = buildCsv(csvRows.headers, csvRows.rows);
 const filename = createCsvFilename("cash-flow-all-months");
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
 await clearSampleDataForTool("cashflow");
 const nextProgress = await setToolSampleState("cashflow", "dismissed");
 const [monthEntry, historyRows] = await Promise.all([
 getCashFlowEntry(selectedMonth),
 listCashFlowEntries(),
 ]);

 setProgress(nextProgress);
 setSampleStateValue("dismissed");
 setEntry(monthEntry ?? createEntry(selectedMonth));
 setHistory(historyRows);
 setExportMessage("Datos de ejemplo eliminados.");
 setExportState("success");
 await refreshGuidance(settings, nextProgress, historyRows);
 }

 function updateLine(
 section: CashFlowSection,
 index: number,
 field: CashFlowLineField,
 value: string,
 ) {
 setEntry((prev) => ({
 ...prev,
 seedSource: "user",
 [section]: upsertLine(prev[section], index, field, value),
 }));
 void markSampleConsumed();
 }

 function addLine(section: CashFlowSection) {
 setEntry((prev) => ({
 ...prev,
 seedSource: "user",
 [section]: [...prev[section], createEmptyLine()],
 }));
 void markSampleConsumed();
 }

 function removeLine(section: CashFlowSection, index: number) {
 setEntry((prev) => {
 const filtered = prev[section].filter((_, lineIndex) => lineIndex !== index);
 return {
 ...prev,
 seedSource: "user",
 [section]: filtered.length > 0 ? filtered : [createEmptyLine()],
 };
 });
 void markSampleConsumed();
 }

 return (
 <div className="space-y-8 pb-12">
 {/* Header Panel */}
 <section className="panel-soft p-8 md:p-12 relative overflow-hidden group">
 <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
 <span className="material-symbols-outlined text-[200px] text-[var(--foreground)]">account_balance_wallet</span>
 </div>
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
 <div>
 <div className="flex items-center gap-3 mb-4">
 <span className="h-3 w-3 bg-[var(--primary)] animate-pulse"></span>
          <h2 className="text-[var(--foreground)]/50 text-sm font-bold tracking-widest uppercase">Herramientas &gt; Gestión Mensual</h2>
 </div>
 <h1 className="text-[var(--foreground)] text-5xl md:text-7xl font-black tracking-tighter leading-none">
 Flujo de Caja
 </h1>
 <p className="mt-6 text-[var(--foreground)]/60 max-w-xl text-lg font-medium leading-relaxed">
 Gestiona el movimiento de efectivo de tu negocio. Compara proyectado contra real para tomar decisiones con confianza.
 </p>
 <div className="mt-8 flex flex-wrap gap-3 items-center">
 {hasActiveSample && (
 <button type="button" className="btn-secondary" onClick={() => void handleClearSample()}>
 Eliminar ejemplo
 </button>
 )}
 <button
 type="button"
 className="btn-primary"
 onClick={() => void handleExportCsv()}
 disabled={!hasExportableData || exportState === "exporting"}
 >
 {exportState === "exporting" ? "Exportando..." : "Exportar CSV"}
 </button>
 <CurrencyModeBadge settings={settings} />
 </div>
 </div>
 <div className="flex flex-col gap-3 text-right">
 {savedAt && (
 <div className="flex items-center justify-end gap-2 text-[var(--foreground)]/40 text-xs font-bold uppercase tracking-wide">
              <span>Último guardado: {savedAt}</span>
 <span className="material-symbols-outlined text-sm">cloud_done</span>
 </div>
 )}
 {exportMessage && (
 <p className={`text-sm font-bold ${exportState === "error" ? "text-[var(--danger)]" : "text-[var(--primary)]"}`}>
 {exportMessage}
 </p>
 )}
 </div>
 </div>
 </section>

 {guidance ? (
 <StageGuidanceCard
 guidance={guidance}
 compact
 note={getToolRecommendation("cashflow", guidance.currentStage, currentStep.title)}
 />
 ) : null}

 <ToolPurposeCard
 guide={CASHFLOW_GUIDE_SPEC}
 blockId={purposeBlockId}
 dismissed={progress.dismissedGuideBlocks.includes(purposeBlockId)}
 onDismiss={handleDismissPurpose}
 />

 <ToolStepper
 guide={CASHFLOW_GUIDE_SPEC}
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

 {/* Control Settings Bento */}
 <section className="panel-light p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-lg">
 <div className="flex-1 w-full space-y-3">
 <label className="text-xs font-bold text-[#1A1A1A]/60 uppercase tracking-widest">Mes Operativo</label>
 <input
 className="w-full border-2 border-[rgba(0,0,0,0.1)] bg-white px-6 py-4 text-[#1A1A1A] font-bold text-lg lg:text-xl focus:outline-none focus:border-[#84B13B] transition-colors"
 type="month"
 value={selectedMonth}
 onChange={(event) => setSelectedMonth(event.target.value)}
 />
 </div>
 <div className="flex-1 w-full space-y-3">
 <label className="text-xs font-bold text-[#1A1A1A]/60 uppercase tracking-widest">Saldo Inicial</label>
 <input
 className="w-full border-2 border-[rgba(0,0,0,0.1)] bg-white px-6 py-4 text-[#1A1A1A] font-bold text-lg lg:text-xl focus:outline-none focus:border-[#84B13B] transition-colors font-mono"
 type="number"
 step="0.01"
 value={entry.startingBalance}
 onChange={(event) => {
 setEntry((prev) => ({
 ...prev,
 seedSource: "user",
 startingBalance: parseNumberInput(event.target.value),
 }));
 void markSampleConsumed();
 }}
 />
 </div>
 </section>

 {/* Massive Balance Info Panel */}
 <section className="bg-[#171717] hover-lift p-8 md:p-12 border border-neutral-800 relative overflow-hidden group">
 <div className="flex flex-col md:flex-row justify-between md:items-end gap-8 relative z-10">
 <div>
 <div className="flex items-center gap-3 mb-4">
 <span className="material-symbols-outlined text-white/70 p-2 bg-white/10 ">account_balance</span>
 <h3 className="text-white/50 text-sm font-bold uppercase tracking-widest">Resumen del Mes</h3>
 </div>
 <p className="text-white text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-none mb-2 break-words">
 {formatAmountByDisplayMode(monthSummary.actualEndingBalance, settings)}
 </p>
 <p className="text-white/50 text-lg font-bold">Saldo real al cierre</p>
 </div>

 <div className="grid grid-cols-2 gap-x-12 gap-y-6">
 <div>
 <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Total Ingresos</p>
 <p className="text-2xl font-bold text-white">
 {formatAmountByDisplayMode(monthSummary.actualTotalInflows, settings)}
 </p>
 </div>
 <div>
 <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Total Egresos</p>
 <p className="text-2xl font-bold text-white">
 {formatAmountByDisplayMode(monthSummary.actualTotalOutflows, settings)}
 </p>
 </div>
 <div>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Proyección cierre</p>
 <p className="text-2xl font-bold text-white/50">
 {formatAmountByDisplayMode(monthSummary.projectedEndingBalance, settings)}
 </p>
 </div>
 </div>
 </div>
 </section>

 <section className="grid lg:grid-cols-2 gap-8">
 <article className="panel p-6 md:p-8 lg:p-10">
 <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--stroke)]">
 <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">Ingresos</h2>
 <div className="p-2 bg-emerald-500/10 text-emerald-600 ">
 <span className="material-symbols-outlined text-[24px]">arrow_upward</span>
 </div>
 </div>
 <div className="space-y-4">
 <div className="hidden md:grid grid-cols-12 gap-2 text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest px-2 mb-2">
 <div className="col-span-5">Concepto</div>
 <div className="col-span-3 text-right pr-2">Proyectado</div>
 <div className="col-span-3 text-right pr-2">Real</div>
 <div className="col-span-1"></div>
 </div>
 {entry.inflows.map((line, index) => (
 <div key={`inflow-${index}`} className="group grid gap-3 md:grid-cols-12 bg-[var(--panel-soft)] hover:bg-[var(--panel-light)] border border-transparent hover:border-[var(--stroke)] p-3 md:p-2 hover-lift items-center transition-all">
 <input
 className="w-full bg-transparent border-none focus:ring-0 text-[var(--foreground)] font-bold placeholder:text-[var(--foreground)]/40 md:col-span-5 px-4"
                          placeholder="Categoría de ingreso"
 value={line.name}
 onChange={(event) => updateLine("inflows", index, "name", event.target.value)}
 />
 <div className="md:col-span-3 relative">
 <span className="md:hidden absolute left-4 inset-y-0 flex items-center text-xs text-[var(--foreground)]/40 font-bold uppercase tracking-wider">Proy</span>
 <input
 className="w-full bg-white border border-[var(--stroke)] py-2 px-4 text-[var(--foreground)] text-right font-mono focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
 type="number"
 step="0.01"
 value={line.projected}
 onChange={(event) => updateLine("inflows", index, "projected", event.target.value)}
 />
 </div>
 <div className="md:col-span-3 relative">
 <span className="md:hidden absolute left-4 inset-y-0 flex items-center text-xs text-[var(--primary)] font-bold uppercase tracking-wider">Real</span>
 <input
 className="w-full bg-white border border-[var(--stroke)] py-2 px-4 text-[var(--primary)] text-right font-mono font-bold focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
 type="number"
 step="0.01"
 value={line.actual ?? 0}
 onChange={(event) => updateLine("inflows", index, "actual", event.target.value)}
 />
 </div>
 <div className="md:col-span-1 flex justify-end pr-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
 <button
 type="button"
 className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
 onClick={() => removeLine("inflows", index)}
 title="Eliminar fila"
 >
 <span className="material-symbols-outlined text-[18px]">close</span>
 </button>
 </div>
 </div>
 ))}
 </div>
 <button type="button" className="mt-6 flex items-center gap-2 text-[var(--foreground)]/60 hover:text-[var(--primary)] text-sm font-bold uppercase tracking-wide transition-colors" onClick={() => addLine("inflows")}>
 <span className="material-symbols-outlined text-lg">add_circle</span>
 Agregar Fila de Ingreso
 </button>
 </article>

 <article className="panel p-6 md:p-8 lg:p-10">
 <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--stroke)]">
 <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">Egresos</h2>
 <div className="p-2 bg-red-500/10 text-[var(--danger)] ">
 <span className="material-symbols-outlined text-[24px]">arrow_downward</span>
 </div>
 </div>
 <div className="space-y-4">
 <div className="hidden md:grid grid-cols-12 gap-2 text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest px-2 mb-2">
 <div className="col-span-5">Concepto</div>
 <div className="col-span-3 text-right pr-2">Proyectado</div>
 <div className="col-span-3 text-right pr-2">Real</div>
 <div className="col-span-1"></div>
 </div>
 {entry.outflows.map((line, index) => (
 <div key={`outflow-${index}`} className="group grid gap-3 md:grid-cols-12 bg-[var(--panel-soft)] hover:bg-[var(--panel-light)] border border-transparent hover:border-[var(--stroke)] p-3 md:p-2 hover-lift items-center transition-all">
 <input
 className="w-full bg-transparent border-none focus:ring-0 text-[var(--foreground)] font-bold placeholder:text-[var(--foreground)]/40 md:col-span-5 px-4"
                          placeholder="Categoría de egreso"
 value={line.name}
 onChange={(event) => updateLine("outflows", index, "name", event.target.value)}
 />
 <div className="md:col-span-3 relative">
 <span className="md:hidden absolute left-4 inset-y-0 flex items-center text-xs text-[var(--foreground)]/40 font-bold uppercase tracking-wider">Proy</span>
 <input
 className="w-full bg-white border border-[var(--stroke)] py-2 px-4 text-[var(--foreground)] text-right font-mono focus:border-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--stroke)] transition-all"
 type="number"
 step="0.01"
 value={line.projected}
 onChange={(event) => updateLine("outflows", index, "projected", event.target.value)}
 />
 </div>
 <div className="md:col-span-3 relative">
 <span className="md:hidden absolute left-4 inset-y-0 flex items-center text-xs text-red-500 font-bold uppercase tracking-wider">Real</span>
 <input
 className="w-full bg-white border border-red-200 py-2 px-4 text-red-600 text-right font-mono font-bold focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400/50 transition-all"
 type="number"
 step="0.01"
 value={line.actual ?? 0}
 onChange={(event) => updateLine("outflows", index, "actual", event.target.value)}
 />
 </div>
 <div className="md:col-span-1 flex justify-end pr-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
 <button
 type="button"
 className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
 onClick={() => removeLine("outflows", index)}
 title="Eliminar fila"
 >
 <span className="material-symbols-outlined text-[18px]">close</span>
 </button>
 </div>
 </div>
 ))}
 </div>
 <button type="button" className="mt-6 flex items-center gap-2 text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors text-sm font-bold uppercase tracking-wide" onClick={() => addLine("outflows")}>
 <span className="material-symbols-outlined text-lg">add_circle</span>
 Agregar Fila de Egreso
 </button>
 </article>
 </section>

 <section className="grid gap-8 lg:grid-cols-2">
 <article className="panel p-6 md:p-8 lg:p-10 flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-2">
 <span className="material-symbols-outlined text-[var(--foreground)]/30">stacked_bar_chart</span>
 <h2 className="text-[var(--foreground)] text-lg font-bold tracking-tight">Comparativa Proyectado vs Real</h2>
 </div>
 <p className="text-[var(--foreground)]/40 text-xs uppercase tracking-widest font-bold mb-8">Egresos e Ingresos del Mes</p>
 </div>
 <div className="h-72 w-full">
 <StableResponsiveChart
 minWidth={320}
 minHeight={250}
                    fallback={<p className="text-sm text-[var(--foreground)]/40">Cargando gráfico...</p>}
 >
 <BarChart data={monthBars} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <CartesianGrid stroke="var(--stroke)" strokeDasharray="3 3" vertical={false} />
 <XAxis dataKey="name" stroke="none" tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 12, fontWeight: 700 }} tickMargin={10} />
 <YAxis stroke="none" tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
 <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--foreground)', fontWeight: 'bold' }} itemStyle={{ color: 'var(--primary)' }} />
 <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }} />
 <Bar dataKey="projected" fill="var(--secondary)" name="Proyectado" radius={[4, 4, 0, 0]} barSize={32} />
 <Bar dataKey="actual" fill="var(--primary)" name="Real" radius={[4, 4, 0, 0]} barSize={32} />
 </BarChart>
 </StableResponsiveChart>
 </div>
 </article>

 <article className="panel p-6 md:p-8 lg:p-10 flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-2">
 <span className="material-symbols-outlined text-[var(--foreground)]/30">monitoring</span>
                <h2 className="text-[var(--foreground)] text-lg font-bold tracking-tight">Tendencia histórica</h2>
 </div>
 <p className="text-[var(--foreground)]/40 text-xs uppercase tracking-widest font-bold mb-8">Todos los meses registrados</p>
 </div>
 <div className="h-72 w-full">
 <StableResponsiveChart
 minWidth={320}
 minHeight={250}
                    fallback={<p className="text-sm text-[var(--foreground)]/40">Cargando gráfico...</p>}
 >
 <LineChart data={trendSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <CartesianGrid stroke="var(--stroke)" strokeDasharray="3 3" vertical={false} />
 <XAxis dataKey="month" stroke="none" tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 12, fontWeight: 700 }} tickMargin={10} />
 <YAxis stroke="none" tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
 <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
 <Legend iconType="plainline" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
 <Line
 type="monotone"
 dataKey="projectedEnding"
 stroke="var(--secondary)"
 strokeWidth={3}
 dot={{ r: 4, fill: '#FFFFFF', stroke: 'var(--secondary)', strokeWidth: 2 }}
 name="Saldo Proyectado"
 />
 <Line
 type="monotone"
 dataKey="actualEnding"
 stroke="var(--primary)"
 strokeWidth={3}
 dot={{ r: 6, fill: 'var(--primary)', stroke: '#FFFFFF', strokeWidth: 3 }}
 activeDot={{ r: 8, fill: 'var(--primary)' }}
 name="Saldo Real"
 />
 </LineChart>
 </StableResponsiveChart>
 </div>
 </article>
 </section>

 <MicrotipsPanel tips={tips} onDismiss={handleDismissTip} />
 </div>
 );
}

