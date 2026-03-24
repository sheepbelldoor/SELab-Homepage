export interface BibEntry {
  type: string; // article, inproceedings, etc.
  key: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi: string | null;
  url: string | null;
  pdfUrl: string | null;
  codeUrl: string | null;
  videoUrl: string | null;
}

/**
 * Parse a BibTeX string into an array of BibEntry objects.
 */
export function parseBibtex(input: string): BibEntry[] {
  const entries: BibEntry[] = [];
  // Match each @type{key, ... } block
  const entryRegex = /@(\w+)\s*\{([^,]*),/g;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(input)) !== null) {
    const type = match[1].toLowerCase();
    const key = match[2].trim();
    const startIdx = match.index + match[0].length;

    // Find the matching closing brace
    let depth = 1;
    let endIdx = startIdx;
    for (let i = startIdx; i < input.length && depth > 0; i++) {
      if (input[i] === "{") depth++;
      else if (input[i] === "}") depth--;
      if (depth === 0) endIdx = i;
    }

    const body = input.slice(startIdx, endIdx);
    const fields = parseFields(body);

    const title = cleanValue(fields["title"] || "");
    if (!title) continue;

    const authors = cleanValue(fields["author"] || "")
      .replace(/\s+and\s+/g, ", ");

    const venue =
      cleanValue(fields["journal"] || "") ||
      cleanValue(fields["booktitle"] || "");

    const yearStr = cleanValue(fields["year"] || "");
    const year = parseInt(yearStr, 10) || new Date().getFullYear();

    const doi = extractDoi(cleanValue(fields["doi"] || ""));
    const url = cleanValue(fields["url"] || "") || null;
    const pdfUrl = cleanValue(fields["pdf"] || "") || null;
    const codeUrl = cleanValue(fields["code"] || "") || null;
    const videoUrl = cleanValue(fields["video"] || "") || null;

    entries.push({
      type,
      key,
      title,
      authors,
      venue,
      year,
      doi,
      url,
      pdfUrl,
      codeUrl,
      videoUrl,
    });
  }

  return entries;
}

function parseFields(body: string): Record<string, string> {
  const fields: Record<string, string> = {};
  // Match field = value pairs
  const fieldRegex = /(\w+)\s*=\s*/g;
  let m: RegExpExecArray | null;

  while ((m = fieldRegex.exec(body)) !== null) {
    const fieldName = m[1].toLowerCase();
    const valueStart = m.index + m[0].length;
    const value = extractValue(body, valueStart);
    if (value !== null) {
      fields[fieldName] = value;
    }
  }

  return fields;
}

function extractValue(body: string, start: number): string | null {
  const ch = body[start];
  if (ch === "{") {
    // Brace-delimited value
    let depth = 1;
    let i = start + 1;
    for (; i < body.length && depth > 0; i++) {
      if (body[i] === "{") depth++;
      else if (body[i] === "}") depth--;
    }
    return body.slice(start + 1, i - 1);
  } else if (ch === '"') {
    // Quote-delimited value
    const end = body.indexOf('"', start + 1);
    if (end === -1) return null;
    return body.slice(start + 1, end);
  } else {
    // Bare value (number or month name)
    const end = body.indexOf(",", start);
    if (end === -1) return body.slice(start).trim();
    return body.slice(start, end).trim();
  }
}

function cleanValue(value: string): string {
  return value
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDoi(value: string): string | null {
  if (!value) return null;
  // If it's a full URL, extract just the DOI path or keep as URL
  const doiMatch = value.match(/(?:https?:\/\/doi\.org\/)?(.+)/);
  if (doiMatch) {
    const doi = doiMatch[1];
    return `https://doi.org/${doi}`;
  }
  return value;
}
