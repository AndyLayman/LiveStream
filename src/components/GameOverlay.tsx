"use client";

interface GameOverlayProps {
  away: { abbreviation: string; score: number; isUs: boolean };
  home: { abbreviation: string; score: number; isUs: boolean };
  inning: number;
  isTopInning: boolean;
  balls: number;
  strikes: number;
  outs: number;
  bases: { first: boolean; second: boolean; third: boolean };
  batter: { firstName: string; lastName: string; number?: string | number | null } | null;
}

export default function GameOverlay({
  away,
  home,
  inning,
  isTopInning,
  balls,
  strikes,
  outs,
  bases,
  batter,
}: GameOverlayProps) {
  const baseSize = "0.95em";
  const dotSize = "0.55em";

  return (
    <div style={{ position: "relative", display: "inline-flex", flexDirection: "column" }}>
      {/* Bases diamond — floats above the count section */}
      <div
        style={{
          position: "absolute",
          bottom: "100%",
          right: "0",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderBottom: "none",
          borderRadius: "0.2em 0.2em 0 0",
          padding: "0.5em 1em 0.25em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.12em",
        }}
      >
        <div style={diamondStyle(bases.second, baseSize)} />
        <div style={{ display: "flex", gap: "0.8em" }}>
          <div style={diamondStyle(bases.third, baseSize)} />
          <div style={diamondStyle(bases.first, baseSize)} />
        </div>
      </div>

      {/* Main scoreboard row */}
      <div
        style={{
          display: "flex",
          border: "1px solid var(--border)",
          borderRadius: "0.2em",
          overflow: "hidden",
          background: "var(--bg-card)",
        }}
      >
        {/* Teams + Scores column */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Away row */}
          <div style={{ display: "flex", flex: 1 }}>
            <div
              style={{
                padding: "0.35em 0.5em",
                background: away.isUs ? "var(--dirt)" : "var(--gray-700)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "3em",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "0.85em",
                  color: away.isUs ? "var(--clay)" : "var(--text)",
                  letterSpacing: "0.05em",
                }}
              >
                {away.abbreviation}
              </span>
            </div>
            <div
              style={{
                padding: "0.25em 0.7em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "2.2em",
              }}
            >
              <span style={{ fontSize: "1.3em", fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>
                {away.score}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--border)" }} />

          {/* Home row */}
          <div style={{ display: "flex", flex: 1 }}>
            <div
              style={{
                padding: "0.35em 0.5em",
                background: home.isUs ? "var(--dirt)" : "var(--gray-700)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "3em",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "0.85em",
                  color: home.isUs ? "var(--clay)" : "var(--text)",
                  letterSpacing: "0.05em",
                }}
              >
                {home.abbreviation}
              </span>
            </div>
            <div
              style={{
                padding: "0.25em 0.7em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "2.2em",
              }}
            >
              <span style={{ fontSize: "1.3em", fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>
                {home.score}
              </span>
            </div>
          </div>
        </div>

        {/* Inning indicator */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.08em",
            padding: "0 0.55em",
            borderLeft: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              fontSize: "0.5em",
              lineHeight: 1,
              color: isTopInning ? "var(--text)" : "var(--text-dim)",
              transition: "color var(--duration-fast) var(--ease-in-out)",
            }}
          >
            &#9650;
          </span>
          <span style={{ fontSize: "1.15em", fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>
            {inning}
          </span>
          <span
            style={{
              fontSize: "0.5em",
              lineHeight: 1,
              color: !isTopInning ? "var(--text)" : "var(--text-dim)",
              transition: "color var(--duration-fast) var(--ease-in-out)",
            }}
          >
            &#9660;
          </span>
        </div>

        {/* Count (O / S / B) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "0.2em",
            padding: "0.4em 0.7em",
            borderLeft: "1px solid var(--border)",
          }}
        >
          <CountRow label="O" filled={outs} total={3} color="var(--text)" dotSize={dotSize} />
          <CountRow label="S" filled={strikes} total={3} color="var(--stitch-red)" dotSize={dotSize} />
          <CountRow label="B" filled={balls} total={4} color="var(--fresh-cut)" dotSize={dotSize} />
        </div>
      </div>

      {/* Batter bar */}
      {batter && (
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            marginTop: "0.15em",
            border: "1px solid var(--border)",
            borderRadius: "0.2em",
            overflow: "hidden",
            background: "var(--bg-card)",
          }}
        >
          <div
            style={{
              padding: "0.25em 0.55em",
              background: "var(--gray-700)",
              fontSize: "0.6em",
              fontWeight: 600,
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
            }}
          >
            AB
          </div>
          <div
            style={{
              padding: "0.25em 0.6em",
              fontSize: "0.8em",
              fontWeight: 500,
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {batter.number != null && (
              <span style={{ color: "var(--text-muted)", marginRight: "0.3em" }}>#{batter.number}</span>
            )}
            {batter.firstName} {batter.lastName}
          </div>
        </div>
      )}
    </div>
  );
}

function diamondStyle(active: boolean, size: string): React.CSSProperties {
  return {
    width: size,
    height: size,
    transform: "rotate(45deg)",
    border: `2px solid ${active ? "var(--accent)" : "var(--text-dim)"}`,
    background: active ? "var(--accent)" : "transparent",
    transition: "all var(--duration-fast) var(--ease-in-out)",
  };
}

function CountRow({
  label,
  filled,
  total,
  color,
  dotSize,
}: {
  label: string;
  filled: number;
  total: number;
  color: string;
  dotSize: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.3em" }}>
      <span
        style={{
          fontSize: "0.55em",
          fontWeight: 600,
          color: "var(--text-muted)",
          width: "0.9em",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: "0.25em" }}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              border: `1.5px solid ${i < filled ? color : "var(--gray-500)"}`,
              background: i < filled ? color : "transparent",
              transition: "all var(--duration-fast) var(--ease-in-out)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
