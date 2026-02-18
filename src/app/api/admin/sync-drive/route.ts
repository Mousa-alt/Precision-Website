import { NextRequest, NextResponse } from "next/server";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
}

interface DriveListResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

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
        { error: "Invalid Google Drive folder URL. Expected format: https://drive.google.com/drive/folders/FOLDER_ID" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Drive API key not configured. Set GOOGLE_DRIVE_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    // Fetch all image files from the folder using Google Drive API v3
    const allFiles: DriveFile[] = [];
    let pageToken: string | undefined;

    do {
      const params = new URLSearchParams({
        q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
        key: apiKey,
        fields: "files(id,name,mimeType,thumbnailLink),nextPageToken",
        pageSize: "100",
        orderBy: "name",
      });
      if (pageToken) params.set("pageToken", pageToken);

      const driveRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?${params.toString()}`
      );

      if (!driveRes.ok) {
        const errData = await driveRes.json();
        const errMsg = errData?.error?.message || "Failed to fetch from Google Drive";
        return NextResponse.json(
          { error: errMsg },
          { status: driveRes.status }
        );
      }

      const data: DriveListResponse = await driveRes.json();
      allFiles.push(...(data.files || []));
      pageToken = data.nextPageToken;
    } while (pageToken);

    // Map to our photo format with direct image URLs
    const photos = allFiles.map((file, index) => ({
      id: file.id,
      url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w2000`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`,
      name: file.name.replace(/\.[^/.]+$/, ""), // strip extension
      mimeType: file.mimeType,
      order: index,
      isHero: index === 0,
    }));

    return NextResponse.json({
      success: true,
      photos,
      folderId,
      message: `Synced ${photos.length} photos from Google Drive`,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync with Google Drive" },
      { status: 500 }
    );
  }
}
