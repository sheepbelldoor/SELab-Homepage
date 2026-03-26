export type Lang = "ko" | "en";
export const SUPPORTED_LANGS: Lang[] = ["ko", "en"];
export const DEFAULT_LANG: Lang = "ko";

/**
 * Pick the right field based on language.
 * Falls back to Korean if English field is empty.
 */
export function t<T extends Record<string, unknown>>(
  record: T,
  field: string,
  lang: Lang
): string {
  if (lang === "en") {
    const enField = `${field}En`;
    const enValue = record[enField] as string;
    if (enValue?.trim()) return enValue;
  }
  return (record[field] as string) || "";
}

/** Validate and return a supported lang, defaulting to "ko" */
export function parseLang(value: string): Lang {
  if (SUPPORTED_LANGS.includes(value as Lang)) return value as Lang;
  return DEFAULT_LANG;
}
