"use client";

import React, { useState } from "react";
import { Prompt } from "./types";
import { 
  Copy, 
  Check, 
  Heart, 
  Trash2, 
  Edit, 
  Calendar, 
  ExternalLink 
} from "lucide-react";

interface PromptCardProps {
  prompt: Prompt;
  onView: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function PromptCard({
  prompt,
  onView,
  onEdit,
  onDelete,
  onToggleFavorite,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    // Standard system toast is triggered in the context, but let's have inline micro feedback too!
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(prompt.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div 
      onClick={() => onView(prompt)}
      className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-lg hover:shadow-slate-100 transition-all-300 duration-200 cursor-pointer flex flex-col justify-between h-full"
    >
      <div>
        {/* Top bar with category & favorite */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100/50">
            {prompt.category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prompt.id);
            }}
            className={`p-1.5 rounded-xl hover:bg-slate-50 transition-colors ${
              prompt.isFavorite ? "text-amber-500" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Heart className="w-5 h-5" fill={prompt.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 text-base mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {prompt.title}
        </h3>

        {/* Preview content */}
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4 h-12">
          {prompt.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {prompt.tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] font-medium text-slate-500 px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer details & action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* View Details */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(prompt);
            }}
            title="View Details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Copy Prompt */}
          <button
            onClick={handleCopy}
            title="Copy Prompt"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-indigo-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Edit */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(prompt);
            }}
            title="Edit Prompt"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Are you sure you want to delete this prompt?")) {
                onDelete(prompt.id);
              }
            }}
            title="Delete Prompt"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
