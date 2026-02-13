"use client";

import { useState } from "react";
import Link from "next/link";

const categories = ["All", "Administrative", "Retail", "Food & Beverage", "Medical", "Design & Supervision"];

const projects = [
  { name: "Intelcia Head Office", location: "Ivory Business, El Sheikh Zayed", category: "Administrative" },
  { name: "Bayer Head Office", location: "Mivida Business Park", category: "Administrative" },
  { name: "Soil Spaces", location: "Mivida Business Park", category: "Administrative" },
  { name: "Cheil Head Office", location: "District 5", category: "Administrative" },
  { name: "Cred Sales Center", location: "New Cairo", category: "Administrative" },
  { name: "Raya Call Center", location: "Crystal Plaza, Maadi", category: "Administrative" },
  { name: "Keys Payroll HQ", location: "Maadi", category: "Administrative" },
  { name: "Apetco HQ", location: "Side Walk Mall", category: "Administrative" },
  { name: "Apetco HQ Extension", location: "Side Walk Mall", category: "Administrative" },
  { name: "Paxton HQ", location: "Hyde Park", category: "Administrative" },
  { name: "ABC Bank HO Renovation", location: "New Cairo", category: "Administrative" },
  { name: "Roche", location: "Galleria 40", category: "Administrative" },
  { name: "Airliquide HQ", location: "Sodic East", category: "Administrative" },
  { name: "Albarka Bank HQ", location: "Nile City", category: "Administrative" },
  { name: "Elsewedy Office", location: "Cairo", category: "Administrative" },
  { name: "Guru - ORA", location: "ZED El Sheikh Zayed", category: "Retail" },
  { name: "Boss", location: "City Center Almaza", category: "Retail" },
  { name: "Antoushka", location: "Mall of Egypt", category: "Retail" },
  { name: "LG", location: "Mall of Egypt", category: "Retail" },
  { name: "Knana", location: "Lake Town", category: "Retail" },
  { name: "Casio", location: "Cairo Festival City", category: "Retail" },
  { name: "Bashmina", location: "Maxim Mall", category: "Retail" },
  { name: "Decathlon", location: "Green Plaza, Alexandria", category: "Retail" },
  { name: "Odoriko", location: "Arkan Plaza", category: "Food & Beverage" },
  { name: "Breadfast", location: "Sphinx", category: "Food & Beverage" },
  { name: "CAF Cafe", location: "Sphinx", category: "Food & Beverage" },
  { name: "CAF Cafe", location: "Waterway 2", category: "Food & Beverage" },
  { name: "Beano's", location: "U Venues Mall", category: "Food & Beverage" },
  { name: "Beano's", location: "Lake Town", category: "Food & Beverage" },
  { name: "La Poire", location: "City Center Alexandria", category: "Food & Beverage" },
  { name: "Al-Abd Patisserie", location: "Cairo Festival City", category: "Food & Beverage" },
  { name: "Al-Abd Patisserie", location: "Al-Obour City", category: "Food & Beverage" },
  { name: "Al-Abd Patisserie", location: "Alabasia", category: "Food & Beverage" },
  { name: "Antakha", location: "District 5", category: "Food & Beverage" },
  { name: "929", location: "The Garden", category: "Food & Beverage" },
  { name: "Stuffit", location: "The Garden", category: "Food & Beverage" },
  { name: "Muncai Medical", location: "ZED El Sheikh Zayed", category: "Medical" },
  { name: "Lazurde & Miss L", location: "Various Locations", category: "Design & Supervision" },
  { name: "Antoushka", location: "Mall of Egypt", category: "Design & Supervision" },
  { name: "Knana Shop", location: "Cairo", category: "Design & Supervision" },
  { name: "CAF Cafe", location: "Cairo", category: "Design & Supervision" },
  { name: "Paxton Office", location: "Cairo", category: "Design & Supervision" },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative w-full min-h-[500px] max-[768px]:min-h-[350px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-black" />

        <div className="relative z-10 pl-[80px] max-[768px]:pl-5 max-[480px]:text-center max-[480px]:px-5" data-aos="fade-up">
          <h1 className="text-[clamp(28px,4vw,50px)] font-bold uppercase leading-[1.4] mb-6">
            Our <span className="text-primary">Projects</span>
          </h1>
          <p className="text-base font-light text-white/80 max-w-[600px] leading-[1.8]">
            With 75+ successfully delivered projects across Cairo&apos;s most prestigious locations,
            our portfolio speaks to our commitment to excellence and client satisfaction.
          </p>

          {/* Quick stats */}
          <div className="flex gap-12 mt-8 max-[480px]:justify-center max-[480px]:gap-6">
            <div>
              <div className="text-2xl font-bold text-primary">75+</div>
              <div className="text-xs text-white/60">Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">35,500</div>
              <div className="text-xs text-white/60">m² Covered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">90%+</div>
              <div className="text-xs text-white/60">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Center timeline line */}
      <section className="relative w-full bg-black py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center" data-aos="fade-up">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-sm font-bold uppercase cursor-pointer transition-all duration-300 rounded-lg border ${
                  activeCategory === cat
                    ? "bg-primary border-primary text-white"
                    : "bg-transparent border-white text-white hover:bg-white hover:text-black"
                }`}
              >
                {cat}
                <span className="ml-1.5 text-xs opacity-60">
                  ({cat === "All" ? projects.length : projects.filter((p) => p.category === cat).length})
                </span>
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="flex flex-wrap justify-center gap-10">
            {filtered.map((project, index) => (
              <div
                key={`${project.name}-${project.location}-${index}`}
                className="flex flex-col items-center gap-3 group"
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 100}
              >
                <div className="w-[350px] max-[768px]:w-[300px] max-[480px]:w-full relative overflow-hidden">
                  <div className="w-full h-[250px] max-[768px]:h-[180px] bg-gradient-to-br from-[#222] to-[#111] rounded-[20px] transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="text-center text-shadow">
                  <p className="text-primary text-xs uppercase tracking-wider font-bold">{project.category}</p>
                  <h3 className="text-lg font-bold mt-1">{project.name}</h3>
                  <p className="text-[0.8rem] text-white/60 mt-0.5">{project.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 bg-radial-dark flex items-center justify-center">
        <div className="text-center" data-aos="zoom-in">
          <h2 className="text-[2rem] max-[768px]:text-[1.5rem] font-bold uppercase mb-8">
            Your Project Could Be <span className="text-primary">Next</span>
          </h2>
          <Link href="/contact">
            <button className="px-9 py-3 border border-white rounded-lg bg-black text-white transition-all duration-300 cursor-pointer hover:border-black hover:bg-white hover:text-black hover:scale-105">
              Start Your Project
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
