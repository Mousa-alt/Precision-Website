import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects, slugify } from "@/lib/projects";
import ProjectDetailClient from "./project-detail-client";

export const revalidate = 3600; // ISR: revalidate every hour

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    try {
        const projects = await getProjects();
        return projects.map((p) => ({ id: slugify(p.displayName) }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const project = await getProjectBySlug(id);
    if (!project) {
        return { title: "Project Not Found | Precision" };
    }

    const coverImg = project.photos[0]?.url;
    return {
        title: `${project.displayName} | Precision Projects`,
        description: `${project.displayName} – ${project.category} project${project.displayLocation ? ` in ${project.displayLocation}` : ''}. View the full gallery by Precision Contracting & MEP.`,
        openGraph: {
            title: `${project.displayName} | Precision`,
            description: `${project.displayName} – ${project.category} project by Precision`,
            images: coverImg ? [{ url: coverImg, width: 1200, height: 630 }] : [],
        },
    };
}

export default async function ProjectPage({ params }: PageProps) {
    const { id } = await params;
    const project = await getProjectBySlug(id);

    if (!project) {
        notFound();
    }

    // Build prev/next navigation
    const allProjects = await getProjects();
    const idx = allProjects.findIndex((p) => slugify(p.displayName) === id);
    const prev = idx > 0 ? allProjects[idx - 1] : null;
    const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : null;

    return (
        <ProjectDetailClient
            project={project}
            prevProject={prev ? { name: prev.displayName, slug: slugify(prev.displayName) } : null}
            nextProject={next ? { name: next.displayName, slug: slugify(next.displayName) } : null}
        />
    );
}
