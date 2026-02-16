"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideLinks from "./SideLinks";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/dashboard");

  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && <SideLinks />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
