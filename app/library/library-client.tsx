"use client";

import Link from "next/link";
import { useState } from "react";

import { InsightGlowCard } from "@/components/insight-glow-card";
import type { ContentDocument } from "@/lib/content";

// Thematic groups — chapters are ordered by progression, so we group by number
const CHAPTER_GROUPS = [
    { label: "Fundamentos", range: [1, 3] },
    { label: "Métricas y Planeación", range: [4, 6] },
    { label: "Capital y Deuda", range: [7, 8] },
    { label: "Rentabilidad y Estrategia", range: [9, 10] },
    { label: "Contingencia y Personas", range: [11, 12] },
    { label: "Inversión y KPIs", range: [13, 14] },
    { label: "Modelos y Expansión", range: [15, 17] },
    { label: "Valuación y Resiliencia", range: [18, 19] },
];

function getGroup(chapterNumber: number) {
    return CHAPTER_GROUPS.find(
        (g) => chapterNumber >= g.range[0] && chapterNumber <= g.range[1],
    );
}

interface ChapterRowProps {
    chapter: ContentDocument;
}

function ChapterRow({ chapter }: ChapterRowProps) {
    return (
        <Link
            href={`/chapter/${chapter.slug}`}
            className="group flex items-center gap-5 px-5 py-4 border-b border-[var(--stroke)] last:border-0 hover:bg-neutral-50 transition-colors"
        >
            {/* Chapter number */}
            <span className="flex-shrink-0 w-10 text-right font-black text-2xl text-neutral-200 group-hover:text-neutral-400 transition-colors leading-none select-none tabular-nums">
                {chapter.chapterNumber}
            </span>

            {/* Title */}
            <span className="flex-1 text-sm font-medium text-neutral-800 group-hover:text-black leading-snug">
                {/* Strip redundant "Capítulo N:" prefix from full title */}
                {chapter.title.replace(/^cap[ií]tulo\s+\d+[:\s]*/i, "")}
            </span>

            {/* Arrow */}
            <span className="flex-shrink-0 text-neutral-300 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all text-sm">
                →
            </span>
        </Link>
    );
}

interface ChapterGroupBlockProps {
    groupLabel: string;
    chapters: ContentDocument[];
}

function ChapterGroupBlock({ groupLabel, chapters }: ChapterGroupBlockProps) {
    return (
        <div>
            <p className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-[var(--stroke)] bg-neutral-50">
                {groupLabel}
            </p>
            {chapters.map((ch) => (
                <ChapterRow key={ch.slug} chapter={ch} />
            ))}
        </div>
    );
}

interface LibraryClientProps {
    chapters: ContentDocument[];
    structural: ContentDocument[];
}

export function LibraryClient({ chapters, structural }: LibraryClientProps) {
    const [showDocs, setShowDocs] = useState(false);

    // Assign chapters to groups
    const grouped = CHAPTER_GROUPS.map((group) => ({
        label: group.label,
        chapters: chapters.filter(
            (ch) =>
                ch.chapterNumber !== undefined &&
                ch.chapterNumber >= group.range[0] &&
                ch.chapterNumber <= group.range[1],
        ),
    })).filter((g) => g.chapters.length > 0);

    // Leftover chapters without a defined group
    const ungrouped = chapters.filter((ch) => !getGroup(ch.chapterNumber ?? 0));

    return (
        <div className="space-y-6">
            {/* Header */}
            <section className="panel-soft p-6">
                <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                    <div>
                        <h1 className="section-title text-4xl text-black">Biblioteca</h1>
                        <p className="mt-2 text-neutral-700">
                            {chapters.length} capítulos organizados por tema. Sin scroll infinito — encuentra lo que buscas en segundos.
                        </p>
                    </div>
                    <InsightGlowCard
                        title="Todo tu contenido"
                        description="Consulta capítulos y material estructural dentro de una lectura limpia y consistente."
                    />
                </div>
            </section>

            {/* Chapter list grouped */}
            <section className="panel overflow-hidden">
                {/* Section header */}
                <div className="px-5 py-4 border-b border-[var(--stroke)] flex items-center justify-between">
                    <h2 className="section-title text-2xl text-black">Capítulos</h2>
                    <span className="text-xs text-neutral-400 font-mono">{chapters.length} capítulos</span>
                </div>

                {/* Groups */}
                <div className="divide-y divide-[var(--stroke)]">
                    {grouped.map((group) => (
                        <ChapterGroupBlock
                            key={group.label}
                            groupLabel={group.label}
                            chapters={group.chapters}
                        />
                    ))}
                    {ungrouped.length > 0 && (
                        <ChapterGroupBlock groupLabel="Otros" chapters={ungrouped} />
                    )}
                </div>
            </section>

            {/* Structural docs — collapsible */}
            <section className="panel overflow-hidden">
                <button
                    onClick={() => setShowDocs((v) => !v)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
                    aria-expanded={showDocs}
                >
                    <h2 className="section-title text-2xl text-black">Documentos de referencia</h2>
                    <span className="w-7 h-7 flex items-center justify-center border border-[var(--stroke)] text-xs font-bold text-neutral-500">
                        {showDocs ? "−" : "+"}
                    </span>
                </button>
                {showDocs && (
                    <div className="border-t border-[var(--stroke)] divide-y divide-[var(--stroke)]">
                        {structural.map((doc) => (
                            <Link
                                key={doc.slug}
                                href={`/chapter/${doc.slug}`}
                                className="group flex items-center gap-4 px-5 py-3 hover:bg-neutral-50 transition-colors"
                            >
                                <span className="flex-1 text-sm font-medium text-neutral-700 group-hover:text-black">
                                    {doc.title}
                                </span>
                                <span className="text-neutral-300 group-hover:text-neutral-600 text-sm">→</span>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
