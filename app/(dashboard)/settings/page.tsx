"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Shield, Laptop, Bell, Trash2, CheckCircle, Save } from "lucide-react";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [preferredWorkType, setPreferredWorkType] = useState("remote");
  const [hoursPerWeekForLearning, setHoursPerWeekForLearning] = useState(8);
  const [targetSalaryMin, setTargetSalaryMin] = useState(450000);
  const [targetSalaryMax, setTargetSalaryMax] = useState(1200000);
  const [dailyReminders, setDailyReminders] = useState(true);

  // Fetch profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile-settings"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    }
  });

  // Load state when query resolves
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setCurrentJobTitle(profile.currentJobTitle || "");
      setLocation(profile.location || "");
      setPreferredWorkType(profile.preferredWorkType || "remote");
      setHoursPerWeekForLearning(profile.hoursPerWeekForLearning || 8);
      setTargetSalaryMin(profile.targetSalaryMin || 450000);
      setTargetSalaryMax(profile.targetSalaryMax || 1200000);
    }
  }, [profile]);

  // Update profile settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: any) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error("Failed to save updates");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile-settings"] });
      alert("Settings saved successfully!");
    }
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({
      name,
      currentJobTitle,
      location,
      preferredWorkType,
      hoursPerWeekForLearning,
      targetSalaryMin,
      targetSalaryMax
    });
  };

  const handleExportData = () => {
    if (!profile) return;
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `skillbridge-profile-${profile.email}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.")) {
      alert("Account deletion simulated. Under production, this triggers collection purging.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-mono">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Account & Preferences</h2>
        <p className="text-sm text-gray-400">Configure your personal information, study duration goals, and notification rules.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Inputs forms (Col span 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Personal profile */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <User className="w-4 h-4 text-brand-500" />
              <span>Personal Profile</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || ""}
                  className="w-full bg-white/5 border border-white/5 text-gray-600 rounded-xl px-4 py-2.5 text-xs cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Current Title</label>
                <input
                  type="text"
                  value={currentJobTitle}
                  onChange={(e) => setCurrentJobTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Reskilling Preferences */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <Laptop className="w-4 h-4 text-accent-500" />
              <span>Reskilling Goals</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Work Preference</label>
                <select
                  value={preferredWorkType}
                  onChange={(e) => setPreferredWorkType(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Study Availability</label>
                <select
                  value={hoursPerWeekForLearning}
                  onChange={(e) => setHoursPerWeekForLearning(parseInt(e.target.value))}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value={3}>2-4 hours/week</option>
                  <option value={8}>5-10 hours/week</option>
                  <option value={15}>10+ hours/week</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Target Minimum Salary</label>
                <input
                  type="number"
                  value={targetSalaryMin}
                  onChange={(e) => setTargetSalaryMin(parseInt(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Action widgets & save triggers (Col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Save Button Card */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
            <button
              type="submit"
              disabled={updateSettingsMutation.isPending}
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-brand-500/15 flex items-center justify-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              <span>{updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>

          {/* Connected Toggles */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <Bell className="w-4 h-4 text-yellow-500" />
              <span>Reminders</span>
            </h3>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-gray-300">Daily Study Push alerts</span>
              <input
                type="checkbox"
                checked={dailyReminders}
                onChange={(e) => setDailyReminders(e.target.checked)}
                className="w-8 h-4 bg-white/10 checked:bg-brand-500 rounded-full appearance-none cursor-pointer relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-4 border border-white/5"
              />
            </label>
          </div>

          {/* Privacy Export Delete */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <Shield className="w-4 h-4 text-red-500" />
              <span>Privacy & Exports</span>
            </h3>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleExportData}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition"
              >
                Export Profile (JSON)
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                className="w-full py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
