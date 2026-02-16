"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RevealImage from "@/components/RevealImage";

const categories = ["All", "Administrative", "Retail", "Food & Beverage", "Medical", "Design & Supervision", "Commercial", "Entertainment"];

const categoryMap: Record<string, string> = {
  "Administrative": "Administrative",
  "Retail": "Retail",
  "F&B": "Food & Beverage",
  "Medical": "Medical",
  "Design & Supervision": "Design & Supervision",
  "Commercial": "Commercial",
  "Entertainment": "Entertainment",
};

const fallbackProjects = [
  { name: "Intelcia Head Office", location: "Ivory Business, El Sheikh Zayed", category: "Administrative" },
  { name: "Bayer Head Office", location: "Mivida Business Park", category: "Administrative" },
  { name: "Soil Spaces", location: "Mivida Business Park", category: "Administrative" },
  { name: "Cheil Head Office", location: "District 5", category: "Administrative" },
  { name: "Boss", location: "City Center Almaza", category: "Retail" },
  { name: "Antoushka", location: "Mall of Egypt", category: "Retail" },
  { name: "Casio", location: "Cairo Festival City", category: "Retail" },
  { name: "Decathlon", location: "Green Plaza, Alexandria", category: "Retail" },
  { name: "Beano's", location: "U Venues Mall", category: "Food & Beverage" },
  { name: "Antakha", location: "District 5", category: "Food & Beverage" },
  { name: "Odoriko", location: "Arkan Plaza", category: "Food & Beverage" },
  { name: "Muncai Medical", location: "ZED El Sheikh Zayed", category: "Medical" },
];

interface DriveProject {
  folderName: string;
  category: string;
  photos: { id: string; url: string; thumbnailUrl: string; name: string }[];
}

interface ProjectDisplay {
  name: string;
  location: string;
  category: string;
  coverPhoto?: string;
  photoCount: number;
}

function cleanFolderName(folderName: string): { name: string; location: string } {
  const parts = folderName.split(/\s*[-\u2013]\s*/);
  if (parts.length >= 3) {
    return {
      name: parts[0].trim().replace(/\b\w/g, (c) => c.toUpperCase()),
      location: parts.slice(1).join(", ").trim(),
    };
  }
  if (parts.length === 2) {
    return {
      name: parts[0].trim().replace(/\b\w/g, (c) => c.toUpperCase()),
      location: parts[1].trim(),
    };
  }
  return { name: folderName.trim(), location: "" };
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<ProjectDisplay[]>(
    fallbackProjects.map((p) => ({ ...p, photoCount: 0 }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPhotos() {
      try {
        const res = await fetch("/api/photos");
        const data = await res.json();
        const driveProjects: DriveProject[] = data.projects || [];

        if (driveProjects.length > 0) {
          const driveDisplay: ProjectDisplay[] = driveProjects.map((dp) => {
            const { name, location } = cleanFolderName(dp.folderName);
            const category = categoryMap[dp.category] || dp.category;
            return {
              name,
              location,
              category,
              coverPhoto: dp.photos[0]?.url,
              photoCount: dp.photos.length,
            };
          });

          setProjects(driveDisplay);
        }
      } catch {
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    }

    loadPhotos();
  }, []);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative w-full min-h-[500px] max-[768px]:min-h-[350px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-black" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="glow-orb w-[400px] h-[400px] bg-primary top-[-50px] right-[-50px] animate-pulse-glow" />

        <div className="relative z-10 pl-[80px] max-[768px]:pl-5 max-[480px]:text-center max-[480px]:px-5" data-aos="fade-up">
          <div className="line-accent mb-6 max-[480px]:mx-auto" />
          <h1 className="text-[clamp(28px,4vw,50px)] font-bold uppercase leading-[1.4] mb-6">
            Our <span className="text-primary">Projects</span>
          </h1>
          <p className="text-base font-light text-white/80 max-w-[600px] leading-[1.8]">
            With 75+ successfully delivered projects across Cairo&apos;s most prestigious locations,
            our portfolio speaks to our commitment to excellence and client satisfaction.
          </p>

          <div className="flex gap-12 mt-8 max-[480px]:justify-center max-[480px]:gap-6">
            {[
              { value: "75+", label: "Projects" },
              { value: "35,500", label: "m\u00B2 Covered" },
              { value: "90%+", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold stat-number">{stat.value}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative w-full bg-black py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center" data-aos="fade-up">
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 max-[480px]:px-3 max-[480px]:py-2 text-sm max-[480px]:text-xs font-bold uppercase cursor-pointer transition-all duration-300 rounded-lg border ${
                    activeCategory === cat
                      ? "bg-primary border-primary text-white"
                      : "bg-transparent border-white/20 text-white/70 hover:border-white hover:text-white"
                  }`}
                >
                  {cat}
                  {count > 0 && (
                    <span className="ml-1.5 text-xs opacity-60">({count})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="flex flex-wrap justify-center gap-8 max-[768px]:gap-4">
            {filtered.map((project, index) => (
              <div
                key={`${project.name}-${project.location}-${index}`}
                className="w-[370px] max-[768px]:w-[calc(50%-16px)] max-[480px]:w-full group"
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 100}
              >
                <div className="relative overflow-hidden rounded-[20px] card-hover bg-[#0a0a0a]">
                  {project.coverPhoto ? (
                    <RevealImage
                      src={project.coverPhoto}
                      alt={project.name}
                      className="w-full h-auto max-h-[320px] max-[768px]:max-h-[240px] object-contain transition-transform duration-500 group-hover:scale-105"
                      wrapClassName="w-full flex items-center justify-center"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-[280px] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/5 transition-transform duration-300 group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <div className="mt-4 px-1">
                  <p className="text-primary text-xs uppercase tracking-wider font-bold">{project.category}</p>
                  <h3 className="text-lg font-bold mt-1 group-hover:text-primary transition-colors duration-300">{project.name}</h3>
                  {project.location && (
                    <p className="text-[0.8rem] text-white/50 mt-0.5">{project.location}</p>
                  )}
                  {project.photoCount > 0 && (
                    <p className="text-[0.7rem] text-white/30 mt-1">{project.photoCount} photos</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && !loading && (
            <div className="text-center py-20 text-white/40">
              <svg className="w-16 h-16 mx-auto mb-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg mb-2">No projects in this category yet</p>
              <p className="text-sm">Projects will appear here once added to the Drive folder.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="glow-orb w-[500px] h-[500px] bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />

        <div className="relative z-10 text-center" data-aos="zoom-in">
          <h2 className="text-[2rem] max-[768px]:text-[1.5rem] font-bold uppercase mb-4">
            Your Project Could Be <span className="text-primary">Next</span>
          </h2>
          <p className="text-white/50 text-sm mb-8 max-w-[400px] mx-auto">
            Let&apos;s discuss how we can bring your vision to life with precision and excellence.
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
