import * as React from "react";
import { cn } from "./cn";

export const statusPageActionClassName =
  "inline-flex h-9 items-center justify-center rounded-sm px-3.5 text-[13px] font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:shadow-[0_0_0_2px_rgba(69,104,255,0.28)]";

export type StatusPageProps = {
  code: string;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

/** Classic Next.js-style status page (404 / 500): code, title, no card. */
export function StatusPage({
  code,
  title,
  description,
  children,
  actions,
  eyebrow,
  className,
  contentClassName,
}: StatusPageProps) {
  return (
    <div
      className={cn(
        "flex min-h-svh flex-1 flex-col items-center justify-center bg-background px-6 py-16 text-foreground",
        className,
      )}
    >
      <div className={cn("w-full max-w-sm text-left", contentClassName)}>
        {eyebrow ? <div className="mb-5">{eyebrow}</div> : null}
        <div className="flex items-center gap-4 sm:gap-5">
          <p className="font-mono text-[28px] font-medium leading-none tracking-tight text-foreground sm:text-[32px]">
            {code}
          </p>
          <span
            aria-hidden
            className="h-8 w-px shrink-0 bg-foreground/15 sm:h-9"
          />
          <h1 className="text-[15px] font-medium leading-snug tracking-[-0.02em] text-foreground sm:text-[16px]">
            {title}
          </h1>
        </div>
        {description ? (
          <div className="mt-4 text-[13px] leading-relaxed text-muted-foreground sm:text-[13.5px]">
            {typeof description === "string" ? <p>{description}</p> : description}
          </div>
        ) : null}
        {children}
        {actions ? (
          <div className="mt-4 flex justify-end gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}

export function StatusPageActionLink({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cn(statusPageActionClassName, className)} {...props} />;
}

export function StatusPageActionButton({
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(statusPageActionClassName, className)}
      {...props}
    />
  );
}
