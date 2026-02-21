"use client";
import React, { useCallback, useEffect, useState } from "react";
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
    const [currentWord, setCurrentWord] = useState(words[0]);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const startAnimation = useCallback(() => {
        const word = words[words.indexOf(currentWord) + 1] || words[0];
        setCurrentWord(word);
        setIsAnimating(true);
    }, [currentWord, words]);

    useEffect(() => {
        if (!mounted) return;
        if (!isAnimating) {
            const timer = setTimeout(() => {
                startAnimation();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isAnimating, duration, startAnimation, mounted]);

    if (!mounted) {
        return <span className={cn("inline-block", className)}>{words[0]}</span>;
    }

    return (
        <div className="inline-flex relative h-[1.5em] items-center overflow-hidden">
            <AnimatePresence
                onExitComplete={() => {
                    setIsAnimating(false);
                }}
            >
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                    }}
                    exit={{
                        opacity: 0,
                        y: -40,
                        x: 0,
                        filter: "blur(8px)",
                        scale: 0.8,
                        position: "absolute",
                    }}
                    className={cn(
                        "z-10 inline-block relative text-left",
                        className
                    )}
                    key={currentWord}
                >
                    {currentWord.split(" ").map((word, wordIndex) => (
                        <motion.span
                            key={word + wordIndex}
                            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{
                                delay: wordIndex * 0.1,
                                duration: 0.3,
                            }}
                            className="inline-block whitespace-nowrap"
                        >
                            {word.split("").map((letter, letterIndex) => (
                                <motion.span
                                    key={word + letterIndex}
                                    initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{
                                        delay: wordIndex * 0.1 + letterIndex * 0.05,
                                        duration: 0.2,
                                    }}
                                    className="inline-block"
                                >
                                    {letter}
                                </motion.span>
                            ))}
                            <span className="inline-block">&nbsp;</span>
                        </motion.span>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
