"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Loader2,
  Save,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

interface Section {
  id: string;
  section_key: string;
  content: Record<string, unknown>;
  updated_at: string;
}

const sectionLabels: Record<string, string> = {
  hero: "Hero Section",
  about: "About Section",
  skills: "Skills Section",
  work_credentials: "Work - Credentials",
  work_education: "Work - Education",
};

function renderEditor(
  key: string,
  content: Record<string, unknown>,
  onChange: (val: Record<string, unknown>) => void
) {
  const handleChange = (field: string, value: string) => {
    onChange({
      ...content,
      [field]:
        field === "facts" || field === "items"
          ? value
            ? (() => { try { return JSON.parse(value); } catch { return []; } })()
            : []
          : value,
    });
  };

  if (key === "hero") {
    return (
      <div className="space-y-4">
        <Field
          label="Name"
          value={(content.name as string) || ""}
          onChange={(v) => handleChange("name", v)}
        />
        <Field
          label="Subtitle"
          value={(content.subtitle as string) || ""}
          onChange={(v) => handleChange("subtitle", v)}
        />
      </div>
    );
  }

  if (key === "about") {
    const facts = (content.facts as Array<{ label: string; value: string }>) ||
      [];
    return (
      <div className="space-y-4">
        <Field
          label="Intro"
          value={(content.intro as string) || ""}
          onChange={(v) => handleChange("intro", v)}
          multiline
        />
        <Field
          label="Bio"
          value={(content.bio as string) || ""}
          onChange={(v) => handleChange("bio", v)}
          multiline
        />
        <div>
          <p className="text-[10px] text-muted font-sans uppercase tracking-[0.25em] mb-2">
            Facts (JSON array)
          </p>
          <textarea
            value={JSON.stringify(facts, null, 2)}
            onChange={(e) => handleChange("facts", e.target.value)}
            rows={8}
            className="w-full bg-secondary border border-muted/20 px-3 py-2 text-xs text-primary font-mono outline-none focus:border-primary transition-colors resize-none"
          />
        </div>
      </div>
    );
  }

  if (key === "skills") {
    return (
      <Field
        label="Title"
        value={(content.title as string) || ""}
        onChange={(v) => handleChange("title", v)}
      />
    );
  }

  if (key === "work_credentials" || key === "work_education") {
    const items = (content.items as Array<Record<string, string>>) || [];
    return (
      <div className="space-y-4">
        <Field
          label="Title"
          value={(content.title as string) || ""}
          onChange={(v) => handleChange("title", v)}
        />
        <div>
          <p className="text-[10px] text-muted font-sans uppercase tracking-[0.25em] mb-2">
            Items (JSON array)
          </p>
          <textarea
            value={JSON.stringify(items, null, 2)}
            onChange={(e) => handleChange("items", e.target.value)}
            rows={8}
            className="w-full bg-secondary border border-muted/20 px-3 py-2 text-xs text-primary font-mono outline-none focus:border-primary transition-colors resize-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(content).map(([field, value]) => (
        <Field
          key={field}
          label={field}
          value={String(value)}
          onChange={(v) => handleChange(field, v)}
          multiline={String(value).length > 60}
        />
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
}) {
  const labelId = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label
        htmlFor={labelId}
        className="text-[10px] text-muted font-sans uppercase tracking-[0.25em] mb-1.5 block"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={labelId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-transparent border-b border-muted/30 px-1 py-2 text-sm text-primary font-sans outline-none focus:border-primary transition-colors resize-none"
        />
      ) : (
        <input
          id={labelId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-b border-muted/30 px-1 py-2 text-sm text-primary font-sans outline-none focus:border-primary transition-colors"
        />
      )}
    </div>
  );
}

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<
    Record<string, Record<string, unknown>>
  >({});
  const [saving, setSaving] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sections");
      const data = await res.json();
      if (res.ok) {
        setSections(data.sections ?? []);
        const content: Record<string, Record<string, unknown>> = {};
        for (const s of data.sections ?? []) {
          content[s.section_key] = s.content;
        }
        setEditedContent(content);
      }
    } catch (err) {
      console.error("Failed to fetch sections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSave = async (sectionKey: string) => {
    setSaving(sectionKey);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section_key: sectionKey,
          content: editedContent[sectionKey],
        }),
      });
      if (res.ok) {
        setSavedKey(sectionKey);
        setTimeout(() => setSavedKey(null), 2000);
        // Update sections list
        setSections((prev) =>
          prev.map((s) =>
            s.section_key === sectionKey
              ? { ...s, content: editedContent[sectionKey], updated_at: new Date().toISOString() }
              : s
          )
        );
      }
    } catch (err) {
      console.error("Failed to save section:", err);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-muted animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary tracking-tight">
          Sections
        </h1>
        <p className="text-xs text-muted font-sans uppercase tracking-[0.3em] mt-2">
          Edit portfolio section content
        </p>
      </div>

      {sections.length === 0 ? (
        <div className="border border-muted/10 p-12 text-center">
          <FileText className="w-8 h-8 text-muted/30 mx-auto mb-4" />
          <p className="text-sm text-muted font-sans">
            No sections found. Run the database migration.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => {
            const isExpanded = expanded === section.section_key;
            const label =
              sectionLabels[section.section_key] || section.section_key;

            return (
              <motion.div
                key={section.id}
                layout
                className="border border-muted/10"
              >
                {/* Header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : section.section_key)}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-secondary/30 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3 text-left">
                    <FileText className="w-4 h-4 text-muted shrink-0" />
                    <div>
                      <p className="text-sm text-primary font-sans font-medium">
                        {label}
                      </p>
                      <p className="text-[10px] text-muted font-sans">
                        {section.section_key}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted/50 font-sans">
                      {section.updated_at
                        ? new Date(section.updated_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : ""}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted" />
                    )}
                  </div>
                </button>

                {/* Expanded editor */}
                {isExpanded && (
                  <div className="border-t border-muted/10 p-4 pl-14 space-y-4">
                    {renderEditor(
                      section.section_key,
                      editedContent[section.section_key] || {},
                      (val) =>
                        setEditedContent((prev) => ({
                          ...prev,
                          [section.section_key]: val,
                        }))
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleSave(section.section_key)}
                        disabled={saving === section.section_key}
                        className="flex items-center gap-2 px-6 py-2.5 text-[10px] uppercase tracking-[0.25em] font-sans text-primary border border-primary/40 hover:bg-primary hover:text-background transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {saving === section.section_key ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : savedKey === section.section_key ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Save className="w-3 h-3" />
                        )}
                        {savedKey === section.section_key ? "Saved!" : "Save"}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
