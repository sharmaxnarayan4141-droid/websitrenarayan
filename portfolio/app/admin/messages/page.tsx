"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const readParam =
        filter === "all" ? "" : `&read=${filter === "read" ? "true" : "false"}`;
      const res = await fetch(
        `/api/admin/messages?page=${page}&limit=20${readParam}`
      );
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotal(data.total ?? 0);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleMarkRead = async (id: string, read: boolean) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read } : m))
      );
    } catch (err) {
      console.error("Failed to update message:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setTotal((prev) => prev - 1);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleBulkDelete = async () => {
    setDeleting(true);
    try {
      await Promise.all(
        Array.from(selected).map((id) =>
          fetch(`/api/admin/messages/${id}`, { method: "DELETE" })
        )
      );
      setMessages((prev) => prev.filter((m) => !selected.has(m.id)));
      setTotal((prev) => prev - selected.size);
      setSelected(new Set());
    } catch (err) {
      console.error("Failed to delete messages:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkMarkRead = async () => {
    try {
      await Promise.all(
        Array.from(selected).map((id) =>
          fetch(`/api/admin/messages/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read: true }),
          })
        )
      );
      setMessages((prev) =>
        prev.map((m) => (selected.has(m.id) ? { ...m, read: true } : m))
      );
      setSelected(new Set());
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === messages.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(messages.map((m) => m.id)));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary tracking-tight">
            Messages
          </h1>
          <p className="text-xs text-muted font-sans uppercase tracking-[0.3em] mt-2">
            {total} total {filter !== "all" && `(${filter})`}
          </p>
        </div>
      </div>

      {/* Filters & Bulk actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Filter tabs */}
        <div className="flex gap-1 border border-muted/10">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.25em] font-sans transition-colors duration-200 ${
                filter === f
                  ? "bg-primary text-background"
                  : "text-muted hover:text-primary hover:bg-primary/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted font-sans uppercase tracking-wider">
              {selected.size} selected
            </span>
            <button
              onClick={handleBulkMarkRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-sans text-primary border border-primary/30 hover:border-primary transition-colors duration-200"
            >
              <Check className="w-3 h-3" />
              Mark Read
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-sans text-red-400 border border-red-900/50 hover:border-red-400 transition-colors duration-200 disabled:opacity-40"
            >
              {deleting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3" />
              )}
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Messages list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-muted animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="border border-muted/10 p-12 text-center">
          <MessageSquare className="w-8 h-8 text-muted/30 mx-auto mb-4" />
          <p className="text-sm text-muted font-sans">
            {filter !== "all"
              ? `No ${filter} messages.`
              : "No messages yet."}
          </p>
        </div>
      ) : (
        <div className="border border-muted/10 divide-y divide-muted/10">
          {/* Select all header */}
          <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50">
            <input
              type="checkbox"
              checked={selected.size === messages.length && messages.length > 0}
              onChange={toggleSelectAll}
              className="w-3.5 h-3.5 accent-primary cursor-pointer"
            />
            <span className="text-[10px] text-muted font-sans uppercase tracking-wider">
              Select All
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                className={`group flex items-start gap-4 p-4 transition-colors duration-200 ${
                  !msg.read ? "bg-primary/[0.02]" : "hover:bg-secondary/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(msg.id)}
                  onChange={() => toggleSelect(msg.id)}
                  className="w-3.5 h-3.5 accent-primary mt-1 cursor-pointer shrink-0"
                />

                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    msg.read ? "bg-muted/20" : "bg-primary"
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-sm font-sans text-primary font-medium">
                        {msg.name}
                      </p>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-muted font-sans hover:text-primary transition-colors duration-200"
                      >
                        {msg.email}
                      </a>
                    </div>
                    <span className="text-[10px] text-muted/50 font-sans whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted/80 font-sans mt-3 leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {!msg.read && (
                    <button
                      onClick={() => handleMarkRead(msg.id, true)}
                      className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 transition-all duration-200"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 text-muted hover:text-red-400 hover:bg-red-900/20 transition-all duration-200"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 text-muted hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted font-sans">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 text-muted hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
