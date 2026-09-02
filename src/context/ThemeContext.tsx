"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeId =
  | "cosmic-dark"
  | "midnight-blue"
  | "aurora"
  | "rose-gold"
  | "emerald-elite"
  | "obsidian"
  | "ocean-depth"
  | "sunset-pro"
  | "arctic-light"
  | "neon-pulse";

export interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  dark: boolean;
  preview: string; // gradient for the preview swatch
  vars: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: "cosmic-dark",
    name: "Cosmic Dark",
    emoji: "🌌",
    dark: true,
    preview: "linear-gradient(135deg,#0f1117 0%,#1a1040 50%,#0d0d1a 100%)",
    vars: {
      "--background": "#0f1117",
      "--background-secondary": "#16181f",
      "--foreground": "#f8fafc",
      "--foreground-muted": "rgba(248,250,252,0.55)",
      "--primary": "#6366f1",
      "--primary-hover": "#4f46e5",
      "--primary-rgb": "99,102,241",
      "--secondary": "#ec4899",
      "--secondary-rgb": "236,72,153",
      "--accent": "#8b5cf6",
      "--accent-rgb": "139,92,246",
      "--card-bg": "rgba(255,255,255,0.04)",
      "--card-border": "rgba(255,255,255,0.09)",
      "--sidebar-bg": "rgba(15,17,23,0.95)",
      "--success": "#10b981",
      "--warning": "#f59e0b",
      "--error": "#ef4444",
      "--glow-1": "rgba(99,102,241,0.18)",
      "--glow-2": "rgba(236,72,153,0.18)",
      "--glow-pos-1": "15% 50%",
      "--glow-pos-2": "85% 30%",
      "--btn-gradient": "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)",
      "--btn-shadow": "0 4px 20px rgba(99,102,241,0.4)",
      "--btn-shadow-hover": "0 8px 30px rgba(99,102,241,0.6)",
      "--heading-gradient": "linear-gradient(90deg,#fff 0%,#a5b4fc 100%)",
      "--scrollbar-thumb": "rgba(255,255,255,0.12)",
      "--radius": "12px",
    },
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    emoji: "🌊",
    dark: true,
    preview: "linear-gradient(135deg,#020817 0%,#0c1a3a 50%,#051025 100%)",
    vars: {
      "--background": "#020817",
      "--background-secondary": "#0a1628",
      "--foreground": "#e2e8f0",
      "--foreground-muted": "rgba(226,232,240,0.55)",
      "--primary": "#3b82f6",
      "--primary-hover": "#2563eb",
      "--primary-rgb": "59,130,246",
      "--secondary": "#06b6d4",
      "--secondary-rgb": "6,182,212",
      "--accent": "#818cf8",
      "--accent-rgb": "129,140,248",
      "--card-bg": "rgba(59,130,246,0.05)",
      "--card-border": "rgba(59,130,246,0.15)",
      "--sidebar-bg": "rgba(2,8,23,0.97)",
      "--success": "#10b981",
      "--warning": "#f59e0b",
      "--error": "#ef4444",
      "--glow-1": "rgba(59,130,246,0.2)",
      "--glow-2": "rgba(6,182,212,0.15)",
      "--glow-pos-1": "20% 60%",
      "--glow-pos-2": "80% 20%",
      "--btn-gradient": "linear-gradient(135deg,#3b82f6 0%,#06b6d4 100%)",
      "--btn-shadow": "0 4px 20px rgba(59,130,246,0.4)",
      "--btn-shadow-hover": "0 8px 30px rgba(59,130,246,0.65)",
      "--heading-gradient": "linear-gradient(90deg,#fff 0%,#93c5fd 100%)",
      "--scrollbar-thumb": "rgba(59,130,246,0.25)",
      "--radius": "12px",
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    emoji: "🌈",
    dark: true,
    preview: "linear-gradient(135deg,#0d1b2a 0%,#1a2a1a 40%,#1a1040 100%)",
    vars: {
      "--background": "#0a1628",
      "--background-secondary": "#0f1e30",
      "--foreground": "#f0fdf4",
      "--foreground-muted": "rgba(240,253,244,0.55)",
      "--primary": "#34d399",
      "--primary-hover": "#10b981",
      "--primary-rgb": "52,211,153",
      "--secondary": "#818cf8",
      "--secondary-rgb": "129,140,248",
      "--accent": "#fb7185",
      "--accent-rgb": "251,113,133",
      "--card-bg": "rgba(52,211,153,0.05)",
      "--card-border": "rgba(52,211,153,0.12)",
      "--sidebar-bg": "rgba(10,22,40,0.97)",
      "--success": "#34d399",
      "--warning": "#f59e0b",
      "--error": "#f87171",
      "--glow-1": "rgba(52,211,153,0.18)",
      "--glow-2": "rgba(129,140,248,0.18)",
      "--glow-pos-1": "10% 40%",
      "--glow-pos-2": "90% 60%",
      "--btn-gradient": "linear-gradient(135deg,#34d399 0%,#818cf8 100%)",
      "--btn-shadow": "0 4px 20px rgba(52,211,153,0.4)",
      "--btn-shadow-hover": "0 8px 30px rgba(52,211,153,0.65)",
      "--heading-gradient": "linear-gradient(90deg,#fff 0%,#6ee7b7 100%)",
      "--scrollbar-thumb": "rgba(52,211,153,0.25)",
      "--radius": "12px",
    },
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    emoji: "🌹",
    dark: true,
    preview: "linear-gradient(135deg,#1a0a0f 0%,#2d1520 50%,#1a0a15 100%)",
    vars: {
      "--background": "#12080e",
      "--background-secondary": "#1e0d16",
      "--foreground": "#fdf2f8",
      "--foreground-muted": "rgba(253,242,248,0.55)",
      "--primary": "#f43f5e",
      "--primary-hover": "#e11d48",
      "--primary-rgb": "244,63,94",
      "--secondary": "#fb923c",
      "--secondary-rgb": "251,146,60",
      "--accent": "#c084fc",
      "--accent-rgb": "192,132,252",
      "--card-bg": "rgba(244,63,94,0.06)",
      "--card-border": "rgba(244,63,94,0.15)",
      "--sidebar-bg": "rgba(18,8,14,0.97)",
      "--success": "#10b981",
      "--warning": "#fb923c",
      "--error": "#f87171",
      "--glow-1": "rgba(244,63,94,0.2)",
      "--glow-2": "rgba(192,132,252,0.15)",
      "--glow-pos-1": "25% 45%",
      "--glow-pos-2": "75% 25%",
      "--btn-gradient": "linear-gradient(135deg,#f43f5e 0%,#c084fc 100%)",
      "--btn-shadow": "0 4px 20px rgba(244,63,94,0.45)",
      "--btn-shadow-hover": "0 8px 30px rgba(244,63,94,0.7)",
      "--heading-gradient": "linear-gradient(90deg,#fff 0%,#fda4af 100%)",
      "--scrollbar-thumb": "rgba(244,63,94,0.3)",
      "--radius": "12px",
    },
  },
  {
    id: "emerald-elite",
    name: "Emerald Elite",
    emoji: "💎",
    dark: true,
    preview: "linear-gradient(135deg,#022c22 0%,#064e3b 50%,#022c22 100%)",
    vars: {
      "--background": "#022c22",
      "--background-secondary": "#064e3b",
      "--foreground": "#ecfdf5",
      "--foreground-muted": "rgba(236,253,245,0.55)",
      "--primary": "#10b981",
      "--primary-hover": "#059669",
      "--primary-rgb": "16,185,129",
      "--secondary": "#fbbf24",
      "--secondary-rgb": "251,191,36",
      "--accent": "#34d399",
      "--accent-rgb": "52,211,153",
      "--card-bg": "rgba(16,185,129,0.06)",
      "--card-border": "rgba(16,185,129,0.18)",
      "--sidebar-bg": "rgba(2,44,34,0.97)",
      "--success": "#10b981",
      "--warning": "#fbbf24",
      "--error": "#f87171",
      "--glow-1": "rgba(16,185,129,0.2)",
      "--glow-2": "rgba(251,191,36,0.15)",
      "--glow-pos-1": "20% 50%",
      "--glow-pos-2": "80% 25%",
      "--btn-gradient": "linear-gradient(135deg,#10b981 0%,#fbbf24 100%)",
      "--btn-shadow": "0 4px 20px rgba(16,185,129,0.45)",
      "--btn-shadow-hover": "0 8px 30px rgba(16,185,129,0.7)",
      "--heading-gradient": "linear-gradient(90deg,#fff 0%,#6ee7b7 100%)",
      "--scrollbar-thumb": "rgba(16,185,129,0.3)",
      "--radius": "12px",
    },
  },
  {
    id: "obsidian",
    name: "Obsidian",
    emoji: "🖤",
    dark: true,
    preview: "linear-gradient(135deg,#000000 0%,#111111 50%,#0a0a0a 100%)",
    vars: {
      "--background": "#000000",
      "--background-secondary": "#0d0d0d",
      "--foreground": "#ffffff",
      "--foreground-muted": "rgba(255,255,255,0.5)",
      "--primary": "#ffffff",
      "--primary-hover": "#e5e5e5",
      "--primary-rgb": "255,255,255",
      "--secondary": "#a3a3a3",
      "--secondary-rgb": "163,163,163",
      "--accent": "#d4d4d4",
      "--accent-rgb": "212,212,212",
      "--card-bg": "rgba(255,255,255,0.04)",
      "--card-border": "rgba(255,255,255,0.08)",
      "--sidebar-bg": "rgba(0,0,0,0.99)",
      "--success": "#22c55e",
      "--warning": "#eab308",
      "--error": "#ef4444",
      "--glow-1": "rgba(255,255,255,0.04)",
      "--glow-2": "rgba(255,255,255,0.03)",
      "--glow-pos-1": "15% 50%",
      "--glow-pos-2": "85% 30%",
      "--btn-gradient": "linear-gradient(135deg,#1a1a1a 0%,#333 100%)",
      "--btn-shadow": "0 4px 20px rgba(255,255,255,0.15)",
      "--btn-shadow-hover": "0 8px 30px rgba(255,255,255,0.25)",
      "--heading-gradient": "linear-gradient(90deg,#fff 0%,#a3a3a3 100%)",
      "--scrollbar-thumb": "rgba(255,255,255,0.15)",
      "--radius": "12px",
    },
  },
  {
    id: "ocean-depth",
    name: "Ocean Depth",
    emoji: "🌊",
    dark: true,
    preview: "linear-gradient(135deg,#001429 0%,#002952 50%,#001d3d 100%)",
    vars: {
      "--background": "#001220",
      "--background-secondary": "#001e36",
      "--foreground": "#e0f2fe",
      "--foreground-muted": "rgba(224,242,254,0.55)",
      "--primary": "#0ea5e9",
      "--primary-hover": "#0284c7",
      "--primary-rgb": "14,165,233",
      "--secondary": "#22d3ee",
      "--secondary-rgb": "34,211,238",
      "--accent": "#7dd3fc",
      "--accent-rgb": "125,211,252",
      "--card-bg": "rgba(14,165,233,0.06)",
      "--card-border": "rgba(14,165,233,0.15)",
      "--sidebar-bg": "rgba(0,18,32,0.98)",
      "--success": "#10b981",
      "--warning": "#f59e0b",
      "--error": "#ef4444",
      "--glow-1": "rgba(14,165,233,0.2)",
      "--glow-2": "rgba(34,211,238,0.15)",
      "--glow-pos-1": "30% 60%",
      "--glow-pos-2": "70% 20%",
      "--btn-gradient": "linear-gradient(135deg,#0ea5e9 0%,#22d3ee 100%)",
      "--btn-shadow": "0 4px 20px rgba(14,165,233,0.45)",
      "--btn-shadow-hover": "0 8px 30px rgba(14,165,233,0.7)",
      "--heading-gradient": "linear-gradient(90deg,#fff 0%,#7dd3fc 100%)",
      "--scrollbar-thumb": "rgba(14,165,233,0.3)",
      "--radius": "12px",
    },
  },
  {
    id: "sunset-pro",
    name: "Sunset Pro",
    emoji: "🌅",
    dark: true,
    preview: "linear-gradient(135deg,#1a0a00 0%,#2d1500 50%,#200a10 100%)",
    vars: {
      "--background": "#130800",
      "--background-secondary": "#1f0e00",
      "--foreground": "#fff7ed",
      "--foreground-muted": "rgba(255,247,237,0.55)",
      "--primary": "#f97316",
      "--primary-hover": "#ea580c",
      "--primary-rgb": "249,115,22",
      "--secondary": "#fbbf24",
      "--secondary-rgb": "251,191,36",
      "--accent": "#fb923c",
      "--accent-rgb": "251,146,60",
      "--card-bg": "rgba(249,115,22,0.06)",
      "--card-border": "rgba(249,115,22,0.15)",
      "--sidebar-bg": "rgba(19,8,0,0.98)",
      "--success": "#10b981",
      "--warning": "#fbbf24",
      "--error": "#f87171",
      "--glow-1": "rgba(249,115,22,0.2)",
      "--glow-2": "rgba(251,191,36,0.15)",
      "--glow-pos-1": "25% 55%",
      "--glow-pos-2": "75% 25%",
      "--btn-gradient": "linear-gradient(135deg,#f97316 0%,#fbbf24 100%)",
      "--btn-shadow": "0 4px 20px rgba(249,115,22,0.45)",
      "--btn-shadow-hover": "0 8px 30px rgba(249,115,22,0.7)",
      "--heading-gradient": "linear-gradient(90deg,#fff 0%,#fdba74 100%)",
      "--scrollbar-thumb": "rgba(249,115,22,0.3)",
      "--radius": "12px",
    },
  },
  {
    id: "arctic-light",
    name: "Arctic Light",
    emoji: "❄️",
    dark: false,
    preview: "linear-gradient(135deg,#f8fafc 0%,#eff6ff 50%,#f0f9ff 100%)",
    vars: {
      "--background": "#f8fafc",
      "--background-secondary": "#ffffff",
      "--foreground": "#0f172a",
      "--foreground-muted": "rgba(15,23,42,0.55)",
      "--primary": "#6366f1",
      "--primary-hover": "#4f46e5",
      "--primary-rgb": "99,102,241",
      "--secondary": "#ec4899",
      "--secondary-rgb": "236,72,153",
      "--accent": "#8b5cf6",
      "--accent-rgb": "139,92,246",
      "--card-bg": "rgba(255,255,255,0.8)",
      "--card-border": "rgba(15,23,42,0.08)",
      "--sidebar-bg": "rgba(241,245,249,0.98)",
      "--success": "#059669",
      "--warning": "#d97706",
      "--error": "#dc2626",
      "--glow-1": "rgba(99,102,241,0.06)",
      "--glow-2": "rgba(236,72,153,0.06)",
      "--glow-pos-1": "15% 50%",
      "--glow-pos-2": "85% 30%",
      "--btn-gradient": "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)",
      "--btn-shadow": "0 4px 20px rgba(99,102,241,0.3)",
      "--btn-shadow-hover": "0 8px 30px rgba(99,102,241,0.5)",
      "--heading-gradient": "linear-gradient(90deg,#0f172a 0%,#6366f1 100%)",
      "--scrollbar-thumb": "rgba(99,102,241,0.2)",
      "--radius": "12px",
    },
  },
  {
    id: "neon-pulse",
    name: "Neon Pulse",
    emoji: "⚡",
    dark: true,
    preview: "linear-gradient(135deg,#050014 0%,#0a0024 50%,#050014 100%)",
    vars: {
      "--background": "#04000e",
      "--background-secondary": "#0a0020",
      "--foreground": "#f0e6ff",
      "--foreground-muted": "rgba(240,230,255,0.55)",
      "--primary": "#bf00ff",
      "--primary-hover": "#9900cc",
      "--primary-rgb": "191,0,255",
      "--secondary": "#00ffcc",
      "--secondary-rgb": "0,255,204",
      "--accent": "#ff00aa",
      "--accent-rgb": "255,0,170",
      "--card-bg": "rgba(191,0,255,0.06)",
      "--card-border": "rgba(191,0,255,0.2)",
      "--sidebar-bg": "rgba(4,0,14,0.98)",
      "--success": "#00ffcc",
      "--warning": "#ffcc00",
      "--error": "#ff4444",
      "--glow-1": "rgba(191,0,255,0.25)",
      "--glow-2": "rgba(0,255,204,0.2)",
      "--glow-pos-1": "20% 50%",
      "--glow-pos-2": "80% 30%",
      "--btn-gradient": "linear-gradient(135deg,#bf00ff 0%,#ff00aa 100%)",
      "--btn-shadow": "0 4px 20px rgba(191,0,255,0.5)",
      "--btn-shadow-hover": "0 8px 30px rgba(191,0,255,0.8)",
      "--heading-gradient": "linear-gradient(90deg,#fff 0%,#e879f9 100%)",
      "--scrollbar-thumb": "rgba(191,0,255,0.35)",
      "--radius": "12px",
    },
  },
];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (id: ThemeId) => void;
  themeId: ThemeId;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES[0],
  setTheme: () => {},
  themeId: "cosmic-dark",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>("cosmic-dark");

  useEffect(() => {
    const saved = localStorage.getItem("resumate-theme") as ThemeId | null;
    if (saved && THEMES.find((t) => t.id === saved)) {
      setThemeId(saved);
    }
  }, []);

  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    // Update body background glow
    document.body.style.backgroundImage = `
      radial-gradient(circle at ${theme.vars["--glow-pos-1"]}, ${theme.vars["--glow-1"]}, transparent 35%),
      radial-gradient(circle at ${theme.vars["--glow-pos-2"]}, ${theme.vars["--glow-2"]}, transparent 35%)
    `;
    document.body.style.backgroundColor = theme.vars["--background"];
    document.body.style.color = theme.vars["--foreground"];
    // Light/dark meta
    document.documentElement.setAttribute("data-theme", theme.dark ? "dark" : "light");
  }, [theme]);

  const setTheme = (id: ThemeId) => {
    setThemeId(id);
    localStorage.setItem("resumate-theme", id);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
