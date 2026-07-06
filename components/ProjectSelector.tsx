"use client";

import React, { useState, useRef, useEffect } from "react";
import { setActiveProject, createProject } from "@/app/actions";

interface Project {
  id: string;
  name: string;
  description: string | null;
}

interface ProjectSelectorProps {
  projects: Project[];
  activeProjectId: string | null;
}

export default function ProjectSelector({ projects, activeProjectId }: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (projectId: string) => {
    setIsOpen(false);
    await setActiveProject(projectId);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsSubmitting(true);
    try {
      await createProject(newProjectName.trim(), newProjectDesc.trim());
      setShowCreateModal(false);
      setNewProjectName("");
      setNewProjectDesc("");
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-3.5 py-2.5 rounded-lg border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-800/40 hover:border-zinc-700/60 transition flex items-center justify-between cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-700"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="p-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-zinc-200 truncate">
            {activeProject ? activeProject.name : "Select Project..."}
          </span>
        </div>
        <svg 
          className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 z-50 rounded-lg border border-zinc-850 bg-zinc-950/95 backdrop-blur-md shadow-2xl p-1.5 flex flex-col gap-0.5 animate-in fade-in duration-100">
          <div className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 px-2 py-1.5 border-b border-zinc-900 mb-1">
            Projects
          </div>
          
          <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
            {projects.map((project) => {
              const isSelected = project.id === activeProjectId;
              return (
                <button
                  key={project.id}
                  onClick={() => handleSelect(project.id)}
                  className={`w-full text-left px-2.5 py-2 rounded text-xs font-medium flex items-center justify-between transition ${
                    isSelected 
                      ? "bg-zinc-850 text-white" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                >
                  <span className="truncate mr-2">{project.name}</span>
                  {isSelected && (
                    <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-zinc-900 mt-1.5 pt-1.5">
            <button
              onClick={() => {
                setIsOpen(false);
                setShowCreateModal(true);
              }}
              className="w-full text-left px-2.5 py-2 rounded text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-zinc-900/40 transition flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Project</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal - Create Project */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md border border-zinc-800/80 bg-zinc-950 rounded-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-bold text-zinc-100 mb-1">Create New Project</h3>
            <p className="text-xs text-zinc-500 mb-5">Set up an isolated workspace for your app development.</p>

            <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Portfolio Website, E-commerce Bot"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-900/80 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Description (Optional)</label>
                <textarea
                  placeholder="What are you building?"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-zinc-900/80 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newProjectName.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition"
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
