import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="relative w-full min-h-[600px] bg-cover bg-center bg-black text-center overflow-hidden"
    >
      {/* Dark gradient overlay since we don't have a bg image yet */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />

      <div className="relative z-10 flex flex-col md:flex-row py-24 px-8 md:pl-8 items-start text-white gap-16 max-[768px]:flex-col max-[768px]:items-center max-[768px]:gap-20 max-[768px]:p-0 max-[768px]:pt-16">
        {/* Logo */}
        <div className="relative text-white text-[1.6rem] flex justify-start items-center w-[30%] max-[768px]:w-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 border-2 border-primary rounded flex items-center justify-center">
              <span className="text-primary font-bold text-2xl">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl tracking-wider uppercase">Precision</span>
              <span className="text-white/60 text-[10px] tracking-[0.15em] uppercase">MEP Solutions</span>
            </div>
          </Link>
        </div>

        {/* Contact Info & Social */}
        <div className="flex flex-col items-start ml-[70px] justify-start grow-[2] flex-wrap max-[768px]:flex-col max-[768px]:items-center max-[768px]:ml-0">
          {/* Social Icons */}
          <div className="w-[450px] max-[768px]:w-auto flex flex-row items-center gap-[20%] overflow-visible mb-8">
            <ul className="list-none flex justify-start gap-6 p-0">
              <li className="text-[1.25rem]">
                <a
                  href="https://www.facebook.com/precision.mep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition-all duration-200 hover:text-[#007bff]"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </li>
              <li className="text-[1.25rem]">
                <a
                  href="https://www.instagram.com/precision.mep.smart.solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition-all duration-200 hover:text-[#f120c4]"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </li>
              <li className="text-[1.25rem]">
                <a
                  href="https://www.linkedin.com/company/precision-egy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition-all duration-200 hover:text-[#50a4ff]"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col items-start gap-2.5 max-[768px]:items-start max-[768px]:ml-2.5">
            <h3 className="text-xl font-bold leading-[2]">Contact Us</h3>
            <span className="text-base text-white font-bold">Precision for Contracting and MEP Solutions</span>
            <p className="text-[13px] font-light flex items-center gap-4">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>33 Taqsim Al-Mustaqbal, Modern University Street, Al-Mokatam, Cairo, Egypt</span>
            </p>
            <p className="text-[13px] font-light flex items-center gap-4">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@precision-egy.com" className="text-white leading-[2.1] transition-all duration-200 hover:text-primary">
                info@precision-egy.com
              </a>
            </p>
            <p className="text-[13px] font-light flex items-center gap-4">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+201007625526" className="text-white leading-[2.1] transition-all duration-200 hover:text-primary">
                +20 100 762 5526
              </a>
              <span className="mx-1">|</span>
              <a href="tel:+201115005060" className="text-white leading-[2.1] transition-all duration-200 hover:text-primary">
                +20 111 500 5060
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 text-white w-full absolute bottom-9 left-1/2 -translate-x-1/2 text-sm leading-[2]">
        &copy; {new Date().getFullYear()} Precision for Contracting and MEP Solutions. All rights reserved.
      </div>
    </footer>
  );
}
