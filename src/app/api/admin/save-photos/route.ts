import { NextRequest, NextResponse } from "next/server";

interface Photo {
  id: string;
  url: string;
  name: string;
  order: number;
  isHero: boolean;
}

// In-memory store for photo ordering/hero selection
// In production, replace with a database (PostgreSQL, MongoDB, etc.)
let photosConfig: Photo[] = [];

export async function POST(request: NextRequest) {
  try {
    const { photos } = await request.json();

    if (!Array.isArray(photos)) {
      return NextResponse.json(
        { error: "Invalid photos data" },
        { status: 400 }
      );
    }

    photosConfig = photos;

    return NextResponse.json({
      success: true,
      message: "Photos configuration saved",
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
  return NextResponse.json({ photos: photosConfig });
}
