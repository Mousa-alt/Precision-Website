"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import RevealImage from "@/components/RevealImage";
import PhotoLightbox from "@/components/PhotoLightbox";

// Animated counter hook
function useCountUp(target: string, duration = 2000) {
  const [count, setCount] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numericPart = parseFloat(target.replace(/[^0-9.]/g, ""));
          const suffix = target.replace(/[0-9.,]/g, "");
          const isDecimal = target.includes(".");
          const startTime = performance.now();

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentVal = numericPart * eased;

            if (isDecimal) {
              setCount(currentVal.toFixed(1) + suffix);
            } else {
              setCount(Math.floor(currentVal).toLocaleString() + suffix);
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          }
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const clientLogos = [
  "Intelcia", "Bayer", "Cheil", "Roche", "Decathlon", "Boss",
  "LG", "Casio", "Beano's", "La Poire", "Breadfast", "Huawei",
  "ABC Bank", "Property Finder", "Raya", "Keys Payroll", "Apetco",
  "Paxton", "Air Liquide", "Al Baraka Bank", "Elsewedy", "Guru",
  "Soil Spaces", "Antoushka",
];

const processSteps = [
  { num: "01", title: "Consultation", desc: "Understanding your vision, requirements, and project scope through detailed initial meetings." },
  { num: "02", title: "Design & Planning", desc: "Technical design, MEP coordination, BOQ preparation, and comprehensive project planning." },
  { num: "03", title: "Execution", desc: "Precision construction with rigorous quality control, safety standards, and timeline management." },
  { num: "04", title: "Handover", desc: "Final inspections, testing & commissioning, documentation, and seamless project handover." },
];

const slides = [
  {
    title: "Engineering Excellence",
    highlight: "Built on Precision",
    subtitle: "Contracting & MEP Solutions",
  },
  {
    title: "Powering Spaces",
    highlight: "With Innovation",
    subtitle: "HVAC, Electrical & Smart Systems",
  },
  {
    title: "The Heartbeat",
    highlight: "Of Every Project",
    subtitle: "From Design to Handover",
  },
];

const servicesList = [
  { title: "HVAC Systems", desc: "Climate control & energy-efficient cooling solutions", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { title: "Electrical Works", desc: "Power systems, lighting & smart automation", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "Plumbing", desc: "Domestic, drainage & sewage pipe networks", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { title: "Fire Fighting", desc: "Sprinklers, alarms & gas suppression systems", icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" },
  { title: "Fit-Out Contracting", desc: "Retail, office & hospitality interior construction", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { title: "Smart Systems", desc: "BMS, KNX automation & security integration", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
];

interface DriveProject {
  folderName: string;
  category: string;
  displayName?: string;
  displayLocation?: string;
  photos: { id: string; url: string; thumbnailUrl: string; name: string }[];
  coverPosition?: string;
  coverFit?: string;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState<
    { name: string; location: string; category: string; coverPhoto: string; photoCount: number; coverPosition: string; coverFit: string; coverZoom?: number; photos: { id: string; url: string; thumbnailUrl: string; name: string }[] }[]
  >([]);
  const [lightboxPhotos, setLightboxPhotos] = useState<{ id: string; url: string; thumbnailUrl: string; name: string }[] | null>(null);
  const [lightboxName, setLightboxName] = useState("");
  const [lightboxLocation, setLightboxLocation] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent, cardIndex: number) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHoveredCard(cardIndex);
  }, []);

  // Animated stats
  const stat1 = useCountUp("75+");
  const stat2 = useCountUp("35.5K");
  const stat3 = useCountUp("90%+");

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, resetKey]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setResetKey((k) => k + 1);
  };

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/photos");
        const data = await res.json();
        const driveProjects: DriveProject[] = data.projects || [];
        if (driveProjects.length === 0) return;

        const categoryMap: Record<string, string> = {
          Administrative: "Administrative",
          Retail: "Retail",
          "F&B": "Food & Beverage",
          Medical: "Medical",
        };

        const toDisplay = (dp: DriveProject, overrideCover?: string, overridePosition?: string, overrideFit?: string, overrideZoom?: number) => {
          const fallbackParts = dp.folderName.split(/\s*[-\u2013]\s*/);
          const name = dp.displayName || fallbackParts[0].trim().replace(/\b\w/g, (c) => c.toUpperCase());
          const location = dp.displayLocation ?? (fallbackParts.length > 1 ? fallbackParts.slice(1).join(", ").trim() : "");
          const coverPhoto = overrideCover
            ? `https://lh3.googleusercontent.com/d/${overrideCover}=w1200`
            : dp.photos[0]?.thumbnailUrl || "";
          return {
            name,
            location,
            category: categoryMap[dp.category] || dp.category,
            coverPhoto,
            photoCount: dp.photos.length,
            coverPosition: overridePosition || dp.coverPosition || "center",
            coverFit: overrideFit || dp.coverFit || "cover",
            coverZoom: overrideZoom,
            photos: dp.photos,
          };
        };

        // Try admin-saved config first
        let usedSavedConfig = false;
        try {
          const cfgRes = await fetch("/api/admin/homepage");
          const cfgData = await cfgRes.json();
          if (cfgData.config?.slots?.length > 0) {
            const slots: { folderName: string; coverPhotoId: string; coverPosition: string; coverFit?: string; coverZoom?: number }[] = cfgData.config.slots;
            const results: typeof featuredProjects = [];
            for (const slot of slots) {
              const match = driveProjects.find(
                (dp) => dp.folderName.toLowerCase() === slot.folderName.toLowerCase()
              );
              if (match) {
                results.push(toDisplay(match, slot.coverPhotoId || undefined, slot.coverPosition || undefined, slot.coverFit || undefined, slot.coverZoom || undefined));
              }
            }
            if (results.length > 0) {
              setFeaturedProjects(results.slice(0, 6));
              usedSavedConfig = true;
            }
          }
        } catch {
          // Config not available, fall back to defaults
        }

        if (!usedSavedConfig) {
          // Fallback: curated order
          const FEATURED_ORDER = ["intelcia", "soil spaces", "cheil", "beano", "bayer", "odoriko"];
          const picked: typeof driveProjects = [];
          for (const keyword of FEATURED_ORDER) {
            const match = driveProjects.find(
              (dp) => dp.folderName.toLowerCase().includes(keyword) && !picked.includes(dp)
            );
            if (match) picked.push(match);
          }
          if (picked.length < 6) {
            for (const dp of driveProjects) {
              if (!picked.includes(dp)) picked.push(dp);
              if (picked.length >= 6) break;
            }
          }
          setFeaturedProjects(picked.slice(0, 6).map((dp) => toDisplay(dp)));
        }
      } catch {
        // silent fail
      }
    }
    loadProjects();
  }, []);

  return (
    <div id="home" className="m-0 p-0">
      {/* ===== HERO ===== */}
      <section className="relative w-full h-[70vh] min-h-[480px] max-[768px]:h-[65vh] max-[768px]:min-h-[420px] max-[480px]:h-[60vh] max-[480px]:min-h-[360px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#060606] to-[#0d0d0d]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="glow-orb w-[600px] h-[600px] bg-primary top-[-150px] right-[-100px] animate-pulse-glow" />
        <div className="glow-orb w-[300px] h-[300px] bg-primary bottom-[10%] left-[-80px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-10 max-[768px]:px-6 max-[480px]:px-5 flex items-center justify-between max-[768px]:flex-col max-[768px]:text-center">
          <div className="max-w-[600px] max-[768px]:max-w-full" data-aos="fade-up">
            <p className="text-primary text-[12px] font-semibold uppercase tracking-[4px] mb-5 max-[480px]:tracking-[2px]">
              {slides[currentSlide].subtitle}
            </p>
            <h1 className="font-bold text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1] mb-6 uppercase">
              {slides[currentSlide].title}{" "}
              <span className="text-primary">{slides[currentSlide].highlight}</span>
            </h1>
            <p className="text-white/50 text-[15px] leading-[1.8] mb-8 max-w-[480px] max-[768px]:max-w-full max-[768px]:mx-auto">
              75+ projects delivered across Cairo. HVAC, electrical, plumbing, fire fighting, fit-out contracting &amp; smart systems.
            </p>

            <div className="flex gap-4 flex-wrap max-[768px]:justify-center">
              <Link href="/contact">
                <button className="px-7 py-3.5 border-none text-white text-[13px] font-semibold uppercase tracking-[1.5px] cursor-pointer rounded-full bg-primary transition-all duration-300 hover:bg-white hover:text-primary hover:scale-105 hover:shadow-[0_0_30px_rgba(123,45,54,0.4)]">
                  Get a Quote
                </button>
              </Link>
              <Link href="/projects">
                <button className="px-7 py-3.5 border border-white/20 text-white text-[13px] font-semibold uppercase tracking-[1.5px] cursor-pointer rounded-full bg-transparent transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:scale-105">
                  View Projects
                </button>
              </Link>
            </div>
          </div>

          {/* Right side: animated stats */}
          <div className="hidden lg:flex flex-col gap-8 items-end" data-aos="fade-left">
            {[
              { hook: stat1, label: "Projects" },
              { hook: stat2, label: "m² Covered" },
              { hook: stat3, label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-right" ref={stat.hook.ref}>
                <div className="text-[2.5rem] font-bold stat-number leading-none">{stat.hook.count}</div>
                <div className="text-[11px] text-white/40 uppercase tracking-[2px] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/[0.03] z-20">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white/40 hover:text-white transition-colors cursor-pointer text-[11px] bg-transparent border-none uppercase tracking-wider"
          >
            {isPlaying ? "||" : "Play"}
          </button>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer border-none ${index === currentSlide ? "bg-primary scale-125" : "bg-white/20 hover:bg-white/40"
                }`}
            />
          ))}
        </div>
      </section>

      {/* ===== WHAT WE DO (compact services strip) ===== */}
      <section className="relative w-full py-16 max-[768px]:py-10 max-[480px]:py-8 bg-[#060606] border-t border-white/[0.03] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-10 max-[768px]:px-5 max-[480px]:px-4">
          <div className="flex items-start gap-16 max-[950px]:flex-col max-[950px]:gap-6" data-aos="fade-up">
            {/* Left: heading */}
            <div className="shrink-0 max-w-[300px] max-[950px]:max-w-full">
              <p className="text-primary text-[11px] font-semibold uppercase tracking-[3px] mb-2">What We Do</p>
              <h2 className="text-[clamp(1.2rem,2.5vw,1.8rem)] font-bold uppercase leading-[1.3]">
                Comprehensive MEP <span className="text-primary">Solutions</span>
              </h2>
              <p className="text-white/40 text-[13px] leading-[1.7] mt-3 max-[480px]:hidden">
                End-to-end contracting and MEP services for commercial, retail, medical, and administrative spaces.
              </p>
              <Link href="/services" className="inline-flex items-center gap-2 mt-4 max-[480px]:mt-2 text-[12px] text-primary uppercase tracking-[2px] font-semibold hover:gap-3 transition-all duration-300">
                All Services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

            {/* Right: service cards — 3 cols desktop, 2 cols tablet, 3x2 grid mobile */}
            <div className="flex-1 flex flex-wrap gap-4 max-[480px]:gap-2.5">
              {servicesList.map((service, i) => (
                <Link href="/services" key={service.title} className="flex w-[calc(33.33%-11px)] max-[950px]:w-[calc(50%-8px)] max-[480px]:w-[calc(50%-5px)]">
                  <div
                    className="w-full bg-white/[0.02] rounded-2xl max-[480px]:rounded-xl p-5 max-[480px]:p-3 border border-white/[0.04] transition-colors duration-300 cursor-pointer group hover:bg-white/[0.04] hover:border-primary/20"
                    data-aos="fade-up"
                    data-aos-delay={i * 40}
                  >
                    <div className="w-10 h-10 max-[480px]:w-8 max-[480px]:h-8 rounded-xl max-[480px]:rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3 max-[480px]:mb-1.5 transition-colors duration-300 group-hover:from-primary group-hover:to-primary-dark">
                      <svg className="w-5 h-5 max-[480px]:w-4 max-[480px]:h-4 text-primary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                      </svg>
                    </div>
                    <h3 className="text-[14px] max-[480px]:text-[12px] font-semibold mb-1 group-hover:text-primary transition-colors duration-300">{service.title}</h3>
                    <p className="text-[12px] text-white/40 leading-[1.6] max-[480px]:hidden">{service.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      <section className="relative w-full py-20 max-[768px]:py-12 max-[480px]:py-8 bg-black overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-10 max-[768px]:px-5 max-[480px]:px-4">
          <div className="flex items-end justify-between mb-10 max-[768px]:mb-6 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-3 max-[480px]:mb-5" data-aos="fade-up">
            <div>
              <p className="text-primary text-[11px] font-semibold uppercase tracking-[3px] mb-3">Portfolio</p>
              <h2 className="text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold uppercase">
                Featured <span className="text-primary">Projects</span>
              </h2>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-2 text-[12px] text-white/50 uppercase tracking-[2px] font-semibold hover:text-primary hover:gap-3 transition-all duration-300">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="flex flex-col gap-5 max-[480px]:gap-3" data-aos="fade-up">
              {/* Hero project */}
              <div
                ref={heroCardRef}
                className="project-card group relative w-full aspect-[21/9] max-[768px]:aspect-[16/9] max-[480px]:aspect-[16/9] bg-[#0a0a0a] cursor-pointer"
                onClick={() => { setLightboxPhotos(featuredProjects[0].photos); setLightboxName(featuredProjects[0].name); setLightboxLocation(featuredProjects[0].location); }}
                onMouseMove={(e) => handleMouseMove(e, 0)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Mouse glow effect */}
                {hoveredCard === 0 && (
                  <div
                    className="absolute inset-0 z-[5] pointer-events-none rounded-[20px] transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(123,45,54,0.15), transparent 40%)`,
                    }}
                  />
                )}
                <RevealImage
                  src={featuredProjects[0].coverPhoto}
                  alt={featuredProjects[0].name}
                  className={`w-full h-full ${featuredProjects[0].coverFit === "contain" ? "object-contain" : "object-cover"}`}
                  wrapClassName="w-full h-full"
                  referrerPolicy="no-referrer"
                  objectPosition={featuredProjects[0].coverPosition}
                  objectFit={featuredProjects[0].coverFit as "cover" | "contain"}
                  zoom={featuredProjects[0].coverZoom}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-8 max-[480px]:p-5">
                  <span className="inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-[2px] bg-primary/90 text-white rounded-full mb-3">
                    {featuredProjects[0].category}
                  </span>
                  <h3 className="text-[clamp(1.2rem,2vw,1.8rem)] font-bold">{featuredProjects[0].name}</h3>
                  {featuredProjects[0].location && (
                    <p className="text-[13px] text-white/50 mt-1">{featuredProjects[0].location}</p>
                  )}
                </div>
              </div>

              {/* 2 medium projects */}
              <div className="flex gap-5 max-[480px]:gap-3">
                {featuredProjects.slice(1, 3).map((project, i) => (
                  <div
                    key={`${project.name}-${i}`}
                    className="project-card group flex-1 relative aspect-[3/2] max-[480px]:aspect-[3/4] bg-[#0a0a0a] cursor-pointer"
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                  >
                    <div className="absolute inset-0 z-10" onClick={() => { setLightboxPhotos(project.photos); setLightboxName(project.name); setLightboxLocation(project.location); }} />
                    <RevealImage
                      src={project.coverPhoto}
                      alt={project.name}
                      className={`w-full h-full ${project.coverFit === "contain" ? "object-contain" : "object-cover"}`}
                      wrapClassName="w-full h-full"
                      referrerPolicy="no-referrer"
                      objectPosition={project.coverPosition}
                      objectFit={project.coverFit as "cover" | "contain"}
                      zoom={project.coverZoom}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 max-[480px]:p-3">
                      <span className="inline-block px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[1.5px] bg-primary/80 text-white rounded-full mb-2">
                        {project.category}
                      </span>
                      <h3 className="text-lg max-[480px]:text-sm font-bold">{project.name}</h3>
                      {project.location && <p className="text-[12px] text-white/50 mt-0.5 max-[480px]:hidden">{project.location}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* 3 smaller projects */}
              <div className="flex gap-5 max-[480px]:gap-3 max-[768px]:flex-wrap">
                {featuredProjects.slice(3, 6).map((project, i) => (
                  <div
                    key={`${project.name}-${i}`}
                    className="project-card group flex-1 min-w-[200px] max-[768px]:min-w-[calc(50%-10px)] max-[480px]:min-w-[calc(50%-10px)] relative aspect-[4/3] bg-[#0a0a0a] cursor-pointer"
                    data-aos="fade-up"
                    data-aos-delay={i * 80}
                  >
                    <div className="absolute inset-0 z-10" onClick={() => { setLightboxPhotos(project.photos); setLightboxName(project.name); setLightboxLocation(project.location); }} />
                    <RevealImage
                      src={project.coverPhoto}
                      alt={project.name}
                      className={`w-full h-full ${project.coverFit === "contain" ? "object-contain" : "object-cover"}`}
                      wrapClassName="w-full h-full"
                      referrerPolicy="no-referrer"
                      objectPosition={project.coverPosition}
                      objectFit={project.coverFit as "cover" | "contain"}
                      zoom={project.coverZoom}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 max-[480px]:p-3">
                      <span className="inline-block px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider bg-primary/70 text-white rounded-full mb-1.5">
                        {project.category}
                      </span>
                      <h3 className="text-[15px] max-[480px]:text-xs font-bold">{project.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="w-full aspect-[21/9] rounded-[20px] bg-white/[0.02] border border-white/[0.04] animate-pulse" />
              <div className="flex gap-5">
                <div className="flex-1 aspect-[3/2] rounded-[20px] bg-white/[0.02] border border-white/[0.04] animate-pulse" />
                <div className="flex-1 aspect-[3/2] rounded-[20px] bg-white/[0.02] border border-white/[0.04] animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== CLIENT LOGOS MARQUEE ===== */}
      <section className="relative w-full py-10 max-[768px]:py-6 bg-[#030303] border-t border-b border-white/[0.03] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-10 max-[768px]:px-5 mb-6">
          <p className="text-center text-[11px] text-white/25 uppercase tracking-[3px] font-semibold">Trusted By Industry Leaders</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#030303] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#030303] to-transparent z-10" />
          <div className="flex animate-marquee whitespace-nowrap">
            {[...clientLogos, ...clientLogos].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="inline-flex items-center px-8 max-[480px]:px-5 text-[14px] max-[480px]:text-[12px] font-semibold text-white/20 uppercase tracking-[3px] whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VIDEO SHOWCASE ===== */}
      <section className="relative w-full py-20 max-[768px]:py-12 max-[480px]:py-8 bg-black border-t border-white/[0.03] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-10 max-[768px]:px-5 max-[480px]:px-4">
          <div className="flex items-end justify-between mb-10 max-[768px]:mb-6 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-3 max-[480px]:mb-5" data-aos="fade-up">
            <div>
              <p className="text-primary text-[11px] font-semibold uppercase tracking-[3px] mb-3">Behind The Scenes</p>
              <h2 className="text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold uppercase">
                See Us In <span className="text-primary">Action</span>
              </h2>
            </div>
          </div>

          <div className="flex gap-6 max-[768px]:gap-4 max-[480px]:flex-col max-[480px]:items-center" data-aos="fade-up">
            {["/videos/showreel-1.mp4", "/videos/showreel-2.mp4"].map((src, i) => (
              <div
                key={src}
                className="relative flex-1 max-w-[400px] max-[480px]:max-w-[300px] aspect-[9/16] bg-[#0a0a0a] rounded-2xl max-[480px]:rounded-xl overflow-hidden group"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <video
                  className="w-full h-full object-cover"
                  src={src}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  suppressHydrationWarning
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW WE WORK (Process) ===== */}
      <section className="relative w-full py-20 max-[768px]:py-12 max-[480px]:py-8 bg-[#030303] border-t border-white/[0.03] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-10 max-[768px]:px-5 max-[480px]:px-4">
          <div className="text-center mb-12 max-[480px]:mb-8" data-aos="fade-up">
            <p className="text-primary text-[11px] font-semibold uppercase tracking-[3px] mb-3">Our Process</p>
            <h2 className="text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold uppercase">
              How We <span className="text-primary">Work</span>
            </h2>
          </div>

          <div className="grid grid-cols-4 max-[950px]:grid-cols-2 max-[480px]:grid-cols-1 gap-5 max-[480px]:gap-3">
            {processSteps.map((step, i) => (
              <div
                key={step.num}
                className="relative bg-white/[0.02] border border-white/[0.04] rounded-2xl max-[480px]:rounded-xl p-7 max-[480px]:p-5 group hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-500"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <span className="absolute top-4 right-5 text-[3rem] font-bold text-white/[0.03] select-none pointer-events-none leading-none">
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <span className="text-primary text-sm font-bold">{step.num}</span>
                </div>
                <h3 className="text-[15px] font-bold uppercase mb-2 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                <p className="text-[12px] text-white/40 leading-[1.7]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT + MISSION/VISION (combined, compact) ===== */}
      <section className="relative w-full py-20 max-[768px]:py-12 max-[480px]:py-8 bg-[#060606] border-t border-white/[0.03] overflow-hidden">
        <div className="glow-orb w-[400px] h-[400px] bg-primary top-[20%] right-[-100px] animate-pulse-glow" />
        <div className="max-w-[1440px] mx-auto px-10 max-[768px]:px-6">
          <div className="flex gap-16 max-[950px]:flex-col max-[950px]:gap-12" data-aos="fade-up">
            {/* Left: About */}
            <div className="flex-1">
              <p className="text-primary text-[11px] font-semibold uppercase tracking-[3px] mb-3">About Us</p>
              <h2 className="text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold uppercase leading-[1.3] mb-6">
                Precision for Contracting <span className="text-primary">& MEP Solutions</span>
              </h2>
              <p className="text-[14px] font-light leading-[1.9] text-white/60 mb-8">
                At Precision, we are a forward-thinking contracting and MEP solutions company dedicated to innovation,
                precision, and delivering excellence in every project. We seamlessly integrate the highest technical
                standards with the artistic vision of our project partners.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-[12px] text-primary uppercase tracking-[2px] font-semibold hover:gap-3 transition-all duration-300">
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

            {/* Right: Mission & Vision cards stacked */}
            <div className="flex-1 flex flex-col gap-5">
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                    <svg className="w-4.5 h-4.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-[15px] font-bold uppercase tracking-wider">Our Mission</h3>
                </div>
                <p className="text-[13px] font-light leading-[1.8] text-white/50">
                  To streamline the construction process for our clients by delivering comprehensive
                  follow-up consultations at every stage, ensuring a seamless operation, functional space
                  with a top-notch quality that exceeds expectations.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                    <svg className="w-4.5 h-4.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-[15px] font-bold uppercase tracking-wider">Our Vision</h3>
                </div>
                <p className="text-[13px] font-light leading-[1.8] text-white/50">
                  To lead as a premier contracting and MEP solutions provider, delivering innovative and
                  sustainable projects that exceed client expectations. We are committed to excellence,
                  craftsmanship, and creating lasting value through every endeavor we undertake.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative w-full py-24 max-[768px]:py-16 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="glow-orb w-[500px] h-[500px] bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />

        <div className="relative z-10 text-center px-6" data-aos="zoom-in">
          <h2 className="text-[clamp(1.4rem,3vw,2.2rem)] font-bold uppercase mb-4">
            Ready to Build Something <span className="text-primary">Exceptional?</span>
          </h2>
          <p className="text-white/40 text-[14px] mb-8 max-w-[450px] mx-auto leading-[1.7]">
            Let&apos;s discuss your project and create something that exceeds expectations.
          </p>
          <Link href="/contact">
            <button className="px-8 py-3.5 border-none rounded-full bg-primary text-white text-[13px] font-semibold uppercase tracking-[1.5px] transition-all duration-300 cursor-pointer hover:bg-white hover:text-primary hover:scale-105 hover:shadow-[0_0_30px_rgba(123,45,54,0.4)]">
              Start Your Project
            </button>
          </Link>
        </div>
      </section>

      {/* Photo Lightbox */}
      {lightboxPhotos && lightboxPhotos.length > 0 && (
        <PhotoLightbox
          photos={lightboxPhotos}
          projectName={lightboxName}
          projectLocation={lightboxLocation}
          onClose={() => setLightboxPhotos(null)}
        />
      )}
    </div>
  );
}
