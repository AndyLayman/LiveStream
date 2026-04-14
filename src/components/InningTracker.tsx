"use client";

interface InningTrackerProps {
  currentInning: number;
  isTopInning: boolean;
  totalInnings?: number;
}

export default function InningTracker({
  currentInning,
  isTopInning,
  totalInnings = 9,
}: InningTrackerProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "0.5em",
        padding: "0.5em 1em",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.8em" }}>
        {/* Inning arrow */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.1em", marginRight: "0.2em" }}>
          <span
            style={{
              fontSize: "0.55em",
              lineHeight: 1,
              color: isTopInning ? "var(--text)" : "var(--text-dim)",
              transition: `color var(--duration-fast) var(--ease-in-out)`,
            }}
          >
            &#9650;
          </span>
          <span style={{ fontSize: "1.2em", fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>
            {currentInning}
          </span>
          <span
            style={{
              fontSize: "0.55em",
              lineHeight: 1,
              color: !isTopInning ? "var(--text)" : "var(--text-dim)",
              transition: `color var(--duration-fast) var(--ease-in-out)`,
            }}
          >
            &#9660;
          </span>
        </div>

        {/* Inning dots */}
        <div style={{ display: "flex", gap: "0.3em" }}>
          {Array.from({ length: totalInnings }, (_, i) => i + 1).map(
            (inning) => (
              <div
                key={inning}
                style={{
                  width: "0.5em",
                  height: "0.5em",
                  borderRadius: "var(--r-full)",
                  background:
                    inning < currentInning
                      ? "var(--accent)"
                      : inning === currentInning
                        ? "var(--text)"
                        : "var(--gray-600)",
                  transition: `background var(--duration-fast) var(--ease-in-out)`,
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
