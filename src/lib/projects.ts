export interface ProjectPhoto {
    id: string;
    url: string;
    thumbnailUrl: string;
    name: string;
}

export interface ProjectData {
    folderName: string;
    category: string;
    displayName: string;
    displayLocation: string;
    photos: ProjectPhoto[];
    coverPosition: string;
    coverFit: "cover" | "contain";
}

export function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Fetches all projects from the photos API (server-side).
 * Uses SITE_URL env var to avoid headers() which breaks SSG/ISR.
 */
export async function getProjects(): Promise<ProjectData[]> {
    try {
        const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        const res = await fetch(`${baseUrl}/api/photos`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) return [];

        const data = await res.json();
        return (data.projects || []) as ProjectData[];
    } catch {
        return [];
    }
}

/**
 * Get a single project by its slug (derived from displayName).
 */
export async function getProjectBySlug(slug: string): Promise<ProjectData | null> {
    const projects = await getProjects();
    return projects.find((p) => slugify(p.displayName) === slug) || null;
}

/**
 * Get all project slugs for static params generation.
 */
export async function getAllProjectSlugs(): Promise<string[]> {
    const projects = await getProjects();
    return projects.map((p) => slugify(p.displayName));
}
