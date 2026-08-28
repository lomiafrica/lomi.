/**
 * Deterministic dithered SVG placeholders (Vercel-style crisp pixels).
 * Pattern resolution (gridCells) is independent of display size so avatars
 * look identical whether rendered at 20px or 120px.
 */

const BAYER_8: readonly number[][] = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((value) => value / 64));

export interface DitherAvatarColors {
  background: string;
  foreground: string;
}

export interface DitherAvatarOptions {
  seed: string;
  /** Rendered width/height in CSS pixels (reference when not fluid) */
  size?: number;
  /** Logical pixel grid — lower values = bigger squares (Vercel uses 40 at 40px) */
  gridCells?: number;
  colors?: Partial<DitherAvatarColors>;
  /** SVG fills its positioned parent — parent must have explicit dimensions */
  fluid?: boolean;
}

function smoothstep(value: number): number {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

export function hashToUnitFloats(seed: string, count: number): number[] {
  const bytes = new Uint8Array(seed.length * 4 + 16);
  let offset = 0;

  for (let round = 0; round < 4; round++) {
    let hash = 2166136261 ^ round;
    for (let i = 0; i < seed.length; i++) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    bytes[offset++] = hash & 0xff;
    bytes[offset++] = (hash >>> 8) & 0xff;
    bytes[offset++] = (hash >>> 16) & 0xff;
    bytes[offset++] = (hash >>> 24) & 0xff;
  }

  const floats: number[] = [];
  for (let i = 0; i < count; i++) {
    const a = bytes[i * 2] ?? 0;
    const b = bytes[i * 2 + 1] ?? 0;
    floats.push(((a << 8) | b) / 65536);
  }
  return floats;
}

function hslToHex(h: number, s: number, l: number): string {
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = h / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

  let r = 0;
  let g = 0;
  let b = 0;

  if (huePrime < 1) {
    r = chroma;
    g = x;
  } else if (huePrime < 2) {
    r = x;
    g = chroma;
  } else if (huePrime < 3) {
    g = chroma;
    b = x;
  } else if (huePrime < 4) {
    g = x;
    b = chroma;
  } else if (huePrime < 5) {
    r = x;
    b = chroma;
  } else {
    r = chroma;
    b = x;
  }

  const match = lightness - chroma / 2;
  const toHex = (channel: number) =>
    Math.round((channel + match) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function seedToDitherColors(seed: string): DitherAvatarColors {
  const floats = hashToUnitFloats(seed, 4);
  const hueUnit = floats[0] ?? 0;
  const satUnit = floats[1] ?? 0;
  const lightUnit = floats[2] ?? 0;
  const accentUnit = floats[3] ?? 0;
  const hue = Math.round(hueUnit * 360);
  const saturation = 58 + Math.round(satUnit * 35);
  const backgroundLightness = 16 + Math.round(lightUnit * 10);
  const foregroundLightness = 54 + Math.round(accentUnit * 20);

  return {
    background: hslToHex(hue, saturation, backgroundLightness),
    foreground: hslToHex(
      hue,
      Math.max(40, saturation - 10),
      foregroundLightness,
    ),
  };
}

/** Higher-contrast palette for dark checkout panels (#121317, gray-800). */
export function seedToCheckoutDitherColors(seed: string): DitherAvatarColors {
  const floats = hashToUnitFloats(seed, 4);
  const hueUnit = floats[0] ?? 0;
  const satUnit = floats[1] ?? 0;
  const lightUnit = floats[2] ?? 0;
  const accentUnit = floats[3] ?? 0;
  const hue = Math.round(hueUnit * 360);
  const saturation = 52 + Math.round(satUnit * 30);
  const backgroundLightness = 34 + Math.round(lightUnit * 10);
  const foregroundLightness = 68 + Math.round(accentUnit * 16);

  return {
    background: hslToHex(hue, saturation, backgroundLightness),
    foreground: hslToHex(
      hue,
      Math.max(38, saturation - 8),
      foregroundLightness,
    ),
  };
}

function svgHexColor(value: string, fallback: string): string {
  return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : fallback;
}

function svgPathData(value: string): string {
  return value.replace(/[^MmHhVvLlZz0-9,.\s-]/g, "");
}

function resolveColors(
  seed: string,
  overrides?: Partial<DitherAvatarColors>,
): DitherAvatarColors {
  const derived = seedToDitherColors(seed);
  return {
    background: svgHexColor(overrides?.background ?? derived.background, derived.background),
    foreground: svgHexColor(overrides?.foreground ?? derived.foreground, derived.foreground),
  };
}

function buildPixelGrid(gridCells: number, seed: string): boolean[][] {
  const angleUnit = hashToUnitFloats(seed, 1)[0] ?? 0;
  const angle = angleUnit * Math.PI * 0.35;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const denom = Math.max(1, 2 * (gridCells - 1));

  const grid: boolean[][] = Array.from({ length: gridCells }, () =>
    Array.from({ length: gridCells }, () => false),
  );

  for (let y = 0; y < gridCells; y++) {
    for (let x = 0; x < gridCells; x++) {
      const nx = (x + 0.5) / gridCells - 0.5;
      const ny = (y + 0.5) / gridCells - 0.5;
      const diagonal = 1 - (x + y) / denom;
      const projection = nx * cosA + ny * sinA;
      const gradient = smoothstep(diagonal * 0.82 + projection * 0.18 + 0.08);
      const threshold = BAYER_8[y % 8]![x % 8]!;
      grid[y]![x] = threshold < gradient;
    }
  }

  return grid;
}

function encodeRow(y: number, row: boolean[]): string {
  const parts: string[] = [];
  let x = 0;
  let cursor = 0;

  while (x < row.length) {
    while (x < row.length && !row[x]) {
      x++;
    }
    if (x >= row.length) {
      break;
    }

    const runStart = x;
    while (x < row.length && row[x]) {
      x++;
    }
    const runLength = x - runStart;

    if (parts.length === 0) {
      parts.push(`M${runStart} ${y}h${runLength}`);
      cursor = x;
    } else {
      parts.push(`m${runStart - cursor} 0h${runLength}`);
      cursor = x;
    }
  }

  return parts.join("");
}

function encodeDitherPath(grid: boolean[][]): string {
  return grid.map((row, y) => encodeRow(y, row)).join("");
}

export function generateDitherAvatarSvg({
  seed,
  size = 40,
  gridCells = 40,
  colors: colorOverrides,
  fluid = false,
}: DitherAvatarOptions): string {
  const cells = Math.max(8, Math.min(gridCells, 64));
  const colors = resolveColors(seed, colorOverrides);
  const grid = buildPixelGrid(cells, seed);
  const pathData = svgPathData(encodeDitherPath(grid));
  const displaySize = Number.isFinite(size) ? Math.max(1, Math.round(size)) : 40;
  const dimensions = fluid
    ? `width="100%" height="100%"`
    : `width="${displaySize}" height="${displaySize}"`;

  return [
    `<svg ${dimensions} viewBox="0 0 ${cells} ${cells}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid slice">`,
    `<rect width="${cells}" height="${cells}" fill="${colors.background}"/>`,
    `<path fill="none" stroke="${colors.foreground}" stroke-width="1" transform="translate(0,0.5)scale(1)" d="${pathData}"/>`,
    `</svg>`,
  ].join("");
}

export function getDitherAvatarDataUri(options: DitherAvatarOptions): string {
  return `data:image/svg+xml,${encodeURIComponent(generateDitherAvatarSvg(options))}`;
}
