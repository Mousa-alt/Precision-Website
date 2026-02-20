import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Services | Precision Contractors",
    description: "HVAC, electrical, plumbing, fire fighting, fit-out contracting, and smart systems — comprehensive MEP solutions for commercial, retail, and administrative spaces in Egypt.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
