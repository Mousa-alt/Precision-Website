#!/usr/bin/env npx tsx
/**
 * AI Photo Analysis Script for Precision Website
 *
 * Downloads tiny thumbnails from Google Drive and uses Google Gemini Vision
 * to rate each photo as a cover photo candidate.
 *
 * Usage:
 *   npx tsx scripts/analyze-photos.ts
 *   npm run analyze
 *
 * Requirements:
 *   - GOOGLE_DRIVE_API_KEY in .env.local
 *   - GOOGLE_DRIVE_FOLDER_ID in .env.local
 *   - GEMINI_API_KEY in .env.local (get free from https://aistudio.google.com/apikey)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env.local");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!DRIVE_API_KEY || !ROOT_FOLDER_ID) {
  console.error("ERROR: Missing GOOGLE_DRIVE_API_KEY or GOOGLE_DRIVE_FOLDER_ID in .env.local");
  process.exit(1);
}

if (!GEMINI_API_KEY) {
  console.error("ERROR: Missing GEMINI_API_KEY in .env.local");
  console.error("Get a free API key from: https://aistudio.google.com/apikey");
  process.exit(1);
}

const DATA_DIR = path.join(projectRoot, "data");
const OUTPUT_FILE = path.join(DATA_DIR, "photo-analysis.json");

// ---- Types ----

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

interface PhotoScore {
  id: string;
  name: string;
  score: number; // 1-10 cover suitability
  type: "branding" | "interior" | "technical" | "other";
  description: string;
}

interface ProjectAnalysis {
  folderName: string;
  category: string;
  photos: PhotoScore[];
  bestCoverId: string;
  analyzedAt: string;
}

interface AnalysisResult {
  version: 2;
  analyzedAt: string;
  projects: ProjectAnalysis[];
}

// ---- Google Drive helpers ----

async function listFolder(folderId: string): Promise<DriveFile[]> {
  const allFiles: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      key: DRIVE_API_KEY!,
      fields: "files(id,name,mimeType),nextPageToken",
      pageSize: "100",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params.toString()}`
    );
    if (!res.ok) {
      console.error(`Drive API error: ${res.status} ${res.statusText}`);
      break;
    }

    const data = await res.json();
    allFiles.push(...(data.files || []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return allFiles;
}

// ---- Gemini Vision helpers ----

async function analyzePhotosWithGemini(
  photos: { id: string; name: string }[],
  projectName: string
): Promise<PhotoScore[]> {
  // Prepare image parts — use tiny thumbnails (=w256, just a few KB each)
  const imageParts: { inlineData: { mimeType: string; data: string } }[] = [];
  const validPhotos: { id: string; name: string }[] = [];

  for (const photo of photos) {
    try {
      const thumbUrl = `https://lh3.googleusercontent.com/d/${photo.id}=w256`;
      const res = await fetch(thumbUrl);
      if (!res.ok) continue;

      const buffer = Buffer.from(await res.arrayBuffer());
      const base64 = buffer.toString("base64");
      imageParts.push({
        inlineData: { mimeType: "image/jpeg", data: base64 },
      });
      validPhotos.push(photo);
    } catch {
      console.log(`  Skipping ${photo.name} (download failed)`);
    }
  }

  if (validPhotos.length === 0) return [];

  // Build the prompt
  const photoList = validPhotos
    .map((p, i) => `Image ${i + 1}: "${p.name}"`)
    .join("\n");

  const prompt = `You are an expert at selecting cover photos for a construction/contracting company portfolio website.

Project: "${projectName}"

I'm showing you ${validPhotos.length} photos from this project. For EACH photo, provide:
1. A cover suitability score from 1-10 (10 = perfect cover photo)
2. Type: "branding" (logo/signage/exterior/storefront), "interior" (finished interior spaces), "technical" (MEP/electrical/plumbing detail shots), or "other"
3. A 5-10 word description

Scoring guide:
- 9-10: Brand-visible storefront/facade with logo, beautiful exterior shot
- 7-8: Clean finished interior, reception area, overview shot
- 5-6: General interior detail, partial views
- 3-4: Construction progress, behind-the-scenes
- 1-2: Technical/MEP close-ups (electrical panels, pipes, ducts, ceiling details)

Photos:
${photoList}

Reply ONLY with valid JSON (no markdown), an array of objects:
[{"index":0,"score":8,"type":"branding","description":"Storefront with illuminated brand logo"},...]`;

  // Build request body with interleaved images and text
  const contents = [
    {
      parts: [
        ...imageParts,
        { text: prompt },
      ],
    },
  ];

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`  Gemini API error: ${res.status} — ${errText.slice(0, 200)}`);
      return validPhotos.map((p) => ({
        id: p.id,
        name: p.name,
        score: 5,
        type: "other" as const,
        description: "Analysis failed",
      }));
    }

    const geminiData = await res.json();
    const textContent =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = textContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("  Could not parse Gemini response as JSON");
      return validPhotos.map((p) => ({
        id: p.id,
        name: p.name,
        score: 5,
        type: "other" as const,
        description: "Parse failed",
      }));
    }

    const scores: { index: number; score: number; type: string; description: string }[] =
      JSON.parse(jsonMatch[0]);

    return validPhotos.map((p, i) => {
      const match = scores.find((s) => s.index === i);
      return {
        id: p.id,
        name: p.name,
        score: match?.score ?? 5,
        type: (match?.type as PhotoScore["type"]) ?? "other",
        description: match?.description ?? "",
      };
    });
  } catch (err) {
    console.error(`  Gemini analysis error:`, err);
    return validPhotos.map((p) => ({
      id: p.id,
      name: p.name,
      score: 5,
      type: "other" as const,
      description: "Error during analysis",
    }));
  }
}

// ---- Main ----

async function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  Precision Photo Analyzer — Gemini Vision    ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log();

  // Load existing analysis to skip already-analyzed projects
  let existing: AnalysisResult | null = null;
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
      console.log(`Found existing analysis with ${existing!.projects.length} projects`);
    } catch {
      existing = null;
    }
  }

  console.log("Scanning Google Drive...\n");

  // Level 1: Category folders
  const categoryFolders = await listFolder(ROOT_FOLDER_ID!);
  const folders = categoryFolders.filter(
    (f) => f.mimeType === "application/vnd.google-apps.folder"
  );

  console.log(`Found ${folders.length} category folders\n`);

  const allProjects: ProjectAnalysis[] = [];
  let analyzed = 0;
  let skipped = 0;

  for (const catFolder of folders) {
    const category = catFolder.name.replace(/^\d+\./, "").trim();
    console.log(`📁 ${catFolder.name}`);

    // Level 2: Project folders
    const projectFolders = await listFolder(catFolder.id);
    const subFolders = projectFolders.filter(
      (f) => f.mimeType === "application/vnd.google-apps.folder"
    );

    for (const projFolder of subFolders) {
      // Check if already analyzed
      const existingProject = existing?.projects.find(
        (p) => p.folderName === projFolder.name
      );

      // Level 3: Images
      const files = await listFolder(projFolder.id);
      const images = files.filter((f) => f.mimeType.startsWith("image/"));

      if (images.length === 0) {
        console.log(`   ${projFolder.name} — no images, skipping`);
        continue;
      }

      // Skip if same photo count (no new photos added)
      if (existingProject && existingProject.photos.length === images.length) {
        console.log(`   ${projFolder.name} — ${images.length} photos (cached)`);
        allProjects.push(existingProject);
        skipped++;
        continue;
      }

      console.log(
        `   ${projFolder.name} — ${images.length} photos → analyzing...`
      );

      const scores = await analyzePhotosWithGemini(
        images.map((img) => ({
          id: img.id,
          name: img.name.replace(/\.[^/.]+$/, ""),
        })),
        projFolder.name
      );

      // Find best cover (highest score)
      const bestCover =
        scores.length > 0
          ? scores.reduce((best, curr) =>
              curr.score > best.score ? curr : best
            )
          : null;

      allProjects.push({
        folderName: projFolder.name,
        category,
        photos: scores,
        bestCoverId: bestCover?.id || images[0]?.id || "",
        analyzedAt: new Date().toISOString(),
      });

      analyzed++;

      // Print scores
      for (const s of scores) {
        const bar = "█".repeat(s.score) + "░".repeat(10 - s.score);
        const star = s.id === bestCover?.id ? " ★ COVER" : "";
        console.log(
          `      [${bar}] ${s.score}/10 ${s.type.padEnd(10)} ${s.name}${star}`
        );
      }

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // Save results
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const result: AnalysisResult = {
    version: 2,
    analyzedAt: new Date().toISOString(),
    projects: allProjects,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), "utf-8");

  console.log("\n══════════════════════════════════════════════");
  console.log(`Done! Analyzed ${analyzed} projects, ${skipped} cached`);
  console.log(`Results saved to: ${OUTPUT_FILE}`);
  console.log("══════════════════════════════════════════════");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
