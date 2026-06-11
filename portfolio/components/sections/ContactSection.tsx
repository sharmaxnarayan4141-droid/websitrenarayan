"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.4 }}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 text-sm font-sans tracking-widest uppercase border ${
          type === "success"
            ? "border-primary/40 bg-secondary text-primary"
            : "border-red-900 bg-secondary text-red-400"
        }`}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
}

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  multiline,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;
  const baseClass =
    "w-full bg-transparent border-b border-[#333] focus:border-primary outline-none text-primary text-base font-sans font-light pt-5 pb-2 placeholder-transparent transition-colors duration-300 caret-primary resize-none";

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-0 font-sans text-xs uppercase tracking-[0.25em] transition-all duration-300 pointer-events-none ${
          isFloated ? "top-0 text-muted text-[10px]" : "top-4 text-muted/60 text-xs"
        }`}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          required={required}
          rows={4}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      )}
    </div>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      showToast("Message sent. I'll get back to you soon.", "success");
      setForm({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative w-full bg-background py-24 md:py-36">
      <div className="absolute top-0 w-full h-[1px] bg-muted/20" />
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="max-w-4xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <h2 className="font-serif text-6xl md:text-8xl font-bold text-primary tracking-tight leading-none mb-4">
            Let&apos;s Talk
          </h2>
          <svg viewBox="0 0 400 12" className="w-48 md:w-72 h-3 overflow-visible">
            <motion.path
              d="M0 6 Q25 0 50 6 Q75 12 100 6 Q125 0 150 6 Q175 12 200 6 Q225 0 250 6 Q275 12 300 6 Q325 0 350 6 Q375 12 400 6"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col gap-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FloatingInput
              id="contact-name"
              label="Name"
              value={form.name}
              onChange={(val) => setForm({ ...form, name: val })}
              required
            />
            <FloatingInput
              id="contact-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(val) => setForm({ ...form, email: val })}
              required
            />
          </div>
          <FloatingInput
            id="contact-message"
            label="Message"
            value={form.message}
            onChange={(val) => setForm({ ...form, message: val })}
            required
            multiline
          />

          <div>
            <button
              id="contact-submit"
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden border border-primary px-10 py-4 text-sm uppercase tracking-[0.25em] font-sans text-primary transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-primary translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
              <span className="relative group-hover:text-background transition-colors duration-500 ease-in-out flex items-center gap-3">
                {loading ? "Sending..." : (
                  <>Send Message <span className="group-hover:translate-x-1 transition-transform duration-300">→</span></>
                )}
              </span>
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
