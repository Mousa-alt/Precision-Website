"use client";

import Link from "next/link";

const services = [
  { title: "HVAC Systems", image: "/images/hvac.jpg" },
  { title: "Electrical Works", image: "/images/electrical.jpg" },
  { title: "Plumbing", image: "/images/plumbing.jpg" },
  { title: "Fire Fighting", image: "/images/firefighting.jpg" },
  { title: "Fit-Out Contracting", image: "/images/fitout.jpg" },
  { title: "Smart Systems", image: "/images/smart.jpg" },
];

const projects = [
  { name: "Intelcia Head Office", location: "Ivory Business, El Sheikh Zayed", category: "Administrative" },
  { name: "Bayer Head Office", location: "Mivida Business Park", category: "Administrative" },
  { name: "Antoushka", location: "Mall of Egypt", category: "Retail" },
  { name: "Decathlon", location: "Green Plaza, Alexandria", category: "Retail" },
  { name: "Beano's", location: "U Venues Mall", category: "Food & Beverage" },
  { name: "Muncai Medical", location: "ZED El Sheikh Zayed", category: "Medical" },
];

export default function Home() {
  return (
    <div id="home" className="m-0 p-0">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full min-h-[820px] max-[1024px]:min-h-[580px] max-[768px]:min-h-[440px] max-[480px]:min-h-[270px] flex items-center">
        {/* Background - dark gradient placeholder (replace with video/image) */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#111] to-[#1a1a1a]" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Hero Text */}
        <div className="absolute z-[100] text-white pl-[100px] max-w-[480px] w-full pointer-events-none max-[1024px]:pl-[60px] max-[768px]:pl-10 max-[480px]:pl-5 max-[480px]:text-center max-[480px]:max-w-full">
          <h1 className="w-full max-w-[430px] font-bold text-[2.6rem] leading-tight mb-20 uppercase max-[1024px]:text-[2rem] max-[1024px]:mb-12 max-[768px]:text-[1.8rem] max-[768px]:mb-9 max-[480px]:text-[1.5rem] max-[480px]:mb-6 max-[480px]:max-w-full">
            Engineering <span className="text-primary">Excellence</span> Built on Precision
          </h1>

          <div className="flex gap-5 flex-wrap pointer-events-auto max-[480px]:justify-center">
            <Link href="/contact">
              <button className="px-6 py-4 min-h-[50px] border-none text-white text-sm font-bold uppercase cursor-pointer rounded-[10px] bg-primary transition-all duration-300 hover:bg-white hover:text-primary hover:scale-110 max-[768px]:px-[18px] max-[768px]:py-2.5 max-[768px]:text-xs max-[768px]:min-h-[45px] max-[480px]:px-2.5 max-[480px]:py-1.5 max-[480px]:min-h-[30px]">
                Get a Quote
              </button>
            </Link>
            <Link href="/projects">
              <button className="px-6 py-4 min-h-[50px] border-none text-white text-sm font-bold uppercase cursor-pointer rounded-[10px] bg-black transition-all duration-300 hover:bg-white hover:text-black hover:scale-110 max-[768px]:px-[18px] max-[768px]:py-2.5 max-[768px]:text-xs max-[768px]:min-h-[45px] max-[480px]:px-2.5 max-[480px]:py-1.5 max-[480px]:min-h-[30px]">
                View Projects
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="aboutMeterika" className="relative w-full overflow-hidden flex justify-center items-center flex-col bg-black">
        {/* Background image placeholder */}
        <div className="w-full h-[500px] max-[768px]:h-[350px] max-[480px]:h-[250px] bg-gradient-to-b from-[#1a1a1a] to-black" />

        {/* Overlay text */}
        <div className="absolute flex flex-col items-center justify-center p-5 m-auto">
          <div className="w-[60%] max-[1200px]:w-[80%] max-[768px]:w-[85%] max-[480px]:w-full flex flex-col items-start justify-center gap-6 p-10 max-[768px]:p-5 text-white" data-aos="fade-up">
            <h2 className="text-[1.5rem] max-[768px]:text-[1.2rem] max-[480px]:text-base font-bold uppercase">
              About Precision
            </h2>
            <p className="text-[1.2rem] max-[768px]:text-[0.9rem] max-[480px]:text-[0.75rem] font-light leading-[1.8]">
              At Precision, we are a forward-thinking contracting and MEP solutions company dedicated to innovation,
              precision, and delivering excellence in every project. We seamlessly integrate the highest technical
              standards with the artistic vision of our project partners.
            </p>
            <Link href="/about">
              <button className="px-9 py-3 border border-white rounded-lg bg-black text-white transition-all duration-300 cursor-pointer mb-8 hover:border-black hover:bg-white hover:text-black hover:scale-105">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== COMMITMENTS / STATS ===== */}
      <section id="home-commitments" className="relative w-full py-20 bg-radial-dark flex justify-center items-center">
        <div className="w-full max-w-[1200px] flex items-center justify-around mx-12 gap-4 flex-wrap max-[768px]:flex-col max-[768px]:mx-5">
          {/* Text */}
          <div className="flex flex-col text-white max-w-[600px]" data-aos="fade-right">
            <h2 className="text-[22px] font-bold mb-8 uppercase">Our Commitment to Excellence</h2>
            <p className="text-base leading-[40px] max-[768px]:leading-[30px] max-[480px]:leading-6">
              In a world where time is of the essence, Precision thrives. We understand the value of
              meeting deadlines without compromising on the quality of our work. Our efficient approach
              ensures that projects are not only completed on time, but also uphold the highest levels
              of craftsmanship.
            </p>
          </div>

          {/* Stats Card */}
          <div className="max-w-[500px] w-full relative" data-aos="fade-left">
            <div className="w-full bg-[#111] rounded-[20px] p-8 border border-white/10">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "75+", label: "Delivered Projects" },
                  { value: "35,500", label: "m² Covered" },
                  { value: "90%+", label: "Client Satisfaction" },
                  { value: "04+", label: "Handovers" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center text-white leading-[2.5]">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="home-services" className="relative w-full bg-black text-white flex justify-center items-center flex-col py-16 overflow-hidden">
        <div className="flex flex-col items-center justify-center px-5 w-[95%]">
          {/* Title */}
          <div className="self-start text-left ml-10 mb-10 max-[768px]:ml-0 max-[768px]:text-center max-[768px]:self-center" data-aos="fade-up">
            <h2 className="text-2xl font-bold mb-2.5 uppercase">Our Services</h2>
            <p className="text-[0.8rem] text-light-gray uppercase leading-[2]">
              Comprehensive MEP Solutions & Fit-Out Contracting
            </p>
          </div>

          {/* Service Cards */}
          <div className="flex flex-wrap justify-center gap-10 px-5 max-[992px]:gap-5">
            {services.map((service) => (
              <Link href="/services" key={service.title}>
                <div className="max-w-[410px] max-[1460px]:max-w-[350px] max-[1300px]:max-w-[270px] max-[576px]:max-w-[350px] text-center mb-5 flex items-end justify-center relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer group" data-aos="zoom-in">
                  {/* Placeholder image */}
                  <div className="w-full h-[280px] max-[768px]:h-[220px] bg-gradient-to-t from-[#1a1a1a] to-[#333] rounded-[10px] transition-transform duration-300 group-hover:scale-105" />
                  {/* Title overlay */}
                  <h3 className="w-full py-6 absolute bottom-0 text-[1.2rem] m-0 text-light-gray bg-black/50">
                    {service.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECTS ===== */}
      <section id="home-projects" className="relative w-full bg-black text-white py-24 flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-black" />

        <div className="relative z-10 w-full max-w-[1200px] px-5">
          {/* Header */}
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-[22px] font-bold uppercase">Our Projects</h2>
          </div>

          {/* Project Cards */}
          <div className="flex flex-col items-center gap-10">
            {projects.map((project, i) => (
              <div key={`${project.name}-${i}`} className="flex flex-col items-center gap-4" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="w-[600px] max-[768px]:w-full max-w-full relative">
                  {/* Placeholder image */}
                  <div className="w-full h-[350px] max-[768px]:h-[220px] bg-gradient-to-br from-[#222] to-[#111] rounded-[20px] object-cover" />
                </div>
                <div className="w-full text-center text-white text-shadow min-h-[80px]">
                  <h3 className="text-[1.5rem] m-0 leading-[2]">{project.name}</h3>
                  <p className="text-[0.8rem] leading-[1.5] m-0 text-white/70">{project.location}</p>
                </div>
              </div>
            ))}

            <Link href="/projects" className="my-6">
              <button className="px-9 py-3 border border-white rounded-lg bg-black text-white transition-all duration-300 cursor-pointer hover:border-black hover:bg-white hover:text-black hover:scale-105">
                View All Projects
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== MISSION / VISION ===== */}
      <section id="animated-section" className="w-full">
        <div className="flex flex-col items-center gap-10 w-full cursor-pointer py-24 overflow-hidden bg-radial-dark">
          {/* Mission */}
          <div className="relative p-5 md:px-12 w-[80%] max-[992px]:w-[90%] max-[768px]:w-[95%] min-h-[380px] max-[992px]:min-h-[250px] max-[768px]:min-h-[200px] mb-24 overflow-hidden z-[2] flex items-center" data-aos="fade-right">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-[20px] -z-[1]" />
            <div className="relative leading-[40px] text-white text-shadow text-left w-full max-w-[700px]">
              <h1 className="text-[2rem] max-[768px]:text-[1.5rem] max-[576px]:text-[1.2rem] mb-10 font-bold uppercase">Our Mission</h1>
              <p className="text-base max-[576px]:text-[0.7rem]">
                To streamline the construction process for our clients by delivering comprehensive
                follow-up consultations at every stage, ensuring a seamless operation, functional space
                with a top-notch quality that exceeds expectations.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="relative p-5 md:px-12 w-[80%] max-[992px]:w-[90%] max-[768px]:w-[95%] min-h-[380px] max-[992px]:min-h-[250px] max-[768px]:min-h-[200px] mb-24 overflow-hidden z-[2] flex items-center justify-end" data-aos="fade-left">
            <div className="absolute inset-0 bg-gradient-to-l from-[#1a1a1a] to-[#222] rounded-[20px] -z-[1]" />
            <div className="relative leading-[40px] text-white text-shadow text-right w-full max-w-[700px]">
              <h1 className="text-[2rem] max-[768px]:text-[1.5rem] max-[576px]:text-[1.2rem] mb-10 font-bold uppercase">Our Vision</h1>
              <p className="text-base max-[576px]:text-[0.7rem]">
                To lead as a premier contracting and MEP solutions provider, delivering innovative and
                sustainable projects that exceed client expectations. We are committed to excellence,
                craftsmanship, and creating lasting value through every endeavor we undertake.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA FOOTER BANNER ===== */}
      <section id="home-footer" className="relative w-full h-[630px] max-[590px]:h-[220px] max-[400px]:h-[150px] bg-black bg-cover bg-center text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative text-center z-10" data-aos="zoom-in">
          <h2 className="text-[2.2rem] max-[768px]:text-[1.5rem] max-[480px]:text-[1.2rem] leading-[2.5] font-bold uppercase mb-6">
            Ready to Build Something <span className="text-primary">Exceptional?</span>
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
