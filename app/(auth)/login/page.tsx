"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email address or password combination.");
      } else {
        // Successful login redirect
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 relative font-sans select-none">
      {/* Background ambient glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-500/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Brand logotype */}
      <Link href="/" className="flex items-center gap-2 mb-8 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center shadow-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg text-white">SkillBridge</span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-gray-400">Sign in to resume your active learning roadmap</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold text-gray-500">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold text-gray-500">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/40 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-1.5 transition group"
          >
            <span>{loading ? "Signing In..." : "Sign In with Email"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>


        <p className="text-center text-xs text-gray-500 pt-2">
          New to SkillBridge?{" "}
          <Link href="/register" className="text-brand-500 font-bold hover:underline">
            Start free
          </Link>
        </p>
      </div>
    </div>
  );
}
