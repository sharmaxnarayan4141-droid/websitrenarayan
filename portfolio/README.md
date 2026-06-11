# Narayan Sharma — Portfolio

A modern, minimal dark portfolio built with **Next.js 14**, **Framer Motion**, **GSAP**, **Lenis**, and **Supabase**.

---

## ✨ Features

- ⚡ Next.js 14 App Router + TypeScript
- 🎨 Tailwind CSS with custom dark palette (`#0a0a0a`)
- 🖱️ Custom lerp-smoothed cursor (dot + trailing ring)
- 🎬 Page preloader with NS monogram
- 📜 Lenis smooth scroll + GSAP ScrollTrigger parallax
- 📬 Contact form with Supabase backend + rate limiting (3/hr per IP)
- 🔠 Cormorant Garamond + Inter Google Fonts
- 🚀 Vercel-ready deployment config

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> Find these in: [Supabase Dashboard](https://app.supabase.com) → Your Project → Settings → API

### 4. Set up Supabase database

Run the SQL migration in your Supabase SQL Editor:

```bash
# Copy contents of lib/supabase_migration.sql and paste into:
# Supabase Dashboard → SQL Editor → New Query → Run
```

### 5. Add your profile image

Place your profile photo at:

```
public/assets/profile.jpg
```

### 6. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📦 Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Add the environment variables in your Vercel project dashboard under **Settings → Environment Variables**.

---

## 🗂️ Project Structure

```
portfolio/
├── app/
│   ├── api/contact/route.ts   # Contact form API with rate limiting
│   ├── globals.css            # Global styles + CSS variables
│   └── layout.tsx             # Root layout (fonts, providers)
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── WorkSection.tsx
│   │   ├── SkillsSection.tsx
│   │   └── ContactSection.tsx
│   └── ui/
│       ├── CustomCursor.tsx
│       ├── Navbar.tsx
│       ├── NoiseOverlay.tsx
│       ├── Preloader.tsx
│       ├── SmoothScroll.tsx
│       └── Footer.tsx
├── lib/
│   └── supabase_migration.sql
├── public/assets/             # Profile image goes here
├── .env.example
└── vercel.json
```

---

## 📄 License

MIT © 2025 Narayan Sharma
