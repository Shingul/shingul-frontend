import { MAX_TITLE_LENGTH } from "./constants";

/**
 * Count words in a string
 */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Extract title from first line (up to MAX_TITLE_LENGTH chars or until newline)
 */
export function extractTitle(content: string): string {
  const firstLine = content.trim().split("\n")[0] || "";
  return firstLine.substring(0, MAX_TITLE_LENGTH).trim();
}

/**
 * Get the raw first line to check its length
 */
export function getFirstLine(content: string): string {
  return content.trim().split("\n")[0] || "";
}

/**
 * Extract description (everything after first line, or all if no newline)
 */
export function extractDescription(content: string): string {
  const lines = content.trim().split("\n");
  if (lines.length <= 1) return "";
  return lines.slice(1).join("\n").trim();
}
