"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={["light", "dark"]}
      value={{ light: "light", dark: "dark" }}
      storageKey="u2p-theme"
    >
      {children}
    </ThemeProvider>
  );
}