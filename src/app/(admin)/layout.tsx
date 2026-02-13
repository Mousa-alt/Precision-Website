import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Precision",
  description: "Manage project photos and site content",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      {/* Simple admin header */}
      <header className="border-b border-white/10 bg-black">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold uppercase">Precision Admin</h1>
          <a href="/" className="text-sm text-white/50 hover:text-white transition-colors">
            Back to Site
          </a>
        </div>
      </header>
      {children}
    </div>
  );
}
