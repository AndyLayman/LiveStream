"use client";

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
          gridTemplateColumns: `${CELL} ${CELL} 0.15em ${CELL} 0.15em 6em`,
          gridTemplateRows: `3em ${CELL} 0.15em ${CELL}`,
        }}
      >
        {/* Bases diamond — row 1, col 4, triangle background */}
        <div
          style={{
            gridColumn: 6,
            gridRow: 1,
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            overflow: "visible",
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
          <div style={{ position: "relative", zIndex: 1, transform: "translateY(0.4em)" }}>
            <BaseDiamond bases={bases} />
          </div>
        </div>

        {/* Away team cell */}
        <TeamCell row={2} abbreviation={away.abbreviation} isUs={away.isUs} />
        {/* Away score cell */}
        <ScoreCell row={2} score={away.score} />

        {/* Inning — rows 2–4, col 4 */}
        <div
          style={{
            gridColumn: 4,
            gridRow: "2 / 5",
            background: "var(--chalk)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4em",
          }}
        >
          <NavArrowUpSolid
            width="0.9em"
            height="0.9em"
            color={isTopInning ? "var(--night-game)" : "var(--chalk)"}
            style={isTopInning ? undefined : { stroke: "var(--night-game)", strokeWidth: 1 }}
          />
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
          <NavArrowDownSolid
            width="0.9em"
            height="0.9em"
            color={!isTopInning ? "var(--night-game)" : "var(--chalk)"}
            style={!isTopInning ? undefined : { stroke: "var(--night-game)", strokeWidth: 1 }}
          />
        </div>

        {/* Count (O/S/B) — rows 2–4, col 6 */}
        <div
          style={{
            gridColumn: 6,
            gridRow: "2 / 5",
            background: "var(--chalk)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: "0.05em",
            paddingLeft: "0.6em",
            paddingBottom: "0.3em",
          }}
        >
          <CountRow label="O" filled={outs} total={2} color="var(--night-game)" />
          <CountRow label="S" filled={strikes} total={2} color="var(--stitch-red)" />
          <CountRow label="B" filled={balls} total={3} color="var(--outfield)" />
        </div>

        {/* Home team cell */}
        <TeamCell row={4} abbreviation={home.abbreviation} isUs={home.isUs} />
        {/* Home score cell */}
        <ScoreCell row={4} score={home.score} />
      </div>

      {/* Batter bar */}
      {batter && (() => {
        const battingTeamIsUs = isTopInning ? away.isUs : home.isUs;
        const abBg = battingTeamIsUs ? "var(--night-game)" : "var(--night-game)";
        const abColor = battingTeamIsUs ? "var(--clay)" : "var(--chalk)";
        return (
        <div style={{ display: "flex", alignItems: "stretch", marginTop: "0.1em" }}>
          <div
            style={{
              width: CELL,
              padding: "0.35em 0",
              background: abBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.7em",
                fontWeight: 600,
                color: abColor,
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
        );
      })()}
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
        background: "var(--night-game)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isUs ? (
        <Six43Logo color="var(--clay)" />
      ) : (
        <span
          style={{
            fontWeight: 700,
            fontSize: "0.95em",
            color: "var(--chalk)",
            letterSpacing: "0.06em",
          }}
        >
          {abbreviation.slice(0, 2).toUpperCase()}
        </span>
      )}
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
              width: "0.5em",
              height: "0.5em",
              borderRadius: "50%",
              border: `0.1em solid ${i < filled ? color : "var(--night-game)"}`,
              background: i < filled ? color : "transparent",
              transition: "all var(--duration-fast) var(--ease-in-out)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Six43Logo({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      width="1.4em"
      height="1.2em"
      viewBox="0 0 33 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.82602 3.80953C11.9054 -1.26984 20.1407 -1.26984 25.2201 3.80953L31.3444 9.93381C32.28 10.8695 32.2801 12.3865 31.3444 13.3222L17.7173 26.9492C16.7816 27.8849 15.2646 27.8849 14.3289 26.9492L0.701741 13.3222C-0.233923 12.3865 -0.233904 10.8695 0.701741 9.93381L6.82602 3.80953ZM16.9149 3.21411C16.3178 3.15929 15.7168 3.16214 15.1202 3.22257L14.8005 3.255C13.4619 3.3906 12.1692 3.81828 11.0138 4.50791C10.5194 4.80305 10.0537 5.14404 9.62298 5.52628L9.19067 5.91001C8.90516 6.1634 9.03836 6.63444 9.41429 6.70075L14.6669 7.62732C17.3189 8.09514 19.9345 8.75021 22.4939 9.58752L27.7916 11.3205C28.0221 11.3959 28.1955 11.1072 28.0207 10.9391L22.758 5.88093L21.7436 5.103C20.3447 4.03017 18.6705 3.37528 16.9149 3.21411Z"
        fill={color}
      />
    </svg>
  );
}
