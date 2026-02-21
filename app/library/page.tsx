import { getAllContentDocuments } from "@/lib/content";
import { LibraryClient } from "./library-client";

export const revalidate = 3600;

export default async function LibraryPage() {
    const documents = await getAllContentDocuments();
    const chapters = documents.filter((document) => document.kind === "chapter");
    const structural = documents.filter((document) => document.kind === "structural");

    return <LibraryClient chapters={chapters} structural={structural} />;
}
