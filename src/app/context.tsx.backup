"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Prompt, DEFAULT_CATEGORIES, DEMO_PROMPTS } from "./types";

interface PromptContextType {
  prompts: Prompt[];
  categories: string[];
  addPrompt: (prompt: Omit<Prompt, "id" | "createdAt" | "isFavorite">) => void;
  updatePrompt: (updatedPrompt: Prompt) => void;
  deletePrompt: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addCategory: (category: string) => boolean;
  deleteCategory: (category: string) => void;
  resetToDefaults: () => void;
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export function PromptProvider({ children }: { children: React.ReactNode }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedPrompts = localStorage.getItem("prompt_library_prompts");
    const storedCategories = localStorage.getItem("prompt_library_categories");

    if (storedPrompts) {
      setPrompts(JSON.parse(storedPrompts));
    } else {
      setPrompts(DEMO_PROMPTS);
      localStorage.setItem("prompt_library_prompts", JSON.stringify(DEMO_PROMPTS));
    }

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem("prompt_library_categories", JSON.stringify(DEFAULT_CATEGORIES));
    }
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const addPrompt = (newPromptData: Omit<Prompt, "id" | "createdAt" | "isFavorite">) => {
    const newPrompt: Prompt = {
      ...newPromptData,
      id: "prompt-" + Date.now(),
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };
    const updated = [newPrompt, ...prompts];
    setPrompts(updated);
    localStorage.setItem("prompt_library_prompts", JSON.stringify(updated));
    showToast("Prompt added successfully!");
  };

  const updatePrompt = (updatedPrompt: Prompt) => {
    const updated = prompts.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p));
    setPrompts(updated);
    localStorage.setItem("prompt_library_prompts", JSON.stringify(updated));
    showToast("Prompt updated successfully!");
  };

  const deletePrompt = (id: string) => {
    const updated = prompts.filter((p) => p.id !== id);
    setPrompts(updated);
    localStorage.setItem("prompt_library_prompts", JSON.stringify(updated));
    showToast("Prompt deleted successfully!", "info");
  };

  const toggleFavorite = (id: string) => {
    const updated = prompts.map((p) => {
      if (p.id === id) {
        const nextFav = !p.isFavorite;
        showToast(nextFav ? "Added to favorites!" : "Removed from favorites!", "success");
        return { ...p, isFavorite: nextFav };
      }
      return p;
    });
    setPrompts(updated);
    localStorage.setItem("prompt_library_prompts", JSON.stringify(updated));
  };

  const addCategory = (categoryName: string): boolean => {
    const trimmed = categoryName.trim();
    if (!trimmed) return false;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast("Category already exists!", "error");
      return false;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    localStorage.setItem("prompt_library_categories", JSON.stringify(updated));
    showToast("Category added successfully!");
    return true;
  };

  const deleteCategory = (categoryName: string) => {
    const updated = categories.filter((c) => c !== categoryName);
    setCategories(updated);
    localStorage.setItem("prompt_library_categories", JSON.stringify(updated));
    showToast("Category deleted successfully!", "info");
  };

  const resetToDefaults = () => {
    setPrompts(DEMO_PROMPTS);
    setCategories(DEFAULT_CATEGORIES);
    localStorage.setItem("prompt_library_prompts", JSON.stringify(DEMO_PROMPTS));
    localStorage.setItem("prompt_library_categories", JSON.stringify(DEFAULT_CATEGORIES));
    showToast("Reset to sample data successfully!");
  };

  return (
    <PromptContext.Provider
      value={{
        prompts,
        categories,
        addPrompt,
        updatePrompt,
        deletePrompt,
        toggleFavorite,
        addCategory,
        deleteCategory,
        resetToDefaults,
        toast,
        showToast,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
}

export function usePrompts() {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("usePrompts must be used within a PromptProvider");
  }
  return context;
}
