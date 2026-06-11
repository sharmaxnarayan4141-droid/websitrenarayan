"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { getPublicClient } from "@/lib/supabase";

const defaultName = "Narayan Sharma";
const defaultSubtitle =
  "AI &amp; Prompt Engineering Enthusiast &nbsp;&middot;&nbsp; Commerce + CS Student &nbsp;&middot;&nbsp; Jodhpur, Rajasthan";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [heroContent, setHeroContent] = useState<{ name?: string; subtitle?: string } | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const supabase = getPublicClient();
        const { data } = await supabase
          .from("site_sections")
          .select("content")
          .eq("section_key", "hero")
          .single();
        if (data && typeof data === "object" && "content" in data) {
          setHeroContent((data as { content: { name?: string; subtitle?: string } }).content);
        }
      } catch {
        // Fallback to hardcoded content
      }
    };
    fetchHero();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms via Framer Motion (no GSAP needed)
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-5, -2]);

  const name = heroContent?.name ?? defaultName;
  const subtitle = heroContent?.subtitle ?? defaultSubtitle;
  const letters = Array.from(name);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 80, rotateX: -40 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] as const },
    },
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-background pt-20"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 w-full max-w-7xl px-8 flex flex-col items-center"
      >
        {/* Staggered Name */}
        <motion.div
          className="flex flex-wrap justify-center font-serif text-[clamp(3.5rem,9vw,110px)] leading-none text-primary mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {letters.map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className={char === " " ? "w-[clamp(0.8rem,2.5vw,2.5rem)]" : "inline-block"}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Profile Photo + PORTFOLIO overlap */}
        <div className="relative w-full flex justify-center items-center h-[280px] md:h-[420px] mt-4">

          {/* Photo — tilted, Framer Motion animated */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: -20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, rotate: -5, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ scale: imageScale, rotate: imageRotate }}
            className="absolute z-10 w-44 h-64 md:w-64 md:h-96 shadow-2xl"
          >
            {/* Glow behind photo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute inset-0 -z-10 blur-2xl scale-110 bg-white/5 rounded-sm"
            />
            <div className="relative w-full h-full overflow-hidden rounded-sm">
              <Image
                src="/assets/profile.jpg"
                alt="Narayan Sharma"
                fill
                className="object-cover object-top grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                priority
              />
              {/* Subtle dark gradient at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* "PORTFOLIO" text — overlapping */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: "easeOut" }}
            className="relative z-20 font-sans font-black text-[clamp(3rem,9vw,96px)] uppercase tracking-tighter select-none"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.15)",
              textShadow: "none",
              mixBlendMode: "screen",
            }}
          >
            PORTFOLIO
          </motion.h2>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-8 md:mt-12 text-[10px] md:text-xs tracking-[0.35em] uppercase text-muted text-center max-w-2xl"
        >
{subtitle}
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted font-sans">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-muted/50"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
