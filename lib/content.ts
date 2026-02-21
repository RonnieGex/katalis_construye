import { promises as fs } from "node:fs";
import path from "node:path";

export interface ContentDocument {
  slug: string;
  title: string;
  body: string;
  kind: "chapter" | "structural";
  chapterNumber?: number;
  sourcePath: string;
}

const CONTENT_ROOT_CANDIDATES = [
  path.join(process.cwd(), "elementos_estructurales"),
  path.join(process.cwd(), "..", "elementos_estructurales"),
];

const STRUCTURAL_FILES = [
  "prefacio_internacional.md",
  "indice_internacional.md",
  "glosario_internacional.md",
] as const;

let resolvedContentRootPromise: Promise<string> | null = null;

export async function getAllContentDocuments(): Promise<ContentDocument[]> {
  const [chapters, structural] = await Promise.all([
    getChapterDocuments(),
    getStructuralDocuments(),
  ]);
  const introduction = createIntroductionDocument();
  return [introduction, ...chapters, ...structural];
}

export async function getChapterDocuments(): Promise<ContentDocument[]> {
  const contentRoot = await resolveContentRoot();
  const fileNames = await fs.readdir(contentRoot);
  const chapterFiles = fileNames
    .map((fileName) => {
      const match = /^capitulo(\d+)_internacional\.md$/i.exec(fileName);
      if (!match) {
        return null;
      }

      return {
        fileName,
        chapterNumber: Number.parseInt(match[1], 10),
      };
    })
    .filter((entry): entry is { fileName: string; chapterNumber: number } => entry !== null)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  const docs = await Promise.all(
    chapterFiles.map(async ({ fileName, chapterNumber }) => {
      const sourcePath = path.join(contentRoot, fileName);
      const body = await fs.readFile(sourcePath, "utf8");
      return {
        slug: fileName.replace(/\.md$/i, ""),
        title: getTitleFromMarkdown(body, `Capitulo ${chapterNumber}`),
        body,
        kind: "chapter" as const,
        chapterNumber,
        sourcePath,
      };
    }),
  );

  return docs;
}

export async function getStructuralDocuments(): Promise<ContentDocument[]> {
  const contentRoot = await resolveContentRoot();
  const docs = await Promise.all(
    STRUCTURAL_FILES.map(async (fileName) => {
      const sourcePath = path.join(contentRoot, fileName);
      const body = await fs.readFile(sourcePath, "utf8");
      return {
        slug: fileName.replace(/\.md$/i, ""),
        title: getTitleFromMarkdown(body, fileName),
        body,
        kind: "structural" as const,
        sourcePath,
      };
    }),
  );

  return docs;
}

export async function getDocumentBySlug(slug: string): Promise<ContentDocument | null> {
  if (slug === "introduccion_internacional") {
    return createIntroductionDocument();
  }

  const all = await getAllContentDocuments();
  return all.find((document) => document.slug === slug) ?? null;
}

async function resolveContentRoot(): Promise<string> {
  if (!resolvedContentRootPromise) {
    resolvedContentRootPromise = (async () => {
      for (const candidate of CONTENT_ROOT_CANDIDATES) {
        try {
          const stats = await fs.stat(candidate);
          if (stats.isDirectory()) {
            return candidate;
          }
        } catch {
          // try the next candidate
        }
      }

      throw new Error(
        `Content directory not found. Tried: ${CONTENT_ROOT_CANDIDATES.join(", ")}`,
      );
    })();
  }

  return resolvedContentRootPromise;
}

function getTitleFromMarkdown(markdown: string, fallback: string): string {
  const line = markdown
    .split(/\r?\n/)
    .map((candidate) => candidate.trim())
    .find((candidate) => candidate.startsWith("# "));

  if (!line) {
    return fallback;
  }

  return line.replace(/^#\s+/, "").trim();
}

function createIntroductionDocument(): ContentDocument {
  return {
    slug: "introduccion_internacional",
    title: "Introduccion",
    kind: "structural",
    sourcePath: "virtual:introduccion",
    body: [
      "# Introduccion",
      "",
      "Katalis Construye es un web book interactivo para desarrollar criterio financiero aplicable.",
      "",
      "## Filosofia",
      "",
      "- **Katalis**: impulsar decisiones que mueven tu negocio.",
      "- **Construye**: formar criterio con practica, no solo teoria.",
      "",
      "## Como usarla",
      "",
      "- Sigue la ruta en **Learn** para avanzar paso a paso.",
      "- Usa **Tools** para aplicar conceptos con tus propios numeros.",
      "- Revisa **Library** para estudiar cualquier capitulo en cualquier orden.",
      "- Configura moneda y respaldo en **Settings**.",
    ].join("\n"),
  };
}
