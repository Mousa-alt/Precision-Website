"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${
        scrolled ? "bg-black" : "bg-transparent"
      }`}
      style={{ padding: "5px 0" }}
    >
      <div className="flex justify-between items-center max-w-[1200px] ml-[80px] mr-auto px-5 max-[950px]:mx-5 max-[950px]:w-[calc(100%-40px)] max-[480px]:mx-2.5 max-[480px]:w-[calc(100%-20px)] max-[480px]:px-2.5">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="w-[130px] h-[80px] max-[950px]:w-[110px] max-[950px]:h-[70px] max-[480px]:w-[100px] max-[480px]:h-[60px] flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 border-2 border-primary rounded flex items-center justify-center">
                <span className="text-primary font-bold text-xl">P</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg tracking-wider uppercase">Precision</span>
                <span className="text-white/60 text-[9px] tracking-[0.15em] uppercase">MEP Solutions</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden max-[950px]:!hidden md:flex justify-between items-center list-none font-bold text-base min-h-[40px] bg-transparent gap-0">
          {navLinks.map((link) => (
            <li key={link.href} className="pointer-events-auto">
              <Link
                href={link.href}
                className={`mr-5 uppercase leading-[2.5] whitespace-normal transition-all duration-200 ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-white hover:text-white/75 active:text-primary"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="hidden max-[950px]:!block text-[0.9rem] px-4 py-2 text-[#a4a3a2] bg-transparent border border-[#a4a3a2] rounded-xl cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="w-full p-4 mb-4 bg-black block opacity-100 transition-opacity duration-300">
          <ul className="flex flex-col items-start list-none pl-0 m-0">
            {navLinks.map((link) => (
              <li key={link.href} className="my-4 font-bold w-full">
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block p-2.5 text-base ${
                    pathname === link.href ? "text-primary" : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
