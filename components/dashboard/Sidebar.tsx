"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  UserCircle, 
  Compass, 
  Map, 
  BookOpen, 
  Briefcase, 
  Settings, 
  LogOut,
  Sparkles
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile Setup", href: "/profile", icon: UserCircle },
  { name: "Career Explorer", href: "/careers", icon: Compass },
  { name: "90-Day Roadmaps", href: "/roadmap", icon: Map },
  { name: "Resources Library", href: "/resources", icon: BookOpen },
  { name: "Micro-Internships", href: "/internships", icon: Briefcase },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 fixed inset-y-0 left-0 z-20 flex flex-col glass-panel border-r border-white/10 bg-dark-950/80">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          SkillBridge
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-brand-500/25 text-white border border-brand-500/30 shadow-md shadow-brand-500/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-brand-500 text-glow-brand" : "text-gray-400 group-hover:text-white"}`} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Log out */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
