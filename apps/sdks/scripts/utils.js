import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apiTypesPath = join(__dirname, "../api-types.ts");
const apiConfigPath = join(__dirname, "../api-config.ts");

export function toPascalCase(str) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

export function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
}

/**
 * Parse API config for resources
 */
export function parseApiConfig() {
  const content = readFileSync(apiConfigPath, "utf-8");
  const resourcesMatch = content.match(
    /export const API_RESOURCES[^=]*=\s*\[([\s\S]*?)\];/,
  );
  if (!resourcesMatch) return [];

  const resources = [];
  const resourceBlocks = resourcesMatch[1].split(/\},\s*\{/);

  for (const block of resourceBlocks) {
    const tableNameMatch = block.match(/tableName:\s*['"](\w+)['"]/);
    const enabledMatch = block.match(/enabled:\s*(true|false)/);
    const descriptionMatch = block.match(/description:\s*['"]([^'"]+)['"]/);
    const tagMatch = block.match(/tag:\s*['"]([^'"]+)['"]/);
    const idFieldMatch = block.match(/idField:\s*['"](\w+)['"]/);

    // Parse operations
    const operationsMatch = block.match(/operations:\s*\{([^}]+)\}/);
    const operations = {
      list: true,
      get: true,
      create: false,
      update: false,
      delete: false,
    };

    if (operationsMatch) {
      const opsContent = operationsMatch[1];
      const listMatch = opsContent.match(/list:\s*(true|false)/);
      const getMatch = opsContent.match(/get:\s*(true|false)/);
      const createMatch = opsContent.match(/create:\s*(true|false)/);
      const updateMatch = opsContent.match(/update:\s*(true|false)/);
      const deleteMatch = opsContent.match(/delete:\s*(true|false)/);

      if (listMatch) operations.list = listMatch[1] === "true";
      if (getMatch) operations.get = getMatch[1] === "true";
      if (createMatch) operations.create = createMatch[1] === "true";
      if (updateMatch) operations.update = updateMatch[1] === "true";
      if (deleteMatch) operations.delete = deleteMatch[1] === "true";
    }

    if (tableNameMatch && enabledMatch && enabledMatch[1] === "true") {
      resources.push({
        tableName: tableNameMatch[1],
        className: toPascalCase(tableNameMatch[1]),
        description: descriptionMatch ? descriptionMatch[1] : "",
        tag: tagMatch ? tagMatch[1] : tableNameMatch[1],
        idField: idFieldMatch ? idFieldMatch[1] : `${tableNameMatch[1]}_id`,
        operations,
      });
    }
  }
  return resources;
}

/**
 * Parse generated TS types to extract schema information
 */
export function parseSchema() {
  const content = readFileSync(apiTypesPath, "utf-8");

  const tables = {};
  const tableMatches = content.matchAll(
    /(\w+): \{\s*Row: \{([\s\S]*?)\};\s*Insert: \{([\s\S]*?)\};\s*Update: \{([\s\S]*?)\};/g,
  );

  for (const match of tableMatches) {
    const tableName = match[1];
    const rowContent = match[2];
    const insertContent = match[3];
    const updateContent = match[4];

    tables[tableName] = {
      row: parseFields(rowContent),
      insert: parseFields(insertContent),
      update: parseFields(updateContent),
    };
  }

  return { tables };
}

function parseFields(content) {
  const fields = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const match = line.match(/^\s*(\w+)(\??):\s*(.+);$/);
    if (match) {
      const fieldName = match[1];
      const isOptional = match[2] === "?";
      let type = match[3];

      // Clean up type
      type = type.replace(/\|\s*null/g, "").trim();

      // Check if it's an enum
      let isEnum = false;
      let enumName = null;
      if (type.includes("APIEnums[")) {
        const enumMatch = type.match(/APIEnums\["(\w+)"\]/);
        if (enumMatch) {
          isEnum = true;
          enumName = enumMatch[1];
          type = "enum";
        }
      }

      // Basic types
      if (type === "string") type = "string";
      else if (type === "number") type = "number";
      else if (type === "boolean") type = "boolean";
      else if (type.startsWith("Json")) type = "json";
      else if (type.endsWith("[]")) {
        // handle array
        type = "array";
      }

      fields.push({
        name: fieldName,
        type,
        isOptional: isOptional || line.includes("| null"),
        isEnum,
        enumName,
      });
    }
  }
  return fields;
}
