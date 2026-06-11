"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Plus,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Save,
  X,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  sort_order: number;
  url: string | null;
  created_at: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // New project form
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStack, setNewStack] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStack, setEditStack] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Expanded view
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (res.ok) setProjects(data.projects ?? []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDesc.trim(),
          stack: newStack
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          url: newUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) => [...prev, data.project]);
        setNewName("");
        setNewDesc("");
        setNewStack("");
        setNewUrl("");
        setShowForm(false);
      }
    } catch (err) {
      console.error("Failed to add project:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDesc,
          stack: editStack
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          url: editUrl.trim() || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? data.project : p))
        );
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to update project:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditName(project.name);
    setEditDesc(project.description);
    setEditStack(project.stack.join(", "));
    setEditUrl(project.url ?? "");
    setExpandedId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary tracking-tight">
            Projects
          </h1>
          <p className="text-xs text-muted font-sans uppercase tracking-[0.3em] mt-2">
            {projects.length} projects
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] font-sans text-primary border border-primary/40 hover:bg-primary hover:text-background transition-all duration-200"
        >
          <Plus className="w-3 h-3" />
          {showForm ? "Cancel" : "Add Project"}
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-muted/10 p-6 overflow-hidden"
          >
            <div className="space-y-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Project Name *"
                className="w-full bg-transparent border-b border-muted/30 px-1 py-2 text-sm text-primary font-sans outline-none focus:border-primary transition-colors placeholder:text-muted/40"
              />
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description"
                rows={3}
                className="w-full bg-transparent border-b border-muted/30 px-1 py-2 text-sm text-primary font-sans outline-none focus:border-primary transition-colors placeholder:text-muted/40 resize-none"
              />
              <input
                type="text"
                value={newStack}
                onChange={(e) => setNewStack(e.target.value)}
                placeholder="Stack (comma-separated, e.g. Next.js, Tailwind CSS)"
                className="w-full bg-transparent border-b border-muted/30 px-1 py-2 text-sm text-primary font-sans outline-none focus:border-primary transition-colors placeholder:text-muted/40"
              />
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="URL (optional)"
                className="w-full bg-transparent border-b border-muted/30 px-1 py-2 text-sm text-primary font-sans outline-none focus:border-primary transition-colors placeholder:text-muted/40"
              />
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleAdd}
                  disabled={adding || !newName.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 text-[10px] uppercase tracking-[0.25em] font-sans text-primary border border-primary/40 hover:bg-primary hover:text-background transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {adding ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Plus className="w-3 h-3" />
                  )}
                  Create Project
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-muted animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="border border-muted/10 p-12 text-center">
          <Briefcase className="w-8 h-8 text-muted/30 mx-auto mb-4" />
          <p className="text-sm text-muted font-sans">
            No projects yet. Add your first one.
          </p>
        </div>
      ) : (
        <div className="border border-muted/10 divide-y divide-muted/10">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                className="group transition-colors duration-200"
              >
                {/* Collapsed view */}
                {editingId !== project.id && (
                  <div
                    className="flex items-center gap-4 px-4 py-4 hover:bg-secondary/30 cursor-pointer transition-colors duration-200"
                    onClick={() =>
                      setExpandedId(
                        expandedId === project.id ? null : project.id
                      )
                    }
                  >
                    <span className="text-[10px] text-muted/50 font-sans w-6 shrink-0">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm text-primary font-sans">
                      {project.name}
                    </span>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(project);
                        }}
                        className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 transition-all duration-200"
                        title="Edit"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        className="p-1.5 text-muted hover:text-red-400 hover:bg-red-900/20 transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {expandedId === project.id ? (
                      <ChevronUp className="w-4 h-4 text-muted shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                    )}
                  </div>
                )}

                {/* Expanded detail */}
                <AnimatePresence>
                  {expandedId === project.id && editingId !== project.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pl-14 space-y-3">
                        <p className="text-xs text-muted/60 font-sans leading-relaxed">
                          {project.description || "No description"}
                        </p>
                        {project.stack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.stack.map((tech) => (
                              <span
                                key={tech}
                                className="text-[10px] uppercase tracking-wider text-muted border border-muted/20 px-2 py-0.5 font-sans"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-primary/60 hover:text-primary uppercase tracking-wider font-sans transition-colors"
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Edit form */}
                {editingId === project.id && (
                  <div className="p-4 pl-14 space-y-4 bg-secondary/30">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Project Name"
                      className="w-full bg-transparent border-b border-primary px-1 py-2 text-sm text-primary font-sans outline-none placeholder:text-muted/40"
                    />
                    <textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Description"
                      rows={3}
                      className="w-full bg-transparent border-b border-muted/30 px-1 py-2 text-sm text-primary font-sans outline-none focus:border-primary transition-colors placeholder:text-muted/40 resize-none"
                    />
                    <input
                      type="text"
                      value={editStack}
                      onChange={(e) => setEditStack(e.target.value)}
                      placeholder="Stack (comma-separated)"
                      className="w-full bg-transparent border-b border-muted/30 px-1 py-2 text-sm text-primary font-sans outline-none focus:border-primary transition-colors placeholder:text-muted/40"
                    />
                    <input
                      type="url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="URL (optional)"
                      className="w-full bg-transparent border-b border-muted/30 px-1 py-2 text-sm text-primary font-sans outline-none focus:border-primary transition-colors placeholder:text-muted/40"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-2 px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] font-sans text-muted border border-muted/30 hover:border-muted transition-all duration-200"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(project.id)}
                        disabled={saving || !editName.trim()}
                        className="flex items-center gap-2 px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] font-sans text-primary border border-primary/40 hover:bg-primary hover:text-background transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Save className="w-3 h-3" />
                        )}
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
