import { cn } from "@/shared/lib/utils/cn";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function getSystemTheme(): Exclude<ThemeMode, "system"> {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  const resolvedTheme = mode === "system" ? getSystemTheme() : mode;
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
}

function getStoredMode(): ThemeMode {
  const storedMode = localStorage.getItem(STORAGE_KEY);

  if (storedMode === "light" || storedMode === "dark" || storedMode === "system") {
    return storedMode;
  }

  return "system";
}

type ThemeSelectorProps = {
  className?: string;
};

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const [mode, setMode] = useState<ThemeMode>(() => getStoredMode());
  const { t } = useTranslation();

  const options: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: "light", label: t("theme.light"), icon: Sun },
    { value: "dark", label: t("theme.dark"), icon: Moon },
    { value: "system", label: t("theme.system"), icon: Monitor },
  ];

  useEffect(() => {
    applyTheme(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (mode === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handleSystemThemeChange);

    return () => {
      media.removeEventListener("change", handleSystemThemeChange);
    };
  }, [mode]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-border/70 bg-card/80 p-1 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70",
        className
      )}
    >
      {options.map(({ value, label, icon: Icon }) => {
        const active = mode === value;

        return (
          <button
            key={value}
            type="button"
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium transition-colors hover:cursor-pointer",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => setMode(value)}
            aria-pressed={active}
            title={label}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
