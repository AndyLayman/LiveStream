"use client";

export interface TeamScore {
  name: string;
  abbreviation: string;
  runs: number;
  hits: number;
  errors: number;
}

interface ScoreboardProps {
  away: TeamScore;
  home: TeamScore;
  inning: number;
  isTopInning: boolean;
}

export default function Scoreboard({
  away,
  home,
  inning,
  isTopInning,
}: ScoreboardProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "0.5em",
        overflow: "hidden",
        minWidth: "22em",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-deep)",
          padding: "0.3em 0.8em",
          fontSize: "0.65em",
          fontWeight: 500,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        <span>Inning {inning}</span>
        <div style={{ display: "flex", gap: "1.2em" }}>
          <span style={{ width: "2em", textAlign: "center" }}>R</span>
          <span style={{ width: "2em", textAlign: "center" }}>H</span>
          <span style={{ width: "2em", textAlign: "center" }}>E</span>
        </div>
      </div>

      <TeamRow team={away} isAtBat={isTopInning} />
      <div style={{ height: "1px", background: "var(--border)" }} />
      <TeamRow team={home} isAtBat={!isTopInning} />
    </div>
  );
}

function TeamRow({
  team,
  isAtBat,
}: {
  team: TeamScore;
  isAtBat: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.4em 0.8em",
        background: isAtBat ? "rgba(233, 215, 180, 0.08)" : "transparent",
        transition: `background var(--duration-fast) var(--ease-in-out)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
        {isAtBat && (
          <span style={{ color: "var(--accent)", fontSize: "0.6em" }}>&#9654;</span>
        )}
        <span
          style={{
            fontWeight: 600,
            fontSize: "0.85em",
            letterSpacing: "0.03em",
            color: isAtBat ? "var(--text)" : "var(--gray-200)",
          }}
        >
          {team.abbreviation}
        </span>
      </div>
      <div style={{ display: "flex", gap: "1.2em" }}>
        <span style={{ width: "2em", textAlign: "center", fontSize: "1.1em", fontWeight: 700, color: "var(--text)" }}>
          {team.runs}
        </span>
        <span style={{ width: "2em", textAlign: "center", fontSize: "1.1em", fontWeight: 400, color: "var(--gray-200)" }}>
          {team.hits}
        </span>
        <span style={{ width: "2em", textAlign: "center", fontSize: "1.1em", fontWeight: 400, color: "var(--text-muted)" }}>
          {team.errors}
        </span>
      </div>
    </div>
  );
}
