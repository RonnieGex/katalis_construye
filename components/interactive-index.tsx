"use client";

import Link from "next/link";

import { getChapterOutlineByLayer, LEARNING_LAYERS } from "@/lib/learn";

export function InteractiveIndex() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-neutral-300 bg-neutral-50 p-5">
        <h2 className="text-2xl font-semibold text-black">Índice interactivo</h2>
        <p className="mt-2 text-sm text-neutral-700">
          Explora por capas de aprendizaje. Abre cada bloque para ver capítulos y herramientas
          sugeridas.
        </p>
      </section>

      {LEARNING_LAYERS.map((layer) => {
        const chapters = getChapterOutlineByLayer(layer.id);
        return (
          <details
            key={layer.id}
            className="group rounded-xl border border-neutral-300 bg-white"
            open={layer.id === "base"}
          >
            <summary className="cursor-pointer list-none p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500">{layer.title}</p>
                  <p className="mt-1 text-base text-neutral-700">{layer.description}</p>
                </div>
                <span className="text-xs text-neutral-500">{chapters.length} capítulos</span>
              </div>
            </summary>

            <div className="space-y-3 border-t border-neutral-200 p-5">
              {chapters.map((chapter) => (
                <article key={chapter.slug} className="rounded-lg border border-neutral-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-black">
                        Capítulo {chapter.chapterNumber}: {chapter.title}
                      </p>
                      <p className="mt-1 text-sm text-neutral-700">{chapter.hint}</p>
                    </div>
                    <Link href={`/chapter/${chapter.slug}`} className="btn-secondary">
                      Leer
                    </Link>
                  </div>

                  {chapter.tools.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {chapter.tools.map((tool) => (
                        <Link key={`${chapter.slug}-${tool.href}`} href={tool.href} className="btn-secondary">
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
