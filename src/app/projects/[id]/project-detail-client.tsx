"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface ProjectPhoto {
    id: string;
    url: string;
    thumbnailUrl: string;
    name: string;
}

interface ProjectData {
    folderName: string;
    category: string;
    displayName: string;
    displayLocation: string;
    photos: ProjectPhoto[];
    coverPosition: string;
    coverFit: "cover" | "contain";
}

interface Props {
    project: ProjectData;
    prevProject: { name: string; slug: string } | null;
    nextProject: { name: string; slug: string } | null;
}

export default function ProjectDetailClient({ project, prevProject, nextProject }: Props) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));

    // Preload adjacent images when lightbox is open
    useEffect(() => {
        if (lightboxIndex === null) return;
        const toLoad = [lightboxIndex - 1, lightboxIndex, lightboxIndex + 1].filter(
            (i) => i >= 0 && i < project.photos.length
        );
        setLoadedImages((prev) => {
            const next = new Set(prev);
            toLoad.forEach((i) => next.add(i));
            return next;
        });
    }, [lightboxIndex, project.photos.length]);

    const closeLightbox = useCallback(() => setLightboxIndex(null), []);

    const goNext = useCallback(() => {
        setLightboxIndex((prev) =>
            prev !== null && prev < project.photos.length - 1 ? prev + 1 : prev
        );
    }, [project.photos.length]);

    const goPrev = useCallback(() => {
        setLightboxIndex((prev) =>
            prev !== null && prev > 0 ? prev - 1 : prev
        );
    }, []);

    // Keyboard navigation
    useEffect(() => {
        if (lightboxIndex === null) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [lightboxIndex, closeLightbox, goNext, goPrev]);

    return (
        <div className="bg-black text-white min-h-screen">
            {/* Hero backdrop */}
            <section className="relative w-full h-[60vh] max-[768px]:h-[40vh] overflow-hidden">
                <div className="absolute inset-0">
                    {project.photos[0] && (
                        <Image
                            src={project.photos[0].url}
                            alt={project.displayName}
                            fill
                            className="object-cover"
                            style={{ objectPosition: project.coverPosition || "center" }}
                            priority
                            referrerPolicy="no-referrer"
                            sizes="100vw"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Back button */}
                <div className="absolute top-6 left-6 z-20">
                    <Link
                        href="/projects"
                        className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors duration-300 glass px-4 py-2 rounded-full"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        All Projects
                    </Link>
                </div>

                {/* Project info overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-10 max-[768px]:p-6">
                    <div className="max-w-[1440px] mx-auto">
                        <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-3">
                            {project.category}
                        </span>
                        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] mb-2">
                            {project.displayName}
                        </h1>
                        {project.displayLocation && (
                            <p className="text-white/50 text-lg max-[768px]:text-base flex items-center gap-2">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {project.displayLocation}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Project details */}
            <section className="relative w-full py-12 max-[768px]:py-8 bg-black">
                <div className="max-w-[1440px] mx-auto px-10 max-[768px]:px-6 max-[480px]:px-4">
                    {/* Stats bar */}
                    <div className="flex gap-8 max-[480px]:gap-4 mb-12 pb-8 border-b border-white/5">
                        <div>
                            <div className="text-[11px] text-white/30 uppercase tracking-[2px] mb-1">Category</div>
                            <div className="text-sm font-semibold">{project.category}</div>
                        </div>
                        {project.displayLocation && (
                            <div>
                                <div className="text-[11px] text-white/30 uppercase tracking-[2px] mb-1">Location</div>
                                <div className="text-sm font-semibold">{project.displayLocation}</div>
                            </div>
                        )}
                        <div>
                            <div className="text-[11px] text-white/30 uppercase tracking-[2px] mb-1">Photos</div>
                            <div className="text-sm font-semibold">{project.photos.length}</div>
                        </div>
                    </div>

                    {/* Gallery grid */}
                    <h2 className="text-lg font-bold uppercase mb-6 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-primary" />
                        Project Gallery
                    </h2>

                    <div className="grid grid-cols-3 max-[950px]:grid-cols-2 max-[480px]:grid-cols-1 gap-3">
                        {project.photos.map((photo, i) => (
                            <div
                                key={photo.id}
                                className="bento-item group relative aspect-[4/3] bg-[#0a0a0a] rounded-xl overflow-hidden cursor-pointer"
                                onClick={() => setLightboxIndex(i)}
                            >
                                <Image
                                    src={photo.thumbnailUrl}
                                    alt={photo.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    referrerPolicy="no-referrer"
                                    sizes="(max-width: 480px) 100vw, (max-width: 950px) 50vw, 33vw"
                                    loading={i < 6 ? "eager" : "lazy"}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-[11px] text-white/70 glass px-2 py-1 rounded-md">{photo.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Prev / Next navigation */}
            <section className="w-full border-t border-white/5">
                <div className="max-w-[1440px] mx-auto grid grid-cols-2 max-[480px]:grid-cols-1">
                    {prevProject ? (
                        <Link
                            href={`/projects/${prevProject.slug}`}
                            className="flex items-center gap-4 p-8 max-[768px]:p-5 hover:bg-white/[0.02] transition-colors duration-300 group border-r border-white/5"
                        >
                            <svg className="w-5 h-5 text-white/30 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <div>
                                <div className="text-[10px] text-white/30 uppercase tracking-[2px] mb-1">Previous Project</div>
                                <div className="text-sm font-semibold group-hover:text-primary transition-colors">{prevProject.name}</div>
                            </div>
                        </Link>
                    ) : (
                        <div className="border-r border-white/5" />
                    )}
                    {nextProject ? (
                        <Link
                            href={`/projects/${nextProject.slug}`}
                            className="flex items-center justify-end gap-4 p-8 max-[768px]:p-5 hover:bg-white/[0.02] transition-colors duration-300 group text-right"
                        >
                            <div>
                                <div className="text-[10px] text-white/30 uppercase tracking-[2px] mb-1">Next Project</div>
                                <div className="text-sm font-semibold group-hover:text-primary transition-colors">{nextProject.name}</div>
                            </div>
                            <svg className="w-5 h-5 text-white/30 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="w-full py-16 max-[768px]:py-10 bg-[#030303] border-t border-white/5">
                <div className="max-w-[600px] mx-auto text-center px-6">
                    <h2 className="text-xl font-bold mb-3">Interested in a Similar Project?</h2>
                    <p className="text-white/40 text-sm mb-6 leading-relaxed">
                        Let&apos;s discuss how Precision can bring your vision to life with the same level of quality and attention to detail.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300"
                    >
                        Start a Conversation
                    </Link>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div className="fixed inset-0 z-[200] bg-black/95 premium-blur flex items-center justify-center">
                    {/* Close */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Counter */}
                    <div className="absolute top-5 left-5 z-10 text-[11px] text-white/40 glass px-3 py-1.5 rounded-full">
                        {lightboxIndex + 1} / {project.photos.length}
                    </div>

                    {/* Prev */}
                    {lightboxIndex > 0 && (
                        <button
                            onClick={goPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Next */}
                    {lightboxIndex < project.photos.length - 1 && (
                        <button
                            onClick={goNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Image */}
                    <div className="relative w-full h-full max-w-[90vw] max-h-[85vh] flex items-center justify-center p-10">
                        <Image
                            src={project.photos[lightboxIndex].url}
                            alt={project.photos[lightboxIndex].name}
                            fill
                            className="object-contain"
                            referrerPolicy="no-referrer"
                            sizes="90vw"
                            priority
                        />
                    </div>

                    {/* Thumbnail strip */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 glass rounded-xl max-w-[90vw] overflow-x-auto scrollbar-hide">
                        {project.photos.map((photo, i) => (
                            <button
                                key={photo.id}
                                onClick={() => setLightboxIndex(i)}
                                className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 cursor-pointer ${i === lightboxIndex ? "border-primary" : "border-transparent opacity-50 hover:opacity-80"
                                    }`}
                            >
                                <Image
                                    src={photo.thumbnailUrl}
                                    alt={photo.name}
                                    fill
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                    sizes="48px"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
