"use client";

import Link from "next/link";

const services = [
  {
    id: "hvac",
    title: "HVAC Systems",
    description: "Complete heating, ventilation, and air conditioning solutions for optimal climate control and energy efficiency across residential and commercial buildings.",
    items: ["Air Cooled Chillers", "Water Cooled Chillers", "Cooling Towers", "District Cooling", "Chilled Pipe Network", "Air Conditioning - DX", "Air Conditioning - VRF", "Refrigeration Pipe Network", "Ventilation Systems", "Duct Network"],
    gradient: "bg-radial-dark",
  },
  {
    id: "electrical",
    title: "Electrical Works",
    description: "Full-spectrum electrical engineering from medium voltage systems to smart automation and building management solutions.",
    items: ["Medium Voltage Systems", "Low Voltage Systems", "Lighting Design & Installation", "Power Systems", "Control Systems", "KNX Automation", "BMS (Building Management System)"],
    gradient: "bg-radial-gray",
  },
  {
    id: "plumbing",
    title: "Plumbing",
    description: "Reliable plumbing infrastructure for domestic, drainage, and sewage systems across all building types.",
    items: ["Domestic Pipe Network", "Drainage Pipe Network", "Sewage Network", "Pumps & Pump Systems"],
    gradient: "bg-radial-dark",
  },
  {
    id: "firefighting",
    title: "Fire Fighting",
    description: "Advanced fire protection systems ensuring safety compliance and peace of mind for every building and space.",
    items: ["Stand Pipe System", "Water Sprinkler Systems (Wet, Dry, Precaution & Deluge)", "Water Mist", "Manual Fire Extinguisher", "Automatic Fire Extinguisher", "Gas Systems (CO\u2082, FM 200, Novec, Inergen & Aerosol)", "Hood Suppression System", "Foam System", "Addressable Fire Alarm", "Conventional Fire Alarm"],
    gradient: "bg-radial-gray",
  },
  {
    id: "fitout",
    title: "Fit-Out Contracting",
    description: "Seamless design and construction of captivating interiors for diverse commercial and residential spaces.",
    items: ["Retail Shops & Showrooms", "Corporate Offices", "Medical Clinics", "Residential Projects", "Food & Beverage Outlets", "Interior Design & Finishing"],
    gradient: "bg-radial-dark",
  },
  {
    id: "communication",
    title: "Communication Systems",
    description: "Modern communication and IT infrastructure for connected, efficient buildings.",
    items: ["Telephone Systems", "Data Networks", "Audio Visual Systems", "MATV (Master Antenna Television)"],
    gradient: "bg-radial-gray",
  },
  {
    id: "security",
    title: "Security Systems",
    description: "Comprehensive security solutions to protect assets and ensure safety across your premises.",
    items: ["Access Control Systems", "Intrusion Detection", "CCTV Surveillance", "Public Address Systems"],
    gradient: "bg-radial-dark",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative w-full min-h-[500px] max-[768px]:min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-black" />

        <div className="relative z-10 text-center px-5" data-aos="fade-up">
          <h1 className="text-[2.6rem] max-[768px]:text-[1.8rem] max-[480px]:text-[1.5rem] font-bold uppercase mb-6">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-[0.8rem] text-light-gray uppercase leading-[2] tracking-wider">
            Comprehensive MEP Solutions & Fit-Out Contracting
          </p>
        </div>
      </section>

      {/* Services */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`relative w-full text-white py-16 ${service.gradient}`}
        >
          <div className="max-w-[1200px] mx-auto px-5">
            <div className={`flex items-start justify-around gap-10 flex-wrap max-[960px]:flex-col max-[960px]:items-center ${index % 2 === 1 ? "flex-row-reverse" : ""}`}>
              {/* Text */}
              <div className="max-w-[500px] flex flex-col" data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}>
                <h2 className="text-2xl font-bold mb-6 uppercase">{service.title}</h2>
                <p className="font-light leading-[28px] text-white/90 mb-8">{service.description}</p>

                {/* Items list */}
                <ul className="space-y-3">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span className="text-primary mt-1">&#9654;</span>
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className="mt-8">
                  <button className="px-9 py-3 border border-white rounded-lg bg-black text-white transition-all duration-300 cursor-pointer hover:border-black hover:bg-white hover:text-black hover:scale-105">
                    Request Quote
                  </button>
                </Link>
              </div>

              {/* Image placeholder */}
              <div className="max-w-[450px] w-full" data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}>
                <div className="w-full h-[350px] max-[768px]:h-[250px] bg-gradient-to-br from-[#222] to-[#111] rounded-[20px] border border-white object-cover" />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="w-full py-24 bg-radial-dark flex items-center justify-center">
        <div className="text-center" data-aos="zoom-in">
          <h2 className="text-[2rem] max-[768px]:text-[1.5rem] font-bold uppercase mb-8">
            Need a Custom <span className="text-primary">MEP Solution?</span>
          </h2>
          <Link href="/contact">
            <button className="px-9 py-3 border border-white rounded-lg bg-black text-white transition-all duration-300 cursor-pointer hover:border-black hover:bg-white hover:text-black hover:scale-105">
              Get in Touch
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
