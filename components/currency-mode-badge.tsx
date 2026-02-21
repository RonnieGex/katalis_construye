import type { AppSettings } from "@/lib/domain";
import { getDisplayCurrencyLabel } from "@/lib/currency";

interface CurrencyModeBadgeProps {
 settings: AppSettings;
}

export function CurrencyModeBadge({ settings }: CurrencyModeBadgeProps) {
 return (
 <p className="mt-2 text-xs text-neutral-500">
 Mostrando: <span className="font-medium text-neutral-800">{getDisplayCurrencyLabel(settings)}</span>
 </p>
 );
}
