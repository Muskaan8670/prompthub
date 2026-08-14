"use client";

import React, { useState } from "react";
import { usePrompts } from "../context";
import { FolderHeart } from "lucide-react";
import PromptCard from "../prompt-card";
import PromptModal from "../prompt-modal";
import PromptEditModal from "../prompt-edit-modal";

export default function FavoritesPage() {
  const { prompts, categories, toggleFavorite, deletePrompt, updatePrompt } = usePrompts();
  
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

  // Filter only favorites
  const favoritePrompts = prompts.filter((p) => p.isFavorite);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Starred Favorites
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Your bookmarked prompts for quick access and regular updates.
        </p>
      </div>

      {favoritePrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritePrompts.map((prompt) => (
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
        <div className="bg-white border border-dashed border-slate-350 rounded-3xl p-16 text-center max-w-lg mx-auto">
          <FolderHeart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800 text-base mb-1">No favorites saved yet</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Click the heart icon on any card inside the library to save it here for fast lookup.
          </p>
        </div>
      )}

      {/* Dialog Modals */}
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
