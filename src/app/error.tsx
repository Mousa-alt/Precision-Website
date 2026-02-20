"use client";

import Link from "next/link";

export default function Error({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                    Something went wrong
                </h1>
                <p className="text-white/30 mb-8 max-w-md mx-auto">
                    An unexpected error occurred. Please try again or return to the home
                    page.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={reset}
                        className="inline-block bg-[#7B2D36] text-white px-8 py-3 rounded-full uppercase text-sm font-medium tracking-wider hover:bg-[#9B3D46] transition-colors"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="inline-block text-white/50 px-8 py-3 rounded-full uppercase text-sm font-medium tracking-wider border border-white/20 hover:border-white/40 transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
