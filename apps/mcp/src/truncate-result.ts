import { mcpMaxResultCharsFromEnv } from "./env-config.js";

const TRUNCATION_FOOTER = "\n\n[truncated, use pagination or a narrower query]";

/**
 * Truncate tool output text when it exceeds the configured limit.
 */
export function truncateToolResultText(text: string): string {
  const max = mcpMaxResultCharsFromEnv();
  if (text.length <= max) return text;
  return `${text.slice(0, max)}${TRUNCATION_FOOTER}`;
}
