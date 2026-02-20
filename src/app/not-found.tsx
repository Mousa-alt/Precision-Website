import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="text-center">
                <h1 className="text-8xl font-bold text-white mb-4">404</h1>
                <h2 className="text-2xl font-medium text-white/50 mb-4">
                    Page Not Found
                </h2>
                <p className="text-white/30 mb-8 max-w-md mx-auto">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-[#7B2D36] text-white px-8 py-3 rounded-full uppercase text-sm font-medium tracking-wider hover:bg-[#9B3D46] transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
