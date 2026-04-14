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

const CELL = "2.5em";

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
  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      {/* Scoreboard + Count/Bases */}
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        {/* Left: Teams + Scores + Inning */}
        <div style={{ display: "flex" }}>
          {/* Teams + Scores */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <TeamRow
              abbreviation={away.abbreviation}
              score={away.score}
              isUs={away.isUs}
            />
            <TeamRow
              abbreviation={home.abbreviation}
              score={home.score}
              isUs={home.isUs}
            />
          </div>

          {/* Inning */}
          <div
            style={{
              width: CELL,
              background: "var(--chalk)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.1em",
            }}
          >
            <span
              style={{
                fontSize: "0.7em",
                lineHeight: 1,
                color: "var(--night-game)",
                opacity: isTopInning ? 1 : 0.2,
                transition: "opacity var(--duration-fast) var(--ease-in-out)",
              }}
            >
              &#9650;
            </span>
            <span
              style={{
                fontSize: "1.15em",
                fontWeight: 700,
                color: "var(--night-game)",
                lineHeight: 1,
              }}
            >
              {inning}
            </span>
            <span
              style={{
                fontSize: "0.7em",
                lineHeight: 1,
                color: "var(--night-game)",
                opacity: !isTopInning ? 1 : 0.2,
                transition: "opacity var(--duration-fast) var(--ease-in-out)",
              }}
            >
              &#9661;
            </span>
          </div>
        </div>

        {/* Right: Bases + Count with pentagon background */}
        <div style={{ position: "relative", width: "6.5em", height: "8em" }}>
          {/* Pentagon background shape */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--chalk)",
              clipPath:
                "polygon(0% 40%, 8% 40%, 50% 2%, 92% 40%, 100% 40%, 100% 100%, 0% 100%)",
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "0.6em",
              paddingBottom: "0.3em",
            }}
          >
            {/* Bases diamond */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.1em",
              }}
            >
              <Diamond active={bases.second} />
              <div style={{ display: "flex", gap: "0.7em" }}>
                <Diamond active={bases.third} />
                <Diamond active={bases.first} />
              </div>
            </div>

            {/* Count dots */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.15em",
                alignSelf: "flex-start",
                paddingLeft: "0.5em",
              }}
            >
              <CountRow label="O" filled={outs} total={2} color="var(--night-game)" />
              <CountRow label="S" filled={strikes} total={2} color="var(--stitch-red)" />
              <CountRow label="B" filled={balls} total={3} color="var(--outfield)" />
            </div>
          </div>
        </div>
      </div>

      {/* Batter bar */}
      {batter && (
        <div style={{ display: "flex", alignItems: "stretch", marginTop: "0.1em" }}>
          <div
            style={{
              width: CELL,
              background: "var(--dirt)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.3em 0",
            }}
          >
            <span
              style={{
                fontSize: "0.65em",
                fontWeight: 500,
                color: "var(--chalk)",
                letterSpacing: "0.05em",
              }}
            >
              AB
            </span>
          </div>
          <div
            style={{
              flex: 1,
              background: "var(--chalk)",
              display: "flex",
              alignItems: "center",
              padding: "0.3em 0.6em",
            }}
          >
            <span
              style={{
                fontSize: "0.8em",
                fontWeight: 400,
                color: "var(--night-game)",
                letterSpacing: "0.03em",
              }}
            >
              {batter.number != null && `#${batter.number} `}
              {batter.firstName} {batter.lastName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function TeamRow({
  abbreviation,
  score,
  isUs,
}: {
  abbreviation: string;
  score: number;
  isUs: boolean;
}) {
  return (
    <div style={{ display: "flex" }}>
      {/* Team cell */}
      <div
        style={{
          width: CELL,
          height: CELL,
          background: isUs ? "var(--dirt)" : "var(--night-game)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: "0.9em",
            color: isUs ? "var(--clay)" : "var(--chalk)",
            letterSpacing: "0.05em",
          }}
        >
          {abbreviation}
        </span>
      </div>
      {/* Score cell */}
      <div
        style={{
          width: CELL,
          height: CELL,
          background: "var(--chalk)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "1.5em",
            fontWeight: 700,
            color: "var(--night-game)",
            lineHeight: 1,
          }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

function Diamond({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: "1.2em",
        height: "1.2em",
        transform: "rotate(45deg)",
        border: `0.15em solid ${active ? "var(--chalk)" : "var(--night-game)"}`,
        background: active ? "var(--night-game)" : "var(--chalk)",
        transition: "all var(--duration-fast) var(--ease-in-out)",
      }}
    />
  );
}

function CountRow({
  label,
  filled,
  total,
  color,
}: {
  label: string;
  filled: number;
  total: number;
  color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25em" }}>
      <span
        style={{
          fontSize: "0.65em",
          fontWeight: 700,
          color: "var(--night-game)",
          width: "1em",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: "0.25em" }}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{
              width: "0.5em",
              height: "0.5em",
              borderRadius: "50%",
              border: `1.5px solid ${i < filled ? color : "var(--night-game)"}`,
              background: i < filled ? color : "var(--chalk)",
              transition: "all var(--duration-fast) var(--ease-in-out)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
