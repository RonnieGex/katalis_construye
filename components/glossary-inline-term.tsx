import { getGlossaryTermByToken } from "@/lib/guidance/glossary";

interface GlossaryInlineTermProps {
  token: string;
}

export function GlossaryInlineTerm({ token }: GlossaryInlineTermProps) {
  const term = getGlossaryTermByToken(token);

  if (!term) {
    return <>{token}</>;
  }

  return (
    <abbr title={term.description} className="cursor-help no-underline border-b border-dotted border-neutral-500">
      {term.displayLabel}
    </abbr>
  );
}
