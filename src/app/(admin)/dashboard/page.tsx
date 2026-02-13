"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, Trash2, Star, Image as ImageIcon, FolderSync, Plus } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  name: string;
  order: number;
  isHero: boolean;
}

const SAMPLE_PHOTOS: Photo[] = [
  { id: "1", url: "/images/projects/hero-1.jpg", name: "Project Hero 1", order: 0, isHero: true },
  { id: "2", url: "/images/projects/palm-hills.jpg", name: "Palm Hills", order: 1, isHero: false },
  { id: "3", url: "/images/projects/mavens.jpg", name: "Mavens", order: 2, isHero: false },
  { id: "4", url: "/images/projects/willows.jpg", name: "Willows", order: 3, isHero: false },
  { id: "5", url: "/images/projects/bouchee.jpg", name: "Bouchee", order: 4, isHero: false },
];

export default function AdminDashboard() {
  const [photos, setPhotos] = useState<Photo[]>(SAMPLE_PHOTOS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>("");
  const [driveUrl, setDriveUrl] = useState<string>("");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setPhotos(updatedItems);
  };

  const toggleHero = (id: string) => {
    setPhotos(photos.map(photo => ({
      ...photo,
      isHero: photo.id === id ? !photo.isHero : false,
    })));
  };

  const deletePhoto = (id: string) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  const syncWithDrive = async () => {
    if (!driveUrl) {
      setSyncStatus("Please enter a Google Drive folder URL");
      return;
    }

    setIsSyncing(true);
    setSyncStatus("Syncing with Google Drive...");

    try {
      const response = await fetch("/api/admin/sync-drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driveUrl }),
      });

      if (!response.ok) throw new Error("Sync failed");

      const data = await response.json();
      setPhotos(data.photos);
      setSyncStatus(`Synced ${data.photos.length} photos from Drive`);
    } catch (error) {
      setSyncStatus("Error syncing. Please check the URL and try again.");
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const saveChanges = async () => {
    try {
      const response = await fetch("/api/admin/save-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos }),
      });

      if (response.ok) {
        setSyncStatus("Changes saved successfully!");
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      setSyncStatus("Error saving changes");
      console.error(error);
    }
  };

  const heroPhoto = photos.find(p => p.isHero);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold uppercase mb-8">
          Admin Dashboard
        </h1>

        {/* Google Drive Sync Section */}
        <div className="bg-[#111] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold uppercase mb-4 flex items-center gap-2">
            <FolderSync size={20} />
            Google Drive Integration
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Paste Google Drive folder URL here..."
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              className="flex-1 px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-white"
            />
            <button
              onClick={syncWithDrive}
              disabled={isSyncing}
              className="px-6 py-3 bg-white text-black font-semibold uppercase rounded-lg hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {isSyncing ? "Syncing..." : "Sync Now"}
            </button>
          </div>
          {syncStatus && (
            <p className={`mt-3 text-sm ${syncStatus.includes("Error") ? "text-red-400" : "text-green-400"}`}>
              {syncStatus}
            </p>
          )}
          <p className="mt-2 text-sm text-white/50">
            Connect a shared Google Drive folder to automatically import project photos.
            Drag to reorder and set the hero image.
          </p>
        </div>

        {/* Hero Preview */}
        {heroPhoto && (
          <div className="bg-[#111] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold uppercase mb-4 flex items-center gap-2">
              <Star size={20} className="text-yellow-400" />
              Current Hero Image
            </h2>
            <div className="relative aspect-video bg-gradient-to-br from-[#222] to-[#111] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ImageIcon size={48} className="mx-auto mb-2 text-white/30" />
                <p className="text-white/50">{heroPhoto.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Photo Manager */}
        <div className="bg-[#111] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold uppercase flex items-center gap-2">
              <ImageIcon size={20} />
              Project Photos
            </h2>
            <button
              onClick={saveChanges}
              className="px-6 py-3 bg-white text-black font-semibold uppercase rounded-lg hover:bg-white/90 transition-all"
            >
              Save Changes
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="photos">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {photos.map((photo, index) => (
                    <Draggable key={photo.id} draggableId={photo.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center gap-4 p-4 bg-black rounded-lg border transition-all ${
                            snapshot.isDragging ? "border-white shadow-lg" : "border-white/10"
                          } ${photo.isHero ? "ring-2 ring-yellow-400/50" : ""}`}
                        >
                          <div {...provided.dragHandleProps} className="text-white/50 hover:text-white cursor-grab">
                            <GripVertical size={20} />
                          </div>
                          <div className="w-16 h-16 bg-gradient-to-br from-[#222] to-[#111] rounded-lg flex items-center justify-center">
                            <span className="text-xs text-white/50">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{photo.name}</p>
                            <p className="text-sm text-white/50">Order: {photo.order}</p>
                          </div>
                          <button
                            onClick={() => toggleHero(photo.id)}
                            className={`p-2 rounded-lg transition-all ${
                              photo.isHero
                                ? "bg-yellow-400/20 text-yellow-400"
                                : "bg-white/10 text-white/50 hover:text-white"
                            }`}
                            title={photo.isHero ? "Remove as hero" : "Set as hero"}
                          >
                            <Star size={18} fill={photo.isHero ? "currentColor" : "none"} />
                          </button>
                          <button
                            onClick={() => deletePhoto(photo.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                            title="Delete photo"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {photos.length === 0 && (
            <div className="text-center py-12 text-white/50">
              <ImageIcon size={48} className="mx-auto mb-4" />
              <p>No photos yet. Sync with Google Drive to get started.</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-[#111] rounded-lg">
          <h3 className="text-lg font-semibold uppercase mb-4">How to Use</h3>
          <ol className="space-y-2 text-white/70 list-decimal list-inside">
            <li>Create a shared folder on Google Drive with project photos</li>
            <li>Set the folder to &quot;Anyone with the link can view&quot;</li>
            <li>Copy the folder URL and paste it above</li>
            <li>Click &quot;Sync Now&quot; to import photos</li>
            <li>Drag and drop to reorder photos</li>
            <li>Click the star icon to set a hero image</li>
            <li>Click &quot;Save Changes&quot; to apply updates</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
