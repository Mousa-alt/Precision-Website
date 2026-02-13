"use client";

export default function ContactPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative w-full min-h-[400px] max-[768px]:min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-black" />

        <div className="relative z-10 text-center px-5" data-aos="fade-up">
          <h1 className="text-[2.6rem] max-[768px]:text-[1.8rem] max-[480px]:text-[1.5rem] font-bold uppercase mb-4">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-base font-light text-white/80 max-w-[600px] mx-auto">
            Ready to bring your vision to life? Get in touch with our team of expert engineers for a consultation.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="w-full py-24 bg-radial-dark">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex items-start justify-around gap-16 flex-wrap max-[768px]:flex-col max-[768px]:items-center">
            {/* Info */}
            <div className="max-w-[500px] flex flex-col gap-8" data-aos="fade-right">
              <h2 className="text-[22px] font-bold uppercase">Get in Touch</h2>

              {/* Address */}
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-primary shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="font-bold text-base mb-1">Office Address</h3>
                  <p className="font-light text-sm text-white/80 leading-[1.8]">
                    33 Taqsim Al-Mustaqbal, Modern University Street<br />
                    Al-Mokatam, Cairo, Egypt
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-primary shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="font-bold text-base mb-1">Email</h3>
                  <a href="mailto:info@precision-egy.com" className="text-white hover:text-primary transition-all duration-200 text-sm">
                    info@precision-egy.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-primary shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h3 className="font-bold text-base mb-1">Phone</h3>
                  <a href="tel:+201007625526" className="text-white hover:text-primary transition-all duration-200 text-sm block">
                    +20 100 762 5526
                  </a>
                  <a href="tel:+201115005060" className="text-white hover:text-primary transition-all duration-200 text-sm block">
                    +20 111 500 5060
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-primary shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <div>
                  <h3 className="font-bold text-base mb-1">WhatsApp</h3>
                  <a
                    href="https://wa.me/201007625526"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary transition-all duration-200 text-sm"
                  >
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>

              {/* Social */}
              <div className="mt-4">
                <h3 className="font-bold text-base mb-4">Follow Us</h3>
                <div className="flex gap-5">
                  <a href="https://www.facebook.com/precision.mep" target="_blank" rel="noopener noreferrer" className="text-white transition-all duration-200 hover:text-[#007bff]" aria-label="Facebook">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                  <a href="https://www.instagram.com/precision.mep.smart.solutions" target="_blank" rel="noopener noreferrer" className="text-white transition-all duration-200 hover:text-[#f120c4]" aria-label="Instagram">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/precision-egy" target="_blank" rel="noopener noreferrer" className="text-white transition-all duration-200 hover:text-[#50a4ff]" aria-label="LinkedIn">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-[500px] w-full bg-[#111] rounded-[20px] border border-white/10 p-10 max-[768px]:p-6" data-aos="fade-left">
              <h2 className="text-xl font-bold uppercase mb-2">Request a Quote</h2>
              <p className="text-sm text-white/60 mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold mb-1.5">First Name</label>
                    <input type="text" id="firstName" className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white text-sm outline-none transition-colors focus:border-primary" placeholder="John" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold mb-1.5">Last Name</label>
                    <input type="text" id="lastName" className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white text-sm outline-none transition-colors focus:border-primary" placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold mb-1.5">Email</label>
                  <input type="email" id="email" className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white text-sm outline-none transition-colors focus:border-primary" placeholder="john@example.com" />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold mb-1.5">Phone</label>
                  <input type="tel" id="phone" className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white text-sm outline-none transition-colors focus:border-primary" placeholder="+20 xxx xxx xxxx" />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-bold mb-1.5">Service</label>
                  <select id="service" className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white text-sm outline-none transition-colors focus:border-primary">
                    <option value="">Select a service</option>
                    <option value="hvac">HVAC Systems</option>
                    <option value="electrical">Electrical Works</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="firefighting">Fire Fighting</option>
                    <option value="fitout">Fit-Out Contracting</option>
                    <option value="communication">Communication Systems</option>
                    <option value="security">Security Systems</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold mb-1.5">Project Details</label>
                  <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white text-sm outline-none transition-colors focus:border-primary resize-none" placeholder="Tell us about your project..." />
                </div>

                <button type="submit" className="w-full px-9 py-3.5 border border-white rounded-lg bg-primary text-white font-bold uppercase transition-all duration-300 cursor-pointer hover:bg-white hover:text-primary hover:scale-105">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
