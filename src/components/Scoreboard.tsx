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
      className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 overflow-hidden shadow-2xl"
      style={{ borderRadius: "0.5em", minWidth: "22em" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between bg-gray-800/80 font-semibold text-gray-400 uppercase tracking-wider"
        style={{ padding: "0.3em 0.8em", fontSize: "0.65em" }}
      >
        <span>Inning {inning}</span>
        <div style={{ display: "flex", gap: "1.2em" }}>
          <span style={{ width: "2em", textAlign: "center" }}>R</span>
          <span style={{ width: "2em", textAlign: "center" }}>H</span>
          <span style={{ width: "2em", textAlign: "center" }}>E</span>
        </div>
      </div>

      {/* Away Team */}
      <TeamRow team={away} isAtBat={isTopInning} />

      {/* Divider */}
      <div className="bg-gray-700/50" style={{ height: "1px" }} />

      {/* Home Team */}
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
      className={`flex items-center justify-between transition-colors ${
        isAtBat ? "bg-yellow-500/10" : ""
      }`}
      style={{ padding: "0.4em 0.8em" }}
    >
      <div className="flex items-center" style={{ gap: "0.5em" }}>
        {isAtBat && (
          <span className="text-yellow-400" style={{ fontSize: "0.6em" }}>&#9654;</span>
        )}
        <span
          className={`font-bold tracking-wide ${
            isAtBat ? "text-white" : "text-gray-300"
          }`}
          style={{ fontSize: "0.85em" }}
        >
          {team.abbreviation}
        </span>
      </div>
      <div style={{ display: "flex", gap: "1.2em" }}>
        <span className="font-mono font-bold text-white" style={{ width: "2em", textAlign: "center", fontSize: "1.1em" }}>
          {team.runs}
        </span>
        <span className="font-mono text-gray-300" style={{ width: "2em", textAlign: "center", fontSize: "1.1em" }}>
          {team.hits}
        </span>
        <span className="font-mono text-gray-400" style={{ width: "2em", textAlign: "center", fontSize: "1.1em" }}>
          {team.errors}
        </span>
      </div>
    </div>
  );
}
