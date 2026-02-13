"use client";

import Link from "next/link";

const founders = [
  { name: "Mohamed Abdel Rahman", role: "Co-Founder" },
  { name: "Ahmed Orabl", role: "Co-Founder" },
  { name: "Badr Allam", role: "Co-Founder" },
];

export default function AboutPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero - Video/Image background placeholder */}
      <section className="relative w-full min-h-[600px] max-[768px]:min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-black" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 text-center px-5" data-aos="fade-up">
          <h1 className="text-[2.6rem] max-[768px]:text-[1.8rem] max-[480px]:text-[1.5rem] font-bold uppercase mb-6">
            About <span className="text-primary">Precision</span>
          </h1>
          <p className="text-lg max-[768px]:text-base font-light max-w-[700px] mx-auto leading-[1.8] text-white/80">
            A forward-thinking contracting and MEP solutions company dedicated to innovation, precision,
            and delivering excellence in every project.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="relative w-full bg-black py-24">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex items-center justify-around gap-10 flex-wrap max-[768px]:flex-col" data-aos="fade-up">
            {/* Text */}
            <div className="max-w-[600px] flex flex-col gap-6">
              <h2 className="text-[22px] font-bold uppercase">Who We Are</h2>
              <p className="font-light leading-[1.8] text-white/90">
                Precision is a dynamic contracting and MEP solutions company driven by innovation,
                meticulous attention, and a passion for excellence. Founded by a group of talented
                engineers with diverse expertise and a wealth of experience across the fields of
                engineering, contracting, and MEP systems.
              </p>
              <p className="font-light leading-[1.8] text-white/90">
                With a track record that includes projects in Cairo&apos;s most revered malls and business
                parks, we have built a reputation for delivering outstanding results that exceed client expectations.
              </p>
              <p className="font-light leading-[1.8] text-white/90">
                Transparency and open communication are at the heart of our client relationships. We believe
                in fostering partnerships based on trust and mutual respect. Beyond completing projects,
                our aim is to create enduring connections that stand as testaments to our shared achievements.
              </p>
            </div>

            {/* Image placeholder */}
            <div className="max-w-[500px] w-full">
              <div className="w-full h-[400px] max-[768px]:h-[300px] bg-gradient-to-br from-[#222] to-[#111] rounded-[20px] border border-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full py-24 bg-radial-dark">
        <div className="max-w-[1200px] mx-auto px-5 flex flex-col gap-20">
          {/* Mission */}
          <div className="relative w-[80%] max-[768px]:w-[95%] mx-auto min-h-[300px] max-[768px]:min-h-[200px] flex items-center overflow-hidden" data-aos="fade-right">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-[20px] -z-[1]" />
            <div className="relative p-10 max-[768px]:p-5 leading-[40px] max-[768px]:leading-[30px] text-white text-shadow max-w-[700px]">
              <h2 className="text-[2rem] max-[768px]:text-[1.5rem] mb-8 font-bold uppercase">Our Mission</h2>
              <p className="text-base max-[768px]:text-sm">
                To streamline the construction process for our clients by delivering comprehensive
                follow-up consultations at every stage, ensuring a seamless operation, functional space
                with a top-notch quality that exceeds expectations. We actively contribute to the growth
                of the communities where we operate through sustainable construction methods.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="relative w-[80%] max-[768px]:w-[95%] mx-auto min-h-[300px] max-[768px]:min-h-[200px] flex items-center justify-end overflow-hidden" data-aos="fade-left">
            <div className="absolute inset-0 bg-gradient-to-l from-[#1a1a1a] to-[#222] rounded-[20px] -z-[1]" />
            <div className="relative p-10 max-[768px]:p-5 leading-[40px] max-[768px]:leading-[30px] text-white text-shadow text-right max-w-[700px]">
              <h2 className="text-[2rem] max-[768px]:text-[1.5rem] mb-8 font-bold uppercase">Our Vision</h2>
              <p className="text-base max-[768px]:text-sm">
                To lead as a premier contracting and MEP solutions provider, delivering innovative and
                sustainable projects that exceed client expectations. We are committed to excellence,
                craftsmanship, and creating lasting value through every endeavor we undertake.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="w-full py-24 bg-radial-gray">
        <div className="max-w-[800px] mx-auto px-5 text-center" data-aos="fade-up">
          <h2 className="text-[22px] font-bold uppercase mb-8">Sustainability</h2>
          <p className="font-light leading-[40px] max-[768px]:leading-[30px] text-white/90">
            Our company is committed to integrating green building practices, minimizing waste through
            efficient recycling, and achieving Green Star ratings and LEED standards. We believe
            sustainability is not just a trend but a responsibility we owe to our communities and
            future generations.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="w-full py-24 bg-black">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-[22px] font-bold uppercase text-center mb-16" data-aos="fade-up">Our Founders</h2>

          <div className="flex justify-center gap-16 flex-wrap">
            {founders.map((founder) => (
              <div key={founder.name} className="text-center" data-aos="zoom-in">
                {/* Photo placeholder */}
                <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[#222] to-[#111] border border-white/10 mx-auto mb-6" />
                <h3 className="text-lg font-bold">{founder.name}</h3>
                <p className="text-primary text-sm mt-1">{founder.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 bg-radial-dark flex items-center justify-center">
        <div className="text-center" data-aos="zoom-in">
          <h2 className="text-[2rem] max-[768px]:text-[1.5rem] font-bold uppercase mb-8">
            Let&apos;s Build <span className="text-primary">Together</span>
          </h2>
          <Link href="/contact">
            <button className="px-9 py-3 border border-white rounded-lg bg-black text-white transition-all duration-300 cursor-pointer hover:border-black hover:bg-white hover:text-black hover:scale-105">
              Contact Us
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
