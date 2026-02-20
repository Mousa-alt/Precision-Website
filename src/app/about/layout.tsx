import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | Precision Contractors",
    description: "Learn about Precision for Contracting & MEP Solutions — a forward-thinking company dedicated to innovation, precision, and delivering excellence across Egypt.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
