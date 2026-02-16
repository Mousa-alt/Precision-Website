"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RevealImage from "@/components/RevealImage";

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
  {
    title: "HVAC Systems",
    desc: "Climate control & energy-efficient cooling solutions",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Electrical Works",
    desc: "Power systems, lighting & smart automation",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Plumbing",
    desc: "Domestic, drainage & sewage pipe networks",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: "Fire Fighting",
    desc: "Sprinklers, alarms & gas suppression systems",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
  },
  {
    title: "Fit-Out Contracting",
    desc: "Retail, office & hospitality interior construction",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "Smart Systems",
    desc: "BMS, KNX automation & security integration",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
];

interface DriveProject {
  folderName: string;
  category: string;
  photos: { id: string; url: string; thumbnailUrl: string; name: string }[];
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState<
    { name: string; location: string; category: string; coverPhoto: string; photoCount: number }[]
  >([]);

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

  // Fetch real project photos for the homepage
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/photos");
        const data = await res.json();
        const driveProjects: DriveProject[] = data.projects || [];

        if (driveProjects.length > 0) {
          const featured = driveProjects.slice(0, 6).map((dp) => {
            const parts = dp.folderName.split(/\s*[-\u2013]\s*/);
            const name = parts[0].trim().replace(/\b\w/g, (c) => c.toUpperCase());
            const location = parts.length > 1 ? parts.slice(1).join(", ").trim() : "";
            const categoryMap: Record<string, string> = {
              Administrative: "Administrative",
              Retail: "Retail",
              "F&B": "Food & Beverage",
              Medical: "Medical",
            };
            return {
              name,
              location,
              category: categoryMap[dp.category] || dp.category,
              coverPhoto: dp.photos[0]?.url || "",
              photoCount: dp.photos.length,
            };
          });
          setFeaturedProjects(featured);
        }
      } catch {
        // silent fail
      }
    }
    loadProjects();
  }, []);

  return (
    <div id="home" className="m-0 p-0">
      {/* ===== HERO SLIDESHOW ===== */}
      <section className="relative w-full h-screen min-h-[600px] max-[768px]:min-h-[400px] max-[768px]:h-[70vh] max-[480px]:min-h-[320px] max-[480px]:h-[60vh] flex items-center overflow-hidden">
        {/* Background with grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Animated glow orbs */}
        <div className="glow-orb w-[500px] h-[500px] bg-primary top-[-100px] right-[-100px] animate-pulse-glow" />
        <div className="glow-orb w-[400px] h-[400px] bg-primary bottom-[-50px] left-[-100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

        {/* Geometric accent lines */}
        <div className="absolute top-[20%] right-[10%] w-[200px] h-[200px] border border-primary/10 rotate-45 max-[768px]:hidden" />
        <div className="absolute top-[30%] right-[12%] w-[150px] h-[150px] border border-primary/5 rotate-45 max-[768px]:hidden" />

        {/* Hero Text */}
        <div className="relative z-10 w-full pl-[100px] max-[1024px]:pl-[60px] max-[768px]:pl-10 max-[480px]:pl-5 max-[480px]:pr-5 max-[480px]:text-center" data-aos="fade-up">
          <div className="line-accent mb-6 max-[480px]:mx-auto" />
          <p className="text-primary text-sm font-bold uppercase tracking-[4px] mb-4 max-[480px]:tracking-[2px]">
            {slides[currentSlide].subtitle}
          </p>
          <h1 className="max-w-[650px] font-bold text-[3rem] leading-[1.15] mb-8 uppercase max-[1024px]:text-[2.2rem] max-[768px]:text-[1.8rem] max-[480px]:text-[1.5rem] max-[480px]:max-w-full">
            {slides[currentSlide].title}{" "}
            <span className="text-primary">{slides[currentSlide].highlight}</span>
          </h1>

          <div className="flex gap-5 flex-wrap max-[480px]:justify-center">
            <Link href="/contact">
              <button className="px-8 py-4 min-h-[52px] border-none text-white text-sm font-bold uppercase cursor-pointer rounded-[10px] bg-primary transition-all duration-300 hover:bg-white hover:text-primary hover:scale-105 max-[768px]:px-5 max-[768px]:py-3 max-[768px]:text-xs max-[480px]:px-4 max-[480px]:py-2.5">
                Get a Quote
              </button>
            </Link>
            <Link href="/projects">
              <button className="px-8 py-4 min-h-[52px] border border-white/30 text-white text-sm font-bold uppercase cursor-pointer rounded-[10px] bg-transparent transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:scale-105 max-[768px]:px-5 max-[768px]:py-3 max-[768px]:text-xs max-[480px]:px-4 max-[480px]:py-2.5">
                View Projects
              </button>
            </Link>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white/60 hover:text-white transition-colors cursor-pointer text-sm bg-transparent border-none"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? "||" : "Play"}
          </button>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-12 h-1 transition-all duration-300 cursor-pointer border-none ${
                  index === currentSlide ? "bg-primary" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-10 max-[768px]:hidden flex flex-col items-center gap-2">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse" />
          <span className="text-[10px] text-white/40 uppercase tracking-widest rotate-90 origin-center translate-y-4">Scroll</span>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="relative w-full py-28 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="glow-orb w-[300px] h-[300px] bg-primary top-[20%] left-[5%] animate-pulse-glow" />

        <div className="relative z-10 max-w-[1100px] mx-auto px-5">
          <div className="flex items-center gap-16 max-[768px]:flex-col" data-aos="fade-up">
            {/* Left: large number accent */}
            <div className="flex-shrink-0 max-[768px]:text-center" data-aos="fade-right">
              <div className="text-[120px] max-[768px]:text-[80px] max-[480px]:text-[60px] font-bold leading-none stat-number opacity-30">75+</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-2">Projects Delivered</div>
            </div>

            {/* Right: text */}
            <div className="flex flex-col gap-6" data-aos="fade-left">
              <div className="line-accent" />
              <h2 className="text-2xl font-bold uppercase">
                About <span className="text-primary">Precision</span>
              </h2>
              <p className="text-base font-light leading-[1.9] text-white/80">
                At Precision, we are a forward-thinking contracting and MEP solutions company dedicated to innovation,
                precision, and delivering excellence in every project. We seamlessly integrate the highest technical
                standards with the artistic vision of our project partners.
              </p>
              <Link href="/about">
                <button className="px-9 py-3 border border-white/30 rounded-lg bg-transparent text-white transition-all duration-300 cursor-pointer hover:bg-white hover:text-black hover:border-white hover:scale-105 w-fit">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative w-full py-20 bg-radial-dark overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-5">
          <div className="flex items-stretch justify-center gap-6 flex-wrap max-[480px]:gap-3" data-aos="fade-up">
            {[
              { value: "75+", label: "Delivered Projects", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
              { value: "35,500", label: "m\u00B2 Covered", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
              { value: "90%+", label: "Client Satisfaction", icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { value: "7+", label: "Service Categories", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="flex-1 min-w-[220px] max-w-[260px] max-[480px]:min-w-[calc(50%-8px)] max-[480px]:max-w-[calc(50%-8px)] bg-[#111] rounded-[20px] p-8 max-[480px]:p-5 border border-white/5 card-hover text-center"
                data-aos="zoom-in"
                data-aos-delay={i * 100}
              >
                <div className="service-icon mx-auto mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <div className="text-3xl font-bold stat-number mb-2">{stat.value}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="relative w-full bg-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="glow-orb w-[400px] h-[400px] bg-primary bottom-[10%] right-[-100px] animate-pulse-glow" />

        <div className="relative z-10 max-w-[1100px] mx-auto px-5">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="line-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3 uppercase">Our Services</h2>
            <p className="text-sm text-white/50 uppercase tracking-wider">
              Comprehensive MEP Solutions & Fit-Out Contracting
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 items-stretch">
            {servicesList.map((service, i) => (
              <Link href="/services" key={service.title} className="flex w-[340px] max-[768px]:w-[calc(50%-12px)] max-[480px]:w-full">
                <div
                  className="w-full bg-[#0d0d0d] rounded-[20px] p-8 max-[480px]:p-6 border border-white/5 card-hover cursor-pointer group flex flex-col"
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                >
                  <div className="service-icon mb-5 transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">{service.title}</h3>
                  <p className="text-sm text-white/50 leading-[1.7]">{service.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12" data-aos="fade-up">
            <Link href="/services">
              <button className="px-9 py-3 border border-white/30 rounded-lg bg-transparent text-white transition-all duration-300 cursor-pointer hover:bg-white hover:text-black hover:border-white hover:scale-105">
                Explore All Services
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROJECTS ===== */}
      <section className="relative w-full bg-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-black" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="line-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold uppercase mb-3">Our Projects</h2>
            <p className="text-sm text-white/50">75+ successfully delivered across Cairo&apos;s most prestigious locations</p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="flex flex-col gap-6" data-aos="fade-up">
              {/* Hero project — large featured image */}
              <div className="group relative w-full aspect-[16/9] max-[768px]:aspect-[4/3] overflow-hidden rounded-[20px] card-hover">
                <RevealImage
                  src={featuredProjects[0].coverPhoto}
                  alt={featuredProjects[0].name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  wrapClassName="w-full h-full bg-[#0a0a0a]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-8 max-[480px]:p-5">
                  <p className="text-primary text-xs uppercase tracking-wider font-bold">{featuredProjects[0].category}</p>
                  <h3 className="text-2xl max-[480px]:text-lg font-bold mt-1">{featuredProjects[0].name}</h3>
                  {featuredProjects[0].location && (
                    <p className="text-sm text-white/60 mt-1">{featuredProjects[0].location}</p>
                  )}
                </div>
              </div>

              {/* Row of 2 medium projects */}
              <div className="flex gap-6 max-[480px]:flex-col">
                {featuredProjects.slice(1, 3).map((project, i) => (
                  <div
                    key={`${project.name}-${i}`}
                    className="flex-1 group relative aspect-[3/2] overflow-hidden rounded-[20px] card-hover"
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                  >
                    <RevealImage
                      src={project.coverPhoto}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      wrapClassName="w-full h-full bg-[#0a0a0a]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 max-[480px]:p-4">
                      <p className="text-primary text-xs uppercase tracking-wider font-bold">{project.category}</p>
                      <h3 className="text-lg font-bold mt-1">{project.name}</h3>
                      {project.location && (
                        <p className="text-sm text-white/60 mt-0.5">{project.location}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Row of 3 smaller projects */}
              <div className="flex gap-6 max-[768px]:flex-wrap">
                {featuredProjects.slice(3, 6).map((project, i) => (
                  <div
                    key={`${project.name}-${i}`}
                    className="flex-1 min-w-[200px] max-[768px]:min-w-[calc(50%-12px)] max-[480px]:min-w-full group relative aspect-[4/3] overflow-hidden rounded-[20px] card-hover"
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                  >
                    <RevealImage
                      src={project.coverPhoto}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      wrapClassName="w-full h-full bg-[#0a0a0a]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 max-[480px]:p-4">
                      <p className="text-primary text-[10px] uppercase tracking-wider font-bold">{project.category}</p>
                      <h3 className="text-base font-bold mt-1">{project.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="w-full aspect-[16/9] rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/5" />
              <div className="flex gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex-1 aspect-[3/2] rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/5" />
                ))}
              </div>
              <div className="flex gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex-1 aspect-[4/3] rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/5" />
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-12" data-aos="fade-up">
            <Link href="/projects">
              <button className="px-9 py-3 border border-white/30 rounded-lg bg-transparent text-white transition-all duration-300 cursor-pointer hover:bg-white hover:text-black hover:border-white hover:scale-105">
                View All Projects
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== MISSION / VISION ===== */}
      <section className="w-full py-16 bg-radial-dark overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex gap-6 max-[768px]:flex-col" data-aos="fade-up">
            {/* Mission */}
            <div className="flex-1 bg-[#0d0d0d] border border-white/5 rounded-[20px] p-10 max-[480px]:p-6 relative overflow-hidden group card-hover">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-transparent" />
              <div className="flex items-center gap-4 mb-5">
                <div className="w-[50px] h-[50px] rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold uppercase">Our <span className="text-primary">Mission</span></h2>
              </div>
              <p className="text-sm font-light leading-[1.8] text-white/70">
                To streamline the construction process for our clients by delivering comprehensive
                follow-up consultations at every stage, ensuring a seamless operation, functional space
                with a top-notch quality that exceeds expectations.
              </p>
            </div>

            {/* Vision */}
            <div className="flex-1 bg-[#0d0d0d] border border-white/5 rounded-[20px] p-10 max-[480px]:p-6 relative overflow-hidden group card-hover">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-transparent" />
              <div className="flex items-center gap-4 mb-5">
                <div className="w-[50px] h-[50px] rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold uppercase">Our <span className="text-primary">Vision</span></h2>
              </div>
              <p className="text-sm font-light leading-[1.8] text-white/70">
                To lead as a premier contracting and MEP solutions provider, delivering innovative and
                sustainable projects that exceed client expectations. We are committed to excellence,
                craftsmanship, and creating lasting value through every endeavor we undertake.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA FOOTER BANNER ===== */}
      <section className="relative w-full py-32 max-[768px]:py-20 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="glow-orb w-[600px] h-[600px] bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />

        <div className="relative z-10 text-center px-5" data-aos="zoom-in">
          <h2 className="text-[2.5rem] max-[768px]:text-[1.8rem] max-[480px]:text-[1.4rem] font-bold uppercase mb-4">
            Ready to Build Something <span className="text-primary">Exceptional?</span>
          </h2>
          <p className="text-white/50 text-base mb-10 max-w-[500px] mx-auto">
            Let&apos;s discuss your project and create something that exceeds expectations.
          </p>
          <Link href="/contact">
            <button className="px-10 py-4 border-none rounded-[10px] bg-primary text-white text-sm font-bold uppercase transition-all duration-300 cursor-pointer hover:bg-white hover:text-primary hover:scale-105">
              Start Your Project
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
