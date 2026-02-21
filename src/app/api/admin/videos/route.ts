import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SESSION_TOKEN = "precision-admin-session";
const DATA_FILE = path.join(process.cwd(), "data", "videos.json");

interface VideoEntry {
  url: string;
  name: string;
  size: number;
  uploadedAt: string;
}

function isAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get(SESSION_TOKEN)?.value;
}

async function readVideos(): Promise<VideoEntry[]> {
  // Vercel Blob (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "videos-config" });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url);
        return await res.json();
      }
    } catch {
      // Fall through
    }
  }

  // Local file (development)
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {
    // No config yet
  }

  return [];
}

async function writeVideos(videos: VideoEntry[]) {
  // Vercel Blob (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put, list, del } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "videos-config" });
    for (const blob of blobs) {
      await del(blob.url);
    }
    await put("videos-config.json", JSON.stringify(videos), {
      access: "public",
      contentType: "application/json",
    });
    return;
  }

  // Local file (development)
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(videos, null, 2), "utf-8");
}

// Detect local video files in public/videos/
function getLocalVideos(): VideoEntry[] {
  const videosDir = path.join(process.cwd(), "public", "videos");
  if (!fs.existsSync(videosDir)) return [];
  return fs.readdirSync(videosDir)
    .filter((f) => /\.(mp4|webm|mov)$/i.test(f))
    .map((f) => {
      const stats = fs.statSync(path.join(videosDir, f));
      return {
        url: `/videos/${f}`,
        name: f,
        size: stats.size,
        uploadedAt: stats.mtime.toISOString(),
      };
    });
}

// GET: List all videos (saved config + local fallback)
export async function GET() {
  try {
    const saved = await readVideos();
    if (saved.length > 0) {
      return NextResponse.json({ videos: saved });
    }
    // No saved config — show local files so they can be managed
    const local = getLocalVideos();
    return NextResponse.json({ videos: local });
  } catch {
    return NextResponse.json({ videos: [] });
  }
}

// POST: Upload a video to Vercel Blob
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "File must be a video" }, { status: 400 });
    }

    // 100MB limit
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 100MB)" }, { status: 400 });
    }

    let videoUrl: string;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Upload to Vercel Blob
      const { put } = await import("@vercel/blob");
      const blob = await put(`videos/${file.name}`, file, {
        access: "public",
        contentType: file.type,
      });
      videoUrl = blob.url;
    } else {
      // Development: save to public/videos/
      const publicDir = path.join(process.cwd(), "public", "videos");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(path.join(publicDir, file.name), buffer);
      videoUrl = `/videos/${file.name}`;
    }

    // Add to videos list
    const videos = await readVideos();
    videos.push({
      url: videoUrl,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    });
    await writeVideos(videos);

    return NextResponse.json({ success: true, url: videoUrl });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// PUT: Reorder videos
export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { videos: newOrder } = await request.json();
    if (!Array.isArray(newOrder)) {
      return NextResponse.json({ error: "Invalid videos array" }, { status: 400 });
    }
    await writeVideos(newOrder);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Video reorder error:", error);
    return NextResponse.json({ error: "Reorder failed" }, { status: 500 });
  }
}

// DELETE: Remove a video
export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
    }

    // Delete from Vercel Blob if it's a blob URL
    if (process.env.BLOB_READ_WRITE_TOKEN && url.includes("blob.vercel-storage.com")) {
      const { del } = await import("@vercel/blob");
      await del(url);
    }

    // Delete local file if it's a /videos/ path
    if (url.startsWith("/videos/")) {
      const filename = path.basename(url);
      const filePath = path.join(process.cwd(), "public", "videos", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove from saved videos list
    const videos = await readVideos();
    const filtered = videos.filter((v) => v.url !== url);
    if (filtered.length !== videos.length) {
      await writeVideos(filtered);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Video delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
