import React from "react";

interface SpinnerProps {
  className?: string;
  inline?: boolean;
  still?: boolean;
  style?: React.CSSProperties;
}

/** Braille spinner. Button loading and LoadingButton use this same mark. */
function Spinner({
  className = "",
  inline = false,
  still = false,
  style,
}: SpinnerProps) {
  const spinnerChars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const [currentChar, setCurrentChar] = React.useState(0);

  React.useEffect(() => {
    if (still) return;
    const interval = setInterval(() => {
      setCurrentChar((prev) => (prev + 1) % spinnerChars.length);
    }, 200);

    return () => clearInterval(interval);
  }, [still, spinnerChars.length]);

  const spinner = (
    <span
      className={`inline-flex items-center justify-center leading-none text-zinc-400 ${className}`}
      style={{
        fontFamily:
          '"DejaVu Sans Mono", "Liberation Mono", "Courier New", monospace',
        fontSize: "13px",
        lineHeight: 1,
        fontWeight: "normal",
        width: "1ch",
        ...style,
      }}
    >
      {spinnerChars[currentChar]}
    </span>
  );

  if (inline) {
    return spinner;
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      {spinner}
    </div>
  );
}

export { Spinner };
export default Spinner;
