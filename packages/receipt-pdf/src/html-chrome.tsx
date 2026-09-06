import type { ReactNode } from "react";
import {
  PDF_DOCS_URL,
  PDF_LEARN_MORE_LABEL,
  PDF_LEGAL_LINE_1,
  PDF_PAY_LINK_LABEL,
  PDF_PAY_ONLINE_LABEL,
  PDF_REGISTERED_OFFICE,
  contactLineSuffix,
  type PdfDocumentKind,
} from "./legal";
import { LOMI_WORDMARK_SRC } from "./wordmark";

export function HtmlDocumentBand({ color }: { color: string }) {
  return (
    <div
      aria-hidden
      className="absolute top-0 left-0 right-0 h-2"
      style={{ backgroundColor: color }}
    />
  );
}

export function HtmlWordmark({ className }: { className?: string }) {
  return (
    <img
      src={LOMI_WORDMARK_SRC}
      alt="lomi."
      width={56}
      height={21}
      className={className ?? "h-[21px] w-[56px] shrink-0 object-contain"}
    />
  );
}

export function HtmlMetaRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <p className="text-[11px] text-[#878787] leading-[18px]">
      <span className="font-semibold">{label} </span>
      <span className="font-normal text-foreground">{value}</span>
    </p>
  );
}

export function HtmlDocumentHeader({
  title,
  children,
  logoSrc,
}: {
  title: ReactNode;
  children?: ReactNode;
  logoSrc?: string | null;
}) {
  return (
    <div className="flex justify-between items-start gap-4 mb-6">
      <div className="flex-1 min-w-0 pr-4">
        <div className="text-[21px] font-semibold leading-6 mb-2">{title}</div>
        <div className="flex flex-col gap-0.5">{children}</div>
      </div>
      {logoSrc ? (
        <img
          src={logoSrc}
          alt=""
          width={56}
          height={21}
          className="h-[21px] w-[56px] shrink-0 object-contain"
        />
      ) : (
        <HtmlWordmark />
      )}
    </div>
  );
}

export function HtmlSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium text-[#878787] uppercase tracking-[0.4px] mb-1">
      {children}
    </p>
  );
}

export function HtmlPayOnlineRow({ url }: { url: string }) {
  return (
    <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#E2E8F0]">
      <span className="text-[11px] text-[#878787]">{PDF_PAY_ONLINE_LABEL}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] font-semibold text-[#4568FF] no-underline"
      >
        {PDF_PAY_LINK_LABEL}
      </a>
    </div>
  );
}

export function HtmlContactLine({
  email,
  kind,
}: {
  email: string;
  kind: PdfDocumentKind;
}) {
  return (
    <p className="text-[10px] leading-[1.4] text-[#6B7280] text-right mt-2.5">
      Please contact{" "}
      <a href={`mailto:${email}`} className="text-[#6B7280] no-underline">
        {email}
      </a>
      {contactLineSuffix(kind)}
    </p>
  );
}

/** Email transaction-card chrome for web receipt / invoice. */
export function HtmlRecordCard({
  heading,
  amount,
  amountHint,
  dateLine,
  actions,
  banner,
  contact,
  children,
}: {
  heading: ReactNode;
  amount: string;
  amountHint?: string;
  dateLine?: string;
  actions?: ReactNode;
  banner?: ReactNode;
  contact?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      data-record-card=""
      className="overflow-hidden rounded-sm border border-stone-200 bg-white px-8 py-8 text-stone-700 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_12px_32px_-20px_rgba(28,25,23,0.2)] dark:border-white/[0.16] dark:bg-[#252522] dark:text-stone-200"
    >
      <div>
        <h2 className="m-0 mb-2 text-[13px] font-medium text-stone-500 dark:text-stone-400">
          {heading}
        </h2>
        <p className="m-0 text-[36px] font-bold leading-none tracking-[-0.5px] text-stone-900 dark:text-stone-100">
          {amount}
        </p>
        {amountHint ? (
          <p className="mb-0 mt-2 text-[13px] text-stone-500 dark:text-stone-400">
            {amountHint}
          </p>
        ) : null}
        {dateLine ? (
          <p
            className={
              amountHint
                ? "mb-0 mt-1 text-[13px] text-stone-500 dark:text-stone-400"
                : "mb-0 mt-2 text-[13px] text-stone-500 dark:text-stone-400"
            }
          >
            {dateLine}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="mb-2 mt-5 flex flex-wrap gap-3 border-b border-stone-200 pb-6 dark:border-white/[0.12]">
          {actions}
        </div>
      ) : (
        <div className="mb-2 mt-6 border-b border-stone-200 dark:border-white/[0.12]" />
      )}
      {banner ? <div className="mb-4 mt-3">{banner}</div> : null}
      {children}
      {contact}
    </div>
  );
}

export function HtmlRecordRow({
  label,
  detail,
  value,
}: {
  label: ReactNode;
  detail?: ReactNode;
  value: ReactNode;
}) {
  if (value == null || value === "") return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-stone-200 py-3.5 last:border-b-0 dark:border-white/[0.12]">
      <span className="w-36 shrink-0 text-[13px] font-medium text-stone-500 dark:text-stone-400">
        {label}
        {detail ? (
          <span className="mt-0.5 block font-normal text-stone-400 dark:text-stone-500">
            {detail}
          </span>
        ) : null}
      </span>
      <span className="min-w-0 break-all text-right text-[13px] font-medium text-stone-800 dark:text-stone-200">
        {value}
      </span>
    </div>
  );
}

/** Invoice / receipt product line without a hairline. */
export function HtmlRecordLine({
  label,
  detail,
  value,
  valueDetail,
}: {
  label: ReactNode;
  detail?: ReactNode;
  value: ReactNode;
  valueDetail?: ReactNode;
}) {
  if (value == null || value === "") return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2 first:pt-3.5">
      <div className="min-w-0 text-[13px] font-medium text-stone-500 dark:text-stone-400">
        {label}
        {detail ? (
          <span className="mt-0.5 block font-normal text-stone-400 dark:text-stone-500">
            {detail}
          </span>
        ) : null}
      </div>
      <div className="min-w-0 text-right text-[13px] font-medium text-stone-800 dark:text-stone-200">
        {value}
        {valueDetail ? (
          <span className="mt-0.5 block text-[12px] font-normal text-stone-500 dark:text-stone-400">
            {valueDetail}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function HtmlLegalFooter() {
  return (
    <div className="mt-8 pt-2 border-t border-[#E2E8F0]">
      <p className="max-w-[46rem] text-[10px] leading-[1.45] text-[#878787]">
        {PDF_LEGAL_LINE_1} {PDF_REGISTERED_OFFICE}.{"  "}
        <a
          href={PDF_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#878787] no-underline"
        >
          {PDF_LEARN_MORE_LABEL}
        </a>
        .
      </p>
    </div>
  );
}
