"use client";

import { useEffect, useRef, useState } from "react";

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapClassName?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
  zoom?: number;
}

export default function RevealImage({ src, alt, className = "", wrapClassName = "", referrerPolicy, objectPosition, objectFit, zoom }: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Gradual reveal: starts when top enters at 85% of viewport,
      // fully revealed when top reaches 30% of viewport
      const startY = windowHeight * 0.88;
      const endY = windowHeight * 0.3;
      const p = 1 - (rect.top - endY) / (startY - endY);
      setProgress(Math.max(0, Math.min(1, p)));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Eased progress for smoother transitions
  const eased = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  const grayscale = Math.round(100 - eased * 100);
  const brightness = 0.4 + eased * 0.6;
  const glowOpacity = eased;
  // Light sweep: moves from -100% to +100% as progress goes 0→1
  const sweepX = -100 + eased * 200;

  return (
    <div ref={ref} className={`img-glow-wrap overflow-hidden ${wrapClassName}`}>
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy={referrerPolicy}
        style={{
          filter: `grayscale(${grayscale}%) brightness(${brightness})`,
          willChange: "filter",
          ...(objectPosition ? { objectPosition, transformOrigin: objectPosition } : {}),
          ...(objectFit ? { objectFit } : {}),
          ...(zoom && zoom > 1 ? { transform: `scale(${zoom})` } : {}),
        }}
      />
      {/* Horizontal light sweep */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 55%, transparent 100%)",
          transform: `translateX(${sweepX}%)`,
          pointerEvents: "none",
          borderRadius: "inherit",
          willChange: "transform",
        }}
      />
      {/* Burgundy glow border */}
      <div
        style={{
          position: "absolute",
          inset: -2,
          borderRadius: "inherit",
          boxShadow: "0 0 30px rgba(123,45,54,0.4), inset 0 0 30px rgba(123,45,54,0.1)",
          opacity: glowOpacity,
          pointerEvents: "none",
          willChange: "opacity",
        }}
      />
    </div>
  );
}
