"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      // Dot follows instantly
      dotX = lerp(dotX, mouseX, 0.9);
      dotY = lerp(dotY, mouseY, 0.9);

      // Ring lags behind for trailing effect
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 15}px, ${ringY - 15}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    const onMouseEnter = () => {
      dotRef.current?.classList.remove("opacity-0");
      ringRef.current?.classList.remove("opacity-0");
    };
    const onMouseLeave = () => {
      dotRef.current?.classList.add("opacity-0");
      ringRef.current?.classList.add("opacity-0");
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9999] opacity-0 transition-opacity duration-300"
        style={{ willChange: "transform" }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-[30px] h-[30px] rounded-full border border-primary/60 pointer-events-none z-[9998] opacity-0 transition-opacity duration-300"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
