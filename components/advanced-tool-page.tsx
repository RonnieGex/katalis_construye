"use client";

import { useEffect, useMemo, useState } from "react";

import { CurrencyModeBadge } from "@/components/currency-mode-badge";
import { FieldGuideHint } from "@/components/field-guide-hint";
import { MicrotipsPanel } from "@/components/microtips-panel";
import { ResultInterpretationCard } from "@/components/result-interpretation-card";
import { StageGuidanceCard } from "@/components/stage-guidance-card";
import { ToolPurposeCard } from "@/components/tool-purpose-card";
import { ToolStepper } from "@/components/tool-stepper";
import { buildCsv, createCsvFilename, downloadCsv } from "@/lib/csv/core";
import type { CsvRows } from "@/lib/csv/types";
import type { AppSettings, ProgressState, ToolId, ToolSampleState } from "@/lib/domain";
import { FORMULA_REGISTRY } from "@/lib/formulas/registry";
import { expandGlossaryLabel } from "@/lib/guidance/glossary";
import { getToolRecommendation } from "@/lib/guidance/recommendations";
import { deriveGuidanceSummary, type GuidanceSummary } from "@/lib/guidance/summary";
import { getVisibleTips } from "@/lib/guidance/tips";
import {
  getDefaultStepId,
  getFieldGuide,
  getNextStepId,
  getResultGuide,
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
  getProgress,
  getSettings,
  listBudgets,
  listCashFlowEntries,
  listCostEntries,
  setToolCurrentStep,
  setToolSampleState,
} from "@/lib/repo";

import type { FormulaRegistryEntry } from "@/lib/formulas/registry";

// ─── Fórmulas Acordeón ───────────────────────────────────────────────────────

function FormulaCard({ formula }: { formula: FormulaRegistryEntry }) {
  const [open, setOpen] = useState(false);
  const f = formula as FormulaRegistryEntry & { humanName?: string; humanExplanation?: string };
  return (
    <article className="border border-neutral-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900">{f.humanName ?? f.formulaId}</p>
          <code className="mt-0.5 block text-[11px] font-mono text-neutral-400 leading-relaxed truncate">
            {f.expression}
          </code>
        </div>
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center border border-neutral-200 text-[10px] font-bold text-neutral-500">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && f.humanExplanation ? (
        <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-3">
          <code className="block text-[11px] font-mono text-neutral-500 mb-2 leading-relaxed">
            {f.expression}
          </code>
          <p className="text-sm text-neutral-700 leading-relaxed">{f.humanExplanation}</p>
        </div>
      ) : null}
    </article>
  );
}

function FormulasSection({ formulas }: { formulas: FormulaRegistryEntry[] }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="panel overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-neutral-50 transition-colors"
        aria-expanded={open}
      >
        <div>
          <h2 className="section-title text-2xl text-black">Fórmulas utilizadas</h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            {open
              ? "Ocultar — haz clic en cada fórmula para ver la explicación"
              : `${formulas.length} fórmula${formulas.length !== 1 ? "s" : ""} — haz clic para ver la lógica detrás de cada cálculo`}
          </p>
        </div>
        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-[var(--stroke)] text-sm font-bold text-neutral-600">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="border-t border-[var(--stroke)] p-5 space-y-2">
          {formulas.map((formula) => (
            <FormulaCard key={formula.formulaId} formula={formula} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

type GenericModel = {
  seedSource?: "sample" | "user";
};

type ExportState = "idle" | "exporting" | "success" | "error";


export interface AdvancedToolField<Model extends GenericModel> {
  key: keyof Model & string;
  label: string;
  type: "number" | "text" | "select";
  step?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
}

interface AdvancedToolPageProps<Model extends GenericModel> {
  toolId: ToolId;
  title: string;
  description: string;
  exportPrefix: string;
  fields: Array<AdvancedToolField<Model>>;
  getModel: () => Promise<Model>;
  saveModel: (model: Model) => Promise<void>;
  sampleModel: () => Model;
  buildRows: (model: Model) => CsvRows;
  summary: (
    model: Model,
    settings: AppSettings,
  ) => Array<{ label: string; value: string; resultKey?: string }>;
}

export function AdvancedToolPage<Model extends GenericModel>({
  toolId,
  title,
  description,
  exportPrefix,
  fields,
  getModel,
  saveModel,
  sampleModel,
  buildRows,
  summary,
}: AdvancedToolPageProps<Model>) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [guidance, setGuidance] = useState<GuidanceSummary | null>(null);
  const [sampleState, setSampleState] = useState<ToolSampleState | undefined>(undefined);
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshGuidance(
    overrideSettings?: AppSettings | null,
    overrideProgress?: ProgressState | null,
  ) {
    const [savedSettings, savedProgress, cashflow, costs, budgets, breakEven] = await Promise.all([
      overrideSettings ? Promise.resolve(overrideSettings) : getSettings(),
      overrideProgress ? Promise.resolve(overrideProgress) : getProgress(),
      listCashFlowEntries(),
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

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [savedSettings, savedProgress, existingModel] = await Promise.all([
          getSettings(),
          getProgress(),
          getModel(),
        ]);

        let nextModel: Model = existingModel as unknown as Model;
        let nextProgress = savedProgress;
        const currentSampleState = savedProgress.toolSampleState[toolId];
        const shouldSeed =
          !existingModel.seedSource &&
          currentSampleState !== "dismissed" &&
          currentSampleState !== "consumed";

        if (shouldSeed) {
          nextModel = sampleModel();
          await saveModel(nextModel);
          nextProgress = await setToolSampleState(toolId, "active");
        }

        if (!active) return;
        setSettings(savedSettings);
        setProgress(nextProgress);
        const initialGuide = resolveToolGuideSpec({
          toolId,
          fieldKeys: fields.map((field) => field.key),
          resultKeys: [],
          fieldLabels: Object.fromEntries(fields.map((field) => [field.key, field.label])),
        });
        setSampleState(nextProgress.toolSampleState[toolId]);
        setModel(nextModel);
        const stepState = nextProgress.toolStepProgress[toolId];
        if (!stepState?.currentStepId) {
          const seeded = await setToolCurrentStep(toolId, getDefaultStepId(initialGuide));
          if (!active) return;
          setProgress(seeded);
        }
        await refreshGuidance(savedSettings, nextProgress);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Unable to load tool.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [fields, getModel, sampleModel, saveModel, toolId]);

  useEffect(() => {
    if (!model || loading) return;
    const timeout = window.setTimeout(() => {
      void (async () => {
        try {
          await saveModel(model);
          setSavedAt(new Date().toLocaleTimeString("es-MX"));
        } catch (saveError) {
          setError(saveError instanceof Error ? saveError.message : "Unable to save.");
        }
      })();
    }, 450);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [model, loading, saveModel]);

  const tips = useMemo(() => {
    if (!guidance || !progress) return [];
    return getVisibleTips({
      route: toolId,
      stage: guidance.currentStage,
      dismissedTipIds: progress.dismissedTipIds,
      limit: 2,
    });
  }, [guidance, progress, toolId]);

  const formulas = useMemo(
    () => FORMULA_REGISTRY.filter((entry) => entry.toolId === toolId),
    [toolId],
  );

  if (loading || !model || !settings || !progress) {
    return <p className="text-sm text-neutral-500">Cargando herramienta...</p>;
  }

  const onlySample = model.seedSource === "sample";
  const hasActiveSample = sampleState === "active" && onlySample;
  const summaryRows = summary(model, settings);
  const activeGuide = resolveToolGuideSpec({
    toolId,
    fieldKeys: fields.map((field) => field.key),
    resultKeys: summaryRows.map((row) => row.resultKey ?? row.label),
    fieldLabels: Object.fromEntries(fields.map((field) => [field.key, field.label])),
  });
  const currentStepId = progress.toolStepProgress[toolId]?.currentStepId ?? getDefaultStepId(activeGuide);
  const currentStep = getStepById(activeGuide, currentStepId) ?? activeGuide.steps[0];
  const visibleFieldKeys = new Set(currentStep.fields.map((field) => field.fieldKey));
  const fieldsToRender =
    visibleFieldKeys.size > 0
      ? fields.filter((field) => visibleFieldKeys.has(field.key))
      : fields;
  const completedStepIds = progress.toolStepProgress[toolId]?.completedStepIds ?? [];
  const purposeBlockId = `${toolId}-purpose`;

  function updateField(field: AdvancedToolField<Model>, rawValue: string) {
    setMessage(null);
    setModel((prev) => {
      if (!prev) return prev;
      const next = { ...prev, seedSource: "user" } as Model;
      if (field.type === "number") {
        (next[field.key] as unknown) = parseNumberInput(rawValue);
      } else {
        (next[field.key] as unknown) = rawValue;
      }
      return next;
    });

    if (sampleState === "active") {
      void (async () => {
        const nextProgress = await setToolSampleState(toolId, "consumed");
        setProgress(nextProgress);
        setSampleState("consumed");
        await refreshGuidance(settings, nextProgress);
      })();
    }
  }

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
    const nextProgress = await setToolCurrentStep(toolId, stepId);
    setProgress(nextProgress);
  }

  async function handleCompleteStep(stepId: string) {
    const nextProgress = await completeToolStep(toolId, stepId);
    setProgress(nextProgress);
  }

  async function handleNextStep() {
    const nextStepId = getNextStepId(activeGuide, currentStepId);
    const nextProgress = await setToolCurrentStep(toolId, nextStepId);
    setProgress(nextProgress);
  }

  async function handleClearSample() {
    await clearSampleDataForTool(toolId);
    const fresh = await getModel();
    const nextProgress = await setToolSampleState(toolId, "dismissed");
    setModel(fresh);
    setProgress(nextProgress);
    setSampleState("dismissed");
    setMessage("Datos de ejemplo eliminados.");
    await refreshGuidance(settings, nextProgress);
  }

  async function handleExportCsv() {
    if (!model) return;
    setExportState("exporting");
    setMessage(null);
    try {
      if (model.seedSource === "sample") {
        setExportState("error");
        setMessage("Primero reemplaza o elimina el ejemplo para exportar datos reales.");
        return;
      }

      const rows = buildRows(model);
      if (rows.rows.length === 0) {
        setExportState("error");
        setMessage("No hay datos exportables para CSV.");
        return;
      }

      const csv = buildCsv(rows.headers, rows.rows);
      const filename = createCsvFilename(exportPrefix);
      downloadCsv(filename, csv);
      setExportState("success");
      setMessage("CSV exportado correctamente.");
    } catch (exportError) {
      setExportState("error");
      setMessage(exportError instanceof Error ? exportError.message : "No se pudo exportar CSV.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="panel-soft p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="section-title text-4xl text-black">{title}</h1>
            <p className="mt-2 text-neutral-700">{description}</p>
            <CurrencyModeBadge settings={settings} />
            {savedAt ? <p className="mt-2 text-xs text-neutral-500">Último guardado: {savedAt}</p> : null}
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
              disabled={model.seedSource === "sample" || exportState === "exporting"}
            >
              {exportState === "exporting" ? "Exportando..." : "Exportar CSV"}
            </button>
          </div>
        </div>
        {message ? (
          <p className={`mt-2 text-xs ${exportState === "error" ? "text-red-700" : "text-emerald-700"}`}>
            {message}
          </p>
        ) : null}
        {model.seedSource === "sample" ? (
          <p className="mt-2 text-xs text-neutral-500">
            Primero reemplaza o elimina el ejemplo para exportar datos reales.
          </p>
        ) : null}
      </section>

      {guidance ? (
        <StageGuidanceCard
          guidance={guidance}
          compact
          note={getToolRecommendation(toolId, guidance.currentStage, currentStep.title)}
        />
      ) : null}

      <ToolPurposeCard
        guide={activeGuide}
        blockId={purposeBlockId}
        dismissed={progress.dismissedGuideBlocks.includes(purposeBlockId)}
        onDismiss={handleDismissPurpose}
      />

      <ToolStepper
        guide={activeGuide}
        currentStepId={currentStepId}
        completedStepIds={completedStepIds}
        onSelectStep={handleSelectStep}
        onCompleteStep={handleCompleteStep}
        onNextStep={handleNextStep}
      />

      <section className="panel p-5">
        <h2 className="section-title text-2xl text-black">{currentStep.title}</h2>
        <p className="mt-1 text-sm text-neutral-700">{currentStep.objective}</p>
        <p className="mt-1 text-xs text-neutral-500">Checklist: {currentStep.completionRule}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {fieldsToRender.map((field) => {
            const rawValue = model[field.key];
            const value =
              typeof rawValue === "number" || typeof rawValue === "string" ? rawValue : "";
            const fieldGuide = getFieldGuide(activeGuide, field.key);
            if (field.type === "select") {
              return (
                <label key={field.key} className="space-y-1 text-sm text-neutral-700">
                  <span>{expandGlossaryLabel(field.label)}</span>
                  <select
                    className="input-base"
                    value={String(value)}
                    onChange={(event) => updateField(field, event.target.value)}
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={`${field.key}-${option.value}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {fieldGuide ? <FieldGuideHint guide={fieldGuide} /> : null}
                </label>
              );
            }

            return (
              <label key={field.key} className="space-y-1 text-sm text-neutral-700">
                <span>{expandGlossaryLabel(field.label)}</span>
                <input
                  className="input-base"
                  type={field.type}
                  step={field.step}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(event) => updateField(field, event.target.value)}
                />
                {fieldGuide ? <FieldGuideHint guide={fieldGuide} /> : null}
              </label>
            );
          })}
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="section-title text-2xl text-black">Resultados e interpretación</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {summaryRows.map((item) => (
            <ResultInterpretationCard
              key={item.label}
              label={expandGlossaryLabel(item.label)}
              value={item.value}
              guide={getResultGuide(activeGuide, item.resultKey ?? item.label)}
            />
          ))}
        </div>
      </section>

      <FormulasSection formulas={formulas} />

      <MicrotipsPanel tips={tips} onDismiss={handleDismissTip} />

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
