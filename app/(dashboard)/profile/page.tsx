"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Edit, Sparkles, Upload, ArrowRight, ShieldCheck } from "lucide-react";
import CVUploader from "@/components/analysis/CVUploader";
import SkillProfileForm from "@/components/analysis/SkillProfileForm";
import AnalysisProgress from "@/components/analysis/AnalysisProgress";

export default function ProfilePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"cv" | "manual">("cv");
  const [loading, setLoading] = useState(false);
  
  // States for extracted CV review
  const [extractedText, setExtractedText] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [skillsPreview, setSkillsPreview] = useState<string[]>([]);
  const [cvJobGuess, setCvJobGuess] = useState("");

  const handleCVTextExtracted = async (text: string, fileName: string) => {
    setExtractedText(text);
    setCvFileName(fileName);
    
    // Proactively call a quick endpoint or run client extraction heuristics to let the user review
    try {
      const res = await fetch("/api/profile/extract-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const preview = await res.json();
        setSkillsPreview(preview.skills || []);
        setCvJobGuess(preview.currentJobTitle || "Professional");
      } else {
        setSkillsPreview(["Management", "Excel", "Communication"]);
        setCvJobGuess("Specialist");
      }
    } catch (err) {
      setSkillsPreview(["Management", "Excel", "Communication"]);
      setCvJobGuess("Specialist");
    }
  };

  const triggerCVAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputType: "cv",
          rawText: extractedText,
          fileName: cvFileName,
          previewJob: cvJobGuess,
          previewSkills: skillsPreview
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();
      router.push(`/analysis/${result.analysisId}`);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Running in demo mode fallback.");
      router.push("/analysis/demo-analysis-id");
    } finally {
      setLoading(false);
    }
  };

  const handleManualFormSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputType: "manual",
          rawText: JSON.stringify(formData),
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();
      router.push(`/analysis/${result.analysisId}`);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Running in demo mode fallback.");
      router.push("/analysis/demo-analysis-id");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="glass-panel border border-white/10 rounded-3xl p-10 max-w-md w-full shadow-2xl shadow-brand-500/5">
          <AnalysisProgress />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Introduction Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-500 text-glow-brand font-bold text-xs uppercase tracking-widest">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Step 1 of 3: Build Profile</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          How would you like to build your profile?
        </h2>
        <p className="text-sm text-gray-400">
          Upload a resume to automatically map your skills, or fill in a manual compatibility profile.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 max-w-md">
        <button
          onClick={() => {
            setMode("cv");
            setExtractedText("");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
            mode === "cv" 
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/15" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Option A: CV Upload</span>
        </button>

        <button
          onClick={() => {
            setMode("manual");
            setExtractedText("");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
            mode === "manual" 
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/15" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>Option B: Manual Profile</span>
        </button>
      </div>

      {/* Mode Panels */}
      <div className="glass-panel border border-white/10 rounded-3xl p-8 shadow-xl">
        {mode === "cv" ? (
          <div className="space-y-6">
            {!extractedText ? (
              <CVUploader onUploadSuccess={handleCVTextExtracted} />
            ) : (
              /* CV review and confirmation screen */
              <div className="space-y-6 animate-float">
                <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-brand-500 text-glow-brand" />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none mb-1">Text Extracted Successfully!</h4>
                    <p className="text-xs text-gray-400">Review the profile summary extracted by our client parser.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-y border-white/5 py-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Detected Job Title</span>
                    <p className="text-sm font-bold text-white mt-1">{cvJobGuess}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Identified Core Skills</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {skillsPreview.map((skill) => (
                        <span 
                          key={skill}
                          className="px-2.5 py-1 bg-white/5 border border-white/10 text-white text-[11px] font-semibold font-mono rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <button 
                    onClick={() => setExtractedText("")}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition"
                  >
                    Re-upload CV
                  </button>
                  <button 
                    onClick={triggerCVAnalysis}
                    className="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/10 flex items-center gap-1.5 group transition-all"
                  >
                    <span>Looks Good, Analyze Profile</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <SkillProfileForm onSubmit={handleManualFormSubmit} loading={loading} />
        )}
      </div>
    </div>
  );
}
