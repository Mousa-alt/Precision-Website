import { NextResponse } from "next/server";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

interface DriveListResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

interface ProjectPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  name: string;
}

interface Project {
  folderName: string;
  category: string;
  photos: ProjectPhoto[];
}

const API_KEY = process.env.GOOGLE_DRIVE_API_KEY!;
const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;

// Keywords that indicate a good cover/hero photo (exterior, branding, general)
const PREFERRED_KEYWORDS = ["exterior", "front", "facade", "hero", "cover", "main", "logo", "brand", "entrance", "sign", "overview", "general", "reception", "lobby"];
// Keywords that indicate a bad cover photo (technical/detail shots)
const AVOID_KEYWORDS = ["electrical", "board", "panel", "interior", "detail", "mep", "pipe", "duct", "cable", "wiring", "switch", "breaker", "db", "meter", "ceiling", "ac", "chiller", "pump"];

function pickCoverIndex(photos: { name: string }[]): number {
  if (photos.length <= 1) return 0;

  let bestIdx = 0;
  let bestScore = -100;

  for (let i = 0; i < photos.length; i++) {
    const name = photos[i].name.toLowerCase();
    let score = 0;

    // Boost for preferred keywords
    for (const kw of PREFERRED_KEYWORDS) {
      if (name.includes(kw)) { score += 10; break; }
    }

    // Penalize for avoid keywords
    for (const kw of AVOID_KEYWORDS) {
      if (name.includes(kw)) { score -= 20; break; }
    }

    // Prefer photos with low numbers in filename (1.jpg, 01.jpg are usually hero shots)
    const numMatch = name.match(/(?:^|\D)(\d{1,2})(?:\D|$)/);
    if (numMatch) {
      const num = parseInt(numMatch[1], 10);
      if (num === 1) score += 5;
      else if (num <= 3) score += 2;
    }

    // Slight preference for earlier photos in the list
    score -= i * 0.1;

    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  return bestIdx;
}

async function listFolder(folderId: string): Promise<DriveFile[]> {
  const allFiles: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      key: API_KEY,
      fields: "files(id,name,mimeType),nextPageToken",
      pageSize: "100",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) break;

    const data: DriveListResponse = await res.json();
    allFiles.push(...(data.files || []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return allFiles;
}

export async function GET() {
  if (!API_KEY || !ROOT_FOLDER_ID) {
    return NextResponse.json({ projects: [], error: "Drive not configured" });
  }

  try {
    // Level 1: Get category folders (01.Administrative, 02.Retail, etc.)
    const categoryFolders = await listFolder(ROOT_FOLDER_ID);
    const folders = categoryFolders.filter(
      (f) => f.mimeType === "application/vnd.google-apps.folder"
    );

    const projects: Project[] = [];

    // Level 2: Get project folders inside each category
    for (const catFolder of folders) {
      // Extract category name (remove numbering prefix like "01.", "02.")
      const category = catFolder.name.replace(/^\d+\./, "").trim();

      const projectFolders = await listFolder(catFolder.id);
      const subFolders = projectFolders.filter(
        (f) => f.mimeType === "application/vnd.google-apps.folder"
      );

      // Level 3: Get images inside each project folder
      for (const projFolder of subFolders) {
        const files = await listFolder(projFolder.id);
        const images = files.filter((f) => f.mimeType.startsWith("image/"));

        if (images.length > 0) {
          const photoList = images.map((img) => ({
            id: img.id,
            url: `https://lh3.googleusercontent.com/d/${img.id}=w1200`,
            thumbnailUrl: `https://lh3.googleusercontent.com/d/${img.id}=w400`,
            name: img.name.replace(/\.[^/.]+$/, ""),
          }));

          // Pick the best cover photo and put it first
          const coverIdx = pickCoverIndex(photoList);
          if (coverIdx > 0) {
            const cover = photoList[coverIdx];
            photoList.splice(coverIdx, 1);
            photoList.unshift(cover);
          }

          projects.push({
            folderName: projFolder.name,
            category,
            photos: photoList,
          });
        }
      }
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Photos API error:", error);
    return NextResponse.json({ projects: [], error: "Failed to fetch photos" });
  }
}
