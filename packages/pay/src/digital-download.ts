import { NextRequest, NextResponse } from "next/server";
import {
  isJsonObject,
  readBoolean,
  readString,
  validateJsonValue,
  type JsonValue,
} from "@lomi./shared";
import { rpc } from "@lomi./queries/checkout-public";

type ValidateDownloadResult = {
  valid?: boolean;
  error?: string;
  storage_path?: string;
  filename?: string;
  mime_type?: string | null;
  entitlement_id?: string;
};

type CheckoutPublicClient = Parameters<typeof rpc>[0] & {
  storage: {
    from: (bucket: string) => {
      createSignedUrl: (
        path: string,
        expires: number,
        options: { download: string },
      ) => Promise<{
        data: { signedUrl?: string } | null;
        error: unknown;
      }>;
    };
  };
};

function parseValidateDownloadResult(
  raw: JsonValue | null | undefined,
): ValidateDownloadResult | null {
  if (raw === null || raw === undefined) return null;
  const data = validateJsonValue(raw);
  if (!isJsonObject(data)) return null;
  return {
    valid: readBoolean(data, "valid"),
    error: readString(data, "error"),
    storage_path: readString(data, "storage_path"),
    filename: readString(data, "filename"),
    mime_type: readString(data, "mime_type") ?? null,
    entitlement_id: readString(data, "entitlement_id"),
  };
}

export function createDigitalDownloadHandler(
  createAdminClient: () => CheckoutPublicClient,
) {
  return async function handleDigitalDownload(
    request: NextRequest,
  ): Promise<NextResponse> {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { error: "Missing download token" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data: validationRaw, error: validateError } = await rpc(
      supabase,
      "validate_download_access_token",
      { p_token: token },
    );

    if (validateError) {
      console.error("validate_download_access_token failed:", validateError);
      return NextResponse.json(
        { error: "Invalid or expired download link" },
        { status: 403 },
      );
    }

    const validation = parseValidateDownloadResult(
      validationRaw === null || validationRaw === undefined
        ? null
        : validateJsonValue(validationRaw),
    );
    if (
      !validation?.valid ||
      !validation.storage_path ||
      !validation.filename
    ) {
      return NextResponse.json(
        { error: validation?.error ?? "Invalid or expired download link" },
        { status: 403 },
      );
    }

    const { error: recordError } = await rpc(
      supabase,
      "record_download_access",
      {
        p_token: token,
      },
    );

    if (recordError) {
      console.error("record_download_access failed:", recordError);
      return NextResponse.json(
        { error: "Failed to record download access" },
        { status: 500 },
      );
    }

    const { data: signed, error: signError } = await supabase.storage
      .from("product_deliverables")
      .createSignedUrl(validation.storage_path, 3600, {
        download: validation.filename,
      });

    if (signError || !signed?.signedUrl) {
      console.error("createSignedUrl failed:", signError);
      return NextResponse.json(
        { error: "Failed to generate download URL" },
        { status: 500 },
      );
    }

    return NextResponse.redirect(signed.signedUrl, 302);
  };
}
