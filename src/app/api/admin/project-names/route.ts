import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SESSION_TOKEN = "precision-admin-session";
const DATA_FILE = path.join(process.cwd(), "data", "project-names.json");

type ProjectOverride = { name: string; location: string; coverPosition?: string; coverFit?: string; coverZoom?: number; displaySize?: string };
type Layout = { order: string[]; sizes: Record<string, string> };
type StoreData = { names: Record<string, ProjectOverride>; layout: Layout };

function isAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get(SESSION_TOKEN)?.value;
}

function normalize(raw: Record<string, unknown>): StoreData {
  // New format: has "names" key
  if (raw.names && typeof raw.names === "object") {
    return {
      names: raw.names as Record<string, ProjectOverride>,
      layout: (raw.layout as Layout) || { order: [], sizes: {} },
    };
  }
  // Old format: flat record of overrides (backward compat)
  return { names: raw as unknown as Record<string, ProjectOverride>, layout: { order: [], sizes: {} } };
}

async function readData(): Promise<StoreData> {
  // Option 1: Vercel Blob (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "project-names" });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url);
        return normalize(await res.json());
      }
    } catch {
      // Fall through to file-based
    }
  }

  // Option 2: Local file system (development)
  try {
    if (fs.existsSync(DATA_FILE)) {
      return normalize(JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")));
    }
  } catch {
    // No data yet
  }

  return { names: {}, layout: { order: [], sizes: {} } };
}

async function writeData(data: StoreData) {
  const payload = JSON.stringify({ names: data.names, layout: data.layout });

  // Option 1: Vercel Blob (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put, list, del } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "project-names" });
    for (const blob of blobs) {
      await del(blob.url);
    }
    await put("project-names.json", payload, {
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
  fs.writeFileSync(DATA_FILE, JSON.stringify({ names: data.names, layout: data.layout }, null, 2), "utf-8");
}

export async function GET() {
  try {
    const { names, layout } = await readData();
    return NextResponse.json({ names, layout });
  } catch {
    return NextResponse.json({ names: {}, layout: { order: [], sizes: {} } });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const names = body.names || {};
    const layout = body.layout || { order: [], sizes: {} };
    await writeData({ names, layout });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save project names error:", error);
    return NextResponse.json(
      { error: "Failed to save project names" },
      { status: 500 }
    );
  }
}
