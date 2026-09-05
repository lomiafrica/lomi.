import { Document, Page, Text, View } from "@react-pdf/renderer";
import { formatAddressLines, formatContactLines } from "./format-address";
import { formatCurrencyForReceipt } from "./format-utils";
import { registerReceiptFonts } from "./fonts";
import {
  PDF_BAND_RECEIPT,
  PDF_BORDER_COLOR,
  PDF_FONT_SIZE,
  PDF_LABEL_COLOR,
  PDF_MUTED_BORDER,
  PDF_TOTALS_WIDTH,
} from "./tokens";
import {
  PdfContactLine,
  PdfDocumentHeader,
  PdfLegalFooter,
  PdfSectionLabel,
  PdfTopBand,
  PDF_PAGE_CHROME_STYLE,
} from "./pdf-chrome";
import { resolveSupportEmail } from "./legal";
import type { ReceiptAddress, ReceiptDocumentData } from "./types";

registerReceiptFonts();

function AddressBlock({
  label,
  address,
}: {
  label: string;
  address: ReceiptAddress;
}) {
  const addressLines = formatAddressLines(address);
  const contactLines = formatContactLines(address);

  return (
    <View style={{ flex: 1, marginBottom: 20 }}>
      <PdfSectionLabel>{label}</PdfSectionLabel>
      <Text
        style={{
          fontSize: 10,
          fontWeight: 600,
          marginBottom: 3,
        }}
      >
        {address.name}
      </Text>
      {addressLines.map((line, index) => (
        <Text
          key={`addr-${index.toString()}`}
          style={{
            fontSize: PDF_FONT_SIZE.body,
            lineHeight: 1.45,
            color: "#6B7280",
            marginBottom: 2,
          }}
        >
          {line}
        </Text>
      ))}
      {contactLines.map((line, index) => (
        <Text
          key={`contact-${index.toString()}`}
          style={{
            fontSize: PDF_FONT_SIZE.body,
            lineHeight: 1.45,
            marginBottom: 2,
            color: "#6B7280",
          }}
        >
          {line}
        </Text>
      ))}
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
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

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "#22c55e";
    case "cancelled":
      return "#ef4444";
    case "suspended":
    case "paused":
      return "#eab308";
    case "pending":
      return "#3b82f6";
    default:
      return "#9ca3af";
  }
}

export function ReceiptPdfDocument({ data }: { data: ReceiptDocumentData }) {
  const supportEmail = resolveSupportEmail(data.from.email);

  return (
    <Document>
      <Page wrap size="A4" style={PDF_PAGE_CHROME_STYLE}>
        <PdfTopBand color={PDF_BAND_RECEIPT} />
        <PdfDocumentHeader
          title={data.title}
          meta={[
            { label: "Receipt ID", value: data.transactionId },
            { label: "Date", value: data.date },
            { label: "Payment method", value: data.paymentMethod },
          ]}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <View style={{ width: "36%" }}>
            <AddressBlock label="From" address={data.from} />
          </View>
          <View style={{ width: "38%", marginLeft: "auto" }}>
            <AddressBlock label="Bill to" address={data.to} />
          </View>
        </View>

        {data.providerTransactionId ? (
          <View style={{ marginBottom: 16 }}>
            <DetailRow
              label="Transaction ID"
              value={data.providerTransactionId}
            />
          </View>
        ) : null}

        {data.lineItems.length > 0 ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 0.5,
              borderBottomColor: PDF_BORDER_COLOR,
              paddingBottom: 5,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                flex: 3.4,
                fontSize: PDF_FONT_SIZE.label,
                fontWeight: 500,
                color: PDF_LABEL_COLOR,
              }}
            >
              Description
            </Text>
            {data.showQuantityAndPrice ? (
              <Text
                style={{
                  flex: 0.6,
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
                  flex: 1,
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
                flex: 1,
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
                paddingBottom: 12,
                marginBottom: 4,
                borderBottomWidth: 0.5,
                borderBottomColor: PDF_MUTED_BORDER,
                alignItems: "flex-start",
              }}
            >
              <View style={{ flex: 3.4, paddingRight: 14 }}>
                <Text
                  style={{
                    fontSize: PDF_FONT_SIZE.body,
                    fontWeight: item.isFee ? 400 : 600,
                  }}
                >
                  {item.description}
                </Text>
              </View>
              {data.showQuantityAndPrice ? (
                <Text style={{ flex: 0.6, fontSize: PDF_FONT_SIZE.body }}>
                  {!item.isFee ? String(item.quantity) : ""}
                </Text>
              ) : null}
              {data.showQuantityAndPrice ? (
                <Text
                  style={{
                    flex: 1,
                    fontSize: PDF_FONT_SIZE.body,
                    textAlign: "right",
                  }}
                >
                  {!item.isFee
                    ? formatCurrencyForReceipt(item.unitPrice, data.currency)
                    : ""}
                </Text>
              ) : null}
              <Text
                style={{
                  flex: 1,
                  fontSize: PDF_FONT_SIZE.body,
                  textAlign: "right",
                }}
              >
                {formatCurrencyForReceipt(item.amount, data.currency)}
              </Text>
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
                {formatCurrencyForReceipt(data.totalAmount, data.currency)}
              </Text>
            </View>
            <PdfContactLine email={supportEmail} kind="receipt" />
          </View>
        </View>

        {data.subscription ? (
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
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <DetailRow label="Plan" value={data.subscription.planName} />
                <DetailRow
                  label="Billing frequency"
                  value={data.subscription.billingFrequency}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <DetailRow
                  label="Next billing"
                  value={data.subscription.nextBillingDate}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: PDF_FONT_SIZE.label,
                      fontWeight: 600,
                    }}
                  >
                    Status
                  </Text>
                  <Text
                    style={{
                      fontSize: PDF_FONT_SIZE.label,
                      color: getStatusColor(data.subscription.status),
                    }}
                  >
                    {data.subscription.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        <PdfLegalFooter />
      </Page>
    </Document>
  );
}
