import Link from "next/link";
import { Sparkles } from "lucide-react";
import Hero from "@/components/landing/Hero";
import SkillTeaser from "@/components/landing/SkillTeaser";
import HowItWorks from "@/components/landing/HowItWorks";
import CareerPreview from "@/components/landing/CareerPreview";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col font-sans select-none">
      {/* Navbar Header */}
      <header className="h-20 w-full px-6 md:px-12 flex items-center justify-between border-b border-white/5 relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            SkillBridge
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            Log In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-bold shadow-md shadow-brand-500/10 transition-colors"
          >
            Start Free
          </Link>
        </div>
      </header>

      {/* Landing Modules */}
      <main className="flex-grow">
        <Hero />
        <SkillTeaser />
        <HowItWorks />
        <CareerPreview />
        <Stats />
        <Testimonials />
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-dark-950/80">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-500/20 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-brand-500" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white/65">
              SkillBridge &copy; 2026
            </span>
          </div>
          
          <div className="flex gap-8 text-xs font-semibold text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
