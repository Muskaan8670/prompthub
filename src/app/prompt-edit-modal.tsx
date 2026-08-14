"use client";

import React, { useState } from "react";
import { Prompt } from "./types";
import { 
  X, 
  Save, 
  Trash2, 
  AlertCircle 
} from "lucide-react";

interface PromptEditModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPrompt: Prompt) => void;
  categories: string[];
}

export default function PromptEditModal({
  prompt,
  isOpen,
  onClose,
  onSave,
  categories,
}: PromptEditModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Initialize values when prompt changes or opens
  React.useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setCategory(prompt.category);
      setTagsInput(prompt.tags.join(", "));
      setContent(prompt.content);
      setNotes(prompt.notes || "");
      setError("");
    }
  }, [prompt, isOpen]);

  if (!isOpen || !prompt) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category || !content.trim()) {
      setError("Title, Category, and Prompt Content are required.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    onSave({
      ...prompt,
      title: title.trim(),
      category,
      tags,
      content: content.trim(),
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col p-6 md:p-8 animate-fade-in z-50">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="font-extrabold text-xl text-slate-900 tracking-tight">
            Edit Prompt Template
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="py-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Prompt Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
              placeholder="e.g. Code Review Assistant"
            />
          </div>

          {/* Row: Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all bg-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
                placeholder="React, TypeScript, CSS"
              />
            </div>
          </div>

          {/* Prompt Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Prompt Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-mono transition-all leading-relaxed"
              placeholder="Paste or write your full prompt here..."
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Notes / Instructions (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
              placeholder="Any helpful tips or placeholders explanation..."
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-250 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-150 transition-all-300"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
