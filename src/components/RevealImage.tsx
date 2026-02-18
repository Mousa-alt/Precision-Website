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
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`img-glow-wrap overflow-hidden ${revealed ? "img-glow-active" : ""} ${wrapClassName}`}>
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy={referrerPolicy}
        loading="lazy"
        style={{
          filter: revealed ? "grayscale(0%) brightness(1)" : "grayscale(100%) brightness(0.4)",
          transition: "filter 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          ...(objectPosition ? { objectPosition, transformOrigin: objectPosition } : {}),
          ...(objectFit ? { objectFit } : {}),
          ...(zoom && zoom > 1 ? { transform: `scale(${zoom})` } : {}),
        }}
      />
    </div>
  );
}
