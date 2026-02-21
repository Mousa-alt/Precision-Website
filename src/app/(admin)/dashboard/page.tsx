"use client";

import { useState, useEffect } from "react";

interface DriveProject {
  folderName: string;
  category: string;
  displayName?: string;
  displayLocation?: string;
  photos: { id: string; url: string; thumbnailUrl: string; name: string }[];
  coverPosition?: string;
}

interface ProjectNameOverride {
  name: string;
  location: string;
  coverPosition?: string;
  coverFit?: string;
  coverZoom?: number;
}

interface HomeSlot {
  folderName: string;
  coverPhotoId: string;
  coverPosition: string;
  coverFit?: string;
  coverZoom?: number;
}

type Tab = "home" | "projects" | "content" | "settings";

const SLOT_LABELS = ["Hero (Large)", "Medium Left", "Medium Right", "Small", "Small", "Small"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [projects, setProjects] = useState<DriveProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Home tab state
  const [homeSlots, setHomeSlots] = useState<HomeSlot[]>([]);
  const [homeSaving, setHomeSaving] = useState(false);
  const [homeLoaded, setHomeLoaded] = useState(false);
  const [expandedSlot, setExpandedSlot] = useState<number | null>(null);
  const [dragSource, setDragSource] = useState<{ type: "slot"; index: number } | { type: "project"; folderName: string } | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  // Projects tab state
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [projectsOrder, setProjectsOrder] = useState<string[]>([]);
  const [projectsSizes, setProjectsSizes] = useState<Record<string, string>>({});
  const [projDragSource, setProjDragSource] = useState<string | null>(null);
  const [projDragOver, setProjDragOver] = useState<string | null>(null);

  // Content editing state
  const [heroSlides, setHeroSlides] = useState([
    { title: "Engineering Excellence", highlight: "Built on Precision", subtitle: "Contracting & MEP Solutions" },
    { title: "Powering Spaces", highlight: "With Innovation", subtitle: "HVAC, Electrical & Smart Systems" },
    { title: "The Heartbeat", highlight: "Of Every Project", subtitle: "From Design to Handover" },
  ]);
  const [aboutText, setAboutText] = useState(
    "At Precision, we are a forward-thinking contracting and MEP solutions company dedicated to innovation, precision, and delivering excellence in every project. We seamlessly integrate the highest technical standards with the artistic vision of our project partners."
  );
  const [missionText, setMissionText] = useState(
    "To streamline the construction process for our clients by delivering comprehensive follow-up consultations at every stage, ensuring a seamless operation, functional space with a top-notch quality that exceeds expectations."
  );
  const [visionText, setVisionText] = useState(
    "To lead as a premier contracting and MEP solutions provider, delivering innovative and sustainable projects that exceed client expectations. We are committed to excellence, craftsmanship, and creating lasting value through every endeavor we undertake."
  );
  const [contactInfo, setContactInfo] = useState({
    address: "33 Taqsim Al-Mustaqbal, Modern University Street, Al-Mokatam, Cairo, Egypt",
    email: "info@precision-egy.com",
    phone1: "+20 100 762 5526",
    phone2: "+20 111 500 5060",
    whatsapp: "201007625526",
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://www.facebook.com/precision.mep",
    instagram: "https://www.instagram.com/precision.mep.smart.solutions",
    linkedin: "https://www.linkedin.com/company/precision-egy",
  });

  // Project names state
  const [projectNames, setProjectNames] = useState<Record<string, ProjectNameOverride>>({});
  const [namesSaving, setNamesSaving] = useState(false);

  // Settings
  const [driveFolderId, setDriveFolderId] = useState("");
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  useEffect(() => {
    loadProjects();
    loadHomeConfig();
    loadProjectNames();
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await fetch("/api/admin/config?key=auto-sync");
      const json = await res.json();
      if (json.data !== null && json.data !== undefined) setAutoSyncEnabled(json.data !== false);
    } catch { /* default to enabled */ }
  }

  async function toggleAutoSync() {
    const newVal = !autoSyncEnabled;
    setAutoSyncEnabled(newVal);
    await fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "auto-sync", data: newVal }),
    });
  }

  // Auto-populate slots with fallback order when no saved config exists
  useEffect(() => {
    if (homeLoaded && homeSlots.length === 0 && projects.length > 0) {
      const FEATURED_ORDER = ["intelcia", "soil spaces", "cheil", "beano", "bayer", "odoriko"];
      const picked: HomeSlot[] = [];
      for (const keyword of FEATURED_ORDER) {
        const match = projects.find(
          (p) => p.folderName.toLowerCase().includes(keyword) && !picked.some((s) => s.folderName === p.folderName)
        );
        if (match && match.photos.length > 0) {
          picked.push({
            folderName: match.folderName,
            coverPhotoId: match.photos[0].id,
            coverPosition: match.coverPosition || "center",
          });
        }
      }
      // Fill remaining slots if needed
      if (picked.length < 6) {
        for (const p of projects) {
          if (!picked.some((s) => s.folderName === p.folderName) && p.photos.length > 0) {
            picked.push({
              folderName: p.folderName,
              coverPhotoId: p.photos[0].id,
              coverPosition: p.coverPosition || "center",
            });
          }
          if (picked.length >= 6) break;
        }
      }
      if (picked.length > 0) {
        setHomeSlots(picked.slice(0, 6));
      }
    }
  }, [homeLoaded, projects]);

  async function loadProjects(bustCache = false) {
    setLoading(true);
    setStatus(bustCache ? "Syncing fresh data from Google Drive..." : "Loading projects from Drive...");
    try {
      if (bustCache) {
        await fetch("/api/revalidate", { method: "POST" });
      }
      const res = await fetch("/api/photos" + (bustCache ? "?t=" + Date.now() : ""), bustCache ? { cache: "no-store" } : undefined);
      const data = await res.json();
      const freshProjects = data.projects || [];
      setProjects(freshProjects);
      if (data.folderId) setDriveFolderId(data.folderId);
      // Auto-add new projects to the order list
      if (bustCache && projectsOrder.length > 0) {
        const existingSet = new Set(projectsOrder);
        const newFolders = freshProjects.filter((p: DriveProject) => !existingSet.has(p.folderName)).map((p: DriveProject) => p.folderName);
        if (newFolders.length > 0) {
          setProjectsOrder([...newFolders, ...projectsOrder]);
        }
      }
      setStatus(`Loaded ${freshProjects.length} projects` + (bustCache ? " (fresh from Drive)" : ""));
    } catch {
      setStatus("Error loading projects");
    } finally {
      setLoading(false);
    }
  }

  async function loadHomeConfig() {
    try {
      const res = await fetch("/api/admin/homepage");
      const data = await res.json();
      if (data.config?.slots && data.config.slots.length > 0) {
        setHomeSlots(data.config.slots);
      }
    } catch {
      // silent fail — will use empty slots
    }
    setHomeLoaded(true);
  }

  async function loadProjectNames() {
    try {
      const res = await fetch("/api/admin/project-names");
      const data = await res.json();
      if (data.names) {
        setProjectNames(data.names);
      }
      if (data.layout) {
        if (data.layout.order?.length > 0) setProjectsOrder(data.layout.order);
        if (data.layout.sizes) setProjectsSizes(data.layout.sizes);
      }
    } catch {
      // silent fail
    }
  }

  async function saveProjectNames() {
    setNamesSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/project-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: projectNames, layout: { order: projectsOrder, sizes: projectsSizes } }),
      });
      if (res.ok) {
        setStatus("Project names saved successfully!");
      } else {
        const data = await res.json();
        setStatus(`Error: ${data.error || "Failed to save"}`);
      }
    } catch {
      setStatus("Error: Failed to save project names");
    }
    setNamesSaving(false);
    setTimeout(() => setStatus(""), 5000);
  }

  function updateProjectName(folderName: string, field: "name" | "location" | "coverPosition" | "coverFit" | "coverZoom", value: string | number) {
    setProjectNames((prev) => ({
      ...prev,
      [folderName]: {
        name: prev[folderName]?.name || "",
        location: prev[folderName]?.location || "",
        coverPosition: prev[folderName]?.coverPosition,
        coverFit: prev[folderName]?.coverFit,
        coverZoom: prev[folderName]?.coverZoom,
        [field]: value,
      },
    }));
  }

  const POSITIONS_2D = [
    { label: "", value: "top left" },
    { label: "", value: "top center" },
    { label: "", value: "top right" },
    { label: "", value: "center left" },
    { label: "", value: "center" },
    { label: "", value: "center right" },
    { label: "", value: "bottom left" },
    { label: "", value: "bottom center" },
    { label: "", value: "bottom right" },
  ];

  async function saveHomeConfig() {
    setHomeSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: homeSlots }),
      });
      if (res.ok) {
        setStatus("Homepage configuration saved successfully!");
      } else {
        const data = await res.json();
        setStatus(`Error: ${data.error || "Failed to save"}`);
      }
    } catch {
      setStatus("Error: Failed to save configuration");
    }
    setHomeSaving(false);
    setTimeout(() => setStatus(""), 5000);
  }

  function showSaved() {
    setStatus("Changes saved! Note: Code changes require redeployment to take effect on the live site.");
    setTimeout(() => setStatus(""), 5000);
  }


  function addToHome(project: DriveProject) {
    if (homeSlots.length >= 6) return;
    if (homeSlots.some((s) => s.folderName === project.folderName)) return;
    setHomeSlots([
      ...homeSlots,
      {
        folderName: project.folderName,
        coverPhotoId: project.photos[0]?.id || "",
        coverPosition: project.coverPosition || "center",
      },
    ]);
  }

  function removeFromHome(index: number) {
    setHomeSlots(homeSlots.filter((_, i) => i !== index));
    if (expandedSlot === index) setExpandedSlot(null);
  }

  function updateCoverPhoto(index: number, photoId: string) {
    const updated = [...homeSlots];
    updated[index] = { ...updated[index], coverPhotoId: photoId };
    setHomeSlots(updated);
  }

  function updatePosition(index: number, position: string) {
    const updated = [...homeSlots];
    updated[index] = { ...updated[index], coverPosition: position };
    setHomeSlots(updated);
  }

  function updateSlotFit(index: number, fit: string) {
    const updated = [...homeSlots];
    updated[index] = { ...updated[index], coverFit: fit };
    setHomeSlots(updated);
  }

  function moveSlot(from: number, to: number) {
    if (to < 0 || to >= homeSlots.length) return;
    const items = Array.from(homeSlots);
    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);
    setHomeSlots(items);
    if (expandedSlot === from) setExpandedSlot(to);
    else if (expandedSlot === to) setExpandedSlot(from);
  }

  function handleDragStart(e: React.DragEvent, source: typeof dragSource) {
    setDragSource(source);
    e.dataTransfer.effectAllowed = "move";
    // Use a transparent 1px image so the browser ghost doesn't obscure drop zones
    const ghost = document.createElement("canvas");
    ghost.width = 1;
    ghost.height = 1;
    e.dataTransfer.setDragImage(ghost, 0, 0);
  }
  function handleSlotDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverSlot(idx);
  }
  function handleSlotDrop(idx: number) {
    if (!dragSource) return;
    if (dragSource.type === "slot" && dragSource.index !== idx) {
      moveSlot(dragSource.index, idx);
    } else if (dragSource.type === "project") {
      // Dropping an available project onto a slot — replace that slot
      const proj = projects.find((p) => p.folderName === dragSource.folderName);
      if (proj) {
        const updated = [...homeSlots];
        updated[idx] = {
          folderName: proj.folderName,
          coverPhotoId: proj.photos[0]?.id || "",
          coverPosition: proj.coverPosition || "center",
        };
        setHomeSlots(updated);
      }
    }
    setDragSource(null);
    setDragOverSlot(null);
  }
  function handleEmptySlotDrop(slotIdx: number) {
    if (!dragSource || dragSource.type !== "project") return;
    const proj = projects.find((p) => p.folderName === dragSource.folderName);
    if (proj && homeSlots.length < 6) {
      // Insert at the correct position
      const updated = [...homeSlots];
      while (updated.length < slotIdx) {
        updated.push({ folderName: "", coverPhotoId: "", coverPosition: "center" });
      }
      updated.splice(slotIdx, 0, {
        folderName: proj.folderName,
        coverPhotoId: proj.photos[0]?.id || "",
        coverPosition: proj.coverPosition || "center",
      });
      setHomeSlots(updated.filter((s) => s.folderName).slice(0, 6));
    }
    setDragSource(null);
    setDragOverSlot(null);
  }
  function handleDragEnd() {
    setDragSource(null);
    setDragOverSlot(null);
  }
  const isDragging = dragSource !== null;
  const dragSlotIdx = dragSource?.type === "slot" ? dragSource.index : null;

  function posToXY(pos: string): { x: number; y: number } {
    const map: Record<string, { x: number; y: number }> = {
      "top left": { x: 0, y: 0 }, "top center": { x: 50, y: 0 }, "top right": { x: 100, y: 0 },
      "center left": { x: 0, y: 50 }, center: { x: 50, y: 50 }, "center right": { x: 100, y: 50 },
      "bottom left": { x: 0, y: 100 }, "bottom center": { x: 50, y: 100 }, "bottom right": { x: 100, y: 100 },
    };
    if (map[pos]) return map[pos];
    const m = pos.match(/(\d+)%\s+(\d+)%/);
    if (m) return { x: parseInt(m[1]), y: parseInt(m[2]) };
    return { x: 50, y: 50 };
  }

  function updatePositionXY(index: number, x: number, y: number) {
    const updated = [...homeSlots];
    updated[index] = { ...updated[index], coverPosition: `${x}% ${y}%` };
    setHomeSlots(updated);
  }

  function updateSlotZoom(index: number, zoom: number) {
    const updated = [...homeSlots];
    updated[index] = { ...updated[index], coverZoom: zoom };
    setHomeSlots(updated);
  }

  // Auto-populate project sizes when none are saved (first load experience)
  useEffect(() => {
    if (projects.length > 0 && Object.keys(projectsSizes).length === 0) {
      const initial: Record<string, string> = {};
      const ordered = projectsOrder.length > 0
        ? projectsOrder.map((n) => projects.find((p) => p.folderName === n)).filter(Boolean) as DriveProject[]
        : projects;
      if (ordered.length >= 1) initial[ordered[0].folderName] = "hero";
      if (ordered.length >= 2) initial[ordered[1].folderName] = "featured";
      if (ordered.length >= 3) initial[ordered[2].folderName] = "featured";
      setProjectsSizes(initial);
    }
  }, [projects]);

  // Compute ordered projects list (respects saved order, appends new ones)
  const orderedProjects = (() => {
    if (projectsOrder.length === 0) return projects;
    const ordered: DriveProject[] = [];
    for (const name of projectsOrder) {
      const p = projects.find((pr) => pr.folderName === name);
      if (p) ordered.push(p);
    }
    for (const p of projects) {
      if (!ordered.includes(p)) ordered.push(p);
    }
    return ordered;
  })();

  function moveProject(fromIdx: number, toIdx: number) {
    if (toIdx < 0 || toIdx >= orderedProjects.length) return;
    const names = orderedProjects.map((p) => p.folderName);
    const [moved] = names.splice(fromIdx, 1);
    names.splice(toIdx, 0, moved);
    setProjectsOrder(names);
  }

  function setProjectSize(folderName: string, size: string) {
    setProjectsSizes((prev) => ({ ...prev, [folderName]: size }));
  }

  function setCoverPhoto(folderName: string, photoIndex: number) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.folderName !== folderName || photoIndex === 0) return p;
        const newPhotos = [...p.photos];
        const [selected] = newPhotos.splice(photoIndex, 1);
        newPhotos.unshift(selected);
        return { ...p, photos: newPhotos };
      })
    );
  }

  // Project drag handlers
  function handleProjDragStart(e: React.DragEvent, folderName: string) {
    setProjDragSource(folderName);
    e.dataTransfer.effectAllowed = "move";
    const ghost = document.createElement("canvas");
    ghost.width = 1;
    ghost.height = 1;
    e.dataTransfer.setDragImage(ghost, 0, 0);
  }
  function handleProjDragOver(e: React.DragEvent, folderName: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setProjDragOver(folderName);
  }
  function handleProjDrop(targetFolder: string) {
    if (!projDragSource || projDragSource === targetFolder) {
      setProjDragSource(null);
      setProjDragOver(null);
      return;
    }
    const names = orderedProjects.map((p) => p.folderName);
    const fromIdx = names.indexOf(projDragSource);
    const toIdx = names.indexOf(targetFolder);
    if (fromIdx >= 0 && toIdx >= 0) {
      const [moved] = names.splice(fromIdx, 1);
      names.splice(toIdx, 0, moved);
      setProjectsOrder(names);
    }
    setProjDragSource(null);
    setProjDragOver(null);
  }
  function handleProjDragEnd() {
    setProjDragSource(null);
    setProjDragOver(null);
  }
  const isProjDragging = projDragSource !== null;

  function getProject(folderName: string): DriveProject | undefined {
    return projects.find((p) => p.folderName === folderName);
  }

  function getCoverUrl(project: DriveProject | undefined, photoId: string): string {
    if (!project) return "";
    const photo = project.photos.find((p) => p.id === photoId);
    return photo?.thumbnailUrl || project.photos[0]?.thumbnailUrl || "";
  }

  function cleanName(folderName: string): string {
    if (projectNames[folderName]?.name) return projectNames[folderName].name;
    const project = projects.find((p) => p.folderName === folderName);
    if (project?.displayName) return project.displayName;
    const parts = folderName.split(/\s*[-\u2013]\s*/);
    return parts[0].trim().replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const availableProjects = projects.filter((p) => !homeSlots.some((s) => s.folderName === p.folderName));

  function renderInlineControls() {
    if (expandedSlot === null || !homeSlots[expandedSlot]) return null;
    const slot = homeSlots[expandedSlot];
    const project = getProject(slot.folderName);
    const { x: posX, y: posY } = posToXY(slot.coverPosition);
    const zoom = slot.coverZoom || 1;
    return (
      <div className="bg-[#0d0d0d] rounded-xl border border-primary/30 p-4 shadow-[0_0_20px_rgba(123,45,54,0.15)]" onClick={(e) => e.stopPropagation()}>
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-primary text-[10px] uppercase tracking-wider font-bold">Slot {expandedSlot + 1} — {SLOT_LABELS[expandedSlot]}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-sm font-bold">{cleanName(slot.folderName)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => moveSlot(expandedSlot, expandedSlot - 1)} disabled={expandedSlot === 0} className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all" title="Move up">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
            <button onClick={() => moveSlot(expandedSlot, expandedSlot + 1)} disabled={expandedSlot >= homeSlots.length - 1} className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all" title="Move down">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button onClick={() => removeFromHome(expandedSlot)} className="px-2 py-1 text-[10px] font-bold uppercase text-red-400/60 hover:text-white border border-red-400/20 hover:bg-red-500 hover:border-red-500 rounded transition-all">Remove</button>
          </div>
        </div>
        {/* Cover Photo Picker */}
        {project && (
          <div className="mb-3">
            <div className="flex gap-1.5 overflow-x-auto pb-1.5">
              {project.photos.map((photo) => (
                <button key={photo.id} onClick={() => updateCoverPhoto(expandedSlot, photo.id)} className={`flex-shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all ${slot.coverPhotoId === photo.id ? "border-primary shadow-[0_0_8px_rgba(123,45,54,0.4)]" : "border-transparent opacity-50 hover:opacity-100"}`}>
                  <img src={photo.thumbnailUrl} alt={photo.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Position + Zoom + Fit — all in one row */}
        <div className="flex items-start gap-6 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="grid grid-cols-3 gap-[3px] w-[42px] mt-1">
              {POSITIONS_2D.map((pos) => (
                <button key={pos.value} onClick={() => updatePosition(expandedSlot, pos.value)} title={pos.value} className={`w-[12px] h-[12px] rounded-full transition-all ${slot.coverPosition === pos.value ? "bg-primary shadow-[0_0_6px_rgba(123,45,54,0.6)]" : "bg-white/15 hover:bg-white/30"}`} />
              ))}
            </div>
            <div className="min-w-[140px]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] text-white/20 w-2 font-mono">X</span>
                <input type="range" min={0} max={100} value={posX} onChange={(e) => updatePositionXY(expandedSlot, parseInt(e.target.value), posY)} className="flex-1 h-1 rounded-full appearance-none bg-white/10 accent-[#7B2D36] cursor-pointer" />
                <span className="text-[9px] text-white/30 w-6 text-right font-mono">{posX}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-white/20 w-2 font-mono">Y</span>
                <input type="range" min={0} max={100} value={posY} onChange={(e) => updatePositionXY(expandedSlot, posX, parseInt(e.target.value))} className="flex-1 h-1 rounded-full appearance-none bg-white/10 accent-[#7B2D36] cursor-pointer" />
                <span className="text-[9px] text-white/30 w-6 text-right font-mono">{posY}%</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Zoom</p>
            <div className="flex items-center gap-1.5">
              <input type="range" min={100} max={250} value={Math.round(zoom * 100)} onChange={(e) => updateSlotZoom(expandedSlot, parseInt(e.target.value) / 100)} className="w-24 h-1 rounded-full appearance-none bg-white/10 accent-[#7B2D36] cursor-pointer" />
              <span className="text-[9px] text-white/30 font-mono">{zoom.toFixed(1)}x</span>
              {zoom > 1 && <button onClick={() => updateSlotZoom(expandedSlot, 1)} className="text-[8px] text-white/30 hover:text-white/60 underline">Reset</button>}
            </div>
          </div>
          <div>
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Fit</p>
            <div className="flex gap-1">
              {(["cover", "contain"] as const).map((fit) => (
                <button key={fit} onClick={() => updateSlotFit(expandedSlot, fit)} className={`px-2 py-0.5 text-[10px] uppercase rounded transition-all ${(slot.coverFit || "cover") === fit ? "bg-primary text-white" : "bg-white/5 text-white/40 hover:text-white/70"}`}>{fit}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderProjectInlineControls() {
    if (!expandedProject) return null;
    const project = projects.find((p) => p.folderName === expandedProject);
    if (!project) return null;
    const override = projectNames[expandedProject];
    const savedPos = override?.coverPosition || project.coverPosition || "center";
    const savedFit = override?.coverFit || "cover";
    const savedZoom = override?.coverZoom || 1;
    const { x: pX, y: pY } = posToXY(savedPos);
    const size = projectsSizes[expandedProject] || "regular";
    const projIdx = orderedProjects.findIndex((p) => p.folderName === expandedProject);
    return (
      <div className="bg-[#0d0d0d] rounded-xl border border-primary/30 p-4 shadow-[0_0_20px_rgba(123,45,54,0.15)]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-primary text-[10px] uppercase tracking-wider font-bold">{project.category}</span>
            <span className="text-white/30 text-xs">&middot;</span>
            <span className="text-sm font-bold">{override?.name || project.folderName.split(/\s*[-\u2013]\s*/)[0]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => moveProject(projIdx, projIdx - 1)} disabled={projIdx <= 0} className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all" title="Move earlier">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
            <button onClick={() => moveProject(projIdx, projIdx + 1)} disabled={projIdx >= orderedProjects.length - 1} className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all" title="Move later">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </div>
        {/* Name + Location */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Display Name</p>
            <input value={override?.name ?? ""} onChange={(e) => updateProjectName(expandedProject, "name", e.target.value)} placeholder={project.displayName || project.folderName.split(/\s*[-\u2013]\s*/)[0]} className="w-full px-2.5 py-1.5 rounded bg-[#1a1a1a] border border-white/10 text-white text-sm outline-none focus:border-primary placeholder:text-white/20" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Location</p>
            <input value={override?.location ?? ""} onChange={(e) => updateProjectName(expandedProject, "location", e.target.value)} placeholder="Location" className="w-full px-2.5 py-1.5 rounded bg-[#1a1a1a] border border-white/10 text-white text-sm outline-none focus:border-primary placeholder:text-white/20" />
          </div>
        </div>
        {/* Display Size */}
        <div className="flex items-center gap-3 mb-3">
          <p className="text-[9px] text-white/30 uppercase tracking-wider">Display Size</p>
          <div className="flex gap-1">
            {([
              { value: "hero", label: "Hero", desc: "Full width" },
              { value: "featured", label: "Featured", desc: "Half width" },
              { value: "regular", label: "Regular", desc: "1/3 width" },
            ] as const).map((s) => (
              <button key={s.value} onClick={() => setProjectSize(expandedProject, s.value)} title={s.desc} className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg transition-all ${size === s.value ? (s.value === "hero" ? "bg-primary text-white" : s.value === "featured" ? "bg-primary/60 text-white" : "bg-white/15 text-white") : "bg-white/5 text-white/30 hover:text-white/60 hover:bg-white/10"}`}>{s.label}</button>
            ))}
          </div>
        </div>
        {/* Cover Photo Picker */}
        <div className="mb-3">
          <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1.5">Cover Photo</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1.5">
            {project.photos.slice(0, 16).map((photo, i) => (
              <button key={photo.id} onClick={() => setCoverPhoto(expandedProject, i)} className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === 0 ? "border-primary shadow-[0_0_8px_rgba(123,45,54,0.4)]" : "border-transparent opacity-50 hover:opacity-100"}`}>
                <img src={photo.thumbnailUrl} alt={photo.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
            {project.photos.length > 16 && <span className="text-[10px] text-white/30 self-center ml-1">+{project.photos.length - 16}</span>}
          </div>
        </div>
        {/* Position + Zoom + Fit */}
        <div className="flex items-start gap-6 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="grid grid-cols-3 gap-[3px] w-[42px] mt-1">
              {POSITIONS_2D.map((pos) => (
                <button key={pos.value} onClick={() => updateProjectName(expandedProject, "coverPosition", pos.value)} title={pos.value} className={`w-[12px] h-[12px] rounded-full transition-all ${savedPos === pos.value ? "bg-primary shadow-[0_0_6px_rgba(123,45,54,0.6)]" : "bg-white/15 hover:bg-white/30"}`} />
              ))}
            </div>
            <div className="min-w-[140px]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] text-white/20 w-2 font-mono">X</span>
                <input type="range" min={0} max={100} value={pX} onChange={(e) => updateProjectName(expandedProject, "coverPosition", `${e.target.value}% ${pY}%`)} className="flex-1 h-1 rounded-full appearance-none bg-white/10 accent-[#7B2D36] cursor-pointer" />
                <span className="text-[9px] text-white/30 w-6 text-right font-mono">{pX}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-white/20 w-2 font-mono">Y</span>
                <input type="range" min={0} max={100} value={pY} onChange={(e) => updateProjectName(expandedProject, "coverPosition", `${pX}% ${e.target.value}%`)} className="flex-1 h-1 rounded-full appearance-none bg-white/10 accent-[#7B2D36] cursor-pointer" />
                <span className="text-[9px] text-white/30 w-6 text-right font-mono">{pY}%</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Zoom</p>
            <div className="flex items-center gap-1.5">
              <input type="range" min={100} max={250} value={Math.round(savedZoom * 100)} onChange={(e) => updateProjectName(expandedProject, "coverZoom", parseInt(e.target.value) / 100)} className="w-24 h-1 rounded-full appearance-none bg-white/10 accent-[#7B2D36] cursor-pointer" />
              <span className="text-[9px] text-white/30 font-mono">{savedZoom.toFixed(1)}x</span>
              {savedZoom > 1 && <button onClick={() => updateProjectName(expandedProject, "coverZoom", 1)} className="text-[8px] text-white/30 hover:text-white/60 underline">Reset</button>}
            </div>
          </div>
          <div>
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Fit</p>
            <div className="flex gap-1">
              {(["cover", "contain"] as const).map((fit) => (
                <button key={fit} onClick={() => updateProjectName(expandedProject, "coverFit", fit)} className={`px-2 py-0.5 text-[10px] uppercase rounded transition-all ${savedFit === fit ? "bg-primary text-white" : "bg-white/5 text-white/40 hover:text-white/70"}`}>{fit}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "home", label: "Homepage", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: "projects", label: "Projects & Photos", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { id: "content", label: "Site Content", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
    { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Status bar */}
      {status && (
        <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${status.includes("Error") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
          {status}
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 bg-[#111] rounded-lg p-1 border border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
            </svg>
            <span className="max-[480px]:hidden">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* HOME TAB */}
      {activeTab === "home" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold uppercase">Homepage Layout</h2>
              <p className="text-sm text-white/50 mt-1">Click any slot to edit. This preview mirrors the actual homepage.</p>
            </div>
            <button
              onClick={saveHomeConfig}
              disabled={homeSaving || homeSlots.length === 0}
              className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold uppercase hover:bg-white hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {homeSaving ? "Saving..." : "Save Configuration"}
            </button>
          </div>

          {/* WYSIWYG Layout Preview */}
          <div className="bg-[#111] rounded-xl border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Layout Preview</h3>
              <span className="text-xs text-white/30 ml-auto">{homeSlots.length}/6 slots</span>
            </div>
            <div className="flex flex-col gap-2.5 max-w-[900px] mx-auto">
              {/* Hero slot (aspect 21/9) */}
              {(() => {
                const slot = homeSlots[0];
                if (!slot) return (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOverSlot(0); }}
                    onDragLeave={() => setDragOverSlot(null)}
                    onDrop={() => handleEmptySlotDrop(0)}
                    className={`aspect-[21/9] rounded-xl bg-[#0a0a0a] border-2 border-dashed transition-all flex items-center justify-center ${isDragging && dragOverSlot === 0 ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(123,45,54,0.3)]" : isDragging ? "border-white/20" : "border-white/10"}`}
                  >
                    <div className="text-center text-white/30">
                      {isDragging ? (
                        <>
                          <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                          <span className="text-sm font-bold block">Drop here — Hero</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm block">Slot 1 — Hero</span>
                          <span className="text-[10px] block mt-1">Drag a project here or use + Add below</span>
                        </>
                      )}
                    </div>
                  </div>
                );
                const project = getProject(slot.folderName);
                const coverUrl = getCoverUrl(project, slot.coverPhotoId);
                const zoom = slot.coverZoom || 1;
                return (
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, { type: "slot", index: 0 })}
                    onDragOver={(e) => handleSlotDragOver(e, 0)}
                    onDrop={() => handleSlotDrop(0)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setExpandedSlot(expandedSlot === 0 ? null : 0)}
                    className={`aspect-[21/9] rounded-xl bg-[#0a0a0a] relative overflow-hidden cursor-pointer transition-all ${dragSlotIdx === 0 ? "opacity-30 scale-[0.97]" : ""} ${dragOverSlot === 0 && dragSlotIdx !== 0 && isDragging ? "ring-3 ring-primary shadow-[0_0_30px_rgba(123,45,54,0.5)]" : ""} ${expandedSlot === 0 && !isDragging ? "ring-2 ring-primary shadow-[0_0_20px_rgba(123,45,54,0.3)]" : !isDragging ? "hover:ring-1 hover:ring-white/20" : ""}`}
                  >
                    {coverUrl && (
                      <img src={coverUrl} alt={slot.folderName} className={`w-full h-full ${(slot.coverFit || "cover") === "contain" ? "object-contain" : "object-cover"}`} style={{ objectPosition: slot.coverPosition, transformOrigin: slot.coverPosition, transform: zoom > 1 ? `scale(${zoom})` : undefined }} referrerPolicy="no-referrer" draggable={false} />
                    )}
                    {/* Drop zone overlay */}
                    {isDragging && dragSlotIdx !== 0 && (
                      <div className={`absolute inset-0 flex items-center justify-center transition-all ${dragOverSlot === 0 ? "bg-primary/20" : "bg-black/40"}`}>
                        <div className={`flex flex-col items-center gap-1 transition-all ${dragOverSlot === 0 ? "scale-110" : "scale-100 opacity-60"}`}>
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                          <span className="text-xs font-bold uppercase tracking-wider text-white">Drop here</span>
                        </div>
                      </div>
                    )}
                    {/* Drag handle */}
                    {!isDragging && (
                      <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white/50 hover:text-white hover:bg-black/80 cursor-grab active:cursor-grabbing transition-all opacity-0 group-hover:opacity-100" style={{ opacity: expandedSlot === 0 ? 1 : undefined }}>
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 max-[480px]:p-3">
                      <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-primary/80 text-white rounded-full mb-1.5">1. Hero</span>
                      <p className="text-base max-[480px]:text-sm font-bold truncate">{cleanName(slot.folderName)}</p>
                    </div>
                  </div>
                );
              })()}

              {expandedSlot === 0 && renderInlineControls()}

              {/* 2 Medium slots (aspect 3/2) */}
              <div className="flex gap-2.5">
                {[1, 2].map((idx) => {
                  const slot = homeSlots[idx];
                  if (!slot) return (
                    <div
                      key={idx}
                      onDragOver={(e) => { e.preventDefault(); setDragOverSlot(idx); }}
                      onDragLeave={() => setDragOverSlot(null)}
                      onDrop={() => handleEmptySlotDrop(idx)}
                      className={`flex-1 aspect-[3/2] rounded-xl bg-[#0a0a0a] border-2 border-dashed transition-all flex items-center justify-center ${isDragging && dragOverSlot === idx ? "border-primary bg-primary/10" : isDragging ? "border-white/20" : "border-white/10"}`}
                    >
                      <span className="text-white/30 text-xs">{isDragging ? "Drop here" : `Slot ${idx + 1} — ${SLOT_LABELS[idx]}`}</span>
                    </div>
                  );
                  const project = getProject(slot.folderName);
                  const coverUrl = getCoverUrl(project, slot.coverPhotoId);
                  const zoom = slot.coverZoom || 1;
                  return (
                    <div
                      key={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, { type: "slot", index: idx })}
                      onDragOver={(e) => handleSlotDragOver(e, idx)}
                      onDrop={() => handleSlotDrop(idx)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setExpandedSlot(expandedSlot === idx ? null : idx)}
                      className={`flex-1 aspect-[3/2] rounded-xl bg-[#0a0a0a] relative overflow-hidden cursor-pointer transition-all ${dragSlotIdx === idx ? "opacity-30 scale-[0.97]" : ""} ${dragOverSlot === idx && dragSlotIdx !== idx && isDragging ? "ring-3 ring-primary shadow-[0_0_30px_rgba(123,45,54,0.5)]" : ""} ${expandedSlot === idx && !isDragging ? "ring-2 ring-primary shadow-[0_0_20px_rgba(123,45,54,0.3)]" : !isDragging ? "hover:ring-1 hover:ring-white/20" : ""}`}
                    >
                      {coverUrl && (
                        <img src={coverUrl} alt={slot.folderName} className={`w-full h-full ${(slot.coverFit || "cover") === "contain" ? "object-contain" : "object-cover"}`} style={{ objectPosition: slot.coverPosition, transformOrigin: slot.coverPosition, transform: zoom > 1 ? `scale(${zoom})` : undefined }} referrerPolicy="no-referrer" draggable={false} />
                      )}
                      {isDragging && dragSlotIdx !== idx && (
                        <div className={`absolute inset-0 flex items-center justify-center transition-all ${dragOverSlot === idx ? "bg-primary/20" : "bg-black/40"}`}>
                          <div className={`flex flex-col items-center gap-1 transition-all ${dragOverSlot === idx ? "scale-110" : "scale-100 opacity-60"}`}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white">Drop</span>
                          </div>
                        </div>
                      )}
                      {!isDragging && (
                        <div className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white/50 hover:text-white cursor-grab active:cursor-grabbing transition-all">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 max-[480px]:p-2">
                        <span className="inline-block px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider bg-primary/70 text-white rounded-full mb-1">{idx + 1}. {SLOT_LABELS[idx]}</span>
                        <p className="text-sm max-[480px]:text-xs font-bold truncate">{cleanName(slot.folderName)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {(expandedSlot === 1 || expandedSlot === 2) && renderInlineControls()}

              {/* 3 Small slots (aspect 4/3) */}
              <div className="flex gap-2.5">
                {[3, 4, 5].map((idx) => {
                  const slot = homeSlots[idx];
                  if (!slot) return (
                    <div
                      key={idx}
                      onDragOver={(e) => { e.preventDefault(); setDragOverSlot(idx); }}
                      onDragLeave={() => setDragOverSlot(null)}
                      onDrop={() => handleEmptySlotDrop(idx)}
                      className={`flex-1 aspect-[4/3] rounded-xl bg-[#0a0a0a] border-2 border-dashed transition-all flex items-center justify-center ${isDragging && dragOverSlot === idx ? "border-primary bg-primary/10" : isDragging ? "border-white/20" : "border-white/10"}`}
                    >
                      <span className="text-white/30 text-[10px]">{isDragging ? "Drop" : `Slot ${idx + 1}`}</span>
                    </div>
                  );
                  const project = getProject(slot.folderName);
                  const coverUrl = getCoverUrl(project, slot.coverPhotoId);
                  const zoom = slot.coverZoom || 1;
                  return (
                    <div
                      key={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, { type: "slot", index: idx })}
                      onDragOver={(e) => handleSlotDragOver(e, idx)}
                      onDrop={() => handleSlotDrop(idx)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setExpandedSlot(expandedSlot === idx ? null : idx)}
                      className={`flex-1 aspect-[4/3] rounded-xl bg-[#0a0a0a] relative overflow-hidden cursor-pointer transition-all ${dragSlotIdx === idx ? "opacity-30 scale-[0.97]" : ""} ${dragOverSlot === idx && dragSlotIdx !== idx && isDragging ? "ring-3 ring-primary shadow-[0_0_30px_rgba(123,45,54,0.5)]" : ""} ${expandedSlot === idx && !isDragging ? "ring-2 ring-primary shadow-[0_0_20px_rgba(123,45,54,0.3)]" : !isDragging ? "hover:ring-1 hover:ring-white/20" : ""}`}
                    >
                      {coverUrl && (
                        <img src={coverUrl} alt={slot.folderName} className={`w-full h-full ${(slot.coverFit || "cover") === "contain" ? "object-contain" : "object-cover"}`} style={{ objectPosition: slot.coverPosition, transformOrigin: slot.coverPosition, transform: zoom > 1 ? `scale(${zoom})` : undefined }} referrerPolicy="no-referrer" draggable={false} />
                      )}
                      {isDragging && dragSlotIdx !== idx && (
                        <div className={`absolute inset-0 flex items-center justify-center transition-all ${dragOverSlot === idx ? "bg-primary/20" : "bg-black/40"}`}>
                          <div className={`flex flex-col items-center gap-0.5 transition-all ${dragOverSlot === idx ? "scale-110" : "scale-100 opacity-60"}`}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                            <span className="text-[9px] font-bold uppercase text-white">Drop</span>
                          </div>
                        </div>
                      )}
                      {!isDragging && (
                        <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded bg-black/60 backdrop-blur-sm text-white/50 hover:text-white cursor-grab active:cursor-grabbing transition-all">
                          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <span className="inline-block px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider bg-primary/70 text-white rounded-full mb-0.5">{idx + 1}</span>
                        <p className="text-xs font-bold truncate">{cleanName(slot.folderName)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {expandedSlot !== null && expandedSlot >= 3 && expandedSlot <= 5 && renderInlineControls()}
            </div>
          </div>

          {/* Available Projects — drag into slots above */}
          <div className="bg-[#111] rounded-xl border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Available Projects</h3>
              <span className="text-xs text-white/30">— drag into a slot above or click +</span>
              <span className="text-xs text-white/30 ml-auto">{availableProjects.length} available</span>
              {loading && <span className="text-xs text-white/30 ml-2">Loading...</span>}
            </div>
            {availableProjects.length === 0 && projects.length > 0 && (
              <p className="text-center text-sm text-white/30 py-4">All projects are featured on the homepage.</p>
            )}
            {availableProjects.length === 0 && projects.length === 0 && (
              <p className="text-center text-sm text-white/30 py-4">Loading projects from Google Drive...</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {availableProjects.map((project) => (
                <div
                  key={project.folderName}
                  draggable
                  onDragStart={(e) => handleDragStart(e, { type: "project", folderName: project.folderName })}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-2 bg-black rounded-lg border p-2 transition-all cursor-grab active:cursor-grabbing ${dragSource?.type === "project" && dragSource.folderName === project.folderName ? "opacity-30 border-primary/30 scale-[0.97]" : "border-white/5 hover:border-white/15 hover:bg-white/[0.02]"}`}
                >
                  {/* Drag grip */}
                  <div className="shrink-0 text-white/25 hover:text-white/50 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>
                  </div>
                  <div className="w-12 h-9 rounded-md bg-[#0a0a0a] overflow-hidden shrink-0">
                    {project.photos[0] ? (
                      <img src={project.photos[0].thumbnailUrl} alt={project.folderName} className="w-full h-full object-cover" referrerPolicy="no-referrer" draggable={false} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/15 text-[8px]">N/A</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{cleanName(project.folderName)}</p>
                    <p className="text-[9px] text-white/40 truncate">{project.photos.length} photos</p>
                  </div>
                  {homeSlots.length < 6 && (
                    <button
                      onClick={() => addToHome(project)}
                      className="shrink-0 w-7 h-7 flex items-center justify-center text-sm font-bold text-primary/70 hover:text-white border border-primary/20 hover:bg-primary hover:border-primary rounded-lg transition-all"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold uppercase">Projects &amp; Layout</h2>
              <p className="text-sm text-white/50 mt-1">Reorder projects, set display sizes, and customize cover photos for the Projects page.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadProjects(true)}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all disabled:opacity-50"
              >
                {loading ? "Syncing..." : "Refresh"}
              </button>
              <button
                onClick={saveProjectNames}
                disabled={namesSaving}
                className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold uppercase hover:bg-white hover:text-primary transition-all disabled:opacity-50"
              >
                {namesSaving ? "Saving..." : "Save All Changes"}
              </button>
            </div>
          </div>

          {/* Size Legend */}
          <div className="flex gap-4 text-[10px] text-white/40 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><span className="w-5 h-3 rounded bg-primary/40 inline-block" /> Hero — full width</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-3 rounded bg-primary/25 inline-block" /> Featured — half width</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white/10 inline-block" /> Regular — 1/3 width</span>
          </div>

          {projects.length === 0 && !loading && (
            <div className="text-center py-16 bg-[#111] rounded-xl border border-white/5">
              <svg className="w-12 h-12 mx-auto mb-3 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-white/40">No projects found. Check your Drive folder configuration.</p>
            </div>
          )}

          {/* WYSIWYG Layout Preview — mirrors actual /projects page */}
          {orderedProjects.length > 0 && (
            <div className="bg-[#111] rounded-xl border border-white/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Projects Page Preview</h3>
                <span className="text-xs text-white/30 ml-auto">Drag to reorder &middot; Click to edit &middot; H/F/R to resize</span>
              </div>
              <div className="space-y-3 max-w-[900px] mx-auto">
                {/* Hero projects — full width */}
                {orderedProjects.filter((p) => (projectsSizes[p.folderName] || "regular") === "hero").map((project) => {
                  const savedPos = projectNames[project.folderName]?.coverPosition || project.coverPosition || "center";
                  const savedFit = projectNames[project.folderName]?.coverFit || "cover";
                  const savedZoom = projectNames[project.folderName]?.coverZoom || 1;
                  const isSelected = expandedProject === project.folderName;
                  const size = projectsSizes[project.folderName] || "regular";
                  return (
                    <div key={`preview-h-${project.folderName}`}>
                    <div
                      draggable
                      onDragStart={(e) => handleProjDragStart(e, project.folderName)}
                      onDragOver={(e) => handleProjDragOver(e, project.folderName)}
                      onDrop={() => handleProjDrop(project.folderName)}
                      onDragEnd={handleProjDragEnd}
                      onClick={() => setExpandedProject(isSelected ? null : project.folderName)}
                      className={`relative w-full aspect-[21/9] rounded-xl bg-[#0a0a0a] overflow-hidden cursor-pointer transition-all ${projDragSource === project.folderName ? "opacity-30 scale-[0.97]" : ""} ${projDragOver === project.folderName && projDragSource !== project.folderName && isProjDragging ? "ring-3 ring-primary shadow-[0_0_30px_rgba(123,45,54,0.5)]" : ""} ${isSelected && !isProjDragging ? "ring-2 ring-primary shadow-[0_0_20px_rgba(123,45,54,0.3)]" : !isProjDragging ? "hover:ring-1 hover:ring-white/20" : ""}`}
                    >
                      {project.photos[0] && (
                        <img src={project.photos[0].thumbnailUrl} alt="" className={`w-full h-full ${savedFit === "contain" ? "object-contain" : "object-cover"}`} style={{ objectPosition: savedPos, transformOrigin: savedPos, transform: savedZoom > 1 ? `scale(${savedZoom})` : undefined }} referrerPolicy="no-referrer" draggable={false} />
                      )}
                      {isProjDragging && projDragSource !== project.folderName && (
                        <div className={`absolute inset-0 flex items-center justify-center transition-all ${projDragOver === project.folderName ? "bg-primary/20" : "bg-black/40"}`}>
                          <div className={`flex flex-col items-center gap-1 ${projDragOver === project.folderName ? "scale-110" : "opacity-60"}`}>
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                            <span className="text-xs font-bold uppercase text-white">Drop here</span>
                          </div>
                        </div>
                      )}
                      {!isProjDragging && (
                        <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white/50 hover:text-white hover:bg-black/80 cursor-grab active:cursor-grabbing transition-all">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>
                        </div>
                      )}
                      {!isProjDragging && (
                        <div className="absolute top-3 left-3 flex gap-1" onClick={(e) => e.stopPropagation()}>
                          {[{ v: "hero", l: "H" }, { v: "featured", l: "F" }, { v: "regular", l: "R" }].map((s) => (
                            <button key={s.v} onClick={() => setProjectSize(project.folderName, s.v)} className={`w-7 h-7 flex items-center justify-center text-[10px] font-bold rounded-lg backdrop-blur-md transition-all shadow-sm ${size === s.v ? "bg-primary text-white shadow-[0_0_8px_rgba(123,45,54,0.5)]" : "bg-black/70 text-white/70 hover:text-white hover:bg-black/90 border border-white/10"}`}>{s.l}</button>
                          ))}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <span className="inline-block px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-primary/80 text-white rounded-full mb-1.5">Hero</span>
                        <p className="text-lg font-bold">{projectNames[project.folderName]?.name || project.folderName.split(/\s*[-\u2013]\s*/)[0]}</p>
                      </div>
                    </div>
                    {isSelected && <div className="mt-3">{renderProjectInlineControls()}</div>}
                    </div>
                  );
                })}
                {/* Featured projects — 2 per row, controls after clicked row */}
                {(() => {
                  const featured = orderedProjects.filter((p) => (projectsSizes[p.folderName] || "regular") === "featured");
                  if (featured.length === 0) return null;
                  const rows: typeof featured[] = [];
                  for (let i = 0; i < featured.length; i += 2) rows.push(featured.slice(i, i + 2));
                  return rows.map((row, ri) => {
                    const rowHasSelected = row.some((p) => expandedProject === p.folderName);
                    return (
                      <div key={`f-row-${ri}`}>
                        <div className="flex flex-wrap gap-3">
                          {row.map((project) => {
                            const savedPos = projectNames[project.folderName]?.coverPosition || project.coverPosition || "center";
                            const savedFit = projectNames[project.folderName]?.coverFit || "cover";
                            const savedZoom = projectNames[project.folderName]?.coverZoom || 1;
                            const isSelected = expandedProject === project.folderName;
                            const size = projectsSizes[project.folderName] || "regular";
                            return (
                              <div
                                key={`preview-f-${project.folderName}`}
                                draggable
                                onDragStart={(e) => handleProjDragStart(e, project.folderName)}
                                onDragOver={(e) => handleProjDragOver(e, project.folderName)}
                                onDrop={() => handleProjDrop(project.folderName)}
                                onDragEnd={handleProjDragEnd}
                                onClick={() => setExpandedProject(isSelected ? null : project.folderName)}
                                className={`relative w-[calc(50%-6px)] aspect-[16/10] rounded-xl bg-[#0a0a0a] overflow-hidden cursor-pointer transition-all ${projDragSource === project.folderName ? "opacity-30 scale-[0.97]" : ""} ${projDragOver === project.folderName && projDragSource !== project.folderName && isProjDragging ? "ring-3 ring-primary shadow-[0_0_30px_rgba(123,45,54,0.5)]" : ""} ${isSelected && !isProjDragging ? "ring-2 ring-primary shadow-[0_0_20px_rgba(123,45,54,0.3)]" : !isProjDragging ? "hover:ring-1 hover:ring-white/20" : ""}`}
                              >
                                {project.photos[0] && (
                                  <img src={project.photos[0].thumbnailUrl} alt="" className={`w-full h-full ${savedFit === "contain" ? "object-contain" : "object-cover"}`} style={{ objectPosition: savedPos, transformOrigin: savedPos, transform: savedZoom > 1 ? `scale(${savedZoom})` : undefined }} referrerPolicy="no-referrer" draggable={false} />
                                )}
                                {isProjDragging && projDragSource !== project.folderName && (
                                  <div className={`absolute inset-0 flex items-center justify-center transition-all ${projDragOver === project.folderName ? "bg-primary/20" : "bg-black/40"}`}>
                                    <div className={`flex flex-col items-center gap-1 ${projDragOver === project.folderName ? "scale-110" : "opacity-60"}`}>
                                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                      <span className="text-[10px] font-bold uppercase text-white">Drop</span>
                                    </div>
                                  </div>
                                )}
                                {!isProjDragging && (
                                  <div className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white/50 hover:text-white cursor-grab active:cursor-grabbing transition-all">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>
                                  </div>
                                )}
                                {!isProjDragging && (
                                  <div className="absolute top-2 left-2 flex gap-1" onClick={(e) => e.stopPropagation()}>
                                    {[{ v: "hero", l: "H" }, { v: "featured", l: "F" }, { v: "regular", l: "R" }].map((s) => (
                                      <button key={s.v} onClick={() => setProjectSize(project.folderName, s.v)} className={`w-7 h-7 flex items-center justify-center text-[10px] font-bold rounded-lg backdrop-blur-md transition-all shadow-sm ${size === s.v ? "bg-primary text-white shadow-[0_0_8px_rgba(123,45,54,0.5)]" : "bg-black/70 text-white/70 hover:text-white hover:bg-black/90 border border-white/10"}`}>{s.l}</button>
                                    ))}
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                  <span className="inline-block px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider bg-primary/60 text-white rounded-full mb-1">Featured</span>
                                  <p className="text-sm font-bold truncate">{projectNames[project.folderName]?.name || project.folderName.split(/\s*[-\u2013]\s*/)[0]}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {rowHasSelected && <div className="mt-3">{renderProjectInlineControls()}</div>}
                      </div>
                    );
                  });
                })()}
                {/* Regular projects — 3 per row, controls after clicked row */}
                {(() => {
                  const regular = orderedProjects.filter((p) => (projectsSizes[p.folderName] || "regular") === "regular");
                  if (regular.length === 0) return null;
                  const rows: typeof regular[] = [];
                  for (let i = 0; i < regular.length; i += 3) rows.push(regular.slice(i, i + 3));
                  return rows.map((row, ri) => {
                    const rowHasSelected = row.some((p) => expandedProject === p.folderName);
                    return (
                      <div key={`r-row-${ri}`}>
                        <div className="flex flex-wrap gap-3">
                          {row.map((project) => {
                            const savedPos = projectNames[project.folderName]?.coverPosition || project.coverPosition || "center";
                            const savedFit = projectNames[project.folderName]?.coverFit || "cover";
                            const savedZoom = projectNames[project.folderName]?.coverZoom || 1;
                            const isSelected = expandedProject === project.folderName;
                            const size = projectsSizes[project.folderName] || "regular";
                            return (
                              <div
                                key={`preview-r-${project.folderName}`}
                                draggable
                                onDragStart={(e) => handleProjDragStart(e, project.folderName)}
                                onDragOver={(e) => handleProjDragOver(e, project.folderName)}
                                onDrop={() => handleProjDrop(project.folderName)}
                                onDragEnd={handleProjDragEnd}
                                onClick={() => setExpandedProject(isSelected ? null : project.folderName)}
                                className={`relative w-[calc(33.33%-8px)] aspect-[4/3] rounded-xl bg-[#0a0a0a] overflow-hidden cursor-pointer transition-all ${projDragSource === project.folderName ? "opacity-30 scale-[0.97]" : ""} ${projDragOver === project.folderName && projDragSource !== project.folderName && isProjDragging ? "ring-3 ring-primary shadow-[0_0_30px_rgba(123,45,54,0.5)]" : ""} ${isSelected && !isProjDragging ? "ring-2 ring-primary shadow-[0_0_20px_rgba(123,45,54,0.3)]" : !isProjDragging ? "hover:ring-1 hover:ring-white/20" : ""}`}
                              >
                                {project.photos[0] && (
                                  <img src={project.photos[0].thumbnailUrl} alt="" className={`w-full h-full ${savedFit === "contain" ? "object-contain" : "object-cover"}`} style={{ objectPosition: savedPos, transformOrigin: savedPos, transform: savedZoom > 1 ? `scale(${savedZoom})` : undefined }} referrerPolicy="no-referrer" draggable={false} />
                                )}
                                {isProjDragging && projDragSource !== project.folderName && (
                                  <div className={`absolute inset-0 flex items-center justify-center transition-all ${projDragOver === project.folderName ? "bg-primary/20" : "bg-black/40"}`}>
                                    <div className={`flex flex-col items-center gap-0.5 ${projDragOver === project.folderName ? "scale-110" : "opacity-60"}`}>
                                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                      <span className="text-[9px] font-bold uppercase text-white">Drop</span>
                                    </div>
                                  </div>
                                )}
                                {!isProjDragging && (
                                  <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded bg-black/60 backdrop-blur-sm text-white/50 hover:text-white cursor-grab active:cursor-grabbing transition-all">
                                    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>
                                  </div>
                                )}
                                {!isProjDragging && (
                                  <div className="absolute top-2 left-2 flex gap-0.5" onClick={(e) => e.stopPropagation()}>
                                    {[{ v: "hero", l: "H" }, { v: "featured", l: "F" }, { v: "regular", l: "R" }].map((s) => (
                                      <button key={s.v} onClick={() => setProjectSize(project.folderName, s.v)} className={`w-7 h-7 flex items-center justify-center text-[10px] font-bold rounded-lg backdrop-blur-md transition-all shadow-sm ${size === s.v ? "bg-primary text-white shadow-[0_0_8px_rgba(123,45,54,0.5)]" : "bg-black/70 text-white/70 hover:text-white hover:bg-black/90 border border-white/10"}`}>{s.l}</button>
                                    ))}
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                                  <p className="text-xs font-bold truncate">{projectNames[project.folderName]?.name || project.folderName.split(/\s*[-\u2013]\s*/)[0]}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {rowHasSelected && <div className="mt-3">{renderProjectInlineControls()}</div>}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      )}

            {/* CONTENT TAB */}
      {activeTab === "content" && (
        <div className="space-y-8">
          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-bold uppercase mb-4">Hero Slideshow</h2>
            <div className="space-y-4">
              {heroSlides.map((slide, i) => (
                <div key={i} className="bg-black rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-white/40 uppercase mb-2">Slide {i + 1}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-white/50 mb-1">Title</label>
                      <input value={slide.title} onChange={(e) => { const u = [...heroSlides]; u[i] = { ...u[i], title: e.target.value }; setHeroSlides(u); }} className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-white/10 text-white text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1">Highlight</label>
                      <input value={slide.highlight} onChange={(e) => { const u = [...heroSlides]; u[i] = { ...u[i], highlight: e.target.value }; setHeroSlides(u); }} className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-white/10 text-white text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1">Subtitle</label>
                      <input value={slide.subtitle} onChange={(e) => { const u = [...heroSlides]; u[i] = { ...u[i], subtitle: e.target.value }; setHeroSlides(u); }} className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-white/10 text-white text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={showSaved} className="mt-4 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold uppercase hover:bg-white hover:text-primary transition-all">Save Hero Content</button>
          </div>

          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-bold uppercase mb-4">About Section</h2>
            <label className="block text-xs text-white/50 mb-1">About Text</label>
            <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} rows={4} className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary resize-none" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs text-white/50 mb-1">Mission</label>
                <textarea value={missionText} onChange={(e) => setMissionText(e.target.value)} rows={3} className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Vision</label>
                <textarea value={visionText} onChange={(e) => setVisionText(e.target.value)} rows={3} className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary resize-none" />
              </div>
            </div>
            <button onClick={showSaved} className="mt-4 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold uppercase hover:bg-white hover:text-primary transition-all">Save About Content</button>
          </div>

          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-bold uppercase mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs text-white/50 mb-1">Office Address</label>
                <input value={contactInfo.address} onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })} className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Email</label>
                <input value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">WhatsApp Number</label>
                <input value={contactInfo.whatsapp} onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })} className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Phone 1</label>
                <input value={contactInfo.phone1} onChange={(e) => setContactInfo({ ...contactInfo, phone1: e.target.value })} className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Phone 2</label>
                <input value={contactInfo.phone2} onChange={(e) => setContactInfo({ ...contactInfo, phone2: e.target.value })} className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <h3 className="text-sm font-bold uppercase mt-6 mb-3">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-1">Facebook URL</label>
                <input value={socialLinks.facebook} onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Instagram URL</label>
                <input value={socialLinks.instagram} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">LinkedIn URL</label>
                <input value={socialLinks.linkedin} onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <button onClick={showSaved} className="mt-4 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold uppercase hover:bg-white hover:text-primary transition-all">Save Contact Info</button>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-bold uppercase mb-4">Google Drive Configuration</h2>
            <div>
              <label className="block text-xs text-white/50 mb-2">Connected Drive Folder</label>
              {driveFolderId ? (
                <a
                  href={`https://drive.google.com/drive/folders/${driveFolderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black border border-white/10 text-sm text-primary hover:border-primary/50 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.71 3.5L1.15 15l4.58 7.5h13.04l4.58-7.5L17.29 3.5H7.71zm.58 1h8.42l5.5 10h-4.46L12 6.5 6.25 14.5H1.79l6.5-10zM12 8.15l4.04 6.35H7.96L12 8.15zM6.08 15.5h4.38L12 18.35l1.54-2.85h4.38L12 21.5l-5.92-6z"/></svg>
                  drive.google.com/drive/folders/{driveFolderId.slice(0, 12)}...
                </a>
              ) : (
                <p className="text-sm text-white/30">Loading...</p>
              )}
              <p className="text-xs text-white/30 mt-2">This is the root folder being synced. To change it, update GOOGLE_DRIVE_FOLDER_ID in your environment variables.</p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Daily Auto-Sync</h3>
                  <p className="text-xs text-white/30 mt-1">Automatically sync new projects from Google Drive every day at 3:00 AM UTC</p>
                </div>
                <button
                  onClick={toggleAutoSync}
                  className={`relative w-12 h-6 rounded-full transition-colors ${autoSyncEnabled ? "bg-primary" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${autoSyncEnabled ? "translate-x-6" : ""}`} />
                </button>
              </div>
              {autoSyncEnabled && (
                <p className="text-xs text-primary/60 mt-2">Next sync runs at 3:00 AM UTC daily. Use &quot;Re-sync Drive Photos&quot; below for immediate sync.</p>
              )}
              {!autoSyncEnabled && (
                <p className="text-xs text-white/20 mt-2">Auto-sync is off. Use &quot;Re-sync Drive Photos&quot; below to manually sync when needed.</p>
              )}
            </div>
          </div>

          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-bold uppercase mb-4">Site Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Projects", value: projects.length },
                { label: "Total Photos", value: projects.reduce((sum, p) => sum + p.photos.length, 0) },
                { label: "Categories", value: [...new Set(projects.map((p) => p.category))].length },
                { label: "Drive Status", value: projects.length > 0 ? "Connected" : "Check Config" },
              ].map((stat) => (
                <div key={stat.label} className="bg-black rounded-lg p-4 border border-white/5 text-center">
                  <div className="text-2xl font-bold stat-number">{stat.value}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-bold uppercase mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => loadProjects(true)} className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all">Re-sync Drive Photos</button>
              <a href="/" target="_blank" className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all inline-block">Preview Website</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
