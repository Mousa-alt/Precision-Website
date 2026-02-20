"use client";

import Link from "next/link";

const founders = [
  { name: "Mohamed Abdel Rahman", role: "Co-Founder" },
  { name: "Ahmed Orabl", role: "Co-Founder" },
  { name: "Badr Allam", role: "Co-Founder" },
];

const values = [
  {
    title: "Quality",
    desc: "Uncompromising standards in every detail, every time.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "Innovation",
    desc: "Embracing cutting-edge technology and modern solutions.",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
  {
    title: "Trust",
    desc: "Transparent partnerships built on open communication.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    title: "Sustainability",
    desc: "Green building practices and LEED-standard compliance.",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative w-full min-h-[400px] max-[768px]:min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-black" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="glow-orb w-[500px] h-[500px] bg-primary top-[-100px] right-[-100px] animate-pulse-glow" />

        <div className="relative z-10 text-center px-5" data-aos="fade-up">
          <div className="line-accent mx-auto mb-6" />
          <h1 className="text-[2.6rem] max-[768px]:text-[1.8rem] max-[480px]:text-[1.5rem] font-bold uppercase mb-6">
            About <span className="text-primary">Precision</span>
          </h1>
          <p className="text-lg max-[768px]:text-base font-light max-w-[700px] mx-auto leading-[1.8] text-white/80">
            A forward-thinking contracting and MEP solutions company dedicated to innovation, precision,
            and delivering excellence in every project.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="relative w-full bg-black py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="glow-orb w-[300px] h-[300px] bg-primary bottom-[10%] left-[-50px] animate-pulse-glow" />

        <div className="relative z-10 max-w-[1100px] mx-auto px-5">
          <div className="flex items-center justify-between gap-16 flex-wrap max-[768px]:flex-col" data-aos="fade-up">
            <div className="max-w-[600px] flex flex-col gap-6">
              <div className="line-accent" />
              <h2 className="text-2xl font-bold uppercase">Who We Are</h2>
              <p className="font-light leading-[1.9] text-white/80">
                Precision is a dynamic contracting and MEP solutions company driven by innovation,
                meticulous attention, and a passion for excellence. Founded by a group of talented
                engineers with diverse expertise and a wealth of experience across the fields of
                engineering, contracting, and MEP systems.
              </p>
              <p className="font-light leading-[1.9] text-white/80">
                With a track record that includes projects in Cairo&apos;s most revered malls and business
                parks, we have built a reputation for delivering outstanding results that exceed client expectations.
              </p>
              <p className="font-light leading-[1.9] text-white/80">
                Transparency and open communication are at the heart of our client relationships. We believe
                in fostering partnerships based on trust and mutual respect.
              </p>
            </div>

            {/* Stats visual */}
            <div className="max-w-[400px] w-full" data-aos="fade-left">
              <div className="bg-[#0d0d0d] rounded-[20px] p-10 border border-white/5">
                {[
                  { value: "75+", label: "Projects Delivered" },
                  { value: "35,500", label: "m\u00B2 Covered" },
                  { value: "90%+", label: "Client Satisfaction" },
                  { value: "7+", label: "Service Categories" },
                ].map((stat, i) => (
                  <div key={stat.label} className={`flex items-center justify-between py-4 ${i > 0 ? "border-t border-white/5" : ""}`}>
                    <span className="text-sm text-white/60">{stat.label}</span>
                    <span className="text-2xl font-bold stat-number">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="w-full py-24 bg-radial-dark overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-5">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="line-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold uppercase">Our Values</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="w-[250px] bg-[#0d0d0d] rounded-[20px] p-8 border border-white/5 card-hover text-center"
                data-aos="zoom-in"
                data-aos-delay={i * 100}
              >
                <div className="service-icon mx-auto mb-5">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-white/50 leading-[1.7]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="max-w-[1100px] mx-auto px-5 flex flex-col gap-16">
          <div className="flex items-center gap-12 max-[768px]:flex-col" data-aos="fade-right">
            <div className="flex-shrink-0">
              <div className="w-[80px] h-[80px] rounded-[20px] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase mb-6">Our <span className="text-primary">Mission</span></h2>
              <p className="text-base font-light leading-[1.9] text-white/80">
                To streamline the construction process for our clients by delivering comprehensive
                follow-up consultations at every stage, ensuring a seamless operation, functional space
                with a top-notch quality that exceeds expectations. We actively contribute to the growth
                of the communities where we operate through sustainable construction methods.
              </p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center gap-12 max-[768px]:flex-col" data-aos="fade-left">
            <div className="flex-shrink-0">
              <div className="w-[80px] h-[80px] rounded-[20px] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase mb-6">Our <span className="text-primary">Vision</span></h2>
              <p className="text-base font-light leading-[1.9] text-white/80">
                To lead as a premier contracting and MEP solutions provider, delivering innovative and
                sustainable projects that exceed client expectations. We are committed to excellence,
                craftsmanship, and creating lasting value through every endeavor we undertake.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="w-full py-24 bg-radial-gray overflow-hidden">
        <div className="max-w-[800px] mx-auto px-5 text-center" data-aos="fade-up">
          <div className="service-icon mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold uppercase mb-8">Sustainability</h2>
          <p className="font-light leading-[1.9] text-white/80">
            Our company is committed to integrating green building practices, minimizing waste through
            efficient recycling, and achieving Green Star ratings and LEED standards. We believe
            sustainability is not just a trend but a responsibility we owe to our communities and
            future generations.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="w-full py-24 bg-black overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-5">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="line-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold uppercase">Our Founders</h2>
          </div>

          <div className="flex justify-center gap-8 flex-wrap">
            {founders.map((founder, i) => (
              <div
                key={founder.name}
                className="bg-[#0d0d0d] rounded-[20px] p-8 border border-white/5 text-center min-w-[200px] card-hover"
                data-aos="zoom-in"
                data-aos-delay={i * 150}
              >
                <h3 className="text-lg font-bold">{founder.name}</h3>
                <p className="text-primary text-sm mt-1">{founder.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="glow-orb w-[500px] h-[500px] bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
        <div className="relative z-10 text-center" data-aos="zoom-in">
          <h2 className="text-[2rem] max-[768px]:text-[1.5rem] font-bold uppercase mb-4">
            Let&apos;s Build <span className="text-primary">Together</span>
          </h2>
          <p className="text-white/50 text-sm mb-8 max-w-[400px] mx-auto">
            Partner with us to create exceptional spaces that exceed expectations.
          </p>
          <Link href="/contact">
            <button className="px-10 py-4 border-none rounded-[10px] bg-primary text-white text-sm font-bold uppercase transition-all duration-300 cursor-pointer hover:bg-white hover:text-primary hover:scale-105">
              Contact Us
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
