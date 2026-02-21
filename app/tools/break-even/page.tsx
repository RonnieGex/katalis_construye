"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { CurrencyModeBadge } from "@/components/currency-mode-badge";
import { FieldGuideHint } from "@/components/field-guide-hint";
import { MicrotipsPanel } from "@/components/microtips-panel";
import { StableResponsiveChart } from "@/components/stable-responsive-chart";
import { StageGuidanceCard } from "@/components/stage-guidance-card";
import { ToolPurposeCard } from "@/components/tool-purpose-card";
import { ToolStepper } from "@/components/tool-stepper";
import {
 computeSingleProductBreakEven,
 computeWeightedContributionMargin,
} from "@/lib/calculations/breakeven";
import { formatAmountByDisplayMode } from "@/lib/currency";
import { DEFAULT_BREAKEVEN, DEFAULT_PROGRESS, DEFAULT_SETTINGS } from "@/lib/defaults";
import type { AppSettings, BreakEvenModel, ProgressState, ToolSampleState } from "@/lib/domain";
import { getToolRecommendation } from "@/lib/guidance/recommendations";
import { getBreakEvenSampleModel } from "@/lib/guidance/sample-data";
import { deriveGuidanceSummary, type GuidanceSummary } from "@/lib/guidance/summary";
import { getVisibleTips } from "@/lib/guidance/tips";
import {
 getDefaultStepId,
 getNextStepId,
 getStepById,
 resolveToolGuideSpec,
} from "@/lib/guidance/tool-guidance";
import {
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
 saveBreakEvenModel,
 setToolCurrentStep,
 setToolSampleState,
} from "@/lib/repo";
import { chartTheme } from "@/lib/theme";

function parseNumber(value: string): number {
 const parsed = Number(value);
 if (!Number.isFinite(parsed)) {
 return 0;
 }
 return parsed;
}

function parseOptionalNumber(value: string): number | undefined {
 if (value.trim() === "") {
 return undefined;
 }
 const parsed = Number(value);
 if (!Number.isFinite(parsed)) {
 return undefined;
 }
 return parsed;
}

function createDefaultModel(): BreakEvenModel {
 return {
 ...DEFAULT_BREAKEVEN,
 singleProduct: { ...(DEFAULT_BREAKEVEN.singleProduct ?? { price: 0, variableCost: 0 }) },
 multiProduct: {
 products: [...(DEFAULT_BREAKEVEN.multiProduct?.products ?? [])],
 },
 scenarios: [...DEFAULT_BREAKEVEN.scenarios],
 seedSource: "user",
 };
}

function isModelEmpty(model: BreakEvenModel): boolean {
 const hasFixed = model.fixedCosts !== 0;
 const hasSingle = (model.singleProduct?.price ?? 0) !== 0 || (model.singleProduct?.variableCost ?? 0) !== 0;
 const hasProducts = (model.multiProduct?.products ?? []).some(
 (product) =>
 product.price !== 0 ||
 product.variableCost !== 0 ||
 product.salesMixPct !== 0,
 );
 const hasScenarios = model.scenarios.length > 0;
 return !(hasFixed || hasSingle || hasProducts || hasScenarios);
}

const BREAKEVEN_GUIDE_SPEC = resolveToolGuideSpec({
 toolId: "breakeven",
 fieldKeys: [
 "fixedCosts",
 "singleProduct.price",
 "singleProduct.variableCost",
 "multiProduct.products",
 "scenarios",
 "units",
 ],
 resultKeys: ["units"],
});

export default function BreakEvenToolPage() {
 const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
 const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);
 const [guidance, setGuidance] = useState<GuidanceSummary | null>(null);
 const [sampleState, setSampleStateValue] = useState<ToolSampleState | undefined>(undefined);
 const [model, setModel] = useState<BreakEvenModel>(createDefaultModel);
 const [loading, setLoading] = useState(true);
 const [autosaveReady, setAutosaveReady] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [savedAt, setSavedAt] = useState<string | null>(null);

 async function refreshGuidance(
 overrideSettings?: AppSettings,
 overrideProgress?: ProgressState,
 overrideModel?: BreakEvenModel,
 ) {
 const [savedSettings, savedProgress, cashflow, costs, budgets, breakEven] = await Promise.all([
 overrideSettings ? Promise.resolve(overrideSettings) : getSettings(),
 overrideProgress ? Promise.resolve(overrideProgress) : getProgress(),
 listCashFlowEntries(),
 listCostEntries(),
 listBudgets(),
 overrideModel ? Promise.resolve(overrideModel) : getBreakEvenModel(),
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

 const nextProgress = await setToolSampleState("breakeven", "consumed");
 setProgress(nextProgress);
 setSampleStateValue("consumed");
 await refreshGuidance(settings, nextProgress);
 }

 useEffect(() => {
 let active = true;
 const load = async () => {
 try {
 const [savedSettings, savedProgress, savedModel] = await Promise.all([
 getSettings(),
 getProgress(),
 getBreakEvenModel(),
 ]);

 let nextProgress = savedProgress;
 if (!savedProgress.toolStepProgress.breakeven?.currentStepId) {
 nextProgress = await setToolCurrentStep("breakeven", getDefaultStepId(BREAKEVEN_GUIDE_SPEC));
 }
 let nextModel: BreakEvenModel = {
 ...createDefaultModel(),
 ...savedModel,
 singleProduct: {
 ...(createDefaultModel().singleProduct ?? { price: 0, variableCost: 0 }),
 ...(savedModel.singleProduct ?? {}),
 },
 multiProduct: {
 products:
 savedModel.multiProduct?.products.length && savedModel.multiProduct.products.length > 0
 ? savedModel.multiProduct.products
 : createDefaultModel().multiProduct?.products ?? [],
 },
 scenarios: savedModel.scenarios ?? [],
 };

 const currentSampleState = savedProgress.toolSampleState.breakeven;
 const canSeedSample = currentSampleState !== "dismissed" && currentSampleState !== "consumed";

 if (isModelEmpty(nextModel) && canSeedSample) {
 nextModel = getBreakEvenSampleModel();
 await saveBreakEvenModel(nextModel);
 nextProgress = await setToolSampleState("breakeven", "active");
 }

 if (!active) {
 return;
 }

 setSettings(savedSettings);
 setProgress(nextProgress);
 setSampleStateValue(nextProgress.toolSampleState.breakeven);
 setModel(nextModel);
 await refreshGuidance(savedSettings, nextProgress, nextModel);
 } catch (loadError) {
 if (!active) {
 return;
 }
 setError(loadError instanceof Error ? loadError.message : "No se pudo cargar herramienta");
 } finally {
 if (active) {
 setLoading(false);
 setAutosaveReady(true);
 }
 }
 };

 void load();
 return () => {
 active = false;
 };
 }, []);

 useEffect(() => {
 if (!autosaveReady) {
 return;
 }

 const timeout = window.setTimeout(() => {
 void (async () => {
 try {
 await saveBreakEvenModel(model);
 setSavedAt(new Date().toLocaleTimeString("es-MX"));
 await refreshGuidance(settings, progress, model);
 } catch (saveError) {
 setError(saveError instanceof Error ? saveError.message : "No se pudo guardar");
 }
 })();
 }, 500);

 return () => {
 window.clearTimeout(timeout);
 };
 }, [autosaveReady, model, progress, settings]);

 const singleResult = useMemo(
 () =>
 computeSingleProductBreakEven({
 fixedCosts: model.fixedCosts,
 price: model.singleProduct?.price ?? 0,
 variableCost: model.singleProduct?.variableCost ?? 0,
 }),
 [model.fixedCosts, model.singleProduct?.price, model.singleProduct?.variableCost],
 );
 const weightedContribution = useMemo(
 () => computeWeightedContributionMargin(model.multiProduct?.products ?? []),
 [model.multiProduct?.products],
 );
 const weightedUnits = weightedContribution > 0 ? model.fixedCosts / weightedContribution : null;

 const scenarioResults = useMemo(
 () =>
 model.scenarios.map((scenario) => {
 const scenarioInput = {
 fixedCosts: scenario.fixedCosts ?? model.fixedCosts,
 price: scenario.price ?? (model.singleProduct?.price ?? 0),
 variableCost: scenario.variableCost ?? (model.singleProduct?.variableCost ?? 0),
 };
 return {
 scenario,
 result: computeSingleProductBreakEven(scenarioInput),
 };
 }),
 [model.fixedCosts, model.scenarios, model.singleProduct?.price, model.singleProduct?.variableCost],
 );

 const comparisonBars = useMemo(() => {
 const rows = [
 { name: "Simple", margin: singleResult.contributionMargin },
 { name: "Mix", margin: weightedContribution },
 ...scenarioResults.map((item) => ({
 name: item.scenario.name || "Escenario",
 margin: item.result.contributionMargin,
 })),
 ];
 return rows;
 }, [singleResult.contributionMargin, weightedContribution, scenarioResults]);

 const hasActiveSample = sampleState === "active" && model.seedSource === "sample";
 const currentStepId =
  progress.toolStepProgress.breakeven?.currentStepId ?? getDefaultStepId(BREAKEVEN_GUIDE_SPEC);
 const currentStep = getStepById(BREAKEVEN_GUIDE_SPEC, currentStepId) ?? BREAKEVEN_GUIDE_SPEC.steps[0];
 const completedStepIds = progress.toolStepProgress.breakeven?.completedStepIds ?? [];
 const purposeBlockId = "breakeven-purpose";

 const tips = useMemo(() => {
 if (!guidance) {
 return [];
 }
 return getVisibleTips({
 route: "breakeven",
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
  const nextProgress = await setToolCurrentStep("breakeven", stepId);
  setProgress(nextProgress);
 }

 async function handleCompleteStep(stepId: string) {
  const nextProgress = await completeToolStep("breakeven", stepId);
  setProgress(nextProgress);
 }

 async function handleNextStep() {
  const nextStepId = getNextStepId(BREAKEVEN_GUIDE_SPEC, currentStepId);
  const nextProgress = await setToolCurrentStep("breakeven", nextStepId);
  setProgress(nextProgress);
 }

 async function handleClearSample() {
 await clearSampleDataForTool("breakeven");
 const nextProgress = await setToolSampleState("breakeven", "dismissed");
 const fallback = createDefaultModel();
 setProgress(nextProgress);
 setSampleStateValue("dismissed");
 setModel(fallback);
 await refreshGuidance(settings, nextProgress, fallback);
 }

 function updateProduct(
 index: number,
 key: "name" | "price" | "variableCost" | "salesMixPct",
 value: string,
 ) {
 setModel((prev) => ({
 ...prev,
 seedSource: "user",
 multiProduct: {
 products: (prev.multiProduct?.products ?? []).map((product, productIndex) => {
 if (productIndex !== index) {
 return product;
 }
 if (key === "name") {
 return { ...product, name: value };
 }
 return { ...product, [key]: parseNumber(value) };
 }),
 },
 }));
 void markSampleConsumed();
 }

 function addProduct() {
 setModel((prev) => ({
 ...prev,
 seedSource: "user",
 multiProduct: {
 products: [
 ...(prev.multiProduct?.products ?? []),
 { name: "Nuevo producto", price: 0, variableCost: 0, salesMixPct: 0 },
 ],
 },
 }));
 void markSampleConsumed();
 }

 function removeProduct(index: number) {
 setModel((prev) => ({
 ...prev,
 seedSource: "user",
 multiProduct: {
 products:
 (prev.multiProduct?.products ?? []).filter((_, productIndex) => productIndex !== index) ||
 [],
 },
 }));
 void markSampleConsumed();
 }

 function addScenario() {
 setModel((prev) => ({
 ...prev,
 seedSource: "user",
 scenarios: [
 ...prev.scenarios,
 {
 name: `Escenario ${prev.scenarios.length + 1}`,
 fixedCosts: undefined,
 price: undefined,
 variableCost: undefined,
 },
 ],
 }));
 void markSampleConsumed();
 }

 function updateScenario(
 index: number,
 key: "name" | "fixedCosts" | "price" | "variableCost",
 value: string,
 ) {
 setModel((prev) => ({
 ...prev,
 seedSource: "user",
 scenarios: prev.scenarios.map((scenario, scenarioIndex) => {
 if (scenarioIndex !== index) {
 return scenario;
 }
 if (key === "name") {
 return { ...scenario, name: value };
 }
 return { ...scenario, [key]: parseOptionalNumber(value) };
 }),
 }));
 void markSampleConsumed();
 }

 function removeScenario(index: number) {
 setModel((prev) => ({
 ...prev,
 seedSource: "user",
 scenarios: prev.scenarios.filter((_, scenarioIndex) => scenarioIndex !== index),
 }));
 void markSampleConsumed();
 }

 if (loading) {
 return <p className="text-sm text-neutral-500">Cargando herramienta...</p>;
 }

 return (
 <div className="space-y-6">
 <section className="panel-soft p-6">
 <div className="flex flex-wrap items-start justify-between gap-3">
 <div>
 <h1 className="section-title text-4xl text-black">Punto de equilibrio</h1>
 <p className="mt-2 text-neutral-700">Modo simple, multiproducto y simulacion de escenarios.</p>
 <CurrencyModeBadge settings={settings} />
 {savedAt ? <p className="mt-2 text-xs text-neutral-500">Ultimo guardado: {savedAt}</p> : null}
 </div>
 {hasActiveSample ? (
 <button type="button" className="btn-secondary" onClick={() => void handleClearSample()}>
 Eliminar ejemplo
 </button>
 ) : null}
 </div>
 </section>

 {guidance ? (
 <StageGuidanceCard
 guidance={guidance}
 compact
 note={getToolRecommendation("breakeven", guidance.currentStage, currentStep.title)}
 />
 ) : null}

 <ToolPurposeCard
 guide={BREAKEVEN_GUIDE_SPEC}
 blockId={purposeBlockId}
 dismissed={progress.dismissedGuideBlocks.includes(purposeBlockId)}
 onDismiss={handleDismissPurpose}
 />

 <ToolStepper
 guide={BREAKEVEN_GUIDE_SPEC}
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
 <label className="max-w-sm space-y-1 text-sm text-neutral-700">
 Costos fijos
 <input
 className="input-base"
 type="number"
 step="0.01"
 value={model.fixedCosts}
 onChange={(event) => {
 setModel((prev) => ({
 ...prev,
 seedSource: "user",
 fixedCosts: parseNumber(event.target.value),
 }));
 void markSampleConsumed();
 }}
 />
 </label>
 </section>

 <section className="grid gap-4 md:grid-cols-2">
 <article className="panel p-5">
 <h2 className="section-title text-2xl text-black">Modelo simple</h2>
 <div className="mt-3 grid gap-3">
 <label className="space-y-1 text-sm text-neutral-700">
 Precio unitario
 <input
 className="input-base"
 type="number"
 step="0.01"
 value={model.singleProduct?.price ?? 0}
 onChange={(event) => {
 setModel((prev) => ({
 ...prev,
 seedSource: "user",
 singleProduct: {
 price: parseNumber(event.target.value),
 variableCost: prev.singleProduct?.variableCost ?? 0,
 },
 }));
 void markSampleConsumed();
 }}
 />
 </label>
 <label className="space-y-1 text-sm text-neutral-700">
 Costo variable unitario
 <input
 className="input-base"
 type="number"
 step="0.01"
 value={model.singleProduct?.variableCost ?? 0}
 onChange={(event) => {
 setModel((prev) => ({
 ...prev,
 seedSource: "user",
 singleProduct: {
 price: prev.singleProduct?.price ?? 0,
 variableCost: parseNumber(event.target.value),
 },
 }));
 void markSampleConsumed();
 }}
 />
 </label>
 </div>

 <div className="mt-4 space-y-1 text-sm text-neutral-700">
 <p>
 Margen de contribucion:{" "}
 {formatAmountByDisplayMode(singleResult.contributionMargin, settings)}
 </p>
 <p>
 Unidades equilibrio:{" "}
 {singleResult.units === null ? "Sin equilibrio" : singleResult.units.toFixed(2)}
 </p>
 {singleResult.message ? <p className="text-red-700">{singleResult.message}</p> : null}
 </div>
 </article>

 <article className="panel p-5">
 <h2 className="section-title text-2xl text-black">Modelo multiproducto</h2>
 <div className="mt-3 space-y-3">
 {(model.multiProduct?.products ?? []).map((product, index) => (
 <div
 key={`${product.name}-${index}`}
 className="grid gap-2 border border-neutral-300 p-3 md:grid-cols-5"
 >
 <input
 className="input-base"
 value={product.name}
 onChange={(event) => updateProduct(index, "name", event.target.value)}
 />
 <input
 className="input-base"
 type="number"
 step="0.01"
 value={product.price}
 onChange={(event) => updateProduct(index, "price", event.target.value)}
 />
 <input
 className="input-base"
 type="number"
 step="0.01"
 value={product.variableCost}
 onChange={(event) => updateProduct(index, "variableCost", event.target.value)}
 />
 <input
 className="input-base"
 type="number"
 step="0.01"
 value={product.salesMixPct}
 onChange={(event) => updateProduct(index, "salesMixPct", event.target.value)}
 />
 <button type="button" className="btn-secondary" onClick={() => removeProduct(index)}>
 Eliminar
 </button>
 </div>
 ))}
 </div>
 <button type="button" className="btn-secondary mt-3" onClick={() => addProduct()}>
 Agregar producto
 </button>
 <div className="mt-4 space-y-1 text-sm text-neutral-700">
 <p>
 Margen ponderado: {formatAmountByDisplayMode(weightedContribution, settings)}
 </p>
 <p>
 Unidades equilibrio mix: {weightedUnits === null ? "Sin equilibrio" : weightedUnits.toFixed(2)}
 </p>
 </div>
 </article>
 </section>

 <section className="panel p-5">
 <h2 className="section-title text-2xl text-black">Escenarios</h2>
 <div className="mt-3 space-y-3">
 {model.scenarios.map((scenario, index) => {
 const scenarioResult = scenarioResults[index];
 return (
 <div
 key={`${scenario.name}-${index}`}
 className="grid gap-2 border border-neutral-300 p-3 md:grid-cols-6"
 >
 <input
 className="input-base"
 value={scenario.name}
 onChange={(event) => updateScenario(index, "name", event.target.value)}
 />
 <input
 className="input-base"
 type="number"
 placeholder="Costos fijos"
 value={scenario.fixedCosts ?? ""}
 onChange={(event) => updateScenario(index, "fixedCosts", event.target.value)}
 />
 <input
 className="input-base"
 type="number"
 placeholder="Precio"
 value={scenario.price ?? ""}
 onChange={(event) => updateScenario(index, "price", event.target.value)}
 />
 <input
 className="input-base"
 type="number"
 placeholder="Costo variable"
 value={scenario.variableCost ?? ""}
 onChange={(event) => updateScenario(index, "variableCost", event.target.value)}
 />
 <div className="flex items-center text-sm text-neutral-700">
 {scenarioResult.result.units === null
 ? "Sin equilibrio"
 : `${scenarioResult.result.units.toFixed(2)} uds`}
 </div>
 <button type="button" className="btn-secondary" onClick={() => removeScenario(index)}>
 Eliminar
 </button>
 </div>
 );
 })}
 </div>
 <button type="button" className="btn-secondary mt-3" onClick={() => addScenario()}>
 Agregar escenario
 </button>
 </section>

 <section className="panel p-5">
 <h2 className="section-title text-2xl text-black">Comparativo de margen</h2>
 <div className="mt-3 h-72">
 <StableResponsiveChart
 minWidth={320}
 minHeight={240}
 fallback={<p className="text-sm text-neutral-500">Cargando grafico...</p>}
 >
 <BarChart data={comparisonBars}>
 <CartesianGrid stroke={chartTheme.chartGrid} strokeDasharray="3 3" />
 <XAxis dataKey="name" />
 <YAxis />
 <Tooltip />
 <Bar dataKey="margin" fill={chartTheme.chartPrimary} />
 </BarChart>
 </StableResponsiveChart>
 </div>
 </section>

 <MicrotipsPanel tips={tips} onDismiss={handleDismissTip} />

 {error ? <p className="text-sm text-red-700">{error}</p> : null}
 </div>
 );
}



