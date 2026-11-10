'use client';

import {
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useTheme } from 'fumadocs-ui/provider/base';
import { isString } from '@lomi./shared';

const MERMAID_START =
  /^(?:stateDiagram(?:-v2)?|flowchart|graph|sequenceDiagram|classDiagram|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph|quadrantChart|xychart-beta|block-beta|sankey-beta|requirementDiagram|C4Context|C4Container)\b/;

function isMermaidText(node: ReactNode): node is string | number {
  return isString(node) || typeof node === 'number';
}

function textOf(node: ReactNode): string {
  if (isMermaidText(node)) return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (!isValidElement(node)) return '';
  // SAFETY: isValidElement proved this is an element; textOf reads only props.children.
  const props = node.props as { children?: ReactNode };
  return textOf(props.children);
}

function linesOf(node: ReactNode): string[] {
  if (Array.isArray(node)) return node.flatMap(linesOf);
  if (!isValidElement(node)) {
    const text = textOf(node);
    return text ? [text] : [];
  }
  // SAFETY: isValidElement proved this is an element; line nodes carry className and children.
  const props = node.props as { className?: string; children?: ReactNode };
  const className = isString(props.className) ? props.className : '';
  if (className.split(/\s+/).includes('line')) return [textOf(props.children)];
  return linesOf(props.children);
}

/** The fence source when Shiki has highlighted a mermaid block as plain code. */
export function mermaidSource(node: ReactNode): string | null {
  const chart = linesOf(node).join('\n').trim();
  if (!MERMAID_START.test(chart)) return null;
  return chart;
}

/** Drawn from a mermaid fence. Loaded only when a page has a diagram. */
export function DocsMermaid({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme();
  const uid = useId().replace(/:/g, '');
  const run = useRef(0);
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const theme = resolvedTheme === 'dark' ? 'dark' : 'neutral';

  useEffect(() => {
    let cancelled = false;
    const id = `docs-mermaid-${uid}-${++run.current}`;
    setFailed(false);
    // Mermaid is large and browser-only. Keep it out of the code-block path.
    void import('mermaid')
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          suppressErrorRendering: true,
          htmlLabels: false,
          fontFamily: 'inherit',
          theme,
        });
        document.getElementById(id)?.remove();
        const rendered = await mermaid.render(id, chart);
        if (!cancelled) setSvg(rendered.svg);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [chart, theme, uid]);

  if (failed) {
    return (
      <pre className="not-prose my-6 overflow-x-auto rounded-lg border border-fd-border bg-fd-card p-4 text-sm text-fd-foreground">
        {chart}
      </pre>
    );
  }

  return (
    <figure className="not-prose my-6 overflow-x-auto rounded-lg border border-fd-border bg-fd-card px-4 py-6">
      {svg ? (
        <div
          className="flex justify-center [&_svg]:h-auto [&_svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="h-40" aria-hidden />
      )}
    </figure>
  );
}
