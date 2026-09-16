import type { KomptoConfig } from "./config.js";
import { redactKomptoConfig } from "./config.js";
import type { KomptoCallResult } from "./client.js";
import {
  buildKomptoVerifyPayload,
  isKomptoPayloadError,
  type KomptoPayloadError,
  type KomptoVerifyPayload,
} from "./kompto.js";
import type {
  FneCertificationRecord,
  FnePlannerAction,
  MerchantInvoiceForFne,
} from "./types.js";
import { assertUnreachable } from "./types.js";

export type CertificationPlan = {
  action: FnePlannerAction;
  reason: string;
  record: FneCertificationRecord;
  verifyPayload: KomptoVerifyPayload | null;
};

export type CertificationApplyInput = {
  record: FneCertificationRecord;
  result: KomptoCallResult;
  nowIso: string;
};

function copyRecord(record: FneCertificationRecord): FneCertificationRecord {
  return { ...record };
}

export function emptyCertificationRecord(
  invoice: Pick<MerchantInvoiceForFne, "customerInvoiceId" | "organizationId">,
): FneCertificationRecord {
  return {
    localInvoiceId: invoice.customerInvoiceId,
    organizationId: invoice.organizationId,
    scope: "merchant_invoice",
    status: "not_requested",
    komptoInvoiceId: null,
    dgiIdentifier: null,
    qrPayload: null,
    pdfUrl: null,
    lastError: null,
    certifiedAt: null,
    period: null,
  };
}

export function isTerminalCertified(record: FneCertificationRecord): boolean {
  return (
    record.status === "certified" &&
    (record.dgiIdentifier !== null || record.komptoInvoiceId !== null)
  );
}

/**
 * Decide the next KOMPTO call. Dry-run never returns `confirm`.
 * Already-certified rows skip so we never double-submit to DGI.
 */
export function planMerchantInvoiceCertification(args: {
  config: KomptoConfig;
  invoice: MerchantInvoiceForFne;
  record: FneCertificationRecord | null;
  dryRun: boolean;
}): CertificationPlan | { error: KomptoPayloadError } {
  const record = args.record ?? emptyCertificationRecord(args.invoice);

  if (!args.config.enabled) {
    return {
      action: "blocked",
      reason: "fne_kompto_enabled is off.",
      record,
      verifyPayload: null,
    };
  }

  const payload = buildKomptoVerifyPayload(args.invoice);
  if (isKomptoPayloadError(payload)) {
    return { error: payload };
  }

  if (isTerminalCertified(record) || record.status === "voided") {
    return {
      action: "skip",
      reason: "Invoice already has an FNE certification id.",
      record,
      verifyPayload: payload,
    };
  }

  switch (record.status) {
    case "not_requested":
    case "failed":
    case "verify_pending":
      return {
        action: "verify",
        reason: "Verify with KOMPTO before any DGI submission.",
        record,
        verifyPayload: payload,
      };
    case "verified":
    case "confirm_pending":
      if (args.dryRun) {
        return {
          action: "skip",
          reason: "Dry-run does not call KOMPTO confirm.",
          record,
          verifyPayload: payload,
        };
      }
      if (record.komptoInvoiceId === null) {
        return {
          action: "verify",
          reason: "Verified row is missing komptoInvoiceId; re-verify.",
          record,
          verifyPayload: payload,
        };
      }
      if (record.status === "confirm_pending") {
        return {
          action: "refresh",
          reason:
            "Confirm may have been sent; refresh electronic invoice before retrying confirm.",
          record,
          verifyPayload: payload,
        };
      }
      return {
        action: "confirm",
        reason: "Verify succeeded; confirm submits to DGI.",
        record,
        verifyPayload: payload,
      };
    case "certified":
      return {
        action: "skip",
        reason: "Invoice already has an FNE certification id.",
        record,
        verifyPayload: payload,
      };
    default: {
      const unreachable: never = record.status;
      return assertUnreachable(unreachable, "FneCertificationStatus");
    }
  }
}

export function applyKomptoVerifyResult(
  input: CertificationApplyInput,
): FneCertificationRecord {
  const next = copyRecord(input.record);
  const parsed = input.result.parsed;
  next.status = "verified";
  next.lastError = null;
  if (parsed.komptoInvoiceId) next.komptoInvoiceId = parsed.komptoInvoiceId;
  if (parsed.dgiIdentifier) next.dgiIdentifier = parsed.dgiIdentifier;
  if (parsed.qrPayload) next.qrPayload = parsed.qrPayload;
  if (parsed.pdfUrl) next.pdfUrl = parsed.pdfUrl;
  return next;
}

export function applyKomptoConfirmResult(
  input: CertificationApplyInput,
): FneCertificationRecord {
  const next = copyRecord(input.record);
  const parsed = input.result.parsed;
  next.lastError = null;
  if (parsed.komptoInvoiceId) next.komptoInvoiceId = parsed.komptoInvoiceId;
  if (parsed.qrPayload) next.qrPayload = parsed.qrPayload;
  if (parsed.pdfUrl) next.pdfUrl = parsed.pdfUrl;
  if (parsed.dgiIdentifier) {
    next.dgiIdentifier = parsed.dgiIdentifier;
    next.status = "certified";
    next.certifiedAt = input.nowIso;
    return next;
  }
  next.status = "confirm_pending";
  return next;
}

export function applyKomptoFailure(
  record: FneCertificationRecord,
  message: string,
): FneCertificationRecord {
  const next = copyRecord(record);
  next.status = "failed";
  next.lastError = message;
  return next;
}

export function certificationLogContext(
  config: KomptoConfig,
  record: FneCertificationRecord,
): {
  flag: ReturnType<typeof redactKomptoConfig>;
  localInvoiceId: string;
  organizationId: string;
  status: FneCertificationRecord["status"];
  komptoInvoiceId: string | null;
} {
  return {
    flag: redactKomptoConfig(config),
    localInvoiceId: record.localInvoiceId,
    organizationId: record.organizationId,
    status: record.status,
    komptoInvoiceId: record.komptoInvoiceId,
  };
}
