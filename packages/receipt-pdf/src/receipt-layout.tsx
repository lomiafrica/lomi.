import type { ReactNode } from "react";
import {
  formatCurrencyForReceipt,
  formatReceiptItemTitle,
  formatReceiptLineDetail,
  isGenericReceiptItemName,
  isPlaceholderReceiptValue,
  receiptNamesMatch,
} from "./format-utils";
import { HtmlFiscalQr } from "./fiscal-qr";
import {
  HtmlOrgIdentity,
  HtmlRecordCard,
  HtmlRecordRow,
  HtmlValueBadge,
} from "./html-chrome";
import type { ReceiptDocumentData, ReceiptLayoutLabels } from "./types";

function truncateId(id: string, maxLength = 20): string {
  if (id.length <= maxLength) return id;
  return `${id.slice(0, maxLength)}…`;
}

export function ReceiptLayout({
  data,
  labels,
  actions,
  banner,
  contact,
  heading,
  identity,
  dateLine,
}: {
  data: ReceiptDocumentData;
  labels: ReceiptLayoutLabels;
  actions?: ReactNode;
  banner?: ReactNode;
  contact?: ReactNode;
  heading?: ReactNode;
  identity?: ReactNode;
  dateLine?: string;
}) {
  const productItems = data.lineItems.filter(
    (item) =>
      !item.isFee &&
      item.description &&
      !isGenericReceiptItemName(item.description),
  );
  const isMultiItem = productItems.length > 1;
  const singleItem = productItems[0];
  const planName = data.subscription?.planName;
  const hasRealPlan =
    Boolean(data.subscription) && !isPlaceholderReceiptValue(planName);
  const planAlreadyListed = productItems.some((item) =>
    receiptNamesMatch(item.description, planName),
  );
  const itemLabel = isMultiItem
    ? (labels.items ?? labels.description)
    : data.subscription && (productItems.length === 0 || planAlreadyListed)
      ? (labels.plan ?? "Plan")
      : (labels.item ?? labels.description);
  const showPlanRow =
    hasRealPlan && productItems.length > 0 && !planAlreadyListed;
  const nextBilling = data.subscription?.nextBillingDate;
  const showNextBilling =
    Boolean(data.subscription) &&
    !data.amountHint &&
    !isPlaceholderReceiptValue(nextBilling);

  return (
    <HtmlRecordCard
      identity={
        identity ?? (
          <HtmlOrgIdentity name={data.from.name} logoUrl={data.logoUrl} />
        )
      }
      heading={heading ?? data.title}
      amount={
        data.subscription?.isTrial
          ? (labels.trial ?? "Trial")
          : data.isFree
            ? (labels.free ?? "Free")
            : formatCurrencyForReceipt(data.totalAmount, data.currency)
      }
      amountHint={data.amountHint}
      dateLine={dateLine}
      actions={actions}
      banner={banner}
      contact={contact}
    >
      {data.transactionId ? (
        <HtmlRecordRow
          label={labels.reference ?? labels.receiptId}
          value={truncateId(data.transactionId)}
        />
      ) : data.providerTransactionId ? (
        <HtmlRecordRow
          label={labels.reference ?? labels.receiptId}
          value={truncateId(data.providerTransactionId)}
        />
      ) : null}
      {data.paymentMethod && data.paymentMethod !== "—" ? (
          <HtmlRecordRow
            label={labels.paymentMethod}
            value={<HtmlValueBadge>{data.paymentMethod}</HtmlValueBadge>}
          />
        ) : null}
      {data.dgiReference ? (
        <HtmlRecordRow
          label={labels.dgiReference ?? "DGI"}
          value={<HtmlValueBadge>{data.dgiReference}</HtmlValueBadge>}
        />
      ) : null}
      {data.dgiQrValue ? (
        <HtmlRecordRow
          label={labels.dgiQr ?? "DGI"}
          value={
            <HtmlFiscalQr
              value={data.dgiQrValue}
              label={labels.dgiQr ?? "DGI"}
            />
          }
        />
      ) : null}
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
      {isMultiItem ? (
        productItems.map((item, index) => {
          const unitDetail = formatReceiptLineDetail(
            item.quantity,
            item.unitPrice,
            data.currency,
          );
          return (
            <HtmlRecordRow
              key={`item-${index.toString()}`}
              label={item.description}
              value={
                <>
                  {formatCurrencyForReceipt(item.amount, data.currency)}
                  {unitDetail ? (
                    <span className="mt-0.5 block text-[12px] font-normal text-stone-500 dark:text-stone-400">
                      {unitDetail}
                    </span>
                  ) : null}
                </>
              }
            />
          );
        })
      ) : singleItem ? (
        <HtmlRecordRow
          label={itemLabel}
          value={formatReceiptItemTitle(
            singleItem.description,
            singleItem.quantity,
          )}
        />
      ) : hasRealPlan && planName ? (
        <HtmlRecordRow label={itemLabel} value={planName} />
      ) : null}
      {showPlanRow && planName ? (
        <HtmlRecordRow label={labels.plan ?? "Plan"} value={planName} />
      ) : null}
      {showNextBilling && nextBilling ? (
        <HtmlRecordRow
          label={labels.nextBilling ?? "Next billing"}
          value={nextBilling}
        />
      ) : null}
    </HtmlRecordCard>
  );
}
