import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SESSION_TOKEN = "precision-admin-session";
const DATA_FILE = path.join(process.cwd(), "data", "homepage.json");

function isAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get(SESSION_TOKEN)?.value;
}

// Try Vercel Blob first, fall back to file system
async function readConfig() {
  // Option 1: Vercel Blob (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "homepage-config" });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url);
        return await res.json();
      }
    } catch {
      // Fall through to file-based
    }
  }

  // Option 2: Local file system (development)
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
    // No config yet
  }

  return null;
}

async function writeConfig(config: unknown) {
  // Option 1: Vercel Blob (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put, list, del } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "homepage-config" });
    for (const blob of blobs) {
      await del(blob.url);
    }
    await put("homepage-config.json", JSON.stringify(config), {
      access: "public",
      contentType: "application/json",
    });
    return;
  }

  // Option 2: Local file system (development)
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(config, null, 2), "utf-8");
}

export async function GET() {
  try {
    const config = await readConfig();
    return NextResponse.json({ config });
  } catch {
    return NextResponse.json({ config: null });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await request.json();
    await writeConfig(config);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save homepage config error:", error);
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}
