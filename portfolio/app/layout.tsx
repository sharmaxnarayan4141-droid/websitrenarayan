import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/ui/Navbar";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Preloader from "@/components/ui/Preloader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Narayan Sharma | AI & Prompt Engineering Enthusiast",
  description:
    "Portfolio of Narayan Sharma — AI & Prompt Engineering Enthusiast, Commerce + CS student at St. Austin Sr. Sec. School, Jodhpur, Rajasthan. Certified by SIN School of AI.",
  keywords: [
    "Narayan Sharma",
    "Prompt Engineering",
    "AI Essentials",
    "Generative AI",
    "SIN School of AI",
    "Portfolio",
    "Jodhpur",
    "Rajasthan",
    "Commerce Computer Science",
  ],
  authors: [{ name: "Narayan Sharma" }],
  openGraph: {
    title: "Narayan Sharma | AI & Prompt Engineering Enthusiast",
    description:
      "Portfolio of Narayan Sharma — AI & Prompt Engineering Enthusiast, certified by SIN School of AI. Commerce + CS Student, Jodhpur, Rajasthan.",
    type: "website",
    locale: "en_IN",
    siteName: "Narayan Sharma Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Narayan Sharma | AI & Prompt Engineering Enthusiast",
    description:
      "Portfolio of Narayan Sharma — AI Enthusiast, certified in Prompt Engineering. Commerce + CS Student, Jodhpur, India.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cormorant.variable} font-sans bg-background text-primary antialiased`}
      >
        <Preloader />
        <SmoothScroll>
          <NoiseOverlay />
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
