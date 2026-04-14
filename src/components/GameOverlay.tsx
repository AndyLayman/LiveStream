"use client";

import { NavArrowUp, NavArrowDown } from "iconoir-react/regular";
import { NavArrowUp as NavArrowUpSolid, NavArrowDown as NavArrowDownSolid } from "iconoir-react/solid";

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
      {/* Main scoreboard grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `${CELL} ${CELL} ${CELL} 6em`,
          gridTemplateRows: `2.8em ${CELL} ${CELL}`,
        }}
      >
        {/* Bases diamond — row 1, col 4, triangle background */}
        <div
          style={{
            gridColumn: 4,
            gridRow: 1,
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "0.1em",
          }}
        >
          {/* Triangle background shape */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--chalk)",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          />
          {/* Diamond content (not clipped) */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <BaseDiamond bases={bases} />
          </div>
        </div>

        {/* Away team cell */}
        <TeamCell row={2} abbreviation={away.abbreviation} isUs={away.isUs} />
        {/* Away score cell */}
        <ScoreCell row={2} score={away.score} />

        {/* Inning — rows 2–3, col 3 */}
        <div
          style={{
            gridColumn: 3,
            gridRow: "2 / 4",
            background: "var(--chalk)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.08em",
          }}
        >
          {isTopInning ? (
            <NavArrowUpSolid width="0.9em" height="0.9em" color="var(--night-game)" />
          ) : (
            <NavArrowUp width="0.9em" height="0.9em" color="var(--night-game)" style={{ opacity: 0.2 }} />
          )}
          <span
            style={{
              fontSize: "1.2em",
              fontWeight: 700,
              color: "var(--night-game)",
              lineHeight: 1,
            }}
          >
            {inning}
          </span>
          {!isTopInning ? (
            <NavArrowDownSolid width="0.9em" height="0.9em" color="var(--night-game)" />
          ) : (
            <NavArrowDown width="0.9em" height="0.9em" color="var(--night-game)" style={{ opacity: 0.2 }} />
          )}
        </div>

        {/* Count (O/S/B) — rows 2–3, col 4 */}
        <div
          style={{
            gridColumn: 4,
            gridRow: "2 / 4",
            background: "var(--chalk)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "0.05em",
            paddingLeft: "0.6em",
          }}
        >
          <CountRow label="O" filled={outs} total={2} color="var(--night-game)" />
          <CountRow label="S" filled={strikes} total={2} color="var(--stitch-red)" />
          <CountRow label="B" filled={balls} total={3} color="var(--outfield)" />
        </div>

        {/* Home team cell */}
        <TeamCell row={3} abbreviation={home.abbreviation} isUs={home.isUs} />
        {/* Home score cell */}
        <ScoreCell row={3} score={home.score} />
      </div>

      {/* Batter bar */}
      {batter && (
        <div style={{ display: "flex", alignItems: "stretch", marginTop: "0.1em" }}>
          <div
            style={{
              width: CELL,
              padding: "0.35em 0",
              background: "var(--dirt)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.7em",
                fontWeight: 600,
                color: "var(--chalk)",
                letterSpacing: "0.04em",
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
              padding: "0.35em 0.6em",
            }}
          >
            <span
              style={{
                fontSize: "0.8em",
                fontWeight: 400,
                color: "var(--night-game)",
                letterSpacing: "0.02em",
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

/* ── Sub-components ── */

function TeamCell({
  row,
  abbreviation,
  isUs,
}: {
  row: number;
  abbreviation: string;
  isUs: boolean;
}) {
  return (
    <div
      style={{
        gridColumn: 1,
        gridRow: row,
        background: isUs ? "var(--dirt)" : "var(--night-game)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: "0.95em",
          color: isUs ? "var(--clay)" : "var(--chalk)",
          letterSpacing: "0.06em",
        }}
      >
        {abbreviation.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

function ScoreCell({ row, score }: { row: number; score: number }) {
  return (
    <div
      style={{
        gridColumn: 2,
        gridRow: row,
        background: "var(--chalk)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: "1.6em",
          fontWeight: 700,
          color: "var(--night-game)",
          lineHeight: 1,
        }}
      >
        {score}
      </span>
    </div>
  );
}

function BaseDiamond({
  bases,
}: {
  bases: { first: boolean; second: boolean; third: boolean };
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Diamond active={bases.second} />
      <div style={{ display: "flex", gap: "0.9em", marginTop: "-0.2em" }}>
        <Diamond active={bases.third} />
        <Diamond active={bases.first} />
      </div>
    </div>
  );
}

function Diamond({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: "1.3em",
        height: "1.3em",
        transform: "rotate(45deg)",
        border: `0.13em solid ${active ? "var(--chalk)" : "var(--night-game)"}`,
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
    <div style={{ display: "flex", alignItems: "center", gap: "0.2em" }}>
      <span
        style={{
          fontSize: "0.75em",
          fontWeight: 700,
          color: "var(--night-game)",
          width: "0.9em",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: "0.2em" }}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{
              width: "0.45em",
              height: "0.45em",
              borderRadius: "50%",
              border: `2px solid ${i < filled ? color : "var(--night-game)"}`,
              background: i < filled ? color : "var(--chalk)",
              transition: "all var(--duration-fast) var(--ease-in-out)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
