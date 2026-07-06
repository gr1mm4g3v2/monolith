"use client";

import React, { useState, useEffect } from "react";
import { createProject } from "@/app/actions";

export default function OnboardingOverlay() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createProject(name.trim(), desc.trim());
    } catch (err) {
      console.error("Failed to initialize project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-lg border border-zinc-800 bg-zinc-950 rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6 select-none animate-in zoom-in-95 duration-200">
        
        {/* Glow Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-purple-600/5 to-transparent pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col gap-1 text-center">
          <div className="inline-flex mx-auto items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl shadow-xl shadow-indigo-600/20 mb-3">
            M
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome to <span className="gradient-accent-text">Monolith</span>
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto mt-1">
            Let's initialize your workspace. Create your first project below to activate your AI development suite.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">First Project Name</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. My SaaS Product, Mobile App"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-zinc-900 border border-zinc-800/80 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Description (Optional)</label>
            <textarea
              disabled={isSubmitting}
              placeholder="Provide a brief summary of what you are planning to build..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 text-sm bg-zinc-900 border border-zinc-800/80 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!mounted || isSubmitting || !name.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:scale-[1.01] active:scale-[0.99] transition duration-200"
          >
            {isSubmitting ? "Initializing Workspace..." : "Initialize Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}
