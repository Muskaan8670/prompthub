"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Prompt } from "./types";

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

  // Helper to trigger UI success/error notification banners
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // 1. Initial Load: Fetch Prompts and Categories from API routes on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [promptsRes, categoriesRes] = await Promise.all([
          fetch("/api/prompts"),
          fetch("/api/categories")
        ]);

        if (promptsRes.ok && categoriesRes.ok) {
          const promptsData = await promptsRes.json();
          const categoriesData = await categoriesRes.json();
          setPrompts(promptsData);
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error("Failed to load initial backend details:", err);
      }
    }
    loadData();
  }, []);

  // 2. Create Prompt: HTTP POST to backend route
  const addPrompt = async (newPromptData: Omit<Prompt, "id" | "createdAt" | "isFavorite">) => {
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPromptData),
      });

      if (res.ok) {
        const createdPrompt = await res.json();
        setPrompts((prev) => [createdPrompt, ...prev]);
        showToast("Prompt added successfully!");
      } else {
        showToast("Failed to save prompt", "error");
      }
    } catch (err) {
      showToast("Error connecting to server", "error");
    }
  };

  // 3. Update Prompt Details: HTTP PUT to /api/prompts/[id]
  const updatePrompt = async (updatedPrompt: Prompt) => {
    try {
      const res = await fetch(`/api/prompts/${updatedPrompt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPrompt),
      });

      if (res.ok) {
        const saved = await res.json();
        setPrompts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
        showToast("Prompt updated successfully!");
      } else {
        showToast("Failed to update prompt", "error");
      }
    } catch (err) {
      showToast("Error connecting to server", "error");
    }
  };

  // 4. Delete Prompt: HTTP DELETE to /api/prompts/[id]
  const deletePrompt = async (id: string) => {
    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPrompts((prev) => prev.filter((p) => p.id !== id));
        showToast("Prompt deleted successfully!", "info");
      } else {
        showToast("Failed to delete prompt", "error");
      }
    } catch (err) {
      showToast("Error connecting to server", "error");
    }
  };

  // 5. Toggle Favorite Status: HTTP PUT to /api/prompts/[id] updating only isFavorite field
  const toggleFavorite = async (id: string) => {
    const target = prompts.find((p) => p.id === id);
    if (!target) return;

    const updatedFavoriteStatus = !target.isFavorite;

    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: updatedFavoriteStatus }),
      });

      if (res.ok) {
        const saved = await res.json();
        setPrompts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
        showToast(
          updatedFavoriteStatus ? "Added to favorites!" : "Removed from favorites!",
          "success"
        );
      }
    } catch (err) {
      showToast("Error toggling favorite", "error");
    }
  };

  // 6. Create Category: HTTP POST to /api/categories
  const addCategory = (categoryName: string): boolean => {
    const trimmed = categoryName.trim();
    if (!trimmed) return false;

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast("Category already exists!", "error");
      return false;
    }

    // Call API async, update state immediately for smooth UI feedback
    fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    }).then((res) => {
      if (res.ok) {
        setCategories((prev) => [...prev, trimmed]);
        showToast("Category added successfully!");
      } else {
        showToast("Failed to add category", "error");
      }
    });

    return true;
  };

  // 7. Delete Category: HTTP DELETE to /api/categories?name=[name]
  const deleteCategory = async (categoryName: string) => {
    try {
      const res = await fetch(`/api/categories?name=${encodeURIComponent(categoryName)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c !== categoryName));
        showToast("Category deleted successfully!", "info");
      } else {
        showToast("Failed to delete category", "error");
      }
    } catch (err) {
      showToast("Error connecting to server", "error");
    }
  };

  // 8. Reset Data to Defaults: HTTP POST to /api/reset
  const resetToDefaults = async () => {
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
      });

      if (res.ok) {
        // Trigger page reload to re-fetch defaults from backend
        showToast("Reset completed successfully! Reloading...", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showToast("Failed to reset database", "error");
      }
    } catch (err) {
      showToast("Error resetting database", "error");
    }
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
