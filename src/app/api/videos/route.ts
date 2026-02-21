import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "videos.json");

// Public endpoint: returns video URLs for the homepage
export async function GET() {
  try {
    // Vercel Blob (production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { list } = await import("@vercel/blob");
        const { blobs } = await list({ prefix: "videos-config" });
        if (blobs.length > 0) {
          const res = await fetch(blobs[0].url);
          const videos = await res.json();
          return NextResponse.json({ videos: videos.map((v: { url: string }) => v.url) });
        }
      } catch {
        // Fall through
      }
    }

    // Local file (development)
    if (fs.existsSync(DATA_FILE)) {
      const videos = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return NextResponse.json({ videos: videos.map((v: { url: string }) => v.url) });
    }

    // Fallback: check for local video files
    const videosDir = path.join(process.cwd(), "public", "videos");
    if (fs.existsSync(videosDir)) {
      const files = fs.readdirSync(videosDir).filter((f) => f.endsWith(".mp4"));
      return NextResponse.json({ videos: files.map((f) => `/videos/${f}`) });
    }

    return NextResponse.json({ videos: [] });
  } catch {
    return NextResponse.json({ videos: [] });
  }
}
