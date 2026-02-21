"use client";

import { useEffect, useMemo, useState } from "react";
import {
 Cell,
 Line,
 LineChart,
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
import { computeBudgetLineTotals } from "@/lib/calculations/budget";
import { computeMonthCashFlow } from "@/lib/calculations/cashflow";
import { deriveKpiSummary } from "@/lib/calculations/kpi";
import { formatAmountByDisplayMode } from "@/lib/currency";
import { DEFAULT_PROGRESS, DEFAULT_SETTINGS } from "@/lib/defaults";
import type {
 AnnualBudget,
 AppSettings,
 CashFlowEntry,
 CostExpenseEntry,
 ProgressState,
 ToolSampleState,
} from "@/lib/domain";
import { getToolRecommendation } from "@/lib/guidance/recommendations";
import {
 getBudgetSample,
 getCashFlowSampleEntries,
 getCostsSampleEntries,
} from "@/lib/guidance/sample-data";
import { deriveGuidanceSummary, type GuidanceSummary } from "@/lib/guidance/summary";
import { getVisibleTips } from "@/lib/guidance/tips";
import {
 getDefaultStepId,
 getNextStepId,
 getStepById,
 resolveToolGuideSpec,
} from "@/lib/guidance/tool-guidance";
import {
 addCostEntries,
 clearSampleDataForTool,
 completeToolStep,
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
 upsertBudget,
 upsertCashFlowEntries,
} from "@/lib/repo";
import { chartTheme } from "@/lib/theme";

const PIE_COLORS = [chartTheme.chartPrimary, chartTheme.chartAccent, chartTheme.chartMuted];

function formatPercent(value: number | null): string {
 if (value === null) {
 return "N/A";
 }
 return `${value.toFixed(2)}%`;
}

function computeTaxesAndInterestFromBudget(budget: AnnualBudget | null): number {
 if (!budget) {
 return 0;
 }

 return budget.expenseLines.reduce((total, line) => {
 const matchesTaxes = /(tax|impuesto|interes|interest)/i.test(line.name);
 if (!matchesTaxes) {
 return total;
 }
 return total + line.actualByMonth.reduce((lineTotal, value) => lineTotal + value, 0);
 }, 0);
}

const KPIS_GUIDE_SPEC = resolveToolGuideSpec({
 toolId: "kpis",
 fieldKeys: [
 "source-cashflow",
 "source-costs",
 "source-budget",
 "grossMargin",
 "runwayMonths",
 "kpi-thresholds",
 ],
 resultKeys: ["margins.grossMargin", "margins.netMargin", "runwayMonths"],
});

export default function KpiDashboardPage() {
 const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
 const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);
 const [guidance, setGuidance] = useState<GuidanceSummary | null>(null);
 const [sampleState, setSampleStateValue] = useState<ToolSampleState | undefined>(undefined);
 const [cashflow, setCashflow] = useState<CashFlowEntry[]>([]);
 const [costs, setCosts] = useState<CostExpenseEntry[]>([]);
 const [latestBudget, setLatestBudget] = useState<AnnualBudget | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [message, setMessage] = useState<string | null>(null);

 async function refreshGuidance(
 overrideSettings?: AppSettings,
 overrideProgress?: ProgressState,
 overrideCashflow?: CashFlowEntry[],
 overrideCosts?: CostExpenseEntry[],
 overrideBudgets?: AnnualBudget[],
 ) {
 const [savedSettings, savedProgress, cashFlowRows, costRows, budgetRows, breakEven] =
 await Promise.all([
 overrideSettings ? Promise.resolve(overrideSettings) : getSettings(),
 overrideProgress ? Promise.resolve(overrideProgress) : getProgress(),
 overrideCashflow ? Promise.resolve(overrideCashflow) : listCashFlowEntries(),
 overrideCosts ? Promise.resolve(overrideCosts) : listCostEntries(),
 overrideBudgets ? Promise.resolve(overrideBudgets) : listBudgets(),
 getBreakEvenModel(),
 ]);

 setSettings(savedSettings);
 setProgress(savedProgress);
 setGuidance(
 deriveGuidanceSummary({
 settings: savedSettings,
 progress: savedProgress,
 cashflow: cashFlowRows,
 costs: costRows,
 budgets: budgetRows,
 breakEven,
 }),
 );
 }

 useEffect(() => {
 let active = true;
 const load = async () => {
 try {
 const [savedSettings, savedProgress] = await Promise.all([getSettings(), getProgress()]);
 let cashFlowRows = await listCashFlowEntries();
 let costRows = await listCostEntries();
 let budgetRows = await listBudgets();
 let nextProgress = savedProgress;
 if (!savedProgress.toolStepProgress.kpis?.currentStepId) {
 nextProgress = await setToolCurrentStep("kpis", getDefaultStepId(KPIS_GUIDE_SPEC));
 }

 const currentSampleState = savedProgress.toolSampleState.kpis;
 const canSeedSample = currentSampleState !== "dismissed" && currentSampleState !== "consumed";

 if (cashFlowRows.length === 0 && costRows.length === 0 && budgetRows.length === 0 && canSeedSample) {
 await Promise.all([
 upsertCashFlowEntries(getCashFlowSampleEntries()),
 addCostEntries(getCostsSampleEntries()),
 upsertBudget(getBudgetSample()),
 ]);

 nextProgress = await setToolSampleState("cashflow", "active");
 nextProgress = await setToolSampleState("costs", "active");
 nextProgress = await setToolSampleState("budget", "active");
 nextProgress = await setToolSampleState("kpis", "active");

 cashFlowRows = await listCashFlowEntries();
 costRows = await listCostEntries();
 budgetRows = await listBudgets();
 }

 if (!active) {
 return;
 }

 setSettings(savedSettings);
 setProgress(nextProgress);
 setSampleStateValue(nextProgress.toolSampleState.kpis);
 setCashflow(cashFlowRows);
 setCosts(costRows);
 const latest = [...budgetRows].sort((a, b) => a.year - b.year).at(-1) ?? null;
 setLatestBudget(latest);
 await refreshGuidance(savedSettings, nextProgress, cashFlowRows, costRows, budgetRows);
 } catch (loadError) {
 if (!active) {
 return;
 }
 setError(loadError instanceof Error ? loadError.message : "No se pudo cargar indicadores");
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

 const revenue = useMemo(() => {
 if (!latestBudget) {
 return 0;
 }
 return computeBudgetLineTotals(latestBudget.incomeLines).actualTotal;
 }, [latestBudget]);

 const directCosts = useMemo(
 () =>
 costs
 .filter((entry) => entry.type === "fixed_cost" || entry.type === "variable_cost")
 .reduce((total, entry) => total + entry.amount, 0),
 [costs],
 );

 const operatingExpenses = useMemo(
 () =>
 costs
 .filter((entry) => entry.type === "expense")
 .reduce((total, entry) => total + entry.amount, 0),
 [costs],
 );

 const taxesAndInterest = useMemo(
 () => computeTaxesAndInterestFromBudget(latestBudget),
 [latestBudget],
 );

 const kpiSummary = useMemo(
 () =>
 deriveKpiSummary({
 revenue,
 directCosts,
 operatingExpenses,
 taxesAndInterest,
 cashFlowMonths: cashflow,
 costEntries: costs,
 budget: latestBudget,
 }),
 [cashflow, costs, directCosts, latestBudget, operatingExpenses, revenue, taxesAndInterest],
 );

 const cashflowTrend = useMemo(
 () =>
 [...cashflow]
 .sort((a, b) => a.month.localeCompare(b.month))
 .map((entry) => {
 const totals = computeMonthCashFlow(entry);
 return {
 month: entry.month,
 projected: totals.projectedEndingBalance,
 actual: totals.actualEndingBalance,
 };
 }),
 [cashflow],
 );

 const costPieData = useMemo(() => {
 const fixed = costs
 .filter((entry) => entry.type === "fixed_cost")
 .reduce((total, entry) => total + entry.amount, 0);
 const variable = costs
 .filter((entry) => entry.type === "variable_cost")
 .reduce((total, entry) => total + entry.amount, 0);
 const expenses = costs
 .filter((entry) => entry.type === "expense")
 .reduce((total, entry) => total + entry.amount, 0);

 return [
 { name: "Costos fijos", value: fixed },
 { name: "Costos variables", value: variable },
 { name: "Gastos", value: expenses },
 ].filter((entry) => entry.value > 0);
 }, [costs]);

 const hasOnlySampleData =
 (cashflow.length > 0 || costs.length > 0 || Boolean(latestBudget)) &&
 cashflow.every((entry) => entry.seedSource === "sample") &&
 costs.every((entry) => entry.seedSource === "sample") &&
 (latestBudget ? latestBudget.seedSource === "sample" : true);

 const hasActiveSample = sampleState === "active" && hasOnlySampleData;
 const currentStepId =
  progress.toolStepProgress.kpis?.currentStepId ?? getDefaultStepId(KPIS_GUIDE_SPEC);
 const currentStep = getStepById(KPIS_GUIDE_SPEC, currentStepId) ?? KPIS_GUIDE_SPEC.steps[0];
 const completedStepIds = progress.toolStepProgress.kpis?.completedStepIds ?? [];
 const purposeBlockId = "kpis-purpose";

 const tips = useMemo(() => {
 if (!guidance) {
 return [];
 }
 return getVisibleTips({
 route: "kpis",
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
  const nextProgress = await setToolCurrentStep("kpis", stepId);
  setProgress(nextProgress);
 }

 async function handleCompleteStep(stepId: string) {
  const nextProgress = await completeToolStep("kpis", stepId);
  setProgress(nextProgress);
 }

 async function handleNextStep() {
  const nextStepId = getNextStepId(KPIS_GUIDE_SPEC, currentStepId);
  const nextProgress = await setToolCurrentStep("kpis", nextStepId);
  setProgress(nextProgress);
 }

 async function handleClearSample() {
 await clearSampleDataForTool("kpis");
 let nextProgress = await setToolSampleState("cashflow", "dismissed");
 nextProgress = await setToolSampleState("costs", "dismissed");
 nextProgress = await setToolSampleState("budget", "dismissed");
 nextProgress = await setToolSampleState("kpis", "dismissed");

 const [cashFlowRows, costRows, budgetRows] = await Promise.all([
 listCashFlowEntries(),
 listCostEntries(),
 listBudgets(),
 ]);

 setCashflow(cashFlowRows);
 setCosts(costRows);
 setLatestBudget([...budgetRows].sort((a, b) => a.year - b.year).at(-1) ?? null);
 setProgress(nextProgress);
 setSampleStateValue("dismissed");
 setMessage("Datos de ejemplo eliminados.");
 await refreshGuidance(settings, nextProgress, cashFlowRows, costRows, budgetRows);
 }

 if (loading) {
 return <p className="text-sm text-neutral-500">Cargando dashboard...</p>;
 }

 return (
 <div className="space-y-6">
 <section className="panel-soft p-6">
 <div className="flex flex-wrap items-start justify-between gap-3">
 <div>
 <h1 className="section-title text-4xl text-black">Dashboard de indicadores KPI</h1>
 <p className="mt-2 text-neutral-700">
 Indicadores derivados desde flujo de caja, presupuesto y costos.
 </p>
 <CurrencyModeBadge settings={settings} />
 </div>
 {hasActiveSample ? (
 <button type="button" className="btn-secondary" onClick={() => void handleClearSample()}>
 Eliminar ejemplo
 </button>
 ) : null}
 </div>
 {message ? <p className="mt-2 text-xs text-emerald-700">{message}</p> : null}
 </section>

 {guidance ? (
 <StageGuidanceCard
 guidance={guidance}
 compact
 note={getToolRecommendation("kpis", guidance.currentStage, currentStep.title)}
 />
 ) : null}

 <ToolPurposeCard
 guide={KPIS_GUIDE_SPEC}
 blockId={purposeBlockId}
 dismissed={progress.dismissedGuideBlocks.includes(purposeBlockId)}
 onDismiss={handleDismissPurpose}
 />

 <ToolStepper
 guide={KPIS_GUIDE_SPEC}
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

 <section className="grid gap-4 md:grid-cols-4">
 <article className="panel p-5">
 <h2 className="text-sm font-medium text-neutral-600">Margen bruto</h2>
 <p className="metric-value mt-2 text-black">{formatPercent(kpiSummary.margins.grossMargin)}</p>
 </article>
 <article className="panel p-5">
 <h2 className="text-sm font-medium text-neutral-600">Margen neto</h2>
 <p className="metric-value mt-2 text-black">{formatPercent(kpiSummary.margins.netMargin)}</p>
 </article>
 <article className="panel p-5">
 <h2 className="text-sm font-medium text-neutral-600">Saldo proyectado</h2>
 <p className="metric-value mt-2 text-black">
 {formatAmountByDisplayMode(kpiSummary.cashFlowProjectedBalance, settings)}
 </p>
 </article>
 <article className="panel p-5">
 <h2 className="text-sm font-medium text-neutral-600">Registros de costos</h2>
 <p className="metric-value mt-2 text-black">{kpiSummary.costsCount}</p>
 </article>
 </section>

 <section className="panel p-5">
 <h2 className="section-title text-2xl text-black">Indicadores KPI (capitulo 14)</h2>
 <div className="mt-3 grid gap-3 text-sm text-neutral-700 md:grid-cols-3">
 <p>
 <span className="font-semibold text-black">Liquidez corriente:</span>{" "}
 {kpiSummary.cap14.currentRatio === null ? "N/A" : kpiSummary.cap14.currentRatio.toFixed(2)}
 </p>
 <p>
 <span className="font-semibold text-black">Prueba acida:</span>{" "}
 {kpiSummary.cap14.acidTest === null ? "N/A" : kpiSummary.cap14.acidTest.toFixed(2)}
 </p>
 <p>
 <span className="font-semibold text-black">ROA (Retorno sobre activos):</span>{" "}
 {kpiSummary.cap14.roa === null ? "N/A" : `${kpiSummary.cap14.roa.toFixed(2)}%`}
 </p>
 <p>
 <span className="font-semibold text-black">Rotacion inventario:</span>{" "}
 {kpiSummary.cap14.inventoryTurnover === null
 ? "N/A"
 : kpiSummary.cap14.inventoryTurnover.toFixed(2)}
 </p>
 <p>
 <span className="font-semibold text-black">Dias de cobro:</span>{" "}
 {kpiSummary.cap14.daysSalesOutstanding === null
 ? "N/A"
 : `${kpiSummary.cap14.daysSalesOutstanding.toFixed(2)} dias`}
 </p>
 <p>
 <span className="font-semibold text-black">Burn rate (consumo de caja):</span>{" "}
 {formatAmountByDisplayMode(kpiSummary.cap14.burnRate, settings)}
 </p>
 <p>
 <span className="font-semibold text-black">Runway (meses de caja):</span>{" "}
 {kpiSummary.cap14.runwayMonths === null
 ? "N/A"
 : `${kpiSummary.cap14.runwayMonths.toFixed(2)} meses`}
 </p>
 </div>
 </section>

 <section className="grid gap-4 md:grid-cols-2">
 <article className="panel p-5">
 <h2 className="section-title text-2xl text-black">Tendencia de saldo</h2>
 <div className="mt-3 h-72">
 <StableResponsiveChart
 minWidth={320}
 minHeight={240}
 fallback={<p className="text-sm text-neutral-500">Cargando grafico...</p>}
 >
 <LineChart data={cashflowTrend}>
 <XAxis dataKey="month" stroke={chartTheme.chartMuted} />
 <YAxis stroke={chartTheme.chartMuted} />
 <Tooltip />
 <Line dataKey="projected" stroke={chartTheme.chartPrimary} strokeWidth={2} />
 <Line dataKey="actual" stroke={chartTheme.chartAccent} strokeWidth={2} />
 </LineChart>
 </StableResponsiveChart>
 </div>
 </article>

 <article className="panel p-5">
 <h2 className="section-title text-2xl text-black">Composicion de costos</h2>
 <div className="mt-3 h-72">
 {costPieData.length > 0 ? (
 <StableResponsiveChart
 minWidth={320}
 minHeight={240}
 fallback={<p className="text-sm text-neutral-500">Cargando grafico...</p>}
 >
 <PieChart>
 <Pie data={costPieData} dataKey="value" nameKey="name" outerRadius={95} label>
 {costPieData.map((entry, index) => (
 <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
 ))}
 </Pie>
 <Tooltip />
 </PieChart>
 </StableResponsiveChart>
 ) : (
 <p className="text-sm text-neutral-500">Sin datos de costos para mostrar.</p>
 )}
 </div>
 </article>
 </section>

 <section className="panel p-5">
 <h2 className="section-title text-2xl text-black">Base del calculo</h2>
 <div className="mt-3 grid gap-3 text-sm text-neutral-700 md:grid-cols-2">
 <p>Revenue: {formatAmountByDisplayMode(revenue, settings)}</p>
 <p>Direct costs: {formatAmountByDisplayMode(directCosts, settings)}</p>
 <p>Operating expenses: {formatAmountByDisplayMode(operatingExpenses, settings)}</p>
 <p>Taxes and interest: {formatAmountByDisplayMode(taxesAndInterest, settings)}</p>
 <p>Budget year: {kpiSummary.latestBudgetYear ?? "N/A"}</p>
 </div>
 </section>

 <MicrotipsPanel tips={tips} onDismiss={handleDismissTip} />

 {error ? <p className="text-sm text-red-700">{error}</p> : null}
 </div>
 );
}



