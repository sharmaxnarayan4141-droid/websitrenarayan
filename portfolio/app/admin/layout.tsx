"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Mail,
  Layers,
  Briefcase,
  FileText,
  LogOut,
  Menu,
  X,
  Loader2,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/skills", label: "Skills", icon: Layers },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/sections", label: "Sections", icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/check");
      if (!res.ok) throw new Error("Not authenticated");
      setAuthenticated(true);
    } catch {
      setAuthenticated(false);
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    // Don't check auth on the login page
    if (pathname === "/admin/login") {
      setAuthenticated(true);
      return;
    }
    checkAuth();
  }, [pathname, checkAuth]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Login page gets a minimal layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-muted animate-spin" />
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-background/90 backdrop-blur-md border-b border-muted/10">
        <span className="font-serif text-lg font-bold tracking-wider uppercase">
          Admin
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-muted hover:text-primary transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-secondary border-r border-muted/10 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="px-6 py-8 border-b border-muted/10">
            <Link
              href="/admin"
              className="font-serif text-2xl font-bold tracking-wider uppercase text-primary"
            >
              Admin
            </Link>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mt-1 font-sans">
              Portfolio Manager
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-sans tracking-wider uppercase transition-all duration-200 rounded-none ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted hover:text-primary hover:bg-primary/5 border-l-2 border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout & back to site */}
          <div className="px-4 py-6 border-t border-muted/10 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2 text-xs text-muted hover:text-primary transition-colors font-sans tracking-wider uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-muted/50" />
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-xs text-muted hover:text-red-400 transition-colors font-sans tracking-wider uppercase w-full"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
