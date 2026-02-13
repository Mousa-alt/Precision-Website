import { NextRequest, NextResponse } from "next/server";
import { writeFileSync } from "fs";
import { join } from "path";

interface Photo {
  id: string;
  url: string;
  name: string;
  order: number;
  isHero: boolean;
}

// Simulated storage - in production, use a database
let photosData: Photo[] = [];

export async function POST(request: NextRequest) {
  try {
    const { photos } = await request.json();

    if (!Array.isArray(photos)) {
      return NextResponse.json(
        { error: "Invalid photos data" },
        { status: 400 }
      );
    }

    photosData = photos;

    // Save to a JSON file for persistence
    // In production, use a database like PostgreSQL, MongoDB, etc.
    const dataPath = join(process.cwd(), "public", "data", "photos.json");
    try {
      writeFileSync(dataPath, JSON.stringify(photos, null, 2));
    } catch {
      // Directory might not exist, just log for now
      console.log("Could not write to file, using memory storage");
    }

    return NextResponse.json({
      success: true,
      message: "Photos saved successfully",
      count: photos.length,
    });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { error: "Failed to save photos" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    photos: photosData,
  });
}
