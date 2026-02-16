"use client";

import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((d) => setAuthed(d.authenticated === true))
      .catch(() => setAuthed(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setAuthed(true);
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthed(false);
    setPassword("");
  };

  // Loading state
  if (authed === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Login page
  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-[400px] bg-[#111] rounded-2xl border border-white/5 p-8">
          <div className="text-center mb-8">
            <img src="/images/logo-new-white.png" alt="Precision" className="h-[40px] mx-auto mb-6" />
            <h1 className="text-xl font-bold uppercase text-white">Admin Login</h1>
            <p className="text-sm text-white/50 mt-2">Enter password to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3.5 rounded-lg bg-black border border-white/10 text-white text-sm outline-none transition-colors focus:border-primary"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3.5 rounded-lg bg-primary text-white font-bold uppercase transition-all duration-300 hover:bg-white hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <a href="/" className="block text-center text-sm text-white/30 mt-6 hover:text-white/60 transition-colors">
            Back to website
          </a>
        </div>
      </div>
    );
  }

  // Authenticated - show admin
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo-new-white.png" alt="Precision" className="h-[28px]" />
            <span className="text-xs text-white/40 uppercase tracking-wider border-l border-white/10 pl-4">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-white/50 hover:text-white transition-colors">View Site</a>
            <button onClick={handleLogout} className="text-sm text-red-400/70 hover:text-red-400 transition-colors">Logout</button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
