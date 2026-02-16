import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import AOSProvider from "@/components/AOSProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "Precision | Contracting & MEP Solutions in Egypt",
  description:
    "PRECISION is a forward-thinking Contracting and MEP Solutions Company in Egypt, dedicated to innovation, precision, and delivering excellence in every project.",
  keywords: [
    "Precision",
    "MEP services",
    "contracting",
    "HVAC",
    "electrical",
    "plumbing",
    "fire fighting",
    "fit-out",
    "Egypt",
    "Cairo",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <AOSProvider />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
