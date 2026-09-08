const NAMED_ENTITIES = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
} as const;

type NamedEntityKey = keyof typeof NAMED_ENTITIES;

function isNamedEntityKey(name: string): name is NamedEntityKey {
  return name === "nbsp" ||
    name === "amp" ||
    name === "lt" ||
    name === "gt" ||
    name === "quot" ||
    name === "apos";
}

function namedEntity(name: string): string | undefined {
  const key = name.toLowerCase();
  if (!isNamedEntityKey(key)) return undefined;
  return NAMED_ENTITIES[key];
}

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
      const named = namedEntity(body);
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
