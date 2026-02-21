import type { FieldGuide } from "@/lib/guidance/tool-guidance";

interface FieldGuideHintProps {
  guide: FieldGuide;
}

export function FieldGuideHint({ guide }: FieldGuideHintProps) {
  return (
    <article className="mt-2 border border-neutral-300 bg-neutral-50 p-3 text-xs text-neutral-700">
      <p>
        <span className="font-semibold text-black">Que es:</span> {guide.whatIsIt}
      </p>
      <p className="mt-1">
        <span className="font-semibold text-black">Como llenarlo:</span> {guide.howToFill}
      </p>
      <p className="mt-1">
        <span className="font-semibold text-black">Ejemplo:</span> {guide.example}
      </p>
      {guide.unitHint ? (
        <p className="mt-1">
          <span className="font-semibold text-black">Unidad:</span> {guide.unitHint}
        </p>
      ) : null}
      {guide.commonMistake ? (
        <p className="mt-1 text-amber-700">
          <span className="font-semibold">Evita:</span> {guide.commonMistake}
        </p>
      ) : null}
    </article>
  );
}
