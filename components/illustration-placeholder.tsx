interface IllustrationPlaceholderProps {
 alt: string;
 src?: string;
}

export function IllustrationPlaceholder({ alt, src }: IllustrationPlaceholderProps) {
 return (
 <figure className="my-6 border border-dashed border-slate-500 bg-slate-900/55 p-5">
 <div className="text-sm font-medium text-neutral-800">Visual coming soon</div>
 <div className="mt-1 text-sm text-neutral-700">{alt || "Illustration"}</div>
 {src ? <div className="mt-2 text-xs text-neutral-500">Ref: {src}</div> : null}
 </figure>
 );
}
