"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Check, AlertCircle, RefreshCw } from "lucide-react";

interface CVUploaderProps {
  onUploadSuccess: (extractedText: string, fileName: string) => void;
}

export default function CVUploader({ onUploadSuccess }: CVUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    if (uploadedFile.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB limit.");
      return;
    }

    setFile(uploadedFile);
    setError(null);
    setLoading(true);
    setProgress(10);

    // Simulate upload progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 80) {
          clearInterval(progressInterval);
          return 80;
        }
        return prev + 15;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        let errorMessage = "Failed to parse file. Please verify it is a valid PDF/TXT.";
        try {
          const errBody = await response.json();
          if (errBody.error) errorMessage = errBody.error;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const result = await response.json();
      onUploadSuccess(result.text, uploadedFile.name);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process resume.");
      setFile(null);
    } finally {
      setLoading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"]
    },
    maxFiles: 1,
  });

  return (
    <div className="w-full space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
          isDragActive 
            ? "border-brand-500 bg-brand-500/5" 
            : "border-white/10 hover:border-brand-500/50 hover:bg-white/5"
        }`}
      >
        <input {...getInputProps()} />
        
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-sm font-semibold text-white">Extracting CV Structure...</p>
            <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden mt-2 border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 font-mono">{progress}% Complete</span>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-accent-500/10 rounded-full text-accent-500 border border-accent-500/20">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">File Uploaded Successfully</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-white/5 border border-white/10 rounded-full text-gray-400">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">
              {isDragActive ? "Drop the resume here" : "Drag and drop your CV here"}
            </p>
            <p className="text-xs text-gray-500">
              Accepts PDF or plain text TXT files up to 5MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
