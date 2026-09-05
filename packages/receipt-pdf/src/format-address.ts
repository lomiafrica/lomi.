import { formatOfficialAddressLines } from "@lomi./shared";
import type { ReceiptAddress } from "./types";

export function formatAddressLines(
  address: Pick<
    ReceiptAddress,
    "street" | "district" | "city" | "region" | "postalCode" | "country"
  >,
  locale?: string,
): string[] {
  return formatOfficialAddressLines(
    {
      street: address.street,
      district: address.district,
      city: address.city,
      region: address.region,
      postalCode: address.postalCode,
      country: address.country,
    },
    locale,
  );
}

export function formatContactLines(
  address: Pick<ReceiptAddress, "email" | "phone">,
): string[] {
  const lines: string[] = [];
  if (address.email?.trim()) lines.push(address.email.trim());
  if (address.phone?.trim()) lines.push(address.phone.trim());
  return lines;
}
