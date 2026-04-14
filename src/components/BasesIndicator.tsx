"use client";

interface BasesIndicatorProps {
  first: boolean;
  second: boolean;
  third: boolean;
}

export default function BasesIndicator({
  first,
  second,
  third,
}: BasesIndicatorProps) {
  const baseSize = "1.1em";

  const baseStyle = (active: boolean): React.CSSProperties => ({
    width: baseSize,
    height: baseSize,
    transform: "rotate(45deg)",
    border: `2px solid ${active ? "var(--accent)" : "var(--gray-600)"}`,
    background: active ? "var(--accent)" : "var(--gray-800)",
    transition: `all var(--duration-fast) var(--ease-in-out)`,
  });

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "0.5em",
        padding: "0.6em",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.15em" }}>
        <div style={baseStyle(second)} />
        <div style={{ display: "flex", gap: "1em" }}>
          <div style={baseStyle(third)} />
          <div style={baseStyle(first)} />
        </div>
      </div>
    </div>
  );
}
