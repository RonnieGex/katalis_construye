import type { ResultGuide } from "@/lib/guidance/tool-guidance";

interface ResultInterpretationCardProps {
  label: string;
  value: string;
  guide: ResultGuide | null;
}

export function ResultInterpretationCard({
  label,
  value,
  guide,
}: ResultInterpretationCardProps) {
  return (
    <article className="border border-neutral-300 bg-white p-4">
      <p className="text-sm text-neutral-700">
        <span className="font-semibold text-black">{label}:</span> {value}
      </p>
      {guide ? (
        <div className="mt-2 space-y-1 text-xs text-neutral-600">
          <p>
            <span className="font-semibold text-black">Qué significa:</span> {guide.meaning}
          </p>
          {guide.healthyRange ? (
            <p>
              <span className="font-semibold text-black">Rango saludable:</span> {guide.healthyRange}
            </p>
          ) : null}
          {guide.warningRule ? (
            <p>
              <span className="font-semibold text-black">Alerta:</span> {guide.warningRule}
            </p>
          ) : null}
          <p>
            <span className="font-semibold text-black">Siguiente acción:</span> {guide.nextAction}
          </p>
        </div>
      ) : null}
    </article>
  );
}
