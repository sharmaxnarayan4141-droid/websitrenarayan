"use client";

import Link from "next/link";

const links = ["About", "Work", "Skills", "Contact"];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-40 px-8 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-serif text-xl font-bold tracking-widest uppercase text-primary">
          Narayan
        </Link>
        <ul className="flex gap-8 text-xs uppercase tracking-widest font-sans">
          {links.map((link) => (
            <li key={link}>
              <Link
                href={`#${link.toLowerCase()}`}
                className="relative group text-muted hover:text-primary transition-colors duration-300"
              >
                {link}
                {/* Underline slides in left-to-right */}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
