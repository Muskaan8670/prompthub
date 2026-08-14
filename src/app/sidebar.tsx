"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrompts } from "./context";
import { 
  LayoutDashboard, 
  FolderHeart, 
  PlusCircle, 
  Settings, 
  BookOpen, 
  Terminal, 
  Sparkles,
  Menu,
  X
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { toast } = usePrompts();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Prompt Library", href: "/prompts", icon: BookOpen },
    { name: "Add Prompt", href: "/add-prompt", icon: PlusCircle },
    { name: "Favorites", href: "/favorites", icon: FolderHeart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 max-w-sm px-4 py-3 rounded-lg shadow-xl border bg-white border-slate-100 text-slate-900 animate-fade-in">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">PromptHub</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col md:h-screen
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-150">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-slate-900 leading-none tracking-tight">PromptHub</h1>
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-widest mt-1 block">Enterprise v1</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-indigo-50/70 text-indigo-600 shadow-sm shadow-indigo-50" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                `}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-105" : "group-hover:scale-105"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Info card at the bottom */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Storage Sync</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              All data is secure and synchronized to your local browser storage.
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for Mobile Navigation */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-xs md:hidden"
        />
      )}
    </>
  );
}
