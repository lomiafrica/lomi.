import { getMcpResourceUrl } from "./oauth-introspection.js";

/** Dark plate with a small lomi. wordmark. The old figure mark is not the brand. */
export const CONNECTOR_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#121317"/><text x="64" y="72" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="18" font-weight="600" fill="#ffffff">lomi.</text></svg>';

export type ConnectorIcon = {
  src: string;
  mimeType: "image/png" | "image/svg+xml";
  sizes: ["128x128" | "any"];
};

function readConnectorOrigin(): string {
  try {
    return new URL(getMcpResourceUrl()).origin;
  } catch {
    return "https://mcp.lomi.africa";
  }
}

/** Absolute icon URLs advertised on initialize and the server card. */
export function connectorIcons(): ConnectorIcon[] {
  const origin = readConnectorOrigin();
  return [
    {
      src: `${origin}/icon.png`,
      mimeType: "image/png",
      sizes: ["128x128"],
    },
    {
      src: `${origin}/icon.svg`,
      mimeType: "image/svg+xml",
      sizes: ["any"],
    },
  ];
}

export function connectorIconPng(): Buffer {
  return Buffer.from(CONNECTOR_ICON_PNG_BASE64, "base64");
}

export const CONNECTOR_ICON_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAFKElEQVR4nO2cTU9dRRjH+xWcgftc7r308iZgMWra2IRAqqREN7SUF6F2hSVdqUljtFprX3ZK3KlJ46K2mlA3ol+gprZgWfEJWBRY1FQSL6SQsIBMM8ecyb3ea2pcMAPzm+S/YGbOycnz/O7/nDPnGQ4oLQZJtDE44PsCkAAAEAgOAATCLQAIhGcAIBAeAoFAeAsAAuE1EAiEdQAgEBaCgEBYCQQCYSkYCIRvAUAgfAwCAuFrIBAIn4OBQKgHAAKhIAQIhIogIBBKwoBAqAkEAqEoFAiEqmAgEMrCgUDYFwAEwsYQIBB2BgGBsDUMCIS9gUAgbA4FAmF3MBAI28MV29P5/wAqcgj4BxHafxIAIIBAqEiFA2j/SQCAAAKhIhUOoP0nAQACCISKVDiA9p8EAAggECpS4QDafxIAIIBAqEiFA2j/SQCAAAKhIhUOoP0nAQACCISKVDiA9p8EAAggECpS4QDafxIAIIBAqEiFA2j/SQCAAAKhIhUOoP0nAQD+QxBy+YPmxIlT3gOm9pmCdwDJ5s3CwoJJW1191vs1KS0mX2gyo6Pjifr6+r1fz74FoPFgs0t+SAB0d/e6a7pz51fv1wMAAGBwgF2EoCHXaPr730x09Gi3918yDvA/g/CcyphisdV0vvCiqatvqBizt5uOzi7T1tZZdZwdKza1Jio0NnlPZLQA2L8n3pk0Dx7Mm42NDfPkyYaZnZ0zExNnq+ZKtmA2NzedOjq7zL179925t7a2zLvvvZ/MPX36TDInbY8e/WFefuWIOxfPAAEA0NLabh4+XDL/1uyY/YWWA1DeFhcXax731dff1OxfX183GckBQAgOYO16eXnZPKstLS07a/8nALZZ1yj9VTK1WqlUSsbL28DAIACEAMDZyXOub2dnx4yPn0kSXZ9pMGNjbyd9aZucPFcTgJ9mfja67u/zzcz8UjF2/vwHSb8938rKiuu/cuUaAIQAwPz8vOv7/IupquOmpr5043Nzv9cE4PDhV938gYGTFUCV32rKz3Xz5i0ACAEAa89pO97/RtVx9vUsbaurqzUBaGlpd/N7e19z/WtraxXnunjxkhu79f0PABACAI8f/+n6Tg4OVR03MjLmxq2F1wKgueV5N7+n95jrt3ABQOAATE/fdn137/5Wddz92Vk3Pn37RwDQ+2wdoPwXm67HDw4Om1NDIwkQ5a2n59iuAKDrsqa945CT79jtawDsCt6NG9+ZZ7Xr179N5u4GAIe6Xqo4f/kaRKjaswCkunz5qtne3q5KvO1LX9lSAYDsPQAymZz58KOPnWrNyReKifV/eumzREPDoyaXL1bNs/BYKFJlGwpurK2tw/VfuPBJxXGv9x13Y8MjbyV9rXb+1WuJ7LJzAmtjs+uzssD5jt+eBwAJAACB4ABAINwCgEB4BgAC4SEQCIS3ACAQXgOBQFgHAAJhIQgIhJVAIBCWgoFA+BYABMLHICAQvgYCgfA5GAiEegAgEApCgECoCAICoSQMCISaQCAQikKBQKgKBgKhLFxRds6+ABU5BGwM0f6TAAABBEJFKhxA+08CAAQQCBWpcADtPwkAEEAgVKTCAbT/JABAAIFQkQoH0P6TAAABBEJFKhxA+08CAAQQCBWpcADtPwkAEEAgVKTCAbT/JABAAIFQkQoH0P6TAAABBEJFKhxA+08CAAQQCBWpcADtPwkAEEAgVKTCAbT/JABAAIFQkQoH0P6TAAABBEJFKhxA+08CAAQQCBWpcADtPwkAEEAgVKR6CoQ6BIGJIzZ9AAAAAElFTkSuQmCC";
