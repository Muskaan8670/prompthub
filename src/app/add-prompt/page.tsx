"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrompts } from "../context";
import { 
  PlusCircle, 
  Trash, 
  Sparkles, 
  FolderPlus,
  AlertCircle
} from "lucide-react";

export default function AddPromptPage() {
  const router = useRouter();
  const { addPrompt, categories, addCategory } = usePrompts();

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Category creation states
  const [newCatName, setNewCatName] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !category || !content.trim()) {
      setError("Please fill out all required fields: Title, Category, and Prompt Content.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    addPrompt({
      title: title.trim(),
      category,
      tags,
      content: content.trim(),
      notes: notes.trim() || undefined,
    });

    router.push("/prompts");
  };

  const handleClear = () => {
    setTitle("");
    setCategory("");
    setTagsInput("");
    setContent("");
    setNotes("");
    setError("");
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      const added = addCategory(newCatName.trim());
      if (added) {
        setCategory(newCatName.trim());
        setNewCatName("");
        setShowAddCat(false);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-3xl animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Add New Prompt
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Store a new AI prompt template. Employees will be able to search and copy it.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Prompt Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Prompt Title <span className="text-rose-550">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Generate SEO Blog Outline"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
            />
          </div>

          {/* Row: Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category dropdown & inline additions */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Category <span className="text-rose-550">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddCat(!showAddCat)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  New Category
                </button>
              </div>

              {!showAddCat ? (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm bg-white transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex gap-2 animate-fade-in">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="New category name..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-750 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCat(false);
                      setNewCatName("");
                    }}
                    className="px-3 py-2.5 bg-slate-100 text-slate-650 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, Frontend, Coding"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
              />
            </div>
          </div>

          {/* Prompt Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Prompt Content <span className="text-rose-550">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Act as a copywriter... [insert topic]"
              rows={8}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-mono transition-all leading-relaxed"
            />
            <span className="text-[11px] text-slate-450 block leading-tight">
              Tip: Use placeholders like [topic] or [language] so users know what inputs to customize.
            </span>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Recommended model: Claude 3.5 Sonnet, Temperature: 0.7"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
            />
          </div>

          {/* Footer action buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="px-5 py-3 rounded-2xl border border-slate-250 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-indigo-150 transition-all duration-250 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              Save Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
