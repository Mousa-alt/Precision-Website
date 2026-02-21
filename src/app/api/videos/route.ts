import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "videos.json");
const LAYOUT_FILE = path.join(process.cwd(), "data", "video-layout.json");

function getLayout(): string {
  try {
    if (fs.existsSync(LAYOUT_FILE)) {
      return JSON.parse(fs.readFileSync(LAYOUT_FILE, "utf-8")) || "2-equal";
    }
  } catch { /* default */ }
  return "2-equal";
}

// Public endpoint: returns video URLs + layout for the homepage
export async function GET() {
  try {
    const layout = getLayout();
    const maxSlots = layout === "4-equal" ? 4 : layout === "3-equal" || layout === "1-large-2-small" ? 3 : 2;

    // Vercel Blob (production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { list } = await import("@vercel/blob");
        const { blobs } = await list({ prefix: "videos-config" });
        if (blobs.length > 0) {
          const res = await fetch(blobs[0].url);
          const videos = await res.json();
          if (videos.length > 0) {
            const urls = videos.slice(0, maxSlots).map((v: { url: string }) => v.url);
            return NextResponse.json({ videos: urls, layout });
          }
        }
      } catch {
        // Fall through
      }
    }

    // Local config file (development)
    if (fs.existsSync(DATA_FILE)) {
      const videos = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      if (videos.length > 0) {
        const urls = videos.slice(0, maxSlots).map((v: { url: string }) => v.url);
        return NextResponse.json({ videos: urls, layout });
      }
    }

    // Fallback: local video files in public/videos/
    const videosDir = path.join(process.cwd(), "public", "videos");
    if (fs.existsSync(videosDir)) {
      const files = fs.readdirSync(videosDir)
        .filter((f) => /\.(mp4|webm|mov)$/i.test(f))
        .slice(0, maxSlots)
        .map((f) => `/videos/${f}`);
      return NextResponse.json({ videos: files, layout });
    }

    return NextResponse.json({ videos: [], layout });
  } catch {
    return NextResponse.json({ videos: [], layout: "2-equal" });
  }
}
