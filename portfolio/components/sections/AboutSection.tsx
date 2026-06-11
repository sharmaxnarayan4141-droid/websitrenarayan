"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPublicClient } from "@/lib/supabase";

interface AboutContent {
  intro?: string;
  bio?: string;
  facts?: { label: string; value: string }[];
}

const defaultContent: AboutContent = {
  intro:
    "I'm Narayan Sharma — a Class 12 student studying Commerce with Computer Science at St. Austin Sr. Sec. School, Jodhpur, Rajasthan.",
  bio:
    "I am passionate about Artificial Intelligence and Prompt Engineering. I believe in the intersection of discipline and creativity — whether it is crafting precise prompts, building digital experiences, or solving real-world problems through technology.",
  facts: [
    { label: "Location", value: "Jodhpur, Rajasthan, India" },
    { label: "School", value: "St. Austin Sr. Sec. School" },
    { label: "Stream", value: "Commerce + Computer Science" },
    { label: "Focus", value: "AI & Prompt Engineering" },
  ],
};

function parseIntro(intro: string): React.ReactNode[] {
  // Split on key terms to italicize them
  const segments = intro.split(
    /(Narayan Sharma|Commerce with Computer Science|St\. Austin Sr\. Sec\. School, Jodhpur, Rajasthan)/g
  );
  // With regex capture groups in split, odd indices are the matched delimiters
  return segments.map((seg, i) =>
    i % 2 === 1
      ? <span key={i} className="text-primary italic">{seg}</span>
      : <span key={i}>{seg}</span>
  );
}

export default function AboutSection() {
  const [content, setContent] = useState<AboutContent>(defaultContent);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const supabase = getPublicClient();
        const { data } = await supabase
          .from("site_sections")
          .select("content")
          .eq("section_key", "about")
          .single();
        if (data && typeof data === "object" && "content" in data) {
          setContent((data as { content: AboutContent }).content);
        }
      } catch {
        // Fallback to default content
      }
    };
    fetchAbout();
  }, []);

  const { intro, bio, facts } = content;

  return (
    <section id="about" className="relative w-full bg-background text-primary py-24">
      <div className="absolute top-0 w-full h-[1px] bg-muted/20" />

      <div className="max-w-7xl mx-auto px-8 w-full flex flex-col md:flex-row items-start gap-12 md:gap-24">
        {/* Left: Large rotated ABOUT */}
        <div className="md:w-1/3 flex justify-center md:justify-end pt-4">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-sans font-bold text-7xl md:text-[120px] tracking-tighter uppercase text-muted/30 md:-rotate-90 origin-center md:origin-right whitespace-nowrap"
          >
            About
          </motion.h2>
        </div>

        {/* Right: Content */}
        <div className="md:w-2/3 flex flex-col justify-center max-w-2xl gap-8">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-serif text-2xl md:text-4xl leading-relaxed text-accent"
          >
            {parseIntro(intro ?? defaultContent.intro!)}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="font-sans text-base md:text-lg tracking-wide text-muted font-light leading-loose"
          >
            {bio || defaultContent.bio}
          </motion.p>

          {/* Quick Facts */}
          {((facts ?? defaultContent.facts)!.length ?? 0) > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="grid grid-cols-2 gap-x-8 gap-y-5 mt-4 border-t border-[#1a1a1a] pt-8"
            >
              {(facts ?? defaultContent.facts!).map((item) => (
                <div key={item.label}>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted font-sans mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-accent font-sans font-light">{item.value}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
