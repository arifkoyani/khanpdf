"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { DarkModeSwitch } from 'react-toggle-dark-mode';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  const isDark = resolvedTheme === "dark";

  const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <DarkModeSwitch
      checked={isDark}
      onChange={toggleDarkMode}
      size={20}
      moonColor="white"
      sunColor="black"
      aria-label="Toggle dark mode"
      className="rounded-lg border border-border bg-background/60 p-1 hover:border-primary/50 transition-colors"
    />
  );
}