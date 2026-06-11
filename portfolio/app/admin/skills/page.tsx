"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Plus,
  Trash2,
  Loader2,
  GripVertical,
  Check,
  X,
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (res.ok) setSkills(data.skills ?? []);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSkills((prev) => [...prev, data.skill]);
        setNewName("");
      }
    } catch (err) {
      console.error("Failed to add skill:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSkills((prev) =>
          prev.map((s) => (s.id === id ? data.skill : s))
        );
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to update skill:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete skill:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary tracking-tight">
          Skills
        </h1>
        <p className="text-xs text-muted font-sans uppercase tracking-[0.3em] mt-2">
          {skills.length} skills
        </p>
      </div>

      {/* Add new skill */}
      <div className="border border-muted/10 p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="New skill name..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-primary font-sans placeholder:text-muted/40"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.25em] font-sans text-primary border border-primary/40 hover:bg-primary hover:text-background transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {adding ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
            Add
          </button>
        </div>
      </div>

      {/* Skills list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-muted animate-spin" />
        </div>
      ) : skills.length === 0 ? (
        <div className="border border-muted/10 p-12 text-center">
          <Layers className="w-8 h-8 text-muted/30 mx-auto mb-4" />
          <p className="text-sm text-muted font-sans">
            No skills yet. Add your first one above.
          </p>
        </div>
      ) : (
        <div className="border border-muted/10 divide-y divide-muted/10">
          <AnimatePresence>
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                className="group flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors duration-200"
              >
                <GripVertical className="w-4 h-4 text-muted/30 group-hover:text-muted/60 transition-colors duration-200 shrink-0 cursor-grab" />
                <span className="text-[10px] text-muted/50 font-sans w-6 shrink-0">
                  {index + 1}
                </span>

                {editingId === skill.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleUpdate(skill.id)
                      }
                      autoFocus
                      className="flex-1 bg-transparent border-b border-primary outline-none text-sm text-primary font-sans py-1"
                    />
                    <button
                      onClick={() => handleUpdate(skill.id)}
                      className="p-1 text-primary hover:text-primary transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-muted hover:text-primary transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span
                    className="flex-1 text-sm text-primary font-sans cursor-pointer"
                    onClick={() => {
                      setEditingId(skill.id);
                      setEditName(skill.name);
                    }}
                  >
                    {skill.name}
                  </span>
                )}

                {/* Order controls */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleDelete(skill.id)}
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
    </div>
  );
}
