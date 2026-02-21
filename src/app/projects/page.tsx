"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RevealImage from "@/components/RevealImage";
import PhotoLightbox from "@/components/PhotoLightbox";

const categories = ["All", "Administrative", "Retail", "Food & Beverage", "Medical", "Design & Supervision", "Commercial", "Entertainment"];

const categoryColors: Record<string, string> = {
  "All": "bg-primary border-primary",
  "Administrative": "bg-blue-600 border-blue-600",
  "Retail": "bg-emerald-600 border-emerald-600",
  "Food & Beverage": "bg-amber-600 border-amber-600",
  "Medical": "bg-cyan-600 border-cyan-600",
  "Design & Supervision": "bg-violet-600 border-violet-600",
  "Commercial": "bg-rose-600 border-rose-600",
  "Entertainment": "bg-fuchsia-600 border-fuchsia-600",
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Full track record — projects that may or may not have photos in Drive
const trackRecordData: { category: string; projects: { name: string; location: string }[] }[] = [
  {
    category: "Retail",
    projects: [
      { name: "Guru", location: "ORA Zed, El Sheikh Zayed" },
      { name: "Boss", location: "City Center Almaza" },
      { name: "Antoushka", location: "Mall of Egypt" },
      { name: "LG", location: "Mall of Egypt" },
      { name: "Knana", location: "Lake Town" },
      { name: "Casio", location: "Cairo Festival City" },
      { name: "Bashmina", location: "Maxim Mall" },
      { name: "Decathlon", location: "Green Plaza" },
    ],
  },
  {
    category: "Food & Beverage",
    projects: [
      { name: "Odoriko", location: "Arkan Plaza" },
      { name: "Breadfast", location: "Sphinx" },
      { name: "CAF", location: "Sphinx" },
      { name: "CAF", location: "Waterway 2" },
      { name: "Beano's", location: "U Venues Mall" },
      { name: "Beano's", location: "Lake Town" },
      { name: "La Poire", location: "City Center Alexandria" },
      { name: "Al-Abd", location: "Cairo Festival City" },
      { name: "Al-Abd", location: "Al Obour City" },
      { name: "Al-Abd", location: "Al Abasia" },
      { name: "Antakha", location: "District 5" },
      { name: "929", location: "The Garden" },
      { name: "Stuffit", location: "The Garden" },
    ],
  },
  {
    category: "Administrative",
    projects: [
      { name: "Intelcia Head Office", location: "Ivory Business" },
      { name: "Bayer Head Office", location: "Mivida Business Park" },
      { name: "Soil Spaces", location: "Mivida Business Park" },
      { name: "Cheil Head Office", location: "District 5" },
      { name: "Cred Sales Center", location: "New Cairo" },
      { name: "Raya Call Center", location: "Crystal Plaza, Maadi" },
      { name: "Keys Payroll HQ", location: "Maadi" },
      { name: "Apetco HQ", location: "Sidewalk Mall" },
      { name: "Apetco HQ Extension", location: "Sidewalk Mall" },
      { name: "Paxton HQ", location: "Hyde Park" },
      { name: "ABC Bank HO Renovation", location: "" },
      { name: "Roche", location: "Galleria 40" },
    ],
  },
  {
    category: "Design & Supervision",
    projects: [
      { name: "Air Liquide HQ", location: "Sodic East" },
      { name: "Al Baraka Bank HQ", location: "Nile City" },
      { name: "Elsewedy Office", location: "" },
      { name: "Lazurde & Miss L Shops", location: "" },
      { name: "Antoushka", location: "Mall of Egypt" },
      { name: "Knana Shop", location: "" },
      { name: "CAF Cafe", location: "" },
      { name: "Paxton Office", location: "" },
    ],
  },
  {
    category: "Medical",
    projects: [
      { name: "Muncai", location: "ORA, Zayed" },
    ],
  },
];

const categoryMap: Record<string, string> = {
  "Administrative": "Administrative",
  "Retail": "Retail",
  "F&B": "Food & Beverage",
  "Medical": "Medical",
  "Design & Supervision": "Design & Supervision",
  "Commercial": "Commercial",
  "Entertainment": "Entertainment",
};

interface DriveProject {
  folderName: string;
  category: string;
  displayName?: string;
  displayLocation?: string;
  photos: { id: string; url: string; thumbnailUrl: string; name: string }[];
  coverPosition?: string;
  coverFit?: string;
  coverZoom?: number;
}

interface ProjectDisplay {
  name: string;
  location: string;
  category: string;
  coverPhoto?: string;
  coverPosition: string;
  coverFit: "cover" | "contain";
  coverZoom?: number;
  displaySize: "hero" | "featured" | "regular";
  photoCount: number;
  photos: { id: string; url: string; thumbnailUrl: string; name: string }[];
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
  const [projects, setProjects] = useState<ProjectDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxProject, setLightboxProject] = useState<ProjectDisplay | null>(null);

  useEffect(() => {
    async function loadPhotos() {
      try {
        const [photosRes, namesRes] = await Promise.all([
          fetch("/api/photos"),
          fetch("/api/admin/project-names").catch(() => null),
        ]);

        const data = await photosRes.json();
        const driveProjects: DriveProject[] = data.projects || [];

        if (driveProjects.length > 0) {
          // Load project-name overrides + layout (order, sizes)
          let projectOverrides: Record<string, { name: string; location: string; coverPosition?: string; coverFit?: string; coverZoom?: number }> = {};
          let savedOrder: string[] = [];
          let savedSizes: Record<string, string> = {};
          try {
            if (namesRes?.ok) {
              const namesData = await namesRes.json();
              projectOverrides = namesData.names || {};
              if (namesData.layout) {
                savedOrder = namesData.layout.order || [];
                savedSizes = namesData.layout.sizes || {};
              }
            }
          } catch {
            // No overrides
          }

          const toDisplay = (dp: DriveProject): ProjectDisplay => {
            const override = projectOverrides[dp.folderName];
            const name = override?.name || dp.displayName || cleanFolderName(dp.folderName).name;
            const location = override?.location ?? dp.displayLocation ?? cleanFolderName(dp.folderName).location;
            const category = categoryMap[dp.category] || dp.category;
            const size = (savedSizes[dp.folderName] || "regular") as "hero" | "featured" | "regular";
            return {
              name,
              location,
              category,
              coverPhoto: dp.photos[0]?.url,
              coverPosition: override?.coverPosition || dp.coverPosition || "center",
              coverFit: (override?.coverFit as "cover" | "contain") || (dp.coverFit as "cover" | "contain") || "cover",
              coverZoom: override?.coverZoom,
              displaySize: size,
              photoCount: dp.photos.length,
              photos: dp.photos,
            };
          };

          // Apply saved order — NEW projects (not in savedOrder) come FIRST so they appear at the top
          const savedSet = new Set(savedOrder);
          const newProjects = driveProjects.filter((dp) => !savedSet.has(dp.folderName));
          const existingOrdered: DriveProject[] = [];
          for (const name of savedOrder) {
            const p = driveProjects.find((dp) => dp.folderName === name);
            if (p) existingOrdered.push(p);
          }
          const ordered = [...newProjects, ...existingOrdered];

          const allProjects = ordered.map(toDisplay);
          setProjects(allProjects);

          // Check URL parameter to auto-open a project gallery
          const params = new URLSearchParams(window.location.search);
          const projectParam = params.get("project");
          if (projectParam) {
            const match = allProjects.find(
              (p) => p.name.toLowerCase() === projectParam.toLowerCase()
            );
            if (match && match.photos.length > 0) {
              setLightboxProject(match);
            }
          }
        }
      } catch {
        // Keep empty on error
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

  const heroProjects = filtered.filter((p) => p.displaySize === "hero");
  const featuredProjects = filtered.filter((p) => p.displaySize === "featured");
  const regularProjects = filtered.filter((p) => p.displaySize === "regular");

  // Build track record list, excluding projects that already have photos
  const photoProjectNames = new Set(
    projects.map((p) => p.name.toLowerCase())
  );
  const filteredTrackRecord = trackRecordData
    .map((group) => ({
      category: group.category,
      projects: group.projects.filter(
        (p) => !photoProjectNames.has(p.name.toLowerCase())
      ),
    }))
    .filter((group) => group.projects.length > 0)
    .filter(
      (group) =>
        activeCategory === "All" || group.category === activeCategory
    );

  const trackRecordCount = filteredTrackRecord.reduce(
    (sum, g) => sum + g.projects.length,
    0
  );

  function openProject(project: ProjectDisplay) {
    if (project.photos.length > 0) {
      setLightboxProject(project);
    }
  }

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
              // Count photo projects + text-only track record projects
              const photoCount =
                cat === "All"
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length;
              const textCount =
                cat === "All"
                  ? trackRecordData.reduce((s, g) => s + g.projects.filter((p) => !photoProjectNames.has(p.name.toLowerCase())).length, 0)
                  : (trackRecordData.find((g) => g.category === cat)?.projects.filter((p) => !photoProjectNames.has(p.name.toLowerCase())).length || 0);
              const count = photoCount + textCount;

              if (count === 0 && cat !== "All") return null;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[1.5px] cursor-pointer transition-all duration-300 rounded-full border ${activeCategory === cat
                    ? `${categoryColors[cat] || "bg-primary border-primary"} text-white`
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

          {/* Hero projects — full width */}
          {heroProjects.length > 0 && (
            <div className="space-y-5 mb-8" data-aos="fade-up">
              {heroProjects.map((project, i) => (
                <div
                  key={`hero-${project.name}-${i}`}
                  className="project-card group relative w-full aspect-[21/9] max-[768px]:aspect-[16/9] bg-[#0a0a0a] cursor-pointer"
                  onClick={() => openProject(project)}
                >
                  {project.coverPhoto ? (
                    <RevealImage
                      src={project.coverPhoto}
                      alt={project.name}
                      className={`w-full h-full ${project.coverFit === "contain" ? "object-contain" : "object-cover"}`}
                      wrapClassName="w-full h-full"
                      referrerPolicy="no-referrer"
                      objectPosition={project.coverPosition}
                      objectFit={project.coverFit}
                      zoom={project.coverZoom}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 max-[480px]:p-5">
                    <span className="inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-[2px] bg-primary/90 text-white rounded-full mb-3">
                      {project.category}
                    </span>
                    <h3 className="text-[clamp(1.2rem,2vw,1.8rem)] font-bold">{project.name}</h3>
                    {project.location && (
                      <p className="text-[13px] text-white/50 mt-1">{project.location}</p>
                    )}
                    {project.photoCount > 0 && (
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-[11px] text-white/30 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {project.photoCount} photos
                        </p>
                        <Link
                          href={`/projects/${slugify(project.name)}`}
                          className="text-[11px] text-primary hover:text-primary/80 font-semibold transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Featured projects — 2 per row */}
          {featuredProjects.length > 0 && (
            <div className="flex flex-wrap gap-5 mb-8 max-[768px]:gap-4" data-aos="fade-up">
              {featuredProjects.map((project, i) => (
                <div
                  key={`featured-${project.name}-${i}`}
                  className="project-card group relative w-[calc(50%-10px)] max-[768px]:w-[calc(50%-8px)] aspect-[16/10] bg-[#0a0a0a] cursor-pointer"
                  onClick={() => openProject(project)}
                >
                  {project.coverPhoto ? (
                    <RevealImage
                      src={project.coverPhoto}
                      alt={project.name}
                      className={`w-full h-full ${project.coverFit === "contain" ? "object-contain" : "object-cover"}`}
                      wrapClassName="w-full h-full"
                      referrerPolicy="no-referrer"
                      objectPosition={project.coverPosition}
                      objectFit={project.coverFit}
                      zoom={project.coverZoom}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-7 max-[480px]:p-5">
                    <span className="inline-block px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[1.5px] bg-white/10 backdrop-blur-sm text-white/80 rounded-full mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-xl max-[480px]:text-lg font-bold">{project.name}</h3>
                    {project.location && (
                      <p className="text-[12px] text-white/50 mt-1">{project.location}</p>
                    )}
                    {project.photoCount > 0 && (
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-[11px] text-white/30 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {project.photoCount} photos
                        </p>
                        <Link
                          href={`/projects/${slugify(project.name)}`}
                          className="text-[11px] text-primary hover:text-primary/80 font-semibold transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Regular projects — 3 per row grid */}
          <div className="flex flex-wrap gap-5 max-[768px]:gap-4">
            {regularProjects.map((project, index) => (
              <div
                key={`${project.name}-${project.location}-${index}`}
                className="w-[calc(33.33%-14px)] max-[950px]:w-[calc(50%-10px)] max-[480px]:w-[calc(50%-8px)] group cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 80}
                onClick={() => openProject(project)}
              >
                <div className="project-card relative bg-[#0a0a0a] aspect-[4/3]">
                  {project.coverPhoto ? (
                    <RevealImage
                      src={project.coverPhoto}
                      alt={project.name}
                      className={`w-full h-full ${project.coverFit === "contain" ? "object-contain" : "object-cover"}`}
                      wrapClassName="w-full h-full"
                      referrerPolicy="no-referrer"
                      objectPosition={project.coverPosition}
                      objectFit={project.coverFit}
                      zoom={project.coverZoom}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  {project.photoCount > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {project.photoCount}
                    </div>
                  )}
                </div>
                <div className="mt-4 px-1">
                  <span className="inline-block px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider bg-primary/15 text-primary rounded-full mb-1.5">
                    {project.category}
                  </span>
                  <h3 className="text-[15px] font-semibold group-hover:text-primary transition-colors duration-300">{project.name}</h3>
                  {project.location && (
                    <p className="text-[12px] text-white/40 mt-0.5">{project.location}</p>
                  )}
                  <Link
                    href={`/projects/${slugify(project.name)}`}
                    className="text-[11px] text-primary/60 hover:text-primary font-semibold transition-colors mt-1.5 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state — only when no photo projects AND no track record */}
          {filtered.length === 0 && trackRecordCount === 0 && !loading && (
            <div className="text-center py-20 text-white/30">
              <svg className="w-14 h-14 mx-auto mb-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-base mb-2">No projects in this category yet</p>
              <p className="text-[13px] text-white/20">Projects will appear here once added to the Drive folder.</p>
            </div>
          )}

          {/* Our Track Record — text-only projects */}
          {trackRecordCount > 0 && !loading && (
            <div className="mt-16 border-t border-white/[0.05] pt-12" data-aos="fade-up">
              <div className="mb-10 max-[480px]:text-center">
                <p className="text-primary text-[11px] font-semibold uppercase tracking-[3px] mb-2">Complete Portfolio</p>
                <h2 className="text-[clamp(1.2rem,2.5vw,1.6rem)] font-bold uppercase">
                  Our Track <span className="text-primary">Record</span>
                </h2>
              </div>

              <div className="flex flex-wrap gap-8 max-[768px]:gap-6">
                {filteredTrackRecord.map((group) => (
                  <div
                    key={group.category}
                    className="w-[calc(50%-16px)] max-[768px]:w-full"
                    data-aos="fade-up"
                  >
                    <h3 className="text-[13px] font-semibold uppercase tracking-[2px] text-primary/80 mb-4 flex items-center gap-2">
                      <span className="w-5 h-[1px] bg-primary/40" />
                      {group.category}
                    </h3>
                    <ul className="space-y-2.5">
                      {group.projects.map((project, i) => (
                        <li
                          key={`${project.name}-${project.location}-${i}`}
                          className="flex items-baseline gap-2 text-[14px] max-[480px]:text-[13px]"
                        >
                          <span className="w-1 h-1 rounded-full bg-white/20 shrink-0 mt-2" />
                          <span className="text-white/80 font-medium">{project.name}</span>
                          {project.location && (
                            <span className="text-white/30 text-[12px]">— {project.location}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
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

      {/* Photo Lightbox */}
      {lightboxProject && (
        <PhotoLightbox
          photos={lightboxProject.photos}
          projectName={lightboxProject.name}
          projectLocation={lightboxProject.location}
          onClose={() => setLightboxProject(null)}
        />
      )}
    </div>
  );
}
