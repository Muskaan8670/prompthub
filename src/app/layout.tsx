import React from "react";
import Sidebar from "./sidebar";
import { PromptProvider } from "./context";
import "./globals.css";

export const metadata = {
  title: "PromptHub - Internal AI Prompt Library",
  description: "Organize, save, search, and reuse your team's AI prompts efficiently.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-slate-900 bg-slate-50/50">
        <PromptProvider>
          <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
              {children}
            </main>
          </div>
        </PromptProvider>
      </body>
    </html>
  );
}
