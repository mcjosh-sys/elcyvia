"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface StaggerChildProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export function StaggerChild({
  children,
  index,
  className = "",
}: StaggerChildProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      el.style.opacity = "1";
      return;
    }

    el.style.animationDelay = `${index * 100}ms`;
    el.classList.add("animate-fade-up-blur");
  }, [index]);

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
}
