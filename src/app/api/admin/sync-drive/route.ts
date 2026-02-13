import { NextRequest, NextResponse } from "next/server";

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
    const { driveUrl } = await request.json();

    if (!driveUrl) {
      return NextResponse.json(
        { error: "Google Drive URL is required" },
        { status: 400 }
      );
    }

    // Extract folder ID from Google Drive URL
    const folderIdMatch = driveUrl.match(/\/folders\/([a-zA-Z0-9-_]+)/);
    const folderId = folderIdMatch ? folderIdMatch[1] : null;

    if (!folderId) {
      return NextResponse.json(
        { error: "Invalid Google Drive folder URL" },
        { status: 400 }
      );
    }

    // TODO: Implement actual Google Drive API integration
    // For now, return sample data with placeholder structure
    // In production, you would:
    // 1. Authenticate with Google Drive API
    // 2. List files in the folder
    // 3. Filter for image files
    // 4. Generate direct links or use a proxy service
    
    const simulatedPhotos: Photo[] = [
      {
        id: `gdrive-${folderId}-1`,
        url: "/images/projects/palm-hills.jpg",
        name: "Palm Hills Project",
        order: 0,
        isHero: true,
      },
      {
        id: `gdrive-${folderId}-2`,
        url: "/images/projects/mavens.jpg",
        name: "Mavens Commercial",
        order: 1,
        isHero: false,
      },
      {
        id: `gdrive-${folderId}-3`,
        url: "/images/projects/willows.jpg",
        name: "Willows District",
        order: 2,
        isHero: false,
      },
      {
        id: `gdrive-${folderId}-4`,
        url: "/images/projects/bouchee.jpg",
        name: "Bouchee Restaurant",
        order: 3,
        isHero: false,
      },
      {
        id: `gdrive-${folderId}-5`,
        url: "/images/projects/brgr.jpg",
        name: "BRGR Golf Central",
        order: 4,
        isHero: false,
      },
    ];

    photosData = simulatedPhotos;

    return NextResponse.json({
      success: true,
      photos: simulatedPhotos,
      message: "Photos synced successfully",
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync with Google Drive" },
      { status: 500 }
    );
  }
}
