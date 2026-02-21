import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownContent } from "@/components/markdown-content";
import { ProgressControls } from "@/components/progress-controls";
import { InteractiveIndex } from "@/components/interactive-index";
import { getAllContentDocuments, getDocumentBySlug } from "@/lib/content";
import {
  getLearningStepForChapter,
  getNextStepForChapter,
  getRelatedTools,
  LEARNING_LAYERS,
} from "@/lib/learn";

interface ChapterPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const docs = await getAllContentDocuments();
  return docs.map((doc) => ({ slug: doc.slug }));
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const resolvedParams = await params;
  const document = await getDocumentBySlug(resolvedParams.slug);

  if (!document) {
    notFound();
  }

  const relatedTools = getRelatedTools(document.chapterNumber);
  const nextStep = getNextStepForChapter(document.slug);
  const learningStep = getLearningStepForChapter(document.slug);
  const layerMeta = learningStep
    ? LEARNING_LAYERS.find((layer) => layer.id === learningStep.layerId)
    : null;

  return (
    <div className="space-y-6">
      <section className="panel-soft p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {document.kind === "chapter" ? `Capitulo ${document.chapterNumber}` : "Documento"}
            </div>
            <h1 className="section-title mt-1 text-4xl text-black">{document.title}</h1>
          </div>
          <Link href="/library" className="btn-secondary">
            Volver a biblioteca
          </Link>
        </div>
        <div className="mt-4">
          <ProgressControls slug={document.slug} />
        </div>
      </section>

      {relatedTools.length > 0 ? (
        <section className="panel p-5">
          <h2 className="section-title text-xl text-black">Herramientas relacionadas</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="btn-secondary">
                {tool.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {learningStep ? (
        <section className="panel p-5">
          <h2 className="section-title text-xl text-black">Aprende / Aplica / Verifica</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <article className="rounded-lg border border-neutral-300 p-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500">Aprende</p>
              <p className="mt-2 text-sm text-neutral-700">{learningStep.description}</p>
              <p className="mt-2 text-xs text-neutral-500">
                Capa: {layerMeta ? layerMeta.title : "Ruta guiada"}
              </p>
            </article>

            <article className="rounded-lg border border-neutral-300 p-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500">Aplica</p>
              {relatedTools.length > 0 ? (
                <div className="mt-2 flex flex-col gap-2">
                  {relatedTools.map((tool) => (
                    <Link key={`apply-${tool.href}`} href={tool.href} className="btn-secondary">
                      {tool.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-neutral-700">
                  Este capitulo es conceptual. Continua al siguiente paso guiado.
                </p>
              )}
            </article>

            <article className="rounded-lg border border-neutral-300 p-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500">Verifica</p>
              <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                <li>1. Marca este capitulo como completado.</li>
                <li>2. Registra al menos 1 dato en la herramienta relacionada.</li>
                <li>3. Revisa el siguiente paso recomendado.</li>
              </ul>
            </article>
          </div>
        </section>
      ) : null}

      {nextStep ? (
        <section className="panel p-5">
          <h2 className="section-title text-xl text-black">Siguiente paso recomendado</h2>
          <p className="mt-1 text-sm text-neutral-700">{nextStep.title}</p>
          <Link href={nextStep.actionHref} className="btn-primary mt-3 inline-flex">
            {nextStep.actionLabel}
          </Link>
        </section>
      ) : null}

      <section className="panel p-6">
        {document.slug === "indice_internacional" ? (
          <InteractiveIndex />
        ) : (
          <MarkdownContent content={document.body} />
        )}
      </section>
    </div>
  );
}
