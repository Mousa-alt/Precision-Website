"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

interface DriveProject {
  folderName: string;
  category: string;
  photos: { id: string; url: string; thumbnailUrl: string; name: string }[];
  coverPosition?: string;
}

interface HomeSlot {
  folderName: string;
  coverPhotoId: string;
  coverPosition: string;
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

  // Settings
  const [driveFolderId, setDriveFolderId] = useState("");

  useEffect(() => {
    loadProjects();
    loadHomeConfig();
  }, []);

  async function loadProjects() {
    setLoading(true);
    setStatus("Loading projects from Drive...");
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setProjects(data.projects || []);
      setStatus(`Loaded ${(data.projects || []).length} projects`);
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

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const items = Array.from(homeSlots);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setHomeSlots(items);
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

  function getProject(folderName: string): DriveProject | undefined {
    return projects.find((p) => p.folderName === folderName);
  }

  function getCoverUrl(project: DriveProject | undefined, photoId: string): string {
    if (!project) return "";
    const photo = project.photos.find((p) => p.id === photoId);
    return photo?.thumbnailUrl || project.photos[0]?.thumbnailUrl || "";
  }

  function cleanName(folderName: string): string {
    const parts = folderName.split(/\s*[-\u2013]\s*/);
    return parts[0].trim().replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const availableProjects = projects.filter((p) => !homeSlots.some((s) => s.folderName === p.folderName));

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
              <h2 className="text-xl font-bold uppercase">Homepage Featured Projects</h2>
              <p className="text-sm text-white/50 mt-1">
                Select up to 6 projects. Drag to reorder. First = hero, 2-3 = medium, 4-6 = small.
              </p>
            </div>
            <button
              onClick={saveHomeConfig}
              disabled={homeSaving || homeSlots.length === 0}
              className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold uppercase hover:bg-white hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {homeSaving ? "Saving..." : "Save Configuration"}
            </button>
          </div>

          {/* Featured slots with DnD */}
          {homeSlots.length > 0 ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="home-slots">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                    {homeSlots.map((slot, index) => {
                      const project = getProject(slot.folderName);
                      const coverUrl = getCoverUrl(project, slot.coverPhotoId);
                      return (
                        <Draggable key={slot.folderName} draggableId={slot.folderName} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-[#111] rounded-xl border ${snapshot.isDragging ? "border-primary/50 shadow-[0_0_20px_rgba(123,45,54,0.3)]" : "border-white/5"} overflow-hidden`}
                            >
                              <div className="flex items-stretch">
                                {/* Drag handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex items-center px-3 bg-white/[0.02] hover:bg-white/[0.05] cursor-grab active:cursor-grabbing border-r border-white/5"
                                >
                                  <svg className="w-5 h-5 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 6h2v2H8zm6 0h2v2h-2zM8 11h2v2H8zm6 0h2v2h-2zM8 16h2v2H8zm6 0h2v2h-2z" />
                                  </svg>
                                </div>

                                {/* Cover photo preview */}
                                <div className="w-[120px] h-[90px] flex-shrink-0 bg-[#0a0a0a]">
                                  {coverUrl ? (
                                    <img
                                      src={coverUrl}
                                      alt={slot.folderName}
                                      className="w-full h-full object-cover"
                                      style={{ objectPosition: slot.coverPosition }}
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No photo</div>
                                  )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 p-4 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <span className="text-primary text-[10px] uppercase tracking-wider font-bold">
                                        Slot {index + 1} — {SLOT_LABELS[index]}
                                      </span>
                                      <h3 className="font-bold text-sm mt-0.5 truncate">{cleanName(slot.folderName)}</h3>
                                      <p className="text-[11px] text-white/40 truncate">{project?.category || ""}</p>
                                    </div>
                                    <button
                                      onClick={() => removeFromHome(index)}
                                      className="text-red-400/50 hover:text-red-400 text-xs flex-shrink-0 px-2 py-1 rounded hover:bg-red-400/10 transition-all"
                                    >
                                      Remove
                                    </button>
                                  </div>

                                  {/* Controls row */}
                                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                                    {/* Position control */}
                                    <div className="flex gap-1">
                                      {["top", "center", "bottom"].map((pos) => (
                                        <button
                                          key={pos}
                                          onClick={() => updatePosition(index, pos)}
                                          className={`px-2 py-0.5 text-[10px] uppercase rounded transition-all ${
                                            slot.coverPosition === pos
                                              ? "bg-primary text-white"
                                              : "bg-white/5 text-white/40 hover:text-white/70"
                                          }`}
                                        >
                                          {pos}
                                        </button>
                                      ))}
                                    </div>

                                    {/* Photo picker toggle */}
                                    <button
                                      onClick={() => setExpandedSlot(expandedSlot === index ? null : index)}
                                      className="text-[10px] text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors"
                                    >
                                      {expandedSlot === index ? "Hide photos" : `Change cover (${project?.photos.length || 0} photos)`}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Expanded photo picker */}
                              {expandedSlot === index && project && (
                                <div className="border-t border-white/5 p-3 bg-black/30">
                                  <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">Click to select cover photo:</p>
                                  <div className="flex gap-2 overflow-x-auto pb-2">
                                    {project.photos.map((photo) => (
                                      <button
                                        key={photo.id}
                                        onClick={() => updateCoverPhoto(index, photo.id)}
                                        className={`flex-shrink-0 w-[80px] h-[60px] rounded-lg overflow-hidden border-2 transition-all ${
                                          slot.coverPhotoId === photo.id
                                            ? "border-primary shadow-[0_0_10px_rgba(123,45,54,0.4)]"
                                            : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                      >
                                        <img
                                          src={photo.thumbnailUrl}
                                          alt={photo.name}
                                          className="w-full h-full object-cover"
                                          referrerPolicy="no-referrer"
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="text-center py-12 bg-[#111] rounded-xl border border-white/5">
              <svg className="w-12 h-12 mx-auto mb-3 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <p className="text-white/40 mb-1">No featured projects configured yet</p>
              <p className="text-white/25 text-sm">Select projects below to feature on the homepage</p>
            </div>
          )}

          {/* Add project picker */}
          {homeSlots.length < 6 && (
            <div className="bg-[#111] rounded-xl border border-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm uppercase">
                  Add Project ({homeSlots.length}/6 selected)
                </h3>
                {loading && <span className="text-xs text-white/30">Loading...</span>}
              </div>

              {availableProjects.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableProjects.map((project) => (
                    <button
                      key={project.folderName}
                      onClick={() => addToHome(project)}
                      className="group bg-black rounded-lg border border-white/5 overflow-hidden text-left hover:border-primary/30 transition-all"
                    >
                      <div className="aspect-[4/3] bg-[#0a0a0a]">
                        {project.photos[0] ? (
                          <img
                            src={project.photos[0].thumbnailUrl}
                            alt={project.folderName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/15 text-xs">No photos</div>
                        )}
                      </div>
                      <div className="p-2.5">
                        <p className="text-[9px] text-primary uppercase tracking-wider font-bold">{project.category}</p>
                        <p className="text-xs font-semibold truncate mt-0.5">{cleanName(project.folderName)}</p>
                        <p className="text-[10px] text-white/30 mt-0.5">{project.photos.length} photos</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <p className="text-sm text-white/30">All projects have been added to the homepage.</p>
              ) : (
                <p className="text-sm text-white/30">Loading projects from Google Drive...</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase">Projects from Google Drive</h2>
            <button
              onClick={loadProjects}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-bold uppercase hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {loading ? "Syncing..." : "Refresh"}
            </button>
          </div>

          <p className="text-sm text-white/50">
            Photos are automatically pulled from your Google Drive folder. The cover photo is chosen automatically based on filename keywords,
            or you can force one by prefixing it with <code className="bg-white/10 px-1 py-0.5 rounded text-white/70">cover-</code>. See naming guide below.
          </p>

          {projects.length === 0 && !loading && (
            <div className="text-center py-16 bg-[#111] rounded-xl border border-white/5">
              <svg className="w-12 h-12 mx-auto mb-3 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-white/40">No projects found. Check your Drive folder configuration.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, idx) => (
              <div key={`${project.folderName}-${idx}`} className="bg-[#111] rounded-xl border border-white/5 overflow-hidden">
                <div className="relative bg-[#0a0a0a] flex items-center justify-center">
                  {project.photos[0] ? (
                    <img
                      src={project.photos[0].thumbnailUrl}
                      alt={project.folderName}
                      className="w-full h-auto max-h-[200px] object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-[150px] flex items-center justify-center text-white/20">No photos</div>
                  )}
                  <span className="absolute top-2 right-2 bg-black/70 text-xs px-2 py-1 rounded">{project.photos.length} photos</span>
                </div>
                <div className="p-4">
                  <p className="text-primary text-[10px] uppercase tracking-wider font-bold">{project.category}</p>
                  <h3 className="font-bold mt-0.5 text-sm">{project.folderName}</h3>
                  <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
                    {project.photos.slice(0, 6).map((photo, i) => (
                      <img
                        key={photo.id}
                        src={photo.thumbnailUrl}
                        alt={photo.name}
                        className={`w-10 h-10 object-cover rounded flex-shrink-0 ${i === 0 ? "ring-2 ring-primary" : "opacity-60"}`}
                        referrerPolicy="no-referrer"
                        title={`${photo.name}${i === 0 ? " (Cover)" : ""}`}
                      />
                    ))}
                    {project.photos.length > 6 && (
                      <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-[10px] text-white/40 flex-shrink-0">
                        +{project.photos.length - 6}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h3 className="font-bold text-sm uppercase mb-3">How to Manage Photos</h3>
            <ol className="space-y-1.5 text-sm text-white/60 list-decimal list-inside">
              <li>Open your Google Drive folder</li>
              <li>Create category folders (e.g., &quot;01.Administrative&quot;, &quot;02.Retail&quot;)</li>
              <li>Inside each category, create project folders (e.g., &quot;Boss - City Center Almaza&quot;)</li>
              <li>Upload project photos into each folder</li>
              <li>Click &quot;Refresh&quot; above to pull latest changes</li>
            </ol>
          </div>

          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h3 className="font-bold text-sm uppercase mb-3">Cover Photo Control</h3>
            <p className="text-sm text-white/50 mb-4">
              Control which photo appears as the project cover and how it&apos;s cropped by renaming files in Google Drive:
            </p>
            <div className="space-y-3">
              <div className="bg-black rounded-lg p-4 border border-white/5">
                <p className="text-primary text-xs uppercase tracking-wider font-bold mb-2">Force a specific cover photo</p>
                <p className="text-sm text-white/60">
                  Prefix the filename with <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">cover-</code> or <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">00-</code>
                </p>
                <p className="text-xs text-white/30 mt-1">Example: <code className="text-white/50">cover-storefront.jpg</code> or <code className="text-white/50">00-brand-logo.jpg</code></p>
              </div>
              <div className="bg-black rounded-lg p-4 border border-white/5">
                <p className="text-primary text-xs uppercase tracking-wider font-bold mb-2">Control image crop position</p>
                <p className="text-sm text-white/60">
                  If the logo/branding is at the top or bottom, add <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">-top</code> or <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">-bottom</code> to the filename
                </p>
                <p className="text-xs text-white/30 mt-1">Example: <code className="text-white/50">cover-facade-top.jpg</code> (keeps the top of the image visible)</p>
              </div>
              <div className="bg-black rounded-lg p-4 border border-white/5">
                <p className="text-primary text-xs uppercase tracking-wider font-bold mb-2">Auto-detection keywords</p>
                <p className="text-sm text-white/60">
                  Photos with these words in the filename are auto-prioritized as covers:
                </p>
                <p className="text-xs text-white/40 mt-1">
                  <span className="text-green-400/60">Preferred:</span> logo, brand, facade, entrance, exterior, front, signage, storefront
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  <span className="text-red-400/60">Avoided:</span> electrical, panel, pipe, duct, cable, ceiling, chiller, pump, drain
                </p>
              </div>
            </div>
          </div>
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
              <label className="block text-xs text-white/50 mb-1">Drive Folder ID</label>
              <input value={driveFolderId} onChange={(e) => setDriveFolderId(e.target.value)} placeholder="Enter Google Drive folder ID" className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary" />
              <p className="text-xs text-white/30 mt-1">The folder ID from your Google Drive URL. Current: configured in .env.local</p>
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
              <button onClick={loadProjects} className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all">Re-sync Drive Photos</button>
              <a href="/" target="_blank" className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all inline-block">Preview Website</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
