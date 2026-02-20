import Link from "next/link";

export default function ProjectNotFound() {
    return (
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
            <div className="text-center px-6">
                <div className="text-[5rem] font-bold text-white/5 leading-none mb-4">404</div>
                <h1 className="text-2xl font-bold mb-3">Project Not Found</h1>
                <p className="text-white/40 text-sm mb-8 max-w-[400px] mx-auto leading-relaxed">
                    The project you&apos;re looking for doesn&apos;t exist or may have been removed from our portfolio.
                </p>
                <Link
                    href="/projects"
                    className="inline-block bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300"
                >
                    View All Projects
                </Link>
            </div>
        </div>
    );
}
