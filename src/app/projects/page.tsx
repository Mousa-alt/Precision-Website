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

  // First 2 projects are "featured" when showing All
  const featuredProjects = activeCategory === "All" ? filtered.slice(0, 2) : [];
  const gridProjects = activeCategory === "All" ? filtered.slice(2) : filtered;

  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative w-full min-h-[400px] max-[768px]:min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] to-black" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="glow-orb w-[400px] h-[400px] bg-primary top-[-80px] right-[-80px] animate-pulse-glow" />

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-10 max-[768px]:px-6 max-[480px]:px-5 max-[480px]:text-center" data-aos="fade-up">
          <p className="text-primary text-[11px] font-semibold uppercase tracking-[3px] mb-3">Portfolio</p>
          <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold uppercase leading-[1.2] mb-4">
            Our <span className="text-primary">Projects</span>
          </h1>
          <p className="text-[14px] font-light text-white/50 max-w-[500px] leading-[1.8] max-[480px]:mx-auto">
            75+ successfully delivered projects across Cairo&apos;s most prestigious locations.
          </p>

          <div className="flex gap-10 mt-8 max-[480px]:justify-center max-[480px]:gap-6">
            {[
              { value: "75+", label: "Projects" },
              { value: "35,500", label: "m² Covered" },
              { value: "90%+", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-bold stat-number">{stat.value}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-[2px]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="relative w-full bg-black py-16">
        <div className="max-w-[1440px] mx-auto px-10 max-[768px]:px-6">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-12 max-[480px]:justify-center" data-aos="fade-up">
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length;

              if (count === 0 && cat !== "All") return null;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[1.5px] cursor-pointer transition-all duration-300 rounded-full border ${
                    activeCategory === cat
                      ? "bg-primary border-primary text-white"
                      : "bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {cat}
                  {count > 0 && (
                    <span className="ml-1.5 text-[10px] opacity-50">({count})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>
          )}

          {/* Featured projects (only when "All" is selected) */}
          {featuredProjects.length > 0 && (
            <div className="flex gap-5 mb-8 max-[768px]:flex-col" data-aos="fade-up">
              {featuredProjects.map((project, i) => (
                <div
                  key={`featured-${project.name}-${i}`}
                  className="project-card group flex-1 relative aspect-[16/10] bg-[#0a0a0a]"
                >
                  {project.coverPhoto ? (
                    <RevealImage
                      src={project.coverPhoto}
                      alt={project.name}
                      className="w-full h-full object-cover"
                      wrapClassName="w-full h-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-5 left-5">
                    <span className="inline-block px-3 py-1 text-[9px] font-semibold uppercase tracking-[1.5px] bg-primary/80 backdrop-blur-sm text-white rounded-full">
                      Featured
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-7 max-[480px]:p-5">
                    <span className="inline-block px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[1.5px] bg-white/10 backdrop-blur-sm text-white/80 rounded-full mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-xl max-[480px]:text-lg font-bold">{project.name}</h3>
                    {project.location && (
                      <p className="text-[12px] text-white/50 mt-1">{project.location}</p>
                    )}
                    {project.photoCount > 0 && (
                      <p className="text-[11px] text-white/30 mt-1">{project.photoCount} photos</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grid */}
          <div className="flex flex-wrap gap-5 max-[768px]:gap-4">
            {gridProjects.map((project, index) => (
              <div
                key={`${project.name}-${project.location}-${index}`}
                className="w-[calc(33.33%-14px)] max-[950px]:w-[calc(50%-10px)] max-[480px]:w-full group"
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 80}
              >
                <div className="project-card relative bg-[#0a0a0a] aspect-[4/3]">
                  {project.coverPhoto ? (
                    <RevealImage
                      src={project.coverPhoto}
                      alt={project.name}
                      className="w-full h-full object-cover"
                      wrapClassName="w-full h-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <div className="mt-4 px-1">
                  <span className="inline-block px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider bg-primary/15 text-primary rounded-full mb-1.5">
                    {project.category}
                  </span>
                  <h3 className="text-[15px] font-semibold group-hover:text-primary transition-colors duration-300">{project.name}</h3>
                  {project.location && (
                    <p className="text-[12px] text-white/40 mt-0.5">{project.location}</p>
                  )}
                  {project.photoCount > 0 && (
                    <p className="text-[10px] text-white/25 mt-1">{project.photoCount} photos</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && !loading && (
            <div className="text-center py-20 text-white/30">
              <svg className="w-14 h-14 mx-auto mb-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-base mb-2">No projects in this category yet</p>
              <p className="text-[13px] text-white/20">Projects will appear here once added to the Drive folder.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full py-20 bg-black overflow-hidden border-t border-white/[0.03]">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="glow-orb w-[400px] h-[400px] bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />

        <div className="relative z-10 text-center px-6" data-aos="zoom-in">
          <h2 className="text-[clamp(1.2rem,2.5vw,1.8rem)] font-bold uppercase mb-3">
            Your Project Could Be <span className="text-primary">Next</span>
          </h2>
          <p className="text-white/40 text-[13px] mb-8 max-w-[400px] mx-auto leading-[1.7]">
            Let&apos;s discuss how we can bring your vision to life with precision and excellence.
          </p>
          <Link href="/contact">
            <button className="px-8 py-3.5 border-none rounded-full bg-primary text-white text-[13px] font-semibold uppercase tracking-[1.5px] transition-all duration-300 cursor-pointer hover:bg-white hover:text-primary hover:scale-105 hover:shadow-[0_0_30px_rgba(123,45,54,0.4)]">
              Start Your Project
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
