"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Simple cn utility if not present in the project
const cn = (...classes: (string | undefined | null | boolean)[]) => {
    return classes.filter(Boolean).join(" ");
};

export const FlipWords = ({
    words,
    duration = 3000,
    className,
}: {
    words: string[];
    duration?: number;
    className?: string;
}) => {
    const [index, setIndex] = useState(0);
    const currentWord = words[index] ?? "";
    const maxWordLength = useMemo(
        () => words.reduce((max, word) => Math.max(max, word.length), 0),
        [words],
    );

    useEffect(() => {
        if (words.length <= 1) {
            return;
        }
        const timer = window.setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, duration);
        return () => window.clearInterval(timer);
    }, [duration, words]);

    return (
        <div
            className="relative inline-flex h-[1.4em] items-center overflow-hidden align-middle"
            style={{ minWidth: `${maxWordLength + 1}ch` }}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={currentWord}
                    initial={{
                        opacity: 0,
                        y: 8,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.28,
                        ease: "easeOut",
                    }}
                    exit={{
                        opacity: 0,
                        y: -8,
                        position: "absolute",
                    }}
                    className={cn("inline-block text-left whitespace-nowrap will-change-transform", className)}
                >
                    {currentWord}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};
