"use client";

import type { SiteSettings } from "@/types/cms";
import { hexToRgb } from "@/lib/utils";

interface ThemeProviderProps {
  settings: SiteSettings;
  children: React.ReactNode;
}

export function ThemeProvider({ settings, children }: ThemeProviderProps) {
  const fontClass =
    settings.font_family === "mono" ? "font-mono" : "font-sans";

  return (
    <div
      className={fontClass}
      style={
        {
          "--primary-accent": settings.primary_accent,
          "--secondary-accent": settings.secondary_accent,
          "--background": settings.background_color,
          "--foreground": settings.text_color,
          "--card-fill": settings.card_fill,
          "--primary-rgb": hexToRgb(settings.primary_accent),
          "--secondary-rgb": hexToRgb(settings.secondary_accent),
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
