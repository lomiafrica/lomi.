import type { ReactNode } from "react";
import {
  formatCurrencyForReceipt,
  isGenericReceiptItemName,
} from "./format-utils";
import { HtmlRecordCard, HtmlRecordRow } from "./html-chrome";
import type { ReceiptDocumentData, ReceiptLayoutLabels } from "./types";

function truncateId(id: string, maxLength = 20): string {
  if (id.length <= maxLength) return id;
  return `${id.slice(0, maxLength)}…`;
}

export function ReceiptLayout({
  data,
  labels,
  actions,
  heading,
  dateLine,
}: {
  data: ReceiptDocumentData;
  labels: ReceiptLayoutLabels;
  actions?: ReactNode;
  heading?: ReactNode;
  dateLine?: string;
}) {
  const productItems = data.lineItems.filter((item) => !item.isFee);
  const itemNames = [
    ...new Set(
      productItems
        .map((item) => item.description)
        .filter((name) => name && !isGenericReceiptItemName(name)),
    ),
  ];
  const itemLabel =
    itemNames.length > 1
      ? (labels.items ?? labels.description)
      : (labels.item ?? labels.description);
  const itemValue =
    itemNames.length === 0
      ? null
      : itemNames.length === 1
        ? itemNames[0]
        : itemNames.join("\n");
  const quantity = productItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );
  const showQuantity =
    itemNames.length > 0 && (data.showQuantityAndPrice || quantity > 1);

  return (
    <HtmlRecordCard
      heading={heading ?? data.title}
      amount={formatCurrencyForReceipt(data.totalAmount, data.currency)}
      dateLine={dateLine}
      actions={actions}
    >
      <HtmlRecordRow
        label={labels.reference ?? labels.receiptId}
        value={truncateId(data.transactionId)}
      />
      {data.providerTransactionId ? (
        <HtmlRecordRow
          label={labels.transactionId}
          value={data.providerTransactionId}
        />
      ) : null}
      <HtmlRecordRow label={labels.paymentMethod} value={data.paymentMethod} />
      {data.isMerchantReceipt && data.to.name ? (
        <HtmlRecordRow
          label={labels.billedTo}
          value={
            <>
              {data.to.name}
              {data.to.email ? (
                <>
                  <br />
                  {data.to.email}
                </>
              ) : null}
            </>
          }
        />
      ) : null}
      {itemValue ? (
        <HtmlRecordRow
          label={itemLabel}
          value={
            productItems.length > 1 ? (
              <span className="whitespace-pre-line">{itemValue}</span>
            ) : (
              itemValue
            )
          }
        />
      ) : null}
      {showQuantity && quantity > 0 ? (
        <HtmlRecordRow label={labels.quantity} value={String(quantity)} />
      ) : null}
      {data.subscription ? (
        <>
          <HtmlRecordRow
            label={labels.plan ?? "Plan"}
            value={data.subscription.planName}
          />
          <HtmlRecordRow
            label={labels.nextBilling ?? "Next billing"}
            value={data.subscription.nextBillingDate}
          />
          <HtmlRecordRow
            label={labels.status ?? "Status"}
            value={data.subscription.status}
          />
        </>
      ) : null}
    </HtmlRecordCard>
  );
}
