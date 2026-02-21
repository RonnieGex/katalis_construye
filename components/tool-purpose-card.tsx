import type { ToolGuideSpec } from "@/lib/guidance/tool-guidance";

interface ToolPurposeCardProps {
  guide: ToolGuideSpec;
  blockId: string;
  dismissed: boolean;
  onDismiss: (blockId: string) => void;
}

export function ToolPurposeCard({ guide, blockId, dismissed, onDismiss }: ToolPurposeCardProps) {
  if (dismissed) {
    return null;
  }

  return (
    <section className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="section-title text-2xl text-black">Para que sirve esta herramienta</h2>
          <p className="text-sm text-neutral-700">{guide.purpose}</p>
          <p className="text-sm text-neutral-700">
            <span className="font-semibold text-black">Cuando usarla:</span> {guide.whenToUse}
          </p>
          <p className="text-sm text-neutral-700">
            <span className="font-semibold text-black">Resultado que debes buscar:</span>{" "}
            {guide.successSignal}
          </p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => onDismiss(blockId)}>
          Entendido
        </button>
      </div>
    </section>
  );
}
