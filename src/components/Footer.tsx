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
                className="h-[54px] w-auto opacity-90"
              />
            </Link>
            <p className="text-[13px] leading-[1.8] text-white/50">
              A forward-thinking contracting and MEP solutions company dedicated
              to innovation, precision, and delivering excellence in every project.
            </p>
            <div className="flex gap-3 mt-1">

              <a href="https://www.instagram.com/precision.mep.smart.solutions" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 transition-all duration-300 hover:text-white hover:border-primary/40 hover:bg-primary/10" aria-label="Instagram">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>


              <a href="https://wa.me/201115005060" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 transition-all duration-300 hover:text-white hover:border-primary/40 hover:bg-primary/10" aria-label="WhatsApp">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
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
              <a
                href="https://maps.google.com/?q=29.991810,31.306904"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-white/30 leading-[1.6] max-w-[220px] block hover:text-primary transition-colors duration-200"
              >
                33 Taqsim Al-Mustaqbal, Modern University St., Al-Mokatam, Cairo
              </a>
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
                className="h-[18px] w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
