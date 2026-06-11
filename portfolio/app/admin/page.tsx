"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Layers,
  Briefcase,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

interface Stats {
  totalMessages: number;
  unreadMessages: number;
  totalSkills: number;
  totalProjects: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState<
    { id: string; name: string; email: string; message: string; read: boolean; created_at: string }[]
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, messagesRes] = await Promise.all([
          fetch("/api/admin/dashboard/stats"),
          fetch("/api/admin/messages?limit=5"),
        ]);

        if (!statsRes.ok || !messagesRes.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const statsData = await statsRes.json();
        const messagesData = await messagesRes.json();

        setStats(statsData);
        setRecentMessages(messagesData.messages ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-muted animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-red-400 font-sans">{error}</p>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Messages",
      value: stats?.totalMessages ?? 0,
      sub: `${stats?.unreadMessages ?? 0} unread`,
      icon: Mail,
      href: "/admin/messages",
    },
    {
      label: "Skills",
      value: stats?.totalSkills ?? 0,
      sub: "Manage skills",
      icon: Layers,
      href: "/admin/skills",
    },
    {
      label: "Projects",
      value: stats?.totalProjects ?? 0,
      sub: "Manage projects",
      icon: Briefcase,
      href: "/admin/projects",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs text-muted font-sans uppercase tracking-[0.3em] mt-2">
          Overview of your portfolio
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={card.href}
                className="group block border border-muted/10 hover:border-muted/30 transition-all duration-300 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-5 h-5 text-muted group-hover:text-primary transition-colors duration-300" />
                  <ArrowUpRight className="w-4 h-4 text-muted/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>
                <p className="font-serif text-4xl font-bold text-primary">
                  {card.value}
                </p>
                <p className="text-xs text-muted font-sans uppercase tracking-[0.2em] mt-1">
                  {card.label}
                </p>
                {card.sub && (
                  <p className="text-[10px] text-muted/60 font-sans mt-2">
                    {card.sub}
                  </p>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Messages */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-primary">
            Recent Messages
          </h2>
          <Link
            href="/admin/messages"
            className="text-[10px] text-muted hover:text-primary uppercase tracking-[0.3em] font-sans transition-colors duration-200"
          >
            View All →
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="border border-muted/10 p-8 text-center">
            <p className="text-sm text-muted font-sans">No messages yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-muted/10 border border-muted/10">
            {recentMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 hover:bg-secondary/50 transition-colors duration-200"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    msg.read ? "bg-muted/30" : "bg-primary"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-sans text-primary truncate">
                    {msg.name}
                  </p>
                  <p className="text-xs text-muted font-sans truncate mt-0.5">
                    {msg.email}
                  </p>
                  <p className="text-xs text-muted/60 font-sans line-clamp-1 mt-1">
                    {msg.message}
                  </p>
                </div>
                <span className="text-[10px] text-muted/50 font-sans whitespace-nowrap">
                  {new Date(msg.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
