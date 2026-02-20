"use client";

import { useRef, useState } from "react";
import Link from "next/link";

const services = [
  {
    id: "hvac",
    title: "HVAC Systems",
    description: "Complete heating, ventilation, and air conditioning solutions for optimal climate control and energy efficiency.",
    items: ["Air Cooled Chillers", "Water Cooled Chillers", "Cooling Towers", "District Cooling", "Chilled Pipe Network", "Air Conditioning - DX", "Air Conditioning - VRF", "Refrigeration Pipe Network", "Ventilation Systems", "Duct Network"],
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    id: "electrical",
    title: "Electrical Works",
    description: "Full-spectrum electrical engineering from medium voltage systems to smart automation and building management.",
    items: ["Medium Voltage Systems", "Low Voltage Systems", "Lighting Design & Installation", "Power Systems", "Control Systems", "KNX Automation", "BMS (Building Management System)"],
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    id: "plumbing",
    title: "Plumbing",
    description: "Reliable plumbing infrastructure for domestic, drainage, and sewage systems across all building types.",
    items: ["Domestic Pipe Network", "Drainage Pipe Network", "Sewage Network", "Pumps & Pump Systems"],
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
  {
    id: "firefighting",
    title: "Fire Fighting",
    description: "Advanced fire protection systems ensuring safety compliance and peace of mind for every space.",
    items: ["Stand Pipe System", "Water Sprinkler Systems (Wet, Dry, Precaution & Deluge)", "Water Mist", "Manual Fire Extinguisher", "Automatic Fire Extinguisher", "Gas Systems (CO\u2082, FM 200, Novec, Inergen & Aerosol)", "Hood Suppression System", "Foam System", "Addressable Fire Alarm", "Conventional Fire Alarm"],
    icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
  },
  {
    id: "fitout",
    title: "Fit-Out Contracting",
    description: "Seamless design and construction of captivating interiors for commercial and residential spaces.",
    items: ["Retail Shops & Showrooms", "Corporate Offices", "Medical Clinics", "Residential Projects", "Food & Beverage Outlets", "Interior Design & Finishing"],
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    id: "communication",
    title: "Communication Systems",
    description: "Modern communication and IT infrastructure for connected, efficient buildings.",
    items: ["Telephone Systems", "Data Networks", "Audio Visual Systems", "MATV (Master Antenna Television)"],
    icon: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0",
  },
  {
    id: "security",
    title: "Security Systems",
    description: "Comprehensive security solutions to protect assets and ensure safety across your premises.",
    items: ["Access Control Systems", "Intrusion Detection", "CCTV Surveillance", "Public Address Systems"],
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
];

function SvgIcon({ d, className = "w-10 h-10" }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
    </svg>
  );
}

function ServiceCard({ service, index, wide }: { service: typeof services[number]; index: number; wide?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      id={service.id}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative group rounded-2xl ${wide ? "flex-[1.5]" : "flex-1"} min-w-0 max-[900px]:!flex-auto max-[900px]:w-full`}
      data-aos="fade-up"
      data-aos-delay={index * 80}
    >
      {/* Mouse-tracking border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(123,45,54,0.5), transparent 40%)`,
        }}
      />

      {/* Card body */}
      <div
        className="relative h-full rounded-2xl border border-white/[0.06] group-hover:border-white/[0.12] p-7 max-[480px]:p-5 transition-all duration-500 overflow-hidden flex flex-col"
        style={{
          background: hovered
            ? `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(123,45,54,0.07), #0a0a0a 60%)`
            : "#0a0a0a",
        }}
      >
        {/* Large faded number */}
        <span className="absolute top-3 right-5 text-[4.5rem] font-bold text-white/[0.025] select-none pointer-events-none leading-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Icon with glow */}
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-[-4px] bg-primary/20 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-primary/30 transition-all duration-500">
            <SvgIcon d={service.icon} className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[1.05rem] font-bold uppercase mb-2 tracking-wide">{service.title}</h3>

        {/* Description */}
        <p className="text-[13px] text-white/45 leading-relaxed mb-4">{service.description}</p>

        {/* Service items */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {service.items.map((item) => (
            <span
              key={item}
              className="px-2.5 py-1 text-[10px] bg-white/[0.03] border border-white/[0.06] rounded-md text-white/35 group-hover:text-white/55 group-hover:border-white/[0.1] transition-all duration-300"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Request Quote link */}
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-xs text-primary/50 group-hover:text-primary mt-auto pt-2 transition-colors duration-300 no-underline"
        >
          Request Quote
          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  // Bento layout: asymmetric rows for visual hierarchy
  const rows: { indices: number[]; wideIndex?: number }[] = [
    { indices: [0, 1], wideIndex: 0 },       // HVAC (wide) + Electrical
    { indices: [2, 3, 4] },                   // Plumbing + Fire Fighting + Fit-Out
    { indices: [5, 6], wideIndex: 1 },        // Communication + Security (wide)
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative w-full min-h-[420px] max-[768px]:min-h-[320px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-black" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="glow-orb w-[500px] h-[500px] bg-primary top-[-100px] left-1/2 -translate-x-1/2 animate-pulse-glow" />

        <div className="relative z-10 text-center px-5" data-aos="fade-up">
          <div className="line-accent mx-auto mb-6" />
          <h1 className="text-[2.6rem] max-[768px]:text-[1.8rem] max-[480px]:text-[1.5rem] font-bold uppercase mb-6">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-sm text-white/60 uppercase tracking-wider max-w-[500px] mx-auto">
            Comprehensive MEP Solutions & Fit-Out Contracting
          </p>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="relative w-full py-16 max-[768px]:py-10 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-5 flex flex-col gap-4 max-[900px]:gap-3">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 max-[900px]:flex-col max-[900px]:gap-3">
              {row.indices.map((serviceIndex, i) => (
                <ServiceCard
                  key={services[serviceIndex].id}
                  service={services[serviceIndex]}
                  index={serviceIndex}
                  wide={row.wideIndex === i}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full py-20 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="glow-orb w-[500px] h-[500px] bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
        <div className="relative z-10 text-center" data-aos="zoom-in">
          <h2 className="text-[2rem] max-[768px]:text-[1.5rem] font-bold uppercase mb-4">
            Need a Custom <span className="text-primary">MEP Solution?</span>
          </h2>
          <p className="text-white/50 text-sm mb-8 max-w-[400px] mx-auto">Our team of expert engineers will design the perfect solution for your project.</p>
          <Link href="/contact">
            <button className="px-10 py-4 border-none rounded-[10px] bg-primary text-white text-sm font-bold uppercase transition-all duration-300 cursor-pointer hover:bg-white hover:text-primary hover:scale-105">
              Get in Touch
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
