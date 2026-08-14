"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePrompts } from "./context";
import { 
  Sparkles, 
  BookOpen, 
  FolderHeart, 
  Folders, 
  PlusCircle, 
  TrendingUp, 
  Terminal,
  Bookmark,
  Calendar
} from "lucide-react";
import PromptModal from "./prompt-modal";
import PromptEditModal from "./prompt-edit-modal";
import PromptCard from "./prompt-card";

export default function Dashboard() {
  const { prompts, categories, toggleFavorite, deletePrompt, updatePrompt } = usePrompts();
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Computed values
  const totalPrompts = prompts.length;
  const favoritePrompts = prompts.filter((p) => p.isFavorite).length;
  const totalCategories = categories.length;

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleView = (prompt: any) => {
    setSelectedPrompt(prompt);
    setIsViewOpen(true);
  };

  const handleEdit = (prompt: any) => {
    setSelectedPrompt(prompt);
    setIsEditOpen(true);
  };

  // Get 3 recently added prompts
  const recentPrompts = [...prompts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Get 3 favorite prompts
  const favoriteList = prompts.filter((p) => p.isFavorite).slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            Welcome to PromptHub <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
          </h1>
          <p className="text-indigo-200/80 text-sm mt-1.5 max-w-xl">
            Save, organize, search, and instantly reuse your AI prompts. Boost productivity across your favorite AI assistants.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/add-prompt"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-2xl text-sm transition-all shadow-md shadow-indigo-950/20"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            Add Prompt
          </Link>
          <Link
            href="/prompts"
            className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-800 text-white hover:bg-indigo-700/80 font-bold rounded-2xl text-sm transition-all border border-indigo-700 shadow-md shadow-indigo-950/10"
          >
            <BookOpen className="w-4.5 h-4.5" />
            View Library
          </Link>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Prompts */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Prompts</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{totalPrompts}</span>
          </div>
        </div>

        {/* Favorite Prompts */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-550">
            <FolderHeart className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Favorites</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{favoritePrompts}</span>
          </div>
        </div>

        {/* Categories Count */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Folders className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Categories</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{totalCategories}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recently Added & Favorite Quick-Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Recently Added */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Recently Added
            </h2>
            <Link href="/prompts" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {recentPrompts.length > 0 ? (
              recentPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={deletePrompt}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            ) : (
              <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 text-center text-slate-500 text-sm">
                No prompts available. Click &quot;Add Prompt&quot; above to create one.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Handpicked Favorites */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-500" />
              Starred Favorites
            </h2>
            <Link href="/favorites" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {favoriteList.length > 0 ? (
              favoriteList.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={deletePrompt}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            ) : (
              <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 text-center text-slate-500 text-sm">
                No starred favorites yet. Click the heart icon on any card to favorite it.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modals for view / edit */}
      <PromptModal
        prompt={selectedPrompt}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        onCopy={handleCopy}
        onToggleFavorite={toggleFavorite}
      />

      <PromptEditModal
        prompt={selectedPrompt}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={updatePrompt}
        categories={categories}
      />
    </div>
  );
}
