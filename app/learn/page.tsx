"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { InsightGlowCard } from "@/components/insight-glow-card";
import { MicrotipsPanel } from "@/components/microtips-panel";
import { StageGuidanceCard } from "@/components/stage-guidance-card";
import { DEFAULT_PROGRESS, DEFAULT_SETTINGS } from "@/lib/defaults";
import type { AppSettings, LearningLayerId, ProgressState } from "@/lib/domain";
import { getVisibleTips } from "@/lib/guidance/tips";
import { deriveGuidanceSummary, type GuidanceSummary } from "@/lib/guidance/summary";
import {
  getLayerProgress,
  getLearningStepsByLayer,
  LEARNING_LAYERS,
  type LearningPathStep,
} from "@/lib/learn";
import {
  dismissTip,
  getBreakEvenModel,
  getProgress,
  getSettings,
  listBudgets,
  listCashFlowEntries,
  listCostEntries,
  setActiveLearningLayer,
} from "@/lib/repo";

export default function LearnPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);
  const [activeLayer, setActiveLayerValue] = useState<LearningLayerId>("base");
  const [guidance, setGuidance] = useState<GuidanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [savedSettings, savedProgress, cashflow, costs, budgets, breakEven] =
          await Promise.all([
            getSettings(),
            getProgress(),
            listCashFlowEntries(),
            listCostEntries(),
            listBudgets(),
            getBreakEvenModel(),
          ]);

        if (!active) {
          return;
        }

        setSettings(savedSettings);
        setProgress(savedProgress);
        setActiveLayerValue(savedProgress.activeLearningLayer);
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
      } catch (loadError) {
        if (!active) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la ruta");
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

  const layerProgress = useMemo(
    () => getLayerProgress(progress.completedChapterSlugs),
    [progress.completedChapterSlugs],
  );

  const activeSteps = useMemo<LearningPathStep[]>(
    () => getLearningStepsByLayer(activeLayer),
    [activeLayer],
  );

  const tips = useMemo(() => {
    if (!guidance) {
      return [];
    }
    return getVisibleTips({
      route: "learn",
      stage: guidance.currentStage,
      dismissedTipIds: progress.dismissedTipIds,
      limit: 2,
    });
  }, [guidance, progress.dismissedTipIds]);

  async function handleDismissTip(tipId: string) {
    const next = await dismissTip(tipId);
    setProgress(next);
  }

  async function handleLayerSelect(layerId: LearningLayerId) {
    setActiveLayerValue(layerId);
    const next = await setActiveLearningLayer(layerId);
    setProgress(next);
  }

  if (loading) {
    return <p className="text-sm text-neutral-500">Cargando ruta guiada...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="panel-soft p-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="section-title text-4xl text-black">Ruta guiada por capas</h1>
            <p className="mt-2 max-w-3xl text-neutral-700">
              Aprende en orden: Base, Intermedia y Avanzada. Cada capitulo te lleva a una accion
              concreta en herramientas.
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Moneda base actual: {settings.baseCurrency.code}
            </p>
          </div>
          <InsightGlowCard
            title="Metodo Katalis Construye"
            description="Aprende, aplica y valida. Cada paso busca construir criterio financiero util."
          />
        </div>
      </section>

      {guidance ? <StageGuidanceCard guidance={guidance} /> : null}

      <section className="grid gap-3 md:grid-cols-3">
        {LEARNING_LAYERS.map((layer) => {
          const stats = layerProgress[layer.id];
          const isActive = layer.id === activeLayer;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => void handleLayerSelect(layer.id)}
              className={`panel p-4 text-left transition ${
                isActive ? "border-black ring-1 ring-black" : "hover:border-neutral-500"
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-neutral-500">{layer.title}</p>
              <p className="mt-1 text-sm text-neutral-700">{layer.description}</p>
              <p className="mt-2 text-xs text-neutral-500">
                {stats.completed}/{stats.total} capitulos ({stats.percent}%)
              </p>
            </button>
          );
        })}
      </section>

      <MicrotipsPanel tips={tips} onDismiss={handleDismissTip} />

      <section className="grid gap-4">
        {activeSteps.map((step, index) => (
          <article key={step.id} className="panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Paso {index + 1}
                </div>
                <h2 className="section-title text-2xl text-black">{step.title}</h2>
                <p className="max-w-3xl text-sm text-neutral-700">{step.description}</p>
                {step.chapterSlug ? (
                  <Link
                    href={`/chapter/${step.chapterSlug}`}
                    className="inline-flex text-sm font-medium text-black underline decoration-neutral-400 underline-offset-4"
                  >
                    Leer capitulo
                  </Link>
                ) : null}
                {step.toolLinks.length > 0 ? (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {step.toolLinks.map((tool) => (
                      <Link key={`${step.id}-${tool.href}`} href={tool.href} className="btn-secondary">
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              <Link href={step.actionHref} className="btn-primary self-center">
                {step.actionLabel}
              </Link>
            </div>
          </article>
        ))}
      </section>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
