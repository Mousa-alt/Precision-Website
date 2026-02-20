"use client";

import Link from "next/link";

const services = [
  {
    id: "hvac",
    title: "HVAC Systems",
    description: "Complete heating, ventilation, and air conditioning solutions for optimal climate control and energy efficiency across residential and commercial buildings.",
    items: ["Air Cooled Chillers", "Water Cooled Chillers", "Cooling Towers", "District Cooling", "Chilled Pipe Network", "Air Conditioning - DX", "Air Conditioning - VRF", "Refrigeration Pipe Network", "Ventilation Systems", "Duct Network"],
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    image: "/images/services/hvac.jpg",
  },
  {
    id: "electrical",
    title: "Electrical Works",
    description: "Full-spectrum electrical engineering from medium voltage systems to smart automation and building management solutions.",
    items: ["Medium Voltage Systems", "Low Voltage Systems", "Lighting Design & Installation", "Power Systems", "Control Systems", "KNX Automation", "BMS (Building Management System)"],
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    image: "/images/services/electrical.jpg",
  },
  {
    id: "plumbing",
    title: "Plumbing",
    description: "Reliable plumbing infrastructure for domestic, drainage, and sewage systems across all building types.",
    items: ["Domestic Pipe Network", "Drainage Pipe Network", "Sewage Network", "Pumps & Pump Systems"],
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    image: "/images/services/plumbing.jpg",
  },
  {
    id: "firefighting",
    title: "Fire Fighting",
    description: "Advanced fire protection systems ensuring safety compliance and peace of mind for every building and space.",
    items: ["Stand Pipe System", "Water Sprinkler Systems (Wet, Dry, Precaution & Deluge)", "Water Mist", "Manual Fire Extinguisher", "Automatic Fire Extinguisher", "Gas Systems (CO\u2082, FM 200, Novec, Inergen & Aerosol)", "Hood Suppression System", "Foam System", "Addressable Fire Alarm", "Conventional Fire Alarm"],
    icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
    image: "/images/services/firefighting.jpg",
  },
  {
    id: "fitout",
    title: "Fit-Out Contracting",
    description: "Seamless design and construction of captivating interiors for diverse commercial and residential spaces.",
    items: ["Retail Shops & Showrooms", "Corporate Offices", "Medical Clinics", "Residential Projects", "Food & Beverage Outlets", "Interior Design & Finishing"],
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    image: "/images/services/fitout.jpg",
  },
  {
    id: "communication",
    title: "Communication Systems",
    description: "Modern communication and IT infrastructure for connected, efficient buildings.",
    items: ["Telephone Systems", "Data Networks", "Audio Visual Systems", "MATV (Master Antenna Television)"],
    icon: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0",
    image: "/images/services/communication.jpg",
  },
  {
    id: "security",
    title: "Security Systems",
    description: "Comprehensive security solutions to protect assets and ensure safety across your premises.",
    items: ["Access Control Systems", "Intrusion Detection", "CCTV Surveillance", "Public Address Systems"],
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    image: "/images/services/security.jpg",
  },
];

function SvgIcon({ d, className = "w-10 h-10" }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
    </svg>
  );
}

export default function ServicesPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative w-full min-h-[500px] max-[768px]:min-h-[350px] flex items-center justify-center overflow-hidden">
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

      {/* Services */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`relative w-full text-white py-20 overflow-hidden ${index % 2 === 0 ? "bg-black" : "bg-radial-dark"}`}
        >
          {index % 2 === 0 && <div className="absolute inset-0 bg-grid-pattern opacity-10" />}

          <div className="relative z-10 max-w-[1100px] mx-auto px-5">
            <div className={`flex items-start justify-between gap-16 flex-wrap max-[960px]:flex-col max-[960px]:items-center ${index % 2 === 1 ? "flex-row-reverse" : ""}`}>
              <div className="max-w-[550px] flex flex-col" data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}>
                <div className="flex items-center gap-5 mb-8">
                  <div className="service-icon w-[70px] h-[70px]">
                    <SvgIcon d={service.icon} className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold uppercase">{service.title}</h2>
                    <div className="line-accent mt-2" />
                  </div>
                </div>
                <p className="font-light leading-[1.8] text-white/80 mb-8">{service.description}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {service.items.map((item) => (
                    <span key={item} className="px-4 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white/70 hover:border-primary/50 hover:text-white transition-all duration-200">
                      {item}
                    </span>
                  ))}
                </div>

                <Link href="/contact">
                  <button className="px-9 py-3 border border-white/30 rounded-lg bg-transparent text-white transition-all duration-300 cursor-pointer hover:bg-white hover:text-black hover:border-white hover:scale-105 w-fit">
                    Request Quote
                  </button>
                </Link>
              </div>

              <div className="max-w-[400px] w-full max-[960px]:max-w-full" data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}>
                <div className="relative w-full aspect-[4/3] max-[960px]:aspect-[16/9] rounded-2xl overflow-hidden group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                    <SvgIcon d={service.icon} className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="relative w-full py-24 bg-black overflow-hidden">
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
