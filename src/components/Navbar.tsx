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
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center max-w-[1400px] mx-auto px-8 max-[950px]:px-5 max-[480px]:px-4 h-[70px] max-[950px]:h-[60px] max-[480px]:h-[52px]">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/images/logo-new-white.png"
            alt="Precision Contractors"
            className="h-[42px] max-[950px]:h-[36px] max-[480px]:h-[30px] w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden max-[950px]:!hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-[13px] font-semibold uppercase tracking-[1.5px] rounded-lg transition-all duration-200 ${
                pathname === link.href
                  ? "text-primary"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="hidden max-[950px]:!flex items-center justify-center w-10 h-10 text-white/70 bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="bg-black/95 backdrop-blur-md border-t border-white/5 px-5 pb-5 pt-2">
          <ul className="flex flex-col list-none p-0 m-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3 px-3 text-sm font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                    pathname === link.href
                      ? "text-primary bg-primary/5"
                      : "text-white/70 hover:text-white hover:bg-white/5"
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
