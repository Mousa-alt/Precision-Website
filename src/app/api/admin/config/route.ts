import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

const ALLOWED_KEYS = ["homepage", "photo-overrides", "auto-sync"];

function getFilePath(key: string): string {
  return path.join(DATA_DIR, `${key}.json`);
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key || !ALLOWED_KEYS.includes(key)) {
    return NextResponse.json(
      { error: "Invalid config key. Allowed: " + ALLOWED_KEYS.join(", ") },
      { status: 400 }
    );
  }

  try {
    const filePath = getFilePath(key);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ data: null });
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Config read error:", error);
    return NextResponse.json({ data: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, data } = body;

    if (!key || !ALLOWED_KEYS.includes(key)) {
      return NextResponse.json(
        { error: "Invalid config key. Allowed: " + ALLOWED_KEYS.join(", ") },
        { status: 400 }
      );
    }

    if (data === undefined) {
      return NextResponse.json(
        { error: "Missing data field" },
        { status: 400 }
      );
    }

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const filePath = getFilePath(key);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: `Config '${key}' saved` });
  } catch (error) {
    console.error("Config write error:", error);
    return NextResponse.json(
      { error: "Failed to save config" },
      { status: 500 }
    );
  }
}
