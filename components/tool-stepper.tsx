import type { ToolStepId } from "@/lib/domain";
import type { ToolGuideSpec } from "@/lib/guidance/tool-guidance";

interface ToolStepperProps {
  guide: ToolGuideSpec;
  currentStepId: ToolStepId;
  completedStepIds: string[];
  onSelectStep: (stepId: ToolStepId) => void;
  onCompleteStep: (stepId: ToolStepId) => void;
  onNextStep: () => void;
}

export function ToolStepper({
  guide,
  currentStepId,
  completedStepIds,
  onSelectStep,
  onCompleteStep,
  onNextStep,
}: ToolStepperProps) {
  const completed = new Set(completedStepIds);

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="section-title text-2xl text-black">Guia paso a paso</h2>
          <p className="mt-1 text-sm text-neutral-700">
            Completa cada paso para capturar bien los datos y leer el resultado con criterio.
          </p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => onNextStep()}>
          Siguiente paso
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {guide.steps.map((step, index) => {
          const isCurrent = step.id === currentStepId;
          const isCompleted = completed.has(step.id);
          return (
            <article
              key={step.id}
              className={`border p-4 transition ${
                isCurrent ? "border-black bg-neutral-50" : "border-neutral-300 bg-white"
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-neutral-500">Paso {index + 1}</p>
              <h3 className="mt-1 text-base font-semibold text-black">{step.title}</h3>
              <p className="mt-2 text-sm text-neutral-700">{step.objective}</p>
              <p className="mt-2 text-xs text-neutral-500">Checklist: {step.completionRule}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" className="btn-secondary" onClick={() => onSelectStep(step.id)}>
                  Ver paso
                </button>
                <button type="button" className="btn-secondary" onClick={() => onCompleteStep(step.id)}>
                  {isCompleted ? "Completado" : "Marcar"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
