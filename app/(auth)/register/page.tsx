"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Sparkles, User, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!terms) {
      setError("Please accept the terms and conditions to proceed.");
      setLoading(false);
      return;
    }

    try {
      // In NextAuth credentials provider config, we set up authorize() to auto-create the user
      // if they do not exist. Therefore, we can register them simply by signing them in!
      // This is a brilliant and highly convenient hackathon design shortcut.
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Registration failed. Please check credentials.");
      } else {
        // Successful login, redirect directly to profile setup onboarding!
        window.location.href = "/profile";
      }
    } catch (err) {
      setError("An unexpected registration error occurred.");
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

      {/* Register Card */}
      <div className="w-full max-w-md glass-panel border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-gray-400">Map your transferable skills to new career horizons</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold text-gray-500">Your Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-3">
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

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-500">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer text-[10px] font-semibold text-gray-400 hover:text-white transition">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-white/5 accent-brand-500 cursor-pointer"
            />
            <span>I accept the SkillBridge reskilling terms and conditions</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/40 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-1.5 transition group"
          >
            <span>{loading ? "Registering Account..." : "Register Account"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>


        <p className="text-center text-xs text-gray-500 pt-2">
          Already registered?{" "}
          <Link href="/login" className="text-brand-500 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
