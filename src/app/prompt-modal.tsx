"use client";

import React, { useState } from "react";
import { Prompt } from "./types";
import { 
  X, 
  Copy, 
  Check, 
  Calendar, 
  Folder, 
  Tags, 
  FileText,
  Heart
} from "lucide-react";

interface PromptModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onCopy: (content: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function PromptModal({
  prompt,
  isOpen,
  onClose,
  onCopy,
  onToggleFavorite,
}: PromptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !prompt) return null;

  const handleCopy = () => {
    onCopy(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(prompt.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Modal Card Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col p-6 md:p-8 animate-fade-in z-50">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                <Folder className="w-3 h-3 mr-1" />
                {prompt.category}
              </span>
              <button
                onClick={() => onToggleFavorite(prompt.id)}
                className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors ${
                  prompt.isFavorite ? "text-amber-500" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Heart className="w-5 h-5" fill={prompt.isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
            <h2 className="font-extrabold text-xl md:text-2xl text-slate-900 tracking-tight leading-snug">
              {prompt.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body Info */}
        <div className="py-6 space-y-6 flex-1">
          {/* Tags */}
          <div className="flex items-start gap-2 text-slate-600">
            <Tags className="w-5 h-5 mt-0.5 text-slate-400 shrink-0" />
            <div className="flex flex-wrap gap-1.5">
              {prompt.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs font-medium text-slate-600 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-150"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Full Prompt Display Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" />
                Prompt Template
              </label>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all-300"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Template
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 md:p-6 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap select-all border border-slate-800 shadow-inner">
              {prompt.content}
            </div>
          </div>

          {/* Optional Notes */}
          {prompt.notes && (
            <div className="bg-amber-50/50 border border-amber-100/70 rounded-2xl p-4 md:p-5">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1.5">
                Usage Instructions / Notes
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {prompt.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Details */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-medium">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Created on {formattedDate}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
