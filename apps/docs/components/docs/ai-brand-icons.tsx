/* @proprietary license */

type BrandIconProps = {
  className?: string;
};

/** Anthropic Claude spark — inlined so the agent pill never waits on /ai/*.svg */
export function ClaudeBrandIcon({ className }: BrandIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="#D97757"
      aria-hidden
      focusable="false"
    >
      <path
        fillRule="nonzero"
        d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"
      />
    </svg>
  );
}

/** OpenAI Codex — inlined so fill follows currentColor */
export function CodexBrandIcon({ className }: BrandIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden
      focusable="false"
    >
      <path
        clipRule="evenodd"
        d="M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z"
      />
    </svg>
  );
}

/** Cursor — inlined so fill follows currentColor */
export function CursorBrandIcon({ className }: BrandIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  );
}

/** OpenCode mark — dual theme, inlined (no /ai/opencode*.svg fetch). */
export function OpenCodeBrandIcon({ className }: BrandIconProps) {
  return (
    <span className={`relative inline-flex ${className ?? ''}`}>
      <svg
        className="block size-full dark:hidden"
        viewBox="30 0 240 300"
        aria-hidden
        focusable="false"
      >
        <path d="M180 240H60V120H180V240Z" fill="#CFCECD" />
        <path d="M180 60H60V240H180V60ZM240 300H0V0H240V300Z" fill="#211E1E" />
      </svg>
      <svg
        className="hidden size-full dark:block"
        viewBox="30 0 240 300"
        aria-hidden
        focusable="false"
      >
        <path d="M180 240H60V120H180V240Z" fill="#4B4646" />
        <path d="M180 60H60V240H180V60ZM240 300H0V0H240V300Z" fill="#F1ECEC" />
      </svg>
    </span>
  );
}

/** Visual Studio Code logomark in its brand blue. */
export function VscodeBrandIcon({ className }: BrandIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="#0098FF"
      aria-hidden
      focusable="false"
    >
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  );
}

/**
 * Official Model Context Protocol mark (docs/favicon.svg).
 * Strokes follow currentColor so the sidebar matches light and dark.
 */
export function McpBrandIcon({ className }: BrandIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 180"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g clipPath="url(#mcp-brand-clip)">
        <path
          d="M18 84.853 85.882 16.971c9.373-9.373 24.569-9.373 33.941 0 9.373 9.373 9.373 24.568 0 33.941L68.558 102.177"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="m69.265 101.47 50.558-50.558c9.373-9.373 24.569-9.373 33.942 0l.353.353c9.373 9.373 9.373 24.569 0 33.941L92.725 146.6c-3.124 3.124-3.124 8.189 0 11.313l12.606 12.607"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="m102.853 33.941-50.205 50.205c-9.372 9.372-9.372 24.568 0 33.941 9.373 9.372 24.569 9.372 33.941 0l50.205-50.205"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="mcp-brand-clip">
          <rect width="180" height="180" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Grok Bot face, vectorized from the product mark. Eyes are punch-outs so fill follows currentColor. */
export function GrokBrandIcon({ className }: BrandIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden
      focusable="false"
    >
      <path d="M12 0a12 12 0 1 0 0 24a12 12 0 1 0 0-24zM14.189 5.591 13.265 7.665A.89.89 24 0 0 14.891 8.389L15.815 6.315A.89.89 24 0 0 14.189 5.591zM19.319 4.641 18.395 6.715A.89.89 24 0 0 20.021 7.439L20.945 5.365A.89.89 24 0 0 19.319 4.641z" />
    </svg>
  );
}
