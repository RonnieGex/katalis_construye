"use client";

import { useEffect, useRef, useState } from "react";

interface FormState {
    nombre: string;
    email: string;
    negocio: string;
    etapa: string;
}

const SUBMITTED_KEY = "kc_lead_submitted";

export function LeadCaptureModal() {
    const [visible, setVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const triggered = useRef(false);

    const [form, setForm] = useState<FormState>({
        nombre: "",
        email: "",
        negocio: "",
        etapa: "",
    });

    // Check if already submitted (persisted in localStorage)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const done = localStorage.getItem(SUBMITTED_KEY);
            if (done) {
                setSubmitted(true); // never show again
            }
        }
    }, []);

    // Listen for first scroll — only if not already submitted
    useEffect(() => {
        if (submitted) return;

        function onScroll() {
            if (triggered.current) return;
            if (window.scrollY > 20) {
                triggered.current = true;
                setVisible(true);
                window.removeEventListener("scroll", onScroll, { capture: true });
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true, capture: true });
        return () => window.removeEventListener("scroll", onScroll, { capture: true });
    }, [submitted]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!form.nombre.trim() || !form.email.trim()) {
            setError("Tu nombre y correo son requeridos.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, ts: new Date().toISOString() }),
            });

            if (!res.ok) throw new Error("Error al guardar");

            localStorage.setItem(SUBMITTED_KEY, "1");
            setSubmitted(true);
            setVisible(false);
        } catch {
            setError("Ocurrió un error. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    if (!visible || submitted) return null;

    return (
        <>
            {/* Backdrop — blocks interaction with page content */}
            <div
                className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="lead-modal-title"
                className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            >
                <div className="w-full max-w-md bg-white border border-neutral-200 shadow-2xl overflow-hidden">
                    {/* Header strip */}
                    <div className="bg-[#171717] px-7 py-5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">
                            Katalis Construye
                        </p>
                        <h2
                            id="lead-modal-title"
                            className="text-xl font-black text-white leading-tight"
                        >
                            Antes de continuar, cuéntanos quién eres
                        </h2>
                        <p className="mt-1.5 text-sm text-white/60 leading-snug">
                            Personalizamos tu experiencia según tu etapa de negocio.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4" noValidate>
                        {/* Nombre */}
                        <div>
                            <label
                                htmlFor="lc-nombre"
                                className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1.5"
                            >
                                Tu nombre *
                            </label>
                            <input
                                id="lc-nombre"
                                type="text"
                                autoComplete="given-name"
                                placeholder="Ej. Ana Martínez"
                                value={form.nombre}
                                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                                className="w-full border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="lc-email"
                                className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1.5"
                            >
                                Correo *
                            </label>
                            <input
                                id="lc-email"
                                type="email"
                                autoComplete="email"
                                placeholder="tu@empresa.com"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                className="w-full border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                                required
                            />
                        </div>

                        {/* Negocio */}
                        <div>
                            <label
                                htmlFor="lc-negocio"
                                className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1.5"
                            >
                                Nombre de tu negocio
                            </label>
                            <input
                                id="lc-negocio"
                                type="text"
                                autoComplete="organization"
                                placeholder="Ej. Cafetería El Punto"
                                value={form.negocio}
                                onChange={(e) => setForm((f) => ({ ...f, negocio: e.target.value }))}
                                className="w-full border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                            />
                        </div>

                        {/* Etapa */}
                        <div>
                            <label
                                htmlFor="lc-etapa"
                                className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1.5"
                            >
                                Etapa de tu negocio
                            </label>
                            <select
                                id="lc-etapa"
                                value={form.etapa}
                                onChange={(e) => setForm((f) => ({ ...f, etapa: e.target.value }))}
                                className="w-full border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black transition-colors bg-white"
                            >
                                <option value="">— Selecciona —</option>
                                <option value="idea">Tengo una idea</option>
                                <option value="inicio">Inicio (menos de 1 año)</option>
                                <option value="crecimiento">Crecimiento (1–5 años)</option>
                                <option value="consolidacion">Consolidación (más de 5 años)</option>
                            </select>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-xs text-red-600 font-medium">{error}</p>
                        )}

                        {/* CTA */}
                        <div className="pt-1">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#171717] text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 hover:bg-neutral-800 disabled:opacity-60 transition-colors"
                            >
                                {loading ? "Enviando…" : "Entrar a la plataforma →"}
                            </button>
                            <p className="mt-3 text-center text-[10px] text-neutral-400">
                                Sin spam. Tu información es confidencial.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
