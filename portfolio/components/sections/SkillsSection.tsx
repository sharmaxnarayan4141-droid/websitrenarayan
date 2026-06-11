"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPublicClient } from "@/lib/supabase";

const defaultSkills = [
  "Prompt Engineering",
  "AI Essentials",
  "Generative AI",
  "ChatGPT",
  "Computer Science",
  "Commerce",
  "Accounting",
  "Microsoft Office",
  "Canva",
  "Communication",
  "Problem Solving",
  "Research",
];

interface Skill {
  name: string;
  sort_order: number;
}

function MarqueeRow({ items, direction = "left" }: { items: string[]; direction?: "left" | "right" }) {
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  return (
    <div className="overflow-hidden w-full flex">
      <div className={`flex gap-3 ${animationClass} whitespace-nowrap shrink-0`}>
        {[...items, ...items, ...items].map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center px-4 py-1.5 text-xs uppercase tracking-widest font-sans text-primary border border-[#333] bg-background rounded-none whitespace-nowrap cursor-default transition-all duration-300 hover:border-white/40 hover:[box-shadow:0_0_8px_rgba(255,255,255,0.2)] hover:text-accent"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<string[]>(defaultSkills);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const supabase = getPublicClient();
        const { data } = await supabase
          .from("skills")
          .select("name, sort_order")
          .order("sort_order", { ascending: true });

        if (data && data.length > 0) {
          setSkills((data as unknown as Skill[]).map((s) => s.name));
        }
      } catch {
        // Fallback to default skills
      }
    };
    fetchSkills();
  }, []);

  const skillsRow2 = [...skills].reverse();

  return (
    <section id="skills" className="relative w-full bg-background py-24 overflow-hidden">
      <div className="absolute top-0 w-full h-[1px] bg-muted/20" />

      <div className="max-w-7xl mx-auto px-8 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative inline-block"
        >
          <h2 className="font-sans font-bold text-5xl md:text-7xl uppercase tracking-tight text-primary">
            Skills
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 left-0 w-full h-[2px] bg-primary origin-left"
          />
        </motion.div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <MarqueeRow items={skills} direction="left" />
        <MarqueeRow items={skillsRow2} direction="right" />
      </div>

      <style jsx global>{`
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-left { animation: marquee-left 25s linear infinite; }
        .animate-marquee-right { animation: marquee-right 25s linear infinite; }
      `}</style>
    </section>
  );
}
