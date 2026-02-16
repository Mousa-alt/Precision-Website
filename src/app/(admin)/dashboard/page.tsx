"use client";

import { useState, useEffect } from "react";

interface DriveProject {
  folderName: string;
  category: string;
  photos: { id: string; url: string; thumbnailUrl: string; name: string }[];
}

type Tab = "projects" | "content" | "settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<DriveProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

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

  function showSaved() {
    setStatus("Changes saved! Note: Code changes require redeployment to take effect on the live site.");
    setTimeout(() => setStatus(""), 5000);
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
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
          {/* Hero Slides */}
          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-bold uppercase mb-4">Hero Slideshow</h2>
            <div className="space-y-4">
              {heroSlides.map((slide, i) => (
                <div key={i} className="bg-black rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-white/40 uppercase mb-2">Slide {i + 1}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-white/50 mb-1">Title</label>
                      <input
                        value={slide.title}
                        onChange={(e) => {
                          const updated = [...heroSlides];
                          updated[i] = { ...updated[i], title: e.target.value };
                          setHeroSlides(updated);
                        }}
                        className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-white/10 text-white text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1">Highlight</label>
                      <input
                        value={slide.highlight}
                        onChange={(e) => {
                          const updated = [...heroSlides];
                          updated[i] = { ...updated[i], highlight: e.target.value };
                          setHeroSlides(updated);
                        }}
                        className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-white/10 text-white text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1">Subtitle</label>
                      <input
                        value={slide.subtitle}
                        onChange={(e) => {
                          const updated = [...heroSlides];
                          updated[i] = { ...updated[i], subtitle: e.target.value };
                          setHeroSlides(updated);
                        }}
                        className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-white/10 text-white text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={showSaved} className="mt-4 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold uppercase hover:bg-white hover:text-primary transition-all">
              Save Hero Content
            </button>
          </div>

          {/* About Section */}
          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-bold uppercase mb-4">About Section</h2>
            <label className="block text-xs text-white/50 mb-1">About Text</label>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary resize-none"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs text-white/50 mb-1">Mission</label>
                <textarea
                  value={missionText}
                  onChange={(e) => setMissionText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Vision</label>
                <textarea
                  value={visionText}
                  onChange={(e) => setVisionText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
            <button onClick={showSaved} className="mt-4 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold uppercase hover:bg-white hover:text-primary transition-all">
              Save About Content
            </button>
          </div>

          {/* Contact Info */}
          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-bold uppercase mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs text-white/50 mb-1">Office Address</label>
                <input
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Email</label>
                <input
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">WhatsApp Number</label>
                <input
                  value={contactInfo.whatsapp}
                  onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Phone 1</label>
                <input
                  value={contactInfo.phone1}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone1: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Phone 2</label>
                <input
                  value={contactInfo.phone2}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone2: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold uppercase mt-6 mb-3">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-1">Facebook URL</label>
                <input
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Instagram URL</label>
                <input
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">LinkedIn URL</label>
                <input
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <button onClick={showSaved} className="mt-4 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold uppercase hover:bg-white hover:text-primary transition-all">
              Save Contact Info
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-bold uppercase mb-4">Google Drive Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 mb-1">Drive Folder ID</label>
                <input
                  value={driveFolderId}
                  onChange={(e) => setDriveFolderId(e.target.value)}
                  placeholder="Enter Google Drive folder ID"
                  className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white text-sm outline-none focus:border-primary"
                />
                <p className="text-xs text-white/30 mt-1">
                  The folder ID from your Google Drive URL. Current: configured in .env.local
                </p>
              </div>
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
              <button
                onClick={loadProjects}
                className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all"
              >
                Re-sync Drive Photos
              </button>
              <a
                href="/"
                target="_blank"
                className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all inline-block"
              >
                Preview Website
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
