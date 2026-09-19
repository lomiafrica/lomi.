import { Font } from "@react-pdf/renderer";

const INTER_FONT_SOURCES = [
  "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
  "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
  "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
] as const;

let fontsRegistered = false;
let fontsPrefetched = false;

function isAvailableFetch(
  value: typeof fetch | undefined,
): value is typeof fetch {
  return typeof value === "function";
}

export function registerReceiptFonts() {
  if (fontsRegistered) return;
  fontsRegistered = true;

  Font.register({
    family: "Inter",
    fonts: [
      { src: INTER_FONT_SOURCES[0], fontWeight: 400 },
      { src: INTER_FONT_SOURCES[1], fontWeight: 500 },
      { src: INTER_FONT_SOURCES[2], fontWeight: 600 },
    ],
  });

  Font.registerHyphenationCallback((word) => [word]);
}

/** Warm Inter in the HTTP cache before the first PDF blob so the viewer is not waiting on fonts. */
export function prefetchReceiptFonts() {
  registerReceiptFonts();
  if (fontsPrefetched) return;
  fontsPrefetched = true;
  const fetchImpl = globalThis.fetch;
  if (!isAvailableFetch(fetchImpl)) return;

  for (const href of INTER_FONT_SOURCES) {
    void fetchImpl(href, { mode: "cors", cache: "force-cache" });
  }
}
