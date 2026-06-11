"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { getPublicClient } from "@/lib/supabase";

interface CredentialItem {
  label: string;
  value: string;
}

interface EducationItem {
  name: string;
  sub: string;
  location: string;
}

interface ProjectItem {
  name: string;
  description: string;
  stack: string[];
  url?: string | null;
  sort_order: number;
}

const defaultCredentialItems: CredentialItem[] = [
  { label: "Course", value: "AI Essentials and Prompt Mastery" },
  { label: "Issued By", value: "SIN School of AI — Dept. of AI & ML" },
  { label: "Accreditations", value: "EGAC (CAB 12203) · ISO 9001:2015 · IAF" },
  { label: "Signed By", value: "Er. Harshvardhan Purohit · Shiv Prakash Bohra" },
  { label: "Certificate ID", value: "48dca1eb-7d5a-4ea1-b498-043b5983b748" },
];

const defaultEducationItems: EducationItem[] = [
  {
    name: "St. Austin Sr. Sec. School",
    sub: "Commerce + Computer Science · Class 12 (Current)",
    location: "Jodhpur, Rajasthan, India",
  },
];

export default function WorkSection() {
  const [credentialItems, setCredentialItems] = useState<CredentialItem[]>(defaultCredentialItems);
  const [educationItems, setEducationItems] = useState<EducationItem[]>(defaultEducationItems);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getPublicClient();

        // Fetch credentials
        const { data: credData } = await supabase
          .from("site_sections")
          .select("content")
          .eq("section_key", "work_credentials")
          .single();

        if (credData && typeof credData === "object" && "content" in credData) {
          const content = (credData as { content: { items?: CredentialItem[] } }).content;
          if (content.items && content.items.length > 0) {
            setCredentialItems(content.items);
          }
        }

        // Fetch education
        const { data: eduData } = await supabase
          .from("site_sections")
          .select("content")
          .eq("section_key", "work_education")
          .single();

        if (eduData && typeof eduData === "object" && "content" in eduData) {
          const content = (eduData as { content: { items?: EducationItem[] } }).content;
          if (content.items && content.items.length > 0) {
            setEducationItems(content.items);
          }
        }

        // Fetch projects
        const { data: projData } = await supabase
          .from("projects")
          .select("name, description, stack, url, sort_order")
          .order("sort_order", { ascending: true });

        if (projData && projData.length > 0) {
          setProjects(projData as unknown as ProjectItem[]);
        } else {
          // Fallback default projects
          setProjects([
            {
              name: "Portfolio Website",
              stack: ["Next.js", "Tailwind CSS", "Framer Motion", "Supabase"],
              description:
                "This personal portfolio — built with Next.js 14, Framer Motion, and GSAP — showcasing my background, AI certification, and skills in a premium dark aesthetic.",
              sort_order: 1,
            },
            {
              name: "AI Prompt Engineering Practice",
              stack: ["ChatGPT", "Prompt Engineering", "Generative AI"],
              description:
                "Applied prompt crafting workflows for research, content generation, and productivity automation. Completed as part of the SIN School of AI certification curriculum.",
              sort_order: 2,
            },
            {
              name: "Commerce + CS Academic Projects",
              stack: ["MS Office", "Computer Science", "Accounting"],
              description:
                "Academic projects combining Commerce fundamentals with Computer Science applications, covering financial modeling, data handling, and presentation design.",
              sort_order: 3,
            },
          ]);
        }
      } catch {
        // Fallback to defaults
        setProjects([
          {
            name: "Portfolio Website",
            stack: ["Next.js", "Tailwind CSS", "Framer Motion", "Supabase"],
            description:
              "This personal portfolio — built with Next.js 14, Framer Motion, and GSAP — showcasing my background, AI certification, and skills in a premium dark aesthetic.",
            sort_order: 1,
          },
          {
            name: "AI Prompt Engineering Practice",
            stack: ["ChatGPT", "Prompt Engineering", "Generative AI"],
            description:
              "Applied prompt crafting workflows for research, content generation, and productivity automation. Completed as part of the SIN School of AI certification curriculum.",
            sort_order: 2,
          },
          {
            name: "Commerce + CS Academic Projects",
            stack: ["MS Office", "Computer Science", "Accounting"],
            description:
              "Academic projects combining Commerce fundamentals with Computer Science applications, covering financial modeling, data handling, and presentation design.",
            sort_order: 3,
          },
        ]);
      }
    };

    fetchData();
  }, []);

  return (
    <section id="work" className="relative w-full bg-background py-24">
      <div className="absolute top-0 w-full h-[1px] bg-muted/20" />
      <div className="max-w-7xl mx-auto px-8">

        {/* === CERTIFICATION === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <h2 className="font-serif text-6xl md:text-8xl font-bold text-primary mb-12 tracking-tight">
            Credentials
          </h2>

          <div className="group border border-[#1f1f1f] hover:border-primary/30 hover:bg-secondary transition-all duration-300 p-8 md:p-12">
            <div className="flex items-start gap-4 mb-8">
              <BadgeCheck className="text-primary mt-1 shrink-0 w-6 h-6" />
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-primary mb-1">
                  AI Essentials and Prompt Mastery Course
                </h3>
                <p className="text-sm text-muted font-sans uppercase tracking-widest">
                  SIN School of AI · SIN Education &amp; Technology Initiative
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#1f1f1f] pt-8">
              {credentialItems.map((item) => (
                <div key={item.label}>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted font-sans mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-accent font-sans font-light leading-relaxed">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* === EDUCATION === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <h2 className="font-serif text-6xl md:text-8xl font-bold text-primary mb-12 tracking-tight">
            Education
          </h2>

          <motion.div
            className="flex flex-col divide-y divide-[#1f1f1f]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {educationItems.map((edu, index) => (
              <motion.div
                key={edu.name}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] } },
                }}
                className="group flex flex-col md:flex-row items-start md:items-center gap-6 py-10 px-6 transition-all duration-300 hover:bg-secondary border-l-4 border-transparent hover:border-primary hover:scale-[1.01]"
              >
                <span className="font-serif text-6xl md:text-8xl font-light text-muted/30 group-hover:text-muted/50 transition-colors duration-300 leading-none select-none shrink-0 w-20 md:w-32">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl md:text-3xl text-primary mb-2">{edu.name}</h3>
                  <p className="text-sm text-accent font-sans font-light mb-1">{edu.sub}</p>
                  <p className="text-xs text-muted font-sans uppercase tracking-widest">{edu.location}</p>
                </div>
                <ArrowUpRight className="w-6 h-6 text-muted group-hover:text-primary group-hover:rotate-45 transition-all duration-300 shrink-0 ml-auto" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* === PROJECTS / WORK === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-serif text-6xl md:text-8xl font-bold text-primary mb-12 tracking-tight">
            Work
          </h2>

          <motion.div
            className="flex flex-col divide-y divide-[#1f1f1f]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] } },
                }}
                className="group flex flex-col md:flex-row items-start md:items-center gap-6 py-10 px-6 transition-all duration-300 hover:bg-secondary border-l-4 border-transparent hover:border-primary hover:scale-[1.01]"
              >
                <span className="font-serif text-6xl md:text-8xl font-light text-muted/30 group-hover:text-muted/50 transition-colors duration-300 leading-none select-none shrink-0 w-20 md:w-32">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl md:text-4xl text-primary group-hover:text-accent transition-colors duration-300 mb-3">
                    {project.name}
                  </h3>
                  <p className="font-sans text-sm text-muted font-light leading-relaxed max-w-xl mb-4">
                    {project.description}
                  </p>
                  {project.stack && project.stack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span key={tech} className="text-xs uppercase tracking-wider text-muted border border-[#333] px-3 py-1 font-sans">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    <ArrowUpRight className="w-8 h-8 text-muted group-hover:text-primary group-hover:rotate-45 transition-all duration-300 shrink-0 ml-auto" />
                  </a>
                ) : (
                  <ArrowUpRight className="w-8 h-8 text-muted group-hover:text-primary group-hover:rotate-45 transition-all duration-300 shrink-0 ml-auto" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
