"use client";

import React, { useState } from "react";
import { usePrompts } from "../context";
import { Search, SlidersHorizontal, Heart, Sparkles } from "lucide-react";
import PromptCard from "../prompt-card";
import PromptModal from "../prompt-modal";
import PromptEditModal from "../prompt-edit-modal";

export default function PromptsPage() {
  const { prompts, categories, toggleFavorite, deletePrompt, updatePrompt } = usePrompts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals state
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

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

  // Filtered prompts
  const filteredPrompts = prompts.filter((prompt) => {
    // Search query match (title, content, tags)
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter match
    const matchesCategory =
      selectedCategory === "All" || prompt.category === selectedCategory;

    // Favorites only match
    const matchesFavorites = !showFavoritesOnly || prompt.isFavorite;

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Prompt Library
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Browse, filter, search, and manage all templates saved inside the organization.
        </p>
      </div>

      {/* Search, Filter bar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by title, keyword, tags..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-60">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm bg-white transition-all"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Favorites Filter toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border text-sm font-semibold transition-all ${
              showFavoritesOnly
                ? "bg-amber-50 border-amber-200 text-amber-700 shadow-sm"
                : "border-slate-250 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-amber-600 text-amber-600" : ""}`} />
            {showFavoritesOnly ? "Favorites Only" : "Filter Favorites"}
          </button>
        </div>
      </div>

      {/* Grid displays */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={deletePrompt}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-16 text-center max-w-xl mx-auto">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800 text-base mb-1">No templates found</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Try adjusting your keywords, switching categories, or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setShowFavoritesOnly(false);
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-md shadow-indigo-150"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Modal Dialogs */}
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
