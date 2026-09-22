import { isJsonObject, isNumber, parseJson, readString } from "./json-value.js";

const CHART_OPEN = "```lomi-chart";
const MAX_CHART_POINTS = 8;

export type AssistantChartPoint = {
  label: string;
  value: number;
};

export type AssistantChart = {
  title?: string;
  unit?: string;
  points: AssistantChartPoint[];
};

export type AssistantTable = {
  headers: string[];
  rows: string[][];
};

export type AssistantRichBlock =
  | { type: "text"; content: string }
  | { type: "table"; table: AssistantTable }
  | { type: "chart"; chart: AssistantChart };

const pushText = (blocks: AssistantRichBlock[], content: string): void => {
  const trimmed = content.replace(/^\n/, "").replace(/\n$/, "");
  if (!trimmed.trim()) return;
  blocks.push({ type: "text", content: trimmed });
};

const parseChart = (raw: string): AssistantChart | undefined => {
  let parsed;
  try {
    parsed = parseJson(raw.trim());
  } catch {
    return undefined;
  }
  if (!isJsonObject(parsed) || !Array.isArray(parsed.points)) return undefined;
  const points: AssistantChartPoint[] = [];
  for (const point of parsed.points) {
    if (!isJsonObject(point)) continue;
    const label = readString(point, "label")?.trim();
    if (!label || !isNumber(point.value)) continue;
    points.push({ label: label.slice(0, 48), value: point.value });
    if (points.length >= MAX_CHART_POINTS) break;
  }
  if (points.length === 0) return undefined;
  const title = readString(parsed, "title")?.trim();
  const unit = readString(parsed, "unit")?.trim();
  return {
    title: title ? title.slice(0, 80) : undefined,
    unit: unit ? unit.slice(0, 16) : undefined,
    points,
  };
};

const splitCells = (line: string): string[] =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());

const isTableLine = (line: string): boolean => /^\s*\|.+\|\s*$/.test(line);

const isAsciiSpace = (ch: string): boolean =>
  ch === " " ||
  ch === "\t" ||
  ch === "\n" ||
  ch === "\r" ||
  ch === "\f" ||
  ch === "\v" ||
  ch === "\u00a0" ||
  ch === "\u1680" ||
  ch === "\u2028" ||
  ch === "\u2029" ||
  ch === "\u202f" ||
  ch === "\u205f" ||
  ch === "\u3000" ||
  ch === "\ufeff" ||
  (ch >= "\u2000" && ch <= "\u200a");

const isSeparatorBodyChar = (ch: string): boolean =>
  isAsciiSpace(ch) || ch === ":" || ch === "-";

/** Markdown table divider, scanned left to right so the check stays linear. */
const isSeparatorLine = (line: string): boolean => {
  let i = 0;
  const n = line.length;
  while (i < n && isAsciiSpace(line[i] ?? "")) i += 1;
  if (line[i] === "|") i += 1;
  const prefix = i;
  while (i < n && isSeparatorBodyChar(line[i] ?? "")) i += 1;
  if (i === prefix) return false;
  let groups = 0;
  while (line[i] === "|") {
    const afterPipe = i + 1;
    let j = afterPipe;
    while (j < n && isSeparatorBodyChar(line[j] ?? "")) j += 1;
    if (j === afterPipe) break;
    i = j;
    groups += 1;
  }
  if (groups < 1) return false;
  if (line[i] === "|") i += 1;
  while (i < n && isAsciiSpace(line[i] ?? "")) i += 1;
  return i === n;
};

const parseTable = (lines: string[]): AssistantTable | undefined => {
  const contentLines = lines.filter((line) => !isSeparatorLine(line));
  const headerLine = contentLines[0];
  if (!headerLine || contentLines.length < 2) return undefined;
  const headers = splitCells(headerLine);
  if (headers.length === 0) return undefined;
  const rows = contentLines.slice(1).map((line) => {
    const cells = splitCells(line);
    while (cells.length < headers.length) cells.push("");
    return cells.slice(0, headers.length);
  });
  if (rows.length === 0) return undefined;
  return { headers, rows };
};

/** Split prose into text and markdown tables. */
export const splitAssistantTables = (content: string): AssistantRichBlock[] => {
  const blocks: AssistantRichBlock[] = [];
  const lines = content.split("\n");
  let prose: string[] = [];
  let table: string[] = [];

  const flushProse = (): void => {
    pushText(blocks, prose.join("\n"));
    prose = [];
  };
  const flushTable = (): void => {
    const parsed = parseTable(table);
    if (parsed) blocks.push({ type: "table", table: parsed });
    else pushText(blocks, table.join("\n"));
    table = [];
  };

  for (const line of lines) {
    if (isTableLine(line) || (table.length > 0 && isSeparatorLine(line))) {
      if (prose.length > 0) flushProse();
      table.push(line);
      continue;
    }
    if (table.length > 0) flushTable();
    prose.push(line);
  }
  if (table.length > 0) flushTable();
  flushProse();
  return blocks;
};

/**
 * Split an assistant reply into text, markdown tables, and lomi-chart fences.
 * An unclosed chart fence is hidden so raw JSON does not flash while streaming.
 */
export const splitAssistantRichBlocks = (
  content: string,
): AssistantRichBlock[] => {
  const blocks: AssistantRichBlock[] = [];
  let rest = content;
  while (rest.length > 0) {
    const start = rest.indexOf(CHART_OPEN);
    if (start < 0) {
      blocks.push(...splitAssistantTables(rest));
      break;
    }
    blocks.push(...splitAssistantTables(rest.slice(0, start)));
    const afterOpen = rest.slice(start + CHART_OPEN.length);
    const fenceEnd = afterOpen.indexOf("```");
    if (fenceEnd < 0) break;
    const chart = parseChart(afterOpen.slice(0, fenceEnd));
    if (chart) blocks.push({ type: "chart", chart });
    rest = afterOpen.slice(fenceEnd + 3);
  }
  return blocks;
};
