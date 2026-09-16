import { encode } from "uqr";
import { View } from "@react-pdf/renderer";

export function fiscalQrModules(value: string): boolean[][] {
  return encode(value, { border: 1 }).data;
}

export function HtmlFiscalQr({
  value,
  size = 96,
  label,
}: {
  value: string;
  size?: number;
  label: string;
}) {
  const modules = fiscalQrModules(value);
  const dim = modules.length;
  const cell = dim > 0 ? size / dim : 0;
  return (
    <svg
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox={`0 0 ${String(size)} ${String(size)}`}
      className="block rounded-[2px] bg-white"
    >
      <rect width={size} height={size} fill="#fff" />
      {modules.flatMap((row, y) =>
        row.map((on, x) =>
          on ? (
            <rect
              key={`${String(y)}-${String(x)}`}
              x={x * cell}
              y={y * cell}
              width={cell}
              height={cell}
              fill="#111"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

export function PdfFiscalQr({ value, size = 72 }: { value: string; size?: number }) {
  const modules = fiscalQrModules(value);
  const dim = modules.length;
  const cell = dim > 0 ? size / dim : 0;
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: "#ffffff",
        flexDirection: "column",
      }}
    >
      {modules.map((row, y) => (
        <View
          key={`r-${String(y)}`}
          style={{ flexDirection: "row", height: cell }}
        >
          {row.map((on, x) => (
            <View
              key={`c-${String(y)}-${String(x)}`}
              style={{
                width: cell,
                height: cell,
                backgroundColor: on ? "#111111" : "#ffffff",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
