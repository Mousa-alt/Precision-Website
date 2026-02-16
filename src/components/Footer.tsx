import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0a0a0a] text-white overflow-hidden border-t border-primary/10">
      <div className="relative z-10 max-w-[1440px] mx-auto px-10 max-[768px]:px-6 pt-20 pb-10 max-[768px]:pt-14">
        {/* 4-column layout */}
        <div className="flex justify-between gap-12 max-[950px]:flex-wrap max-[768px]:gap-10">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-5 max-w-[320px] max-[950px]:max-w-full max-[950px]:min-w-[280px]">
            <Link href="/">
              <img
                src="/images/logo-new-white.png"
                alt="Precision Contractors"
                className="h-[36px] w-auto opacity-90"
              />
            </Link>
            <p className="text-[13px] leading-[1.8] text-white/50">
              A forward-thinking contracting and MEP solutions company dedicated
              to innovation, precision, and delivering excellence in every project.
            </p>
            <div className="flex gap-3 mt-1">
              <a href="https://www.facebook.com/precision.mep" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 transition-all duration-300 hover:text-white hover:border-primary/40 hover:bg-primary/10" aria-label="Facebook">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://www.instagram.com/precision.mep.smart.solutions" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 transition-all duration-300 hover:text-white hover:border-primary/40 hover:bg-primary/10" aria-label="Instagram">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://www.linkedin.com/company/precision-egy" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 transition-all duration-300 hover:text-white hover:border-primary/40 hover:bg-primary/10" aria-label="LinkedIn">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[3px] text-white/30 mb-2">Navigate</h4>
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About Us" },
              { href: "/services", label: "Services" },
              { href: "/projects", label: "Projects" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-white/50 hover:text-white transition-colors duration-200 w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[3px] text-white/30 mb-2">Services</h4>
            {["HVAC Systems", "Electrical Works", "Plumbing", "Fire Fighting", "Fit-Out Contracting", "Smart Systems"].map((service) => (
              <Link
                key={service}
                href="/services"
                className="text-[13px] text-white/50 hover:text-white transition-colors duration-200 w-fit"
              >
                {service}
              </Link>
            ))}
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[3px] text-white/30 mb-2">Get in Touch</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:info@precision-egy.com" className="text-[13px] text-white/50 hover:text-primary transition-colors duration-200">
                info@precision-egy.com
              </a>
              <a href="tel:+201007625526" className="text-[13px] text-white/50 hover:text-primary transition-colors duration-200">
                +20 100 762 5526
              </a>
              <a href="tel:+201115005060" className="text-[13px] text-white/50 hover:text-primary transition-colors duration-200">
                +20 111 500 5060
              </a>
              <p className="text-[12px] text-white/30 leading-[1.6] max-w-[220px]">
                33 Taqsim Al-Mustaqbal, Modern University St., Al-Mokatam, Cairo
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="w-full h-[1px] bg-white/[0.04] mt-14 mb-6" />
        <div className="flex items-center justify-between max-[768px]:flex-col max-[768px]:gap-4 max-[768px]:text-center">
          <p className="text-white/25 text-[12px] tracking-wide">
            &copy; {new Date().getFullYear()} Precision for Contracting and MEP Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-white/20 text-[10px] uppercase tracking-[2px]">Powered by</span>
            <a href="https://parsec.solutions" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/parsec-logo.png"
                alt="Parsec"
                className="h-[18px] w-auto opacity-30 hover:opacity-80 transition-opacity duration-300"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
