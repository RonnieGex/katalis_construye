"use client";

import { useEffect, useRef, useState } from "react";

import { CURRENCY_OPTIONS, resolveCurrencyFromCode } from "@/lib/currency-options";
import type { AppSettings, BusinessModel } from "@/lib/domain";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import {
 exportBackupSnapshot,
 getSettings,
 importBackupSnapshot,
 resetGuidanceHintsAndSamples,
 resetAllData,
 saveSettings,
} from "@/lib/repo";

const BUSINESS_MODEL_OPTIONS: Array<{ value: BusinessModel; label: string }> = [
 { value: "ecommerce", label: "E-commerce" },
 { value: "services", label: "Servicios" },
 { value: "saas", label: "SaaS" },
 { value: "manufacturing", label: "Manufactura" },
 { value: "other", label: "Otro" },
];

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

function createDownloadFile(content: string, filename: string): void {
 const blob = new Blob([content], { type: "application/json" });
 const url = URL.createObjectURL(blob);
 const anchor = document.createElement("a");
 anchor.href = url;
 anchor.download = filename;
 anchor.click();
 URL.revokeObjectURL(url);
}

export default function SettingsPage() {
 const importInputRef = useRef<HTMLInputElement | null>(null);
 const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [message, setMessage] = useState<string | null>(null);
 const [error, setError] = useState<string | null>(null);

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
 setError(null);
 setMessage(null);
 setSaving(true);

 try {
 await saveSettings({
 ...settings,
 currencyDisplayMode: "base",
 });
 setMessage("Ajustes guardados");
 } catch (saveError) {
 setError(saveError instanceof Error ? saveError.message : "No se pudo guardar");
 } finally {
 setSaving(false);
 }
 }

 async function handleExport() {
 setError(null);
 setMessage(null);

 try {
 const snapshot = await exportBackupSnapshot();
 const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
 createDownloadFile(JSON.stringify(snapshot, null, 2), `finanzas-katalis-backup-${timestamp}.json`);
 setMessage("Backup exportado");
 } catch (exportError) {
 setError(exportError instanceof Error ? exportError.message : "No se pudo exportar backup");
 }
 }

 async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
 const file = event.target.files?.[0];
 if (!file) {
 return;
 }

 setError(null);
 setMessage(null);

 try {
 const raw = await file.text();
 const parsed = JSON.parse(raw) as unknown;
 await importBackupSnapshot(parsed);
 const refreshed = await getSettings();
 setSettings(refreshed);
 setMessage("Backup importado");
 } catch (importError) {
 setError(importError instanceof Error ? importError.message : "No se pudo importar backup");
 } finally {
 event.target.value = "";
 }
 }

 async function handleReset() {
 const confirmed = window.confirm(
 "Esta accion elimina los datos locales guardados. Quieres continuar?",
 );

 if (!confirmed) {
 return;
 }

 setError(null);
 setMessage(null);

 try {
 await resetAllData();
 const refreshed = await getSettings();
 setSettings(refreshed);
 setMessage("Datos reiniciados");
 } catch (resetError) {
 setError(resetError instanceof Error ? resetError.message : "No se pudo reiniciar datos");
 }
 }

 async function handleResetGuidance() {
 setError(null);
 setMessage(null);

 try {
 await resetGuidanceHintsAndSamples();
 setMessage("Microtips y estado de ejemplos restablecidos");
 } catch (resetError) {
 setError(
 resetError instanceof Error
 ? resetError.message
 : "No se pudieron restablecer guias, microtips y ejemplos",
 );
 }
 }

 if (loading) {
 return <p className="text-sm text-neutral-500">Cargando ajustes...</p>;
 }

 return (
 <div className="space-y-6">
 <section className="panel-soft p-6">
 <h1 className="section-title text-4xl text-black">Ajustes</h1>
 <p className="mt-2 text-neutral-700">
 Moneda base, modelo de negocio y operaciones de respaldo local.
 </p>
 </section>

 <section className="panel p-6">
 <h2 className="section-title text-2xl text-black">Preferencias globales</h2>
 <div className="mt-4 grid gap-4 md:grid-cols-2">
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

 <div className="mt-5 flex flex-wrap gap-2">
 <button type="button" className="btn-primary" onClick={() => void handleSave()}>
 {saving ? "Guardando..." : "Guardar ajustes"}
 </button>
 </div>
 </section>

 <section className="panel p-6">
 <h2 className="section-title text-2xl text-black">Respaldo y recuperacion</h2>
 <div className="mt-4 flex flex-wrap gap-2">
 <button type="button" className="btn-secondary" onClick={() => void handleExport()}>
 Exportar backup JSON
 </button>

 <button
 type="button"
 className="btn-secondary"
 onClick={() => importInputRef.current?.click()}
 >
 Importar backup JSON
 </button>

 <input
 ref={importInputRef}
 className="hidden"
 type="file"
 accept="application/json,.json"
 onChange={(event) => void handleImport(event)}
 />

 <button type="button" className="btn-secondary" onClick={() => void handleReset()}>
 Reiniciar datos locales
 </button>

 <button
 type="button"
 className="btn-secondary"
 onClick={() => void handleResetGuidance()}
 >
 Restablecer guias, microtips y ejemplos
 </button>
 </div>
 </section>

 {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
 {error ? <p className="text-sm text-red-700">{error}</p> : null}
 </div>
 );
}
