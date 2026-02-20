import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Precision Contractors",
    description: "Get in touch with Precision for Contracting & MEP Solutions. Request a quote for your next project in Egypt.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
