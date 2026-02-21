"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

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
    const [visible, setVisible] = useState(true);
    const timeoutRef = useRef<number | null>(null);
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
            setVisible(false);
            timeoutRef.current = window.setTimeout(() => {
                setIndex((prev) => (prev + 1) % words.length);
                setVisible(true);
            }, 140);
        }, duration);
        return () => {
            window.clearInterval(timer);
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, [duration, words.length]);

    return (
        <div
            className="relative inline-flex h-[1.4em] items-center overflow-hidden align-middle"
            style={{ width: `${maxWordLength + 1}ch` }}
        >
            <span
                className={cn(
                    "inline-block text-left whitespace-nowrap transition-opacity duration-200 ease-out will-change-[opacity]",
                    visible ? "opacity-100" : "opacity-0",
                    className,
                )}
            >
                {currentWord}
            </span>
        </div>
    );
};
