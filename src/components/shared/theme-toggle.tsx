"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom hook to safely get mounted state
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/**
 * ThemeToggle Component
 * Button to toggle between light, dark, and system themes
 * Uses next-themes for theme management
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className={`h-5 w-5 transition-all duration-300 ${
          isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"
        } absolute`}
      />
      <Moon
        className={`h-5 w-5 transition-all duration-300 ${
          isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />
    </Button>
  );
}

/**
 * ThemeToggleDropdown Component
 * Dropdown menu with light, dark, and system options
 */
export function ThemeToggleDropdown() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Sun className="h-4 w-4 mr-2" />
        Tema
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("light")}
        className="text-xs"
      >
        <Sun className="h-4 w-4 mr-1" />
        Terang
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("dark")}
        className="text-xs"
      >
        <Moon className="h-4 w-4 mr-1" />
        Gelap
      </Button>
    </div>
  );
}
