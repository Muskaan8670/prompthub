"use client";

import React, { useState } from "react";
import { usePrompts } from "../context";
import { 
  RefreshCw, 
  Download, 
  Upload, 
  Plus, 
  X,
  Settings as SettingsIcon
} from "lucide-react";

export default function SettingsPage() {
  const { 
    categories, 
    addCategory, 
    deleteCategory, 
    resetToDefaults, 
    prompts,
    showToast
  } = usePrompts();

  const [newCat, setNewCat] = useState("");

  // Add custom category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim()) {
      const added = addCategory(newCat.trim());
      if (added) setNewCat("");
    }
  };

  // Export prompts database as JSON
  const handleExport = () => {
    const dataStr = JSON.stringify({ prompts, categories }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    // Create temp download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `prompthub-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Prompts database exported successfully!");
  };

  // Import prompts database from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.prompts && Array.isArray(parsed.prompts)) {
          localStorage.setItem("prompt_library_prompts", JSON.stringify(parsed.prompts));
          if (parsed.categories && Array.isArray(parsed.categories)) {
            localStorage.setItem("prompt_library_categories", JSON.stringify(parsed.categories));
          }
          showToast("Data imported successfully! Reloading page...", "success");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          showToast("Invalid backup file structure.", "error");
        }
      } catch (err) {
        showToast("Error parsing import file.", "error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Settings &amp; Preferences
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage taxonomies, import or export configurations, and customize data defaults.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Categories management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-indigo-650" />
                Manage Categories
              </h2>
              <p className="text-slate-550 text-xs mt-1">
                Create new labels to categorize prompts, or delete unused ones.
              </p>
            </div>

            {/* Add inline category */}
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="e.g. Code Review"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-indigo-150 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </form>

            {/* Categories list */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200/60"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => deleteCategory(cat)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Import / Export & Administration */}
        <div className="space-y-6">
          {/* Backup & Import */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Backup Data</h3>
            
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-250 text-slate-650 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              Export Database JSON
            </button>

            <div className="relative">
              <label
                htmlFor="import-file"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-indigo-100"
              >
                <Upload className="w-4 h-4" />
                Import Database JSON
              </label>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>

          {/* Reset Action */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-rose-800 text-sm">Danger Zone</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Resetting will clear custom categories &amp; templates, replacing them with the original sample prompt data.
            </p>
            <button
              onClick={() => {
                if (confirm("Reset everything to standard default sample prompts? All updates will be lost.")) {
                  resetToDefaults();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-100"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Default Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
