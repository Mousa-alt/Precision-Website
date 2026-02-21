import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import fs from "fs";
import path from "path";

function isAutoSyncEnabled(): boolean {
  try {
    const filePath = path.join(process.cwd(), "data", "auto-sync.json");
    if (!fs.existsSync(filePath)) return true; // enabled by default
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) !== false;
  } catch {
    return true;
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  const isFromCron = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const isAdmin = !!request.cookies.get("precision-admin-session")?.value;

  if (!isFromCron && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // If this is a cron request and auto-sync is disabled, skip
  if (isFromCron && !isAdmin && !isAutoSyncEnabled()) {
    return NextResponse.json({ skipped: true, reason: "Auto-sync disabled", timestamp: new Date().toISOString() });
  }

  revalidateTag("drive-photos", "max");

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}

// GET for Vercel Cron (cron jobs send GET requests)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAutoSyncEnabled()) {
    return NextResponse.json({ skipped: true, reason: "Auto-sync disabled", timestamp: new Date().toISOString() });
  }

  revalidateTag("drive-photos", "max");

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}
