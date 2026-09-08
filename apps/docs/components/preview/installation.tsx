/* @proprietary license */

'use client';

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from 'react';
import { Check, Clipboard } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'fumadocs-ui/components/tabs.unstyled';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@lomi./ui/cn';
import { copyTextNow } from '@/lib/docs/copy-text';

const codeThemes = {
  light: 'github-light',
  dark: 'vesper',
} as const;

function InstallCommand({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(id);
  }, [copied]);

  const checked = copied;

  return (
    <div
      ref={containerRef}
      className="docs-installation-code relative overflow-x-auto pr-10 text-[13px]"
    >
      <button
        type="button"
        data-checked={checked || undefined}
        aria-label={checked ? 'Copied command' : 'Copy command'}
        className={cn(
          buttonVariants({
            className:
              'absolute top-1.5 right-2 hover:text-fd-accent-foreground data-checked:text-fd-accent-foreground',
            size: 'icon-xs',
          }),
        )}
        onClick={() => {
          const pre = containerRef.current?.querySelector('pre');
          if (copyTextNow(pre?.textContent ?? code)) setCopied(true);
        }}
      >
        {checked ? <Check /> : <Clipboard />}
      </button>
      <DynamicCodeBlock
        lang="bash"
        code={code}
        options={{
          themes: codeThemes,
          components: {
            pre: (
              props: ComponentPropsWithoutRef<'pre'> & { node?: unknown },
            ) => {
              const rest = { ...props };
              delete rest.node;
              return (
                <pre
                  {...rest}
                  className={cn(
                    'min-w-full w-max m-0! bg-transparent! p-0!',
                    '[&_.line]:px-0!',
                    rest.className,
                  )}
                />
              );
            },
          },
        }}
      />
    </div>
  );
}

export function Installation({ name }: { name: string }) {
  const registryUrl = `https://docs.lomi.africa/r/${name}.json`;
  const tabs = [
    { name: 'npx', value: 'npx' },
    { name: 'pnpm', value: 'pnpm' },
    { name: 'yarn', value: 'yarn' },
    { name: 'bun', value: 'bun' },
  ] as const;

  const commands = {
    npx: `npx shadcn@latest add ${registryUrl}`,
    pnpm: `pnpm dlx shadcn@latest add ${registryUrl}`,
    yarn: `yarn dlx shadcn@latest add ${registryUrl}`,
    bun: `bunx shadcn@latest add ${registryUrl}`,
  } as const;

  return (
    <Tabs
      className="docs-well not-prose my-6 overflow-hidden rounded-[9px]"
      defaultValue="npx"
    >
      <TabsList className="flex flex-col gap-3 text-sm items-start border-0 bg-transparent p-3 pb-2 not-prose sm:flex-row">
        <div className="me-auto">
          <p className="font-medium">Install to your codebase</p>
          <p className="mt-1 text-fd-muted-foreground">
            Copy the component source with shadcn.
          </p>
        </div>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="font-medium text-fd-muted-foreground transition-colors data-[state=active]:text-fd-primary"
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-0 border-t border-[color:var(--docs-hairline)] p-0 data-[state=inactive]:hidden"
        >
          <InstallCommand code={commands[tab.value]} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
