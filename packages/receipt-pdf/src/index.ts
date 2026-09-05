export {
  buildReceiptDocumentData,
  buildReceiptLineItems,
} from "./build-receipt-data";
export {
  downloadReceiptPdf,
  renderReceiptPdfBlob,
} from "./download-receipt-pdf";
export { registerReceiptFonts } from "./fonts";
export { formatAddressLines, formatContactLines } from "./format-address";
export {
  HtmlContactLine,
  HtmlDocumentBand,
  HtmlDocumentHeader,
  HtmlLegalFooter,
  HtmlMetaRow,
  HtmlPayOnlineRow,
  HtmlRecordCard,
  HtmlRecordRow,
  HtmlSectionLabel,
  HtmlWordmark,
} from "./html-chrome";
export {
  PDF_DOCS_URL,
  PDF_LEARN_MORE_LABEL,
  PDF_LEGAL_ENTITY,
  PDF_LEGAL_LINE_1,
  PDF_PAY_LINK_LABEL,
  PDF_PAY_ONLINE_LABEL,
  PDF_REGISTERED_OFFICE,
  PDF_SUPPORT_EMAIL_FALLBACK,
  contactLineSuffix,
  extractEmailFromText,
  resolveSupportEmail,
} from "./legal";
export type { PdfDocumentKind } from "./legal";
export {
  PdfContactLine,
  PdfDocumentHeader,
  PdfLegalFooter,
  PdfMetaRow,
  PdfPayOnlineRow,
  PdfSectionLabel,
  PdfTopBand,
  PdfWordmark,
  PDF_PAGE_CHROME_STYLE,
} from "./pdf-chrome";
export {
  PDF_BACKGROUND,
  PDF_BAND_HEIGHT,
  PDF_BAND_INVOICE,
  PDF_BAND_RECEIPT,
  PDF_BORDER_COLOR,
  PDF_FONT_SIZE,
  PDF_LABEL_COLOR,
  PDF_LINK,
  PDF_MUTED_BORDER,
  PDF_MUTED_TEXT,
  PDF_PAGE_PADDING,
  PDF_TEXT_COLOR,
  PDF_TOTALS_WIDTH,
} from "./tokens";
export {
  extractReceiptCardLast4,
  formatReceiptPaymentMethod,
  sanitizeReceiptLast4,
} from "./format-payment-method";
export {
  formatCurrencyForReceipt,
  formatPhoneNumber,
  formatReceiptDate,
  formatSubscriptionStatus,
  isGenericReceiptItemName,
  stripEmojis,
} from "./format-utils";
export { ReceiptLayout } from "./receipt-layout";
export { ReceiptPdfDocument } from "./receipt-pdf-document";
export { LOMI_WORDMARK_SRC } from "./wordmark";
export type {
  ReceiptAddress,
  ReceiptBuildOptions,
  ReceiptDocumentData,
  ReceiptLayoutLabels,
  ReceiptLineItem,
  ReceiptSubscriptionDetails,
  ReceiptTransactionInput,
} from "./types";
