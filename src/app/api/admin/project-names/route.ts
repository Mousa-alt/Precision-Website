import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SESSION_TOKEN = "precision-admin-session";
const DATA_FILE = path.join(process.cwd(), "data", "project-names.json");

function isAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get(SESSION_TOKEN)?.value;
}

async function readNames(): Promise<Record<string, { name: string; location: string; coverPosition?: string; coverFit?: string }>> {
  // Option 1: Vercel Blob (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "project-names" });
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
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {
    // No names yet
  }

  return {};
}

async function writeNames(names: Record<string, { name: string; location: string; coverPosition?: string; coverFit?: string }>) {
  // Option 1: Vercel Blob (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put, list, del } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "project-names" });
    for (const blob of blobs) {
      await del(blob.url);
    }
    await put("project-names.json", JSON.stringify(names), {
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
  fs.writeFileSync(DATA_FILE, JSON.stringify(names, null, 2), "utf-8");
}

export async function GET() {
  try {
    const names = await readNames();
    return NextResponse.json({ names });
  } catch {
    return NextResponse.json({ names: {} });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { names } = await request.json();
    await writeNames(names);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save project names error:", error);
    return NextResponse.json(
      { error: "Failed to save project names" },
      { status: 500 }
    );
  }
}
