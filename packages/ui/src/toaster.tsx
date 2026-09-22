import { Toaster as SileoToaster } from "sileo";

export type SileoThemeMode = "light" | "dark";

export type SileoToasterStylePreset = "dashboard" | "hosted";

type ToasterProps = {
  theme?: SileoThemeMode;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  offset?: number;
  stylePreset?: SileoToasterStylePreset;
};

function getDefaultOptions(
  theme: SileoThemeMode,
  _stylePreset: SileoToasterStylePreset,
) {
  const isDark = theme === "dark";
  // Text follows the toaster theme, not the document class. Sileo's own
  // dark fill is a light gray, so a dark toast must set its own dark fill
  // and light type or it shows up white on a dark page.
  const titleClass = isDark
    ? "text-white! normal-case!"
    : "text-zinc-950! normal-case!";
  const descriptionClass = isDark ? "text-white/70!" : "text-zinc-600!";
  const buttonClass = isDark
    ? "bg-white/10! hover:bg-white/15! text-white!"
    : "bg-black/5! hover:bg-black/10! text-zinc-950!";

  return {
    fill: isDark ? "#383838" : "#E5E7EB",
    roundness: 4,
    duration: 3000,
    styles: {
      title: titleClass,
      description: descriptionClass,
      badge: isDark ? "bg-white/10!" : "bg-black/5!",
      button: buttonClass,
    },
  };
}

export function Toaster({
  theme = "light",
  position = "top-right",
  offset = 20,
  stylePreset = "dashboard",
}: ToasterProps) {
  return (
    <SileoToaster
      theme={theme}
      position={position}
      offset={offset}
      options={getDefaultOptions(theme, stylePreset)}
    />
  );
}
