"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { InsightGlowCard } from "@/components/insight-glow-card";
import { CURRENCY_OPTIONS, resolveCurrencyFromCode } from "@/lib/currency-options";
import type { AppSettings, BusinessModel } from "@/lib/domain";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { getSettings, saveSettings } from "@/lib/repo";

const BUSINESS_MODEL_OPTIONS: Array<{ value: BusinessModel; label: string }> = [
 { value: "ecommerce", label: "E-commerce" },
 { value: "services", label: "Servicios" },
 { value: "saas", label: "SaaS" },
 { value: "manufacturing", label: "Manufactura" },
 { value: "other", label: "Otro" },
];

function parseNumber(value: string): number {
 const parsed = Number(value);
 if (Number.isFinite(parsed)) {
 return parsed;
 }
 return 0;
}

function applyBaseCurrency(settings: AppSettings, code: string): AppSettings {
 const resolved = resolveCurrencyFromCode(code);
 return {
 ...settings,
 baseCurrency: {
 code: resolved.code,
 symbol: resolved.symbol,
 },
 };
}

export default function OnboardingPage() {
 const router = useRouter();
 const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [saving, setSaving] = useState(false);

 useEffect(() => {
 let active = true;
 const load = async () => {
 try {
 const saved = await getSettings();
 if (!active) {
 return;
 }
 setSettings(saved);
 } catch (loadError) {
 if (!active) {
 return;
 }
 setError(loadError instanceof Error ? loadError.message : "No se pudo cargar ajustes");
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

 async function handleSave() {
 setSaving(true);
 setError(null);

 try {
 if (settings.fxRateToUsd <= 0) {
 throw new Error("El tipo de cambio debe ser mayor que 0");
 }

 await saveSettings({
 ...settings,
 onboardingCompletedAt: settings.onboardingCompletedAt ?? new Date().toISOString(),
 });
 router.push("/learn");
 } catch (saveError) {
 setError(saveError instanceof Error ? saveError.message : "No se pudo guardar ajustes");
 } finally {
 setSaving(false);
 }
 }

 if (loading) {
 return <p className="text-sm text-neutral-500">Cargando onboarding...</p>;
 }

 return (
 <div className="space-y-6">
 <section className="panel-soft p-6">
 <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
 <div>
 <h1 className="section-title text-4xl text-black">Onboarding inicial</h1>
 <p className="mt-2 text-neutral-700">
 Configura moneda y modelo de negocio para personalizar calculos.
 </p>
 </div>
 <InsightGlowCard
 title="Configura tu base"
 description="Define moneda, conversion y modelo de negocio para empezar con datos coherentes."
 />
 </div>
 </section>

 <section className="panel p-6">
 <div className="grid gap-4 md:grid-cols-2">
 <label className="space-y-1 text-sm text-neutral-700">
 Moneda base (ISO)
 <select
 className="input-base"
 value={settings.baseCurrency.code}
 onChange={(event) =>
 setSettings((prev) => applyBaseCurrency(prev, event.target.value))
 }
 >
 {CURRENCY_OPTIONS.map((option) => (
 <option key={option.code} value={option.code}>
 {option.label}
 </option>
 ))}
 </select>
 </label>

 <label className="space-y-1 text-sm text-neutral-700">
 Simbolo detectado
 <input
 className="input-base"
 value={settings.baseCurrency.symbol}
 readOnly
 />
 </label>

 <label className="space-y-1 text-sm text-neutral-700">
 Moneda visible
 <select
 className="input-base"
 value={settings.currencyDisplayMode}
 onChange={(event) =>
 setSettings((prev) => ({
 ...prev,
 currencyDisplayMode: event.target.value === "usd" ? "usd" : "base",
 }))
 }
 >
 <option value="base">Moneda base</option>
 <option value="usd">USD</option>
 </select>
 </label>

 <label className="space-y-1 text-sm text-neutral-700">
 Tipo de cambio a USD
 <input
 className="input-base"
 type="number"
 min="0.0001"
 step="0.01"
 value={settings.fxRateToUsd}
 onChange={(event) =>
 setSettings((prev) => ({
 ...prev,
 fxRateToUsd: parseNumber(event.target.value),
 }))
 }
 />
 </label>

 <label className="space-y-1 text-sm text-neutral-700 md:col-span-2">
 Modelo de negocio
 <select
 className="input-base"
 value={settings.businessModel}
 onChange={(event) =>
 setSettings((prev) => ({
 ...prev,
 businessModel: event.target.value as BusinessModel,
 }))
 }
 >
 {BUSINESS_MODEL_OPTIONS.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 </label>
 </div>

 {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

 <div className="mt-6 flex flex-wrap gap-2">
 <button type="button" className="btn-primary" onClick={() => void handleSave()}>
 {saving ? "Guardando..." : "Guardar y continuar"}
 </button>
 <button type="button" className="btn-secondary" onClick={() => router.push("/learn")}>
 Omitir por ahora
 </button>
 </div>
 </section>
 </div>
 );
}
