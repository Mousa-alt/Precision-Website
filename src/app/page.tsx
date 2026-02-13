"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play, Pause } from "lucide-react";

const slides = [
  {
    title: "Powering spaces",
    subtitle: "Precision MEP Solutions",
  },
  {
    title: "bringing space to life",
    subtitle: "Expert Contracting Services",
  },
  {
    title: "The Heart Beat Of any Project",
    subtitle: "Reliable Engineering Excellence",
  },
];

const services = [
  { title: "ELECTRICAL", image: "/images/electrical.jpg" },
  { title: "HVAC", image: "/images/hvac.jpg" },
  { title: "AUTOMATION", image: "/images/automation.jpg" },
  { title: "PLUMBING", image: "/images/plumbing.jpg" },
  { title: "FIRE FIGHTING", image: "/images/firefighting.jpg" },
];

const projects = [
  { name: "PALM HILLS", location: "New Cairo", category: "Residential", image: "/images/projects/palm-hills.jpg" },
  { name: "MAVENS", location: "Park St", category: "Commercial", image: "/images/projects/mavens.jpg" },
  { name: "WILLOW'S", location: "District 5", category: "Residential", image: "/images/projects/willows.jpg" },
  { name: "Bouchee", location: "Heliopolis", category: "Restaurant", image: "/images/projects/bouchee.jpg" },
  { name: "MAVENS", location: "Alex", category: "Commercial", image: "/images/projects/mavens-alex.jpg" },
  { name: "BRGR", location: "Golf Central", category: "Restaurant", image: "/images/projects/brgr.jpg" },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <main className="bg-black text-white overflow-hidden">
      {/* ===== HERO SLIDESHOW ===== */}
      <section className="relative h-screen w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#111] to-[#1a1a1a]" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase mb-6 tracking-tight">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-12">
            {slides[currentSlide].subtitle}
          </p>
          <div className="flex gap-4">
            <Link href="/services">
              <button className="px-8 py-4 bg-white text-black font-semibold uppercase tracking-wide hover:bg-white/90 transition-all">
                View Services
              </button>
            </Link>
            <Link href="/projects">
              <button className="px-8 py-4 border border-white font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition-all">
                View Projects
              </button>
            </Link>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white/70 hover:text-white transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-12 h-1 transition-all ${
                  index === currentSlide ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-video bg-gradient-to-br from-[#222] to-[#111] rounded-lg" />
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold uppercase">
                ABOUT Precision
              </h2>
              <p className="text-white/70 leading-relaxed text-lg">
                AT PRECISION, WE ARE AN INNOVATIVE ENGINEERING FIRM THAT SPECIALIZES IN DELIVERING 
                EXCEPTIONAL MECHANICAL, ELECTRICAL, AND PLUMBING (MEP) SERVICES, AS WELL AS 
                CUTTING-EDGE HEATING AND HOME AUTOMATION SOLUTIONS. OUR UNWAVERING COMMITMENT TO 
                EXCELLENCE IS REFLECTED IN OUR ABILITY TO SEAMLESSLY INTEGRATE THE HIGHEST TECHNICAL 
                STANDARDS WITH THE ARTISTIC VISION OF OUR PROJECT PARTNERS.
              </p>
              <Link href="/about">
                <button className="px-8 py-3 border border-white font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition-all">
                  More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMMITMENTS SECTION ===== */}
      <section className="py-20 md:py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl md:text-8xl font-bold text-white">0</span>
                <span className="text-2xl text-white/50">M2</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl md:text-8xl font-bold text-white">0</span>
                <span className="text-2xl text-white/50">HR</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl md:text-8xl font-bold text-white">0</span>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold uppercase">
                OUR COMMITMENTS
              </h2>
              <p className="text-white/70 leading-relaxed text-lg">
                WE ARE COMMITTED TO SUSTAINABILITY AND SOCIAL RESPONSIBILITY. WE RECOGNIZE OUR PIVOTAL 
                ROLE IN SUPPORTING THE GROWTH AND DEVELOPMENT OF OUR COUNTRY, AND OUR VITAL ROLE IN 
                PEOPLE&apos;S SAFETY, SECURITY AND ENHANCING THEIR PRODUCTIVITY AND DAILY LIVES.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROJECTS SECTION ===== */}
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold uppercase text-center mb-16">
            PROJECTS
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Link href={`/projects/${index}`} key={index}>
                <div className="group relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#222] to-[#111]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold uppercase mb-1">{project.name}</h3>
                    <p className="text-white/70">{project.location}</p>
                    <p className="text-white/50 text-sm mt-1">&quot;{String(index + 1).padStart(2, &apos;0&apos;)}&quot;</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/projects">
              <button className="px-8 py-3 border border-white font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition-all">
                More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="py-20 md:py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase mb-4">SERVICES</h2>
            <p className="text-white/70 text-lg">Seamlessly Integrated</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service, index) => (
              <div key={index} className="group aspect-square bg-gradient-to-br from-[#222] to-[#111] flex flex-col items-center justify-center gap-4 hover:from-[#333] hover:to-[#222] transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold">
                  {String(index + 1).padStart(2, &apos;0&apos;)}
                </div>
                <h3 className="text-sm md:text-base font-semibold uppercase text-center">{service.title}</h3>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services">
              <button className="px-8 py-3 border border-white font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition-all">
                More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GALLERY SECTION ===== */}
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold uppercase text-center mb-4">
            Powering Your Potential
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold uppercase text-center mb-16">
            GALLERY
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="aspect-square bg-gradient-to-br from-[#222] to-[#111] hover:from-[#333] hover:to-[#222] transition-all" />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/gallery">
              <button className="px-8 py-3 border border-white font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition-all">
                More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PARTNERS SECTION ===== */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold uppercase mb-12">
            OUR PARTNERS
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="w-32 h-16 bg-white/20 rounded" />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA / CONTACT SECTION ===== */}
      <section className="py-32 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-8">
            WE&apos;RE HERE FOR YOU
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Ready to bring your project to life? Contact us today to discuss your MEP and contracting needs.
          </p>
          <Link href="/contact">
            <button className="px-12 py-4 bg-white text-black font-semibold uppercase tracking-wide hover:bg-white/90 transition-all">
              Contact Us
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
