/**
 * Validate that a URL uses a safe protocol (http/https only).
 * Returns the URL string if valid, or null if invalid/dangerous.
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
    return null;
  } catch {
    // Allow relative URLs starting with /
    if (trimmed.startsWith("/")) return trimmed;
    return null;
  }
}

/**
 * Validate that a mapUrl is a safe iframe source (only Google Maps or similar).
 */
export function sanitizeMapUrl(url: string | null | undefined): string | null {
  const sanitized = sanitizeUrl(url);
  if (!sanitized) return null;
  try {
    const parsed = new URL(sanitized);
    const allowedHosts = [
      "www.google.com",
      "maps.google.com",
      "google.com",
      "www.google.co.kr",
      "maps.google.co.kr",
    ];
    if (allowedHosts.some((h) => parsed.hostname === h)) {
      return sanitized;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validate string fields: ensure type is string, trim, enforce max length.
 */
export function sanitizeString(
  value: unknown,
  maxLength: number = 5000
): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

/**
 * Validate integer fields.
 */
export function sanitizeInt(value: unknown, defaultVal: number = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return defaultVal;
}

/**
 * Validate boolean fields.
 */
export function sanitizeBool(value: unknown, defaultVal: boolean = false): boolean {
  if (typeof value === "boolean") return value;
  return defaultVal;
}

/**
 * Validate password complexity: minimum 8 characters.
 */
export function validatePassword(password: unknown): string | null {
  if (typeof password !== "string") return null;
  if (password.length < 8) return null;
  return password;
}

/**
 * Map of MIME types to their safe file extensions.
 */
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

export const ALLOWED_UPLOAD_TYPES = Object.keys(MIME_TO_EXT);

/**
 * Get safe file extension from MIME type (not from user-supplied filename).
 */
export function safeExtFromMime(mimeType: string): string | null {
  return MIME_TO_EXT[mimeType] || null;
}
