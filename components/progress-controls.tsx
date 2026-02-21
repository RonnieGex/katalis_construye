"use client";

import { useEffect, useMemo, useState } from "react";

import { getProgress, toggleBookmark, toggleChapterCompleted } from "@/lib/repo";

interface ProgressControlsProps {
 slug: string;
}

export function ProgressControls({ slug }: ProgressControlsProps) {
 const [completed, setCompleted] = useState(false);
 const [bookmarked, setBookmarked] = useState(false);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 let mounted = true;
 const load = async () => {
 try {
 const progress = await getProgress();
 if (!mounted) {
 return;
 }

 setCompleted(progress.completedChapterSlugs.includes(slug));
 setBookmarked(progress.bookmarks.some((item) => item.slug === slug));
 } finally {
 if (mounted) {
 setLoading(false);
 }
 }
 };

 void load();

 return () => {
 mounted = false;
 };
 }, [slug]);

 const classes = useMemo(
 () => ({
 completed: completed
 ? "border-amber-300/80 bg-amber-300 text-slate-950"
 : "border-slate-600 bg-slate-900 text-slate-100",
 bookmarked: bookmarked
 ? "border-transparent chip-accent"
 : "border-slate-600 bg-slate-900 text-slate-100",
 }),
 [bookmarked, completed],
 );

 if (loading) {
 return <div className="text-sm text-neutral-500">Cargando progreso...</div>;
 }

 return (
 <div className="flex flex-wrap items-center gap-2">
 <button
 type="button"
 onClick={async () => {
 const progress = await toggleChapterCompleted(slug);
 setCompleted(progress.completedChapterSlugs.includes(slug));
 }}
 className={` border px-3 py-1.5 text-sm font-medium transition ${classes.completed}`}
 >
 {completed ? "Completado" : "Marcar completado"}
 </button>
 <button
 type="button"
 onClick={async () => {
 const progress = await toggleBookmark(slug);
 setBookmarked(progress.bookmarks.some((item) => item.slug === slug));
 }}
 className={` border px-3 py-1.5 text-sm font-medium transition ${classes.bookmarked}`}
 >
 {bookmarked ? "En favoritos" : "Guardar favorito"}
 </button>
 </div>
 );
}
