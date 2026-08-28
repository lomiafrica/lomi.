const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

function stripTags(input: string): string {
  let out = "";
  let inTag = false;
  for (const character of input) {
    if (character === "<") {
      inTag = true;
      continue;
    }
    if (character === ">") {
      inTag = false;
      continue;
    }
    if (!inTag) out += character;
  }
  return out;
}

function decodeEntities(input: string): string {
  let out = "";
  let index = 0;
  while (index < input.length) {
    const current = input[index];
    if (current !== "&") {
      out += current;
      index += 1;
      continue;
    }
    const end = input.indexOf(";", index + 1);
    if (end === -1 || end - index > 10) {
      out += current;
      index += 1;
      continue;
    }
    const body = input.slice(index + 1, end);
    if (body.startsWith("#")) {
      const code =
        body.startsWith("#x") || body.startsWith("#X")
          ? Number.parseInt(body.slice(2), 16)
          : Number.parseInt(body.slice(1), 10);
      out += Number.isFinite(code)
        ? String.fromCodePoint(code)
        : input.slice(index, end + 1);
    } else {
      const named = NAMED_ENTITIES[body.toLowerCase()];
      out += named ?? input.slice(index, end + 1);
    }
    index = end + 1;
  }
  return out;
}

export const stripHtml = (html: string | null | undefined): string => {
  if (!html) return "";

  const withBreaks = html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/div>/gi, " ")
    .replace(/<\/p>/gi, " ");

  return decodeEntities(stripTags(withBreaks)).replace(/\s+/g, " ").trim();
};
