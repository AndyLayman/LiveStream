"use client";

interface CountIndicatorProps {
  balls: number;
  strikes: number;
  outs: number;
}

export default function CountIndicator({
  balls,
  strikes,
  outs,
}: CountIndicatorProps) {
  const dotSize = "0.8em";

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "0.5em",
        padding: "0.5em 1em",
      }}
    >
      <div style={{ display: "flex", gap: "1.5em", fontSize: "0.7em", fontWeight: 500 }}>
        {/* Balls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4em" }}>
          <span style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>B</span>
          <div style={{ display: "flex", gap: "0.25em" }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "var(--r-full)",
                  border: `1px solid ${i < balls ? "var(--fresh-cut)" : "var(--gray-600)"}`,
                  background: i < balls ? "var(--fresh-cut)" : "var(--gray-800)",
                  transition: `all var(--duration-fast) var(--ease-in-out)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Strikes */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4em" }}>
          <span style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>S</span>
          <div style={{ display: "flex", gap: "0.25em" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "var(--r-full)",
                  border: `1px solid ${i < strikes ? "var(--stitch-red)" : "var(--gray-600)"}`,
                  background: i < strikes ? "var(--stitch-red)" : "var(--gray-800)",
                  transition: `all var(--duration-fast) var(--ease-in-out)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Outs */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4em" }}>
          <span style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>O</span>
          <div style={{ display: "flex", gap: "0.25em" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "var(--r-full)",
                  border: `1px solid ${i < outs ? "var(--accent)" : "var(--gray-600)"}`,
                  background: i < outs ? "var(--accent)" : "var(--gray-800)",
                  transition: `all var(--duration-fast) var(--ease-in-out)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
