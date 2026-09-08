import { pdf } from "@react-pdf/renderer";
import { ReceiptPdfDocument } from "./receipt-pdf-document";
import type { ReceiptDocumentData } from "./types";

export type { ReceiptDocumentData, ReceiptLineItem } from "./types";

function toPdfChunkBuffer(chunk: string | Uint8Array): Buffer {
  return Buffer.from(chunk);
}

/** Node-safe PDF bytes for Nest / MCP / CLI. Browser callers keep using toBlob. */
export async function renderReceiptPdfBuffer(
  data: ReceiptDocumentData,
): Promise<Buffer> {
  const instance = pdf(<ReceiptPdfDocument data={data} />);
  const result = await instance.toBuffer();
  if (Buffer.isBuffer(result)) {
    return result;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of result) {
    chunks.push(toPdfChunkBuffer(chunk));
  }
  return Buffer.concat(chunks);
}
