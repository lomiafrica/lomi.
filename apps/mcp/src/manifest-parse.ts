import type { ToolsManifest } from "./manifest.js";
import {
  isJsonArray,
  isJsonObject,
  readNumber,
  type JsonValue,
} from "@lomi./shared";

export function parseManifest(data: JsonValue): ToolsManifest {
  if (!isJsonObject(data)) {
    throw new Error("Invalid tools-manifest.json");
  }
  const manifestVersion = readNumber(data, "manifestVersion");
  const tools = data.tools;
  if (manifestVersion !== 1 || !isJsonArray(tools)) {
    throw new Error("Invalid tools-manifest.json");
  }
  // SAFETY: Caller JSON matched ToolsManifest envelope (version 1 + tools array).
  return data as ToolsManifest;
}
