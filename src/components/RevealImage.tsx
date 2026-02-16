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
}

export default function RevealImage({ src, alt, className = "", wrapClassName = "", referrerPolicy, objectPosition, objectFit }: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle: reveal when entering center zone, hide when leaving
        setRevealed(entry.isIntersecting);
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`img-glow-wrap ${revealed ? "img-glow-active" : ""} ${wrapClassName}`}>
      <img
        src={src}
        alt={alt}
        className={`img-bw ${revealed ? "img-revealed" : ""} ${className}`}
        referrerPolicy={referrerPolicy}
        style={{
          ...(objectPosition ? { objectPosition } : {}),
          ...(objectFit ? { objectFit } : {}),
        }}
      />
    </div>
  );
}
