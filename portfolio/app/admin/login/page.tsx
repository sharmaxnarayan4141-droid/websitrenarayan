"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid password.");
      }

      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-muted/30 mb-6">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">
            Admin Access
          </h1>
          <p className="text-xs text-muted font-sans uppercase tracking-[0.3em]">
            Enter password to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              autoFocus
              className="w-full bg-transparent border border-muted/30 px-4 py-3.5 text-sm text-primary font-sans outline-none focus:border-primary transition-colors duration-300 placeholder:text-muted/40"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-sans tracking-wider"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full group relative overflow-hidden border border-primary px-6 py-3.5 text-sm uppercase tracking-[0.25em] font-sans text-primary transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-primary translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
            <span className="relative group-hover:text-background transition-colors duration-500 ease-in-out flex items-center justify-center gap-3">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Enter
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </span>
          </button>
        </form>

        {/* Back to site */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-[10px] text-muted hover:text-primary uppercase tracking-[0.3em] font-sans transition-colors duration-200"
          >
            ← Back to site
          </a>
        </div>
      </motion.div>
    </div>
  );
}
