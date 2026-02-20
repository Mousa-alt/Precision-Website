import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Projects | Precision Contractors",
    description: "75+ successfully delivered projects across Cairo's most prestigious locations. Retail, administrative, F&B, medical, and design & supervision.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
