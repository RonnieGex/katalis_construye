"use client";

import { cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";

interface StableResponsiveChartProps {
 children: ReactNode;
 fallback: ReactNode;
 minWidth?: number;
 minHeight?: number;
}

export function StableResponsiveChart({
 children,
 fallback,
 minWidth,
 minHeight,
}: StableResponsiveChartProps) {
 const hostRef = useRef<HTMLDivElement | null>(null);
 const [size, setSize] = useState({ width: 0, height: 0 });

 useEffect(() => {
 let frame = 0;
 const host = hostRef.current;

 const updateSize = () => {
 const node = hostRef.current;
 if (!node) {
 setSize({ width: 0, height: 0 });
 return;
 }
 setSize({ width: node.clientWidth, height: node.clientHeight });
 };

 updateSize();
 frame = window.requestAnimationFrame(updateSize);

 if (!host) {
 return () => {
 window.cancelAnimationFrame(frame);
 };
 }

 const observer = new ResizeObserver(() => {
 updateSize();
 });
 observer.observe(host);

 return () => {
 window.cancelAnimationFrame(frame);
 observer.disconnect();
 };
 }, []);

 const width = Math.max(size.width, minWidth ?? 0);
 const height = Math.max(size.height, minHeight ?? 0);
 const ready = width > 0 && height > 0 && isValidElement(children);

 if (!ready || !isValidElement(children)) {
 return (
 <div ref={hostRef} className="h-full w-full">
 {fallback}
 </div>
 );
 }

 const chart = cloneElement(
 children as ReactElement<{ width: number; height: number }>,
 {
 width,
 height,
 },
 );

 return (
 <div ref={hostRef} className="h-full w-full">
 {chart}
 </div>
 );
}
