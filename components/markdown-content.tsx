/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ChapterInfographic } from "@/components/chapter-infographic";

interface MarkdownContentProps {
    content: string;
}

function isResolvableImageSource(src?: string): boolean {
    if (!src) {
        return false;
    }

    return /^https?:\/\//i.test(src) || src.startsWith("data:") || src.includes("infografias/");
}

export function MarkdownContent({ content }: MarkdownContentProps) {
    return (
        <article
            className="[&_h1]:section-title [&_h1]:mt-10 [&_h1]:text-5xl [&_h1]:leading-tight [&_h1]:tracking-tight [&_h2]:section-title [&_h2]:mt-10 [&_h2]:text-4xl [&_h2]:leading-tight [&_h3]:section-title [&_h3]:mt-8 [&_h3]:text-3xl [&_h3]:leading-tight [&_li]:my-2 [&_li]:text-[1.06rem] [&_ol]:pl-7 [&_p]:my-5 [&_p]:text-[1.08rem] [&_p]:leading-9 [&_strong]:font-semibold [&_table]:my-7 [&_table]:w-full [&_table]:border-collapse [&_tbody_tr]:border-b [&_tbody_tr]:border-neutral-200 [&_td]:border-b [&_td]:border-neutral-200 [&_td]:px-3 [&_td]:py-2.5 [&_th]:border-b [&_th]:border-neutral-300 [&_th]:px-3 [&_th]:py-3 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-7 max-w-4xl overflow-x-auto text-[1.06rem] leading-9 text-neutral-800"
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    img: ({ alt, src }) => {
                        const rawSrc = typeof src === "string" ? src : undefined;

                        // All chapter image references (graficos/ AND infografias/) → HTML infographic component
                        if (
                            rawSrc?.includes("graficos/") ||
                            rawSrc?.includes("infografias/") ||
                            !isResolvableImageSource(rawSrc)
                        ) {
                            return <ChapterInfographic src={rawSrc} alt={alt ?? "Illustration"} />;
                        }

                        // absolute URL or data URI → render as <img>
                        return (
                            <img
                                src={rawSrc}
                                alt={alt ?? "Illustration"}
                                className="border border-[var(--stroke)] shadow-sm bg-white object-cover w-full max-w-2xl mx-auto my-8"
                            />
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
