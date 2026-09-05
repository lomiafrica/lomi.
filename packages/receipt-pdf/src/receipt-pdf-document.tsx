import { Document, Link, Page, Text, View } from "@react-pdf/renderer";
import { formatAddressLines, formatContactLines } from "./format-address";
import {
  formatCurrencyForReceipt,
  isPlaceholderReceiptValue,
  receiptNamesMatch,
} from "./format-utils";
import { registerReceiptFonts } from "./fonts";
import {
  PDF_BAND_RECEIPT,
  PDF_BORDER_COLOR,
  PDF_FONT_SIZE,
  PDF_LABEL_COLOR,
  PDF_LINE_ROW_PADDING_BOTTOM,
  PDF_LINE_ROW_PADDING_TOP,
  PDF_LINK,
  PDF_MUTED_BORDER,
  PDF_MUTED_TEXT,
  PDF_TOTALS_WIDTH,
} from "./tokens";
import {
  PdfContactLine,
  PdfDocumentHeader,
  PdfLegalFooter,
  PdfSectionLabel,
  PdfSectionRule,
  PdfTopBand,
  PDF_PAGE_CHROME_STYLE,
  pdfLineValueOffset,
} from "./pdf-chrome";
import { resolveSupportEmail } from "./legal";
import type {
  ReceiptAddress,
  ReceiptDigitalDelivery,
  ReceiptDocumentData,
} from "./types";

registerReceiptFonts();

function AddressLine({
  children,
  muted,
  weight,
}: {
  children: string;
  muted?: boolean;
  weight?: 600;
}) {
  return (
    <View>
      <Text
        style={{
          fontSize: weight === 600 ? 10 : PDF_FONT_SIZE.body,
          ...(weight === 600 ? { fontWeight: 600 } : {}),
          ...(muted ? { color: PDF_MUTED_TEXT } : {}),
          marginBottom: 2,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

function AddressBlock({
  label,
  address,
  locale,
}: {
  label: string;
  address: ReceiptAddress;
  locale?: string;
}) {
  const addressLines =
    address.formattedLines && address.formattedLines.length > 0
      ? address.formattedLines
      : formatAddressLines(address, locale);
  const contactLines = formatContactLines(address);

  return (
    <View style={{ flexDirection: "column" }}>
      <PdfSectionLabel>{label}</PdfSectionLabel>
      {address.name ? (
        <AddressLine weight={600}>{address.name}</AddressLine>
      ) : null}
      {addressLines.map((line, index) => (
        <AddressLine key={`addr-${index.toString()}`} muted>
          {line}
        </AddressLine>
      ))}
      {contactLines.map((line, index) => (
        <AddressLine key={`contact-${index.toString()}`} muted>
          {line}
        </AddressLine>
      ))}
    </View>
  );
}

function PdfSubscriptionDetails({ data }: { data: ReceiptDocumentData }) {
  const subscription = data.subscription;
  if (!subscription) return null;
  const planAlreadyListed = data.lineItems.some(
    (item) =>
      !item.isFee && receiptNamesMatch(item.description, subscription.planName),
  );
  const showPlan =
    !isPlaceholderReceiptValue(subscription.planName) && !planAlreadyListed;
  const showFrequency = !isPlaceholderReceiptValue(
    subscription.billingFrequency,
  );
  const showNextBilling =
    !data.amountHint &&
    !isPlaceholderReceiptValue(subscription.nextBillingDate);
  if (!showPlan && !showFrequency && !showNextBilling) return null;
  return (
    <View
      wrap={false}
      style={{
        marginTop: 24,
        padding: 12,
        borderWidth: 0.5,
        borderColor: PDF_MUTED_BORDER,
      }}
    >
      <Text
        style={{
          fontSize: PDF_FONT_SIZE.label,
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        Subscription details
      </Text>
      {showPlan ? (
        <DetailRow label="Plan" value={subscription.planName} />
      ) : null}
      {showFrequency ? (
        <DetailRow
          label="Billing frequency"
          value={subscription.billingFrequency}
        />
      ) : null}
      {showNextBilling ? (
        <DetailRow label="Next billing" value={subscription.nextBillingDate} />
      ) : null}
    </View>
  );
}

function PdfLibraryHint({ delivery }: { delivery: ReceiptDigitalDelivery }) {
  const libraryUrl = delivery.libraryUrl;
  const libraryLinkLabel = delivery.libraryLinkLabel;
  if (libraryUrl && libraryLinkLabel) {
    return (
      <Text
        style={{
          fontSize: PDF_FONT_SIZE.label,
          color: PDF_MUTED_TEXT,
          marginTop: 10,
        }}
      >
        {delivery.libraryHintBefore}
        <Link
          src={libraryUrl}
          style={{ color: PDF_LINK, textDecoration: "none" }}
        >
          {libraryLinkLabel}
        </Link>
        {delivery.libraryHintAfter}
      </Text>
    );
  }
  if (!delivery.libraryHint) return null;
  return (
    <Text
      style={{
        fontSize: PDF_FONT_SIZE.label,
        color: PDF_MUTED_TEXT,
        marginTop: 10,
      }}
    >
      {delivery.libraryHint}
    </Text>
  );
}

function PdfDigitalDelivery({
  delivery,
}: {
  delivery: ReceiptDigitalDelivery;
}) {
  if (delivery.files.length === 0 && delivery.licenseKeys.length === 0) {
    return null;
  }
  return (
    <View wrap={false} style={{ marginTop: 24 }}>
      <PdfSectionRule spaceAfter={14} />
      {delivery.files.length > 0 ? (
        <View
          style={{
            marginBottom: delivery.licenseKeys.length > 0 ? 14 : 0,
          }}
        >
          <PdfSectionLabel>{delivery.downloadsTitle}</PdfSectionLabel>
          {delivery.files.map((file, index) => (
            <View
              key={`file-${index.toString()}`}
              style={{ marginBottom: 8 }}
            >
              <Text
                style={{
                  fontSize: PDF_FONT_SIZE.body,
                  fontWeight: 600,
                  lineHeight: 1,
                  marginBottom: 3,
                }}
              >
                {file.filename}
              </Text>
              <Text
                style={{
                  fontSize: PDF_FONT_SIZE.body,
                  lineHeight: 1,
                  color: PDF_MUTED_TEXT,
                }}
              >
                {file.productName}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      {delivery.licenseKeys.length > 0 ? (
        <View>
          <PdfSectionLabel>{delivery.licenseKeysTitle}</PdfSectionLabel>
          {delivery.licenseKeys.map((item, index) => (
            <View key={`key-${index.toString()}`} style={{ marginBottom: 8 }}>
              <Text
                style={{
                  fontSize: PDF_FONT_SIZE.body,
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: 0.3,
                  marginBottom: 3,
                }}
              >
                {item.licenseKey}
              </Text>
              <Text
                style={{
                  fontSize: PDF_FONT_SIZE.body,
                  lineHeight: 1,
                  color: PDF_MUTED_TEXT,
                }}
              >
                {item.productName}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      <PdfLibraryHint delivery={delivery} />
    </View>
  );
}

const PDF_QTY_COL_WIDTH = 36;
const PDF_PRICE_COL_WIDTH = 80;
const PDF_AMOUNT_COL_WIDTH = 110;

function PdfLineValue({
  width,
  align = "left",
  children,
}: {
  width: number;
  align?: "left" | "right";
  children: string;
}) {
  return (
    <View style={{ width }}>
      <Text
        style={{
          fontSize: PDF_FONT_SIZE.body,
          lineHeight: 1,
          textAlign: align,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
      }}
    >
      <Text style={{ fontSize: PDF_FONT_SIZE.label, fontWeight: 600 }}>
        {label}
      </Text>
      <Text style={{ fontSize: PDF_FONT_SIZE.label, maxWidth: "55%" }}>
        {value}
      </Text>
    </View>
  );
}

export function ReceiptPdfDocument({ data }: { data: ReceiptDocumentData }) {
  const supportEmail = resolveSupportEmail(data.from.email);

  return (
    <Document>
      <Page wrap size="A4" style={PDF_PAGE_CHROME_STYLE}>
        <PdfTopBand color={PDF_BAND_RECEIPT} />
        <PdfDocumentHeader
          title={data.title}
          logoSrc={data.logoUrl}
          showWordmark={false}
          metaGroups={[
            [
              {
                label: data.idLabel || "Receipt ID",
                value: data.transactionId || "—",
              },
              {
                label: "Transaction ID",
                value: data.providerTransactionId || "—",
              },
              { label: "Date", value: data.date || "—" },
              {
                label: "Payment method",
                value: data.paymentMethod || "—",
              },
            ],
          ]}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
          }}
        >
          <View style={{ width: "36%" }}>
            <AddressBlock
              label="From"
              address={data.from}
              locale={data.addressLocale}
            />
          </View>
          <View style={{ width: "38%" }}>
            <AddressBlock
              label="Bill to"
              address={data.to}
              locale={data.addressLocale}
            />
          </View>
        </View>

        <PdfSectionRule />

        {data.lineItems.length > 0 ? (
          <View>
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 0.5,
                borderBottomColor: PDF_BORDER_COLOR,
                paddingBottom: PDF_LINE_ROW_PADDING_BOTTOM,
              }}
            >
              <Text
                style={{
                  flexGrow: 1,
                  fontSize: PDF_FONT_SIZE.label,
                  fontWeight: 500,
                  color: PDF_LABEL_COLOR,
                  lineHeight: 1,
                }}
              >
                Description
              </Text>
              {data.showQuantityAndPrice ? (
                <Text
                  style={{
                    width: PDF_QTY_COL_WIDTH,
                    fontSize: PDF_FONT_SIZE.label,
                    fontWeight: 500,
                    color: PDF_LABEL_COLOR,
                  }}
                >
                  Qty
                </Text>
              ) : null}
              {data.showQuantityAndPrice ? (
                <Text
                  style={{
                    width: PDF_PRICE_COL_WIDTH,
                    fontSize: PDF_FONT_SIZE.label,
                    fontWeight: 500,
                    color: PDF_LABEL_COLOR,
                    textAlign: "right",
                  }}
                >
                  Price
                </Text>
              ) : null}
              <Text
                style={{
                  width: PDF_AMOUNT_COL_WIDTH,
                  fontSize: PDF_FONT_SIZE.label,
                  fontWeight: 500,
                  color: PDF_LABEL_COLOR,
                  textAlign: "right",
                }}
              >
                Amount
              </Text>
            </View>

            {data.lineItems.map((item, index) => (
              <View
                key={`line-${index.toString()}`}
                wrap={false}
                style={{
                  flexDirection: "row",
                  paddingTop: PDF_LINE_ROW_PADDING_TOP,
                  paddingBottom: PDF_LINE_ROW_PADDING_BOTTOM,
                  borderBottomWidth: 0.5,
                  borderBottomColor: PDF_MUTED_BORDER,
                }}
              >
                <View style={{ flexGrow: 1, flexShrink: 1, paddingRight: 14 }}>
                  <Text
                    style={{
                      fontSize: PDF_FONT_SIZE.body,
                      fontWeight: item.isFee ? 400 : 600,
                      lineHeight: 1,
                      marginBottom: item.detail ? 4 : 0,
                    }}
                  >
                    {item.description}
                  </Text>
                  {item.detail ? (
                    <Text
                      style={{
                        fontSize: PDF_FONT_SIZE.body,
                        lineHeight: 1,
                        color: PDF_MUTED_TEXT,
                      }}
                    >
                      {item.detail}
                    </Text>
                  ) : null}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: pdfLineValueOffset(item.detail ? 1 : 0),
                  }}
                >
                  {data.showQuantityAndPrice ? (
                    <PdfLineValue width={PDF_QTY_COL_WIDTH}>
                      {!item.isFee ? String(item.quantity) : ""}
                    </PdfLineValue>
                  ) : null}
                  {data.showQuantityAndPrice ? (
                    <PdfLineValue width={PDF_PRICE_COL_WIDTH} align="right">
                      {!item.isFee
                        ? formatCurrencyForReceipt(item.unitPrice, data.currency)
                        : ""}
                    </PdfLineValue>
                  ) : null}
                  <PdfLineValue width={PDF_AMOUNT_COL_WIDTH} align="right">
                    {formatCurrencyForReceipt(item.amount, data.currency)}
                  </PdfLineValue>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <View style={{ alignItems: "flex-end", marginTop: 16 }}>
          <View style={{ width: PDF_TOTALS_WIDTH }}>
            {data.isMerchantReceipt &&
            data.platformFee &&
            data.platformFee > 0.01 ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: PDF_FONT_SIZE.label,
                      color: PDF_LABEL_COLOR,
                    }}
                  >
                    Subtotal
                  </Text>
                  <Text style={{ fontSize: PDF_FONT_SIZE.label }}>
                    {formatCurrencyForReceipt(
                      data.subtotal ?? 0,
                      data.currency,
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: PDF_FONT_SIZE.label,
                      color: PDF_LABEL_COLOR,
                    }}
                  >
                    Fees
                  </Text>
                  <Text style={{ fontSize: PDF_FONT_SIZE.label }}>
                    -{" "}
                    {formatCurrencyForReceipt(data.platformFee, data.currency)}
                  </Text>
                </View>
              </>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopWidth: 0.5,
                borderTopColor: PDF_BORDER_COLOR,
                paddingTop: 6,
                marginTop: 2,
              }}
            >
              <Text style={{ fontSize: PDF_FONT_SIZE.label, fontWeight: 600 }}>
                {data.totalLabel}
              </Text>
              <Text style={{ fontSize: PDF_FONT_SIZE.total, fontWeight: 600 }}>
                {data.subscription?.isTrial
                  ? "Trial"
                  : data.isFree
                    ? "Free"
                    : formatCurrencyForReceipt(data.totalAmount, data.currency)}
              </Text>
            </View>
            {data.amountHint ? (
              <Text
                style={{
                  fontSize: PDF_FONT_SIZE.label,
                  color: PDF_MUTED_TEXT,
                  marginTop: 6,
                  textAlign: "right",
                }}
              >
                {data.amountHint}
              </Text>
            ) : null}
            <PdfContactLine email={supportEmail} kind="receipt" />
          </View>
        </View>

        {data.digitalDelivery ? (
          <PdfDigitalDelivery delivery={data.digitalDelivery} />
        ) : null}

        <PdfSubscriptionDetails data={data} />

        <PdfLegalFooter brandMark />
      </Page>
    </Document>
  );
}
