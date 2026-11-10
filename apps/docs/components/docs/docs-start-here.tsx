import { Children, isValidElement, type ReactNode } from 'react';
import { cn } from '@lomi./ui/cn';

type DocsStartHereProps = {
  title: string;
  children: ReactNode;
};

type DocsStartColumnProps = {
  heading: string;
  lead: string;
  children: ReactNode;
};

/** Two ways in. Same card as the Beecargo docs welcome page. */
export function DocsStartHere({ title, children }: DocsStartHereProps) {
  const columns = Children.toArray(children).filter(isValidElement);

  return (
    <div className="not-prose relative my-8 flex min-h-[200px] w-full flex-col overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_top,white_2%,white_8%,transparent_28%)]"
      >
        <div className="absolute inset-0 bg-linear-to-br from-(--ui-color)/30 via-(--ui-color)/10 to-transparent" />
      </div>
      <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
        <h2 className="text-xl font-medium tracking-tight text-fd-foreground">
          {title}
        </h2>
        <div className="mt-4 grid flex-1 gap-6 sm:grid-cols-2 sm:gap-0">
          {columns.map((column, index) => (
            <div
              className={cn(
                'flex min-w-0 flex-col',
                index === 0
                  ? 'sm:pr-8'
                  : 'border-t border-fd-border pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8',
              )}
              key={index}
            >
              {column}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DocsStartColumn({
  heading,
  lead,
  children,
}: DocsStartColumnProps) {
  const links = Children.toArray(children).filter(isValidElement);

  return (
    <>
      <h3 className="text-[15px] font-semibold tracking-tight text-fd-foreground">
        {heading}
      </h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-fd-muted-foreground">
        {lead}
      </p>
      <ul className="mt-4 space-y-1.5">
        {links.map((link, index) => (
          <li
            className="[&_a]:text-[14px] [&_a]:font-medium [&_a]:text-fd-primary [&_a]:no-underline hover:[&_a]:underline"
            key={index}
          >
            {link}
          </li>
        ))}
      </ul>
    </>
  );
}
