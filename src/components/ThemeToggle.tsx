"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  floating?: boolean;
};

export const ThemeToggle = ({ floating = false }: ThemeToggleProps) => {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"dark" | "light">("dark");

  // Initialize from localStorage on mount
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("artroad_theme")) as
      | "dark"
      | "light"
      | null;
    const html = document.documentElement;
    if (saved === "light") {
      html.setAttribute("data-theme", "light");
      html.classList.remove("dark");
      html.classList.add("light");
      setMode("light");
    } else {
      html.setAttribute("data-theme", "dark");
      html.classList.remove("light");
      html.classList.add("dark");
      setMode("dark");
    }
    setMounted(true);
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    if (mode === "dark") {
      html.setAttribute("data-theme", "light");
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("artroad_theme", "light");
      setMode("light");
    } else {
      html.setAttribute("data-theme", "dark");
      html.classList.remove("light");
      html.classList.add("dark");
      localStorage.setItem("artroad_theme", "dark");
      setMode("dark");
    }
  };

  if (!mounted) return null;

  const Btn = (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--card)]/80 transition-colors"
    >
      {mode === "dark" ? (
        <Sun size={18} className="text-[var(--primary)]" />
      ) : (
        <Moon size={18} className="text-[var(--primary)]" />
      )}
    </button>
  );

  if (floating) {
    return (
      <div className="fixed bottom-6 right-6 z-[60]">
        {Btn}
      </div>
    );
  }

  return Btn;
};