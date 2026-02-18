"use client";

import { useState, useEffect, useCallback } from "react";

interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
  name: string;
}

interface PhotoLightboxProps {
  photos: Photo[];
  projectName: string;
  projectLocation?: string;
  initialIndex?: number;
  onClose: () => void;
}

export default function PhotoLightbox({ photos, projectName, projectLocation, initialIndex = 0, onClose }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loaded, setLoaded] = useState(false);

  const goNext = useCallback(() => {
    setLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setLoaded(false);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  if (photos.length === 0) return null;

  const photo = photos[currentIndex];
  const highResUrl = `https://lh3.googleusercontent.com/d/${photo.id}=w1920`;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 max-[480px]:px-4 py-4 border-b border-white/5 shrink-0">
        <div className="min-w-0">
          <h3 className="text-lg max-[480px]:text-base font-bold truncate">{projectName}</h3>
          {projectLocation && <p className="text-sm text-white/40 truncate">{projectLocation}</p>}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-sm text-white/30">{currentIndex + 1} / {photos.length}</span>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden px-16 max-[768px]:px-12 max-[480px]:px-4 py-4">
        {/* Left arrow */}
        {photos.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-2 max-[768px]:left-1 top-1/2 -translate-y-1/2 z-10 w-12 h-12 max-[480px]:w-10 max-[480px]:h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 transition-all"
            aria-label="Previous photo"
          >
            <svg className="w-6 h-6 max-[480px]:w-5 max-[480px]:h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Loading spinner */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Image */}
        <img
          key={photo.id}
          src={highResUrl}
          alt={photo.name}
          className={`max-w-full max-h-full object-contain rounded-lg transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
        />

        {/* Right arrow */}
        {photos.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 max-[768px]:right-1 top-1/2 -translate-y-1/2 z-10 w-12 h-12 max-[480px]:w-10 max-[480px]:h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 transition-all"
            aria-label="Next photo"
          >
            <svg className="w-6 h-6 max-[480px]:w-5 max-[480px]:h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="px-6 max-[480px]:px-3 py-3 border-t border-white/5 overflow-x-auto shrink-0">
          <div className="flex gap-2 justify-center min-w-max">
            {photos.map((p, i) => (
              <button
                key={p.id}
                onClick={() => { setCurrentIndex(i); setLoaded(false); }}
                className={`flex-shrink-0 w-16 h-12 max-[480px]:w-12 max-[480px]:h-9 rounded-lg overflow-hidden border-2 transition-all ${
                  i === currentIndex
                    ? "border-primary shadow-[0_0_10px_rgba(123,45,54,0.5)]"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img src={p.thumbnailUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
