"use client";

import { useState, useEffect } from "react";
import {
  handleSupabaseRpcSoft,
  isJsonArray,
  isJsonObject,
  readString,
  validateJsonValue,
} from "@lomi./shared";
import { rpc } from "@lomi./queries/checkout-public";

interface CheckoutColors {
  payButtonBgColor: string;
}

type CheckoutPublicClient = Parameters<typeof rpc>[0];

export function useCheckoutColors(
  organizationId: string | null,
  supabase: CheckoutPublicClient,
) {
  const [colors, setColors] = useState<CheckoutColors>({
    payButtonBgColor: "#121317",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColors = async () => {
      if (!organizationId) {
        setColors({
          payButtonBgColor: "#121317",
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await handleSupabaseRpcSoft(
          rpc(supabase, "get_checkout_colors", {
            p_organization_id: organizationId,
          }),
          "get_checkout_colors",
        );

        const rows = data === null ? null : validateJsonValue(data);
        const first =
          rows !== null && isJsonArray(rows) && isJsonObject(rows[0])
            ? rows[0]
            : null;
        const color = first ? readString(first, "pay_button_bg_color") : undefined;
        setColors({
          payButtonBgColor: color || "#121317",
        });
      } catch (err) {
        console.warn("Error fetching checkout colors, using defaults:", err);
        setColors({
          payButtonBgColor: "#121317",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchColors();
  }, [organizationId, supabase]);

  return { colors, isLoading, error };
}
