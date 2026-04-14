"use client";

import { NavArrowUp as NavArrowUpSolid, NavArrowDown as NavArrowDownSolid } from "iconoir-react/solid";

interface TeamInfo {
  abbreviation: string;
  score: number;
  isUs: boolean;
  colorBg?: string | null;
  colorFg?: string | null;
  logoSvg?: string | null;
}

interface GameOverlayProps {
  away: TeamInfo;
  home: TeamInfo;
  inning: number;
  isTopInning: boolean;
  balls: number;
  strikes: number;
  outs: number;
  bases: { first: boolean; second: boolean; third: boolean };
  batter: { firstName: string; lastName: string; number?: string | number | null } | null;
}

const CELL = "2.5em";

/* Padres "us" defaults */
const US_BG = "#2F241F";
const US_FG = "#FFC425";
/* Generic opponent defaults */
const DEFAULT_BG = "#111111";
const DEFAULT_FG = "#F7F7F7";

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
  const battingTeam = isTopInning ? away : home;
  const battingBg = battingTeam.colorBg || (battingTeam.isUs ? US_BG : DEFAULT_BG);
  const battingFg = battingTeam.colorFg || (battingTeam.isUs ? US_FG : DEFAULT_FG);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      {/* Main scoreboard grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `${CELL} ${CELL} 0.15em ${CELL} 0.15em 6em`,
          gridTemplateRows: `3em ${CELL} 0.15em ${CELL}`,
          overflow: "visible",
        }}
      >
        {/* Bases diamond — row 1, col 6, triangle background */}
        <div
          style={{
            gridColumn: 6,
            gridRow: 1,
            position: "relative",
            overflow: "visible",
            zIndex: 2,
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
          {/* Diamond content — positioned at bottom center, allowed to overflow */}
          <div
            style={{
              position: "absolute",
              bottom: "-0.4em",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          >
            <BaseDiamond bases={bases} activeColor={battingBg} activeBorder={battingFg} />
          </div>
        </div>

        {/* Away team cell */}
        <TeamCell row={2} team={away} />
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
        <TeamCell row={4} team={home} />
        {/* Home score cell */}
        <ScoreCell row={4} score={home.score} />
      </div>

      {/* Batter bar */}
      {batter && (() => {
        const abBg = battingBg;
        const abColor = battingFg;
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
  team,
}: {
  row: number;
  team: TeamInfo;
}) {
  const bg = team.colorBg || (team.isUs ? US_BG : DEFAULT_BG);
  const fg = team.colorFg || (team.isUs ? US_FG : DEFAULT_FG);
  const hasLogo = !!team.logoSvg;

  return (
    <div
      style={{
        gridColumn: 1,
        gridRow: row,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {hasLogo ? (
        <div
          style={{ width: "1.4em", height: "1em", display: "flex", alignItems: "center", justifyContent: "center" }}
          dangerouslySetInnerHTML={{ __html: team.logoSvg!.replace(/fill="[^"]*"/g, `fill="${fg}"`) }}
        />
      ) : team.isUs ? (
        <PadresLogo color={fg} />
      ) : (
        <span
          style={{
            fontWeight: 700,
            fontSize: "0.95em",
            color: fg,
            letterSpacing: "0.06em",
          }}
        >
          {team.abbreviation.slice(0, 2).toUpperCase()}
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
  activeColor,
  activeBorder,
}: {
  bases: { first: boolean; second: boolean; third: boolean };
  activeColor: string;
  activeBorder: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Diamond active={bases.second} activeColor={activeColor} activeBorder={activeBorder} />
      <div style={{ display: "flex", gap: "0.9em", marginTop: "-0.2em" }}>
        <Diamond active={bases.third} activeColor={activeColor} activeBorder={activeBorder} />
        <Diamond active={bases.first} activeColor={activeColor} activeBorder={activeBorder} />
      </div>
    </div>
  );
}

function Diamond({ active, activeColor, activeBorder }: { active: boolean; activeColor: string; activeBorder: string }) {
  return (
    <div
      style={{
        width: "1.3em",
        height: "1.3em",
        transform: "rotate(45deg)",
        border: `0.13em solid ${active ? activeBorder : "var(--night-game)"}`,
        background: active ? activeColor : "var(--chalk)",
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

function PadresLogo({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      width="2em"
      height="1.8em"
      viewBox="170 60 230 300"
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
    >
      <path
        d="M223.522 66.637c-25.46 0-43.636 18.594-43.52 42.922v48.029c0 16.459 13.837 32.726 33.256 32.726h77.64c5.352 0 6.792 4.884 6.792 6.758 0 .666-.064 42.248-.064 42.248.032 11.074-6.452 19.786-17.968 19.786h-11.31v-58.259h-27.079v.044h-.01l.014 58.215h-28.5c-4.838-.164-5.682-4.729-5.682-6.786 0-1.43-.029-19.678-.029-26.241 0-6.978 8.574-9.245 10.66-9.774.267-.067.448-.215.416-.526-.022-.249-.19-.362-.362-.362h-37.764c0 13.77-.005 40.415-.005 40.449-.085 14.308 11.716 30.323 28.907 30.323h32.37l-.004 29.21c-.079 2.423-.488 4.542-1.125 6.416-2.499 6.6-8.629 9.836-11.4 10.437-.707.153-.711.963-.133 1.081l.059.03h90.575l.793-.005c38.459 0 59.953-18.708 59.953-56.609v-100.111c0-38.256-21.581-56.407-59.637-56.407 0 0-90.813.025-91.609.025-.721 0-.774 1.136 0 1.242.716.099 12.504 1.068 12.504 11.881l.004 29.893c-8.478 0-27.012.032-27.837 0-4.568-.055-6.125-3.33-6.366-5.886.007-7.026.008-42.696.015-43.164.27-13.553 7.6-20.475 20.347-20.475l61.608-.029c3.563 0 6.648 1.741 6.648 6.097 0 4.382-4.637 5.645-5.449 6.034-.352.203-.427.748-.034.748h34.43l-.015-11.355c-.275-8.336-5.8-28.594-31.666-28.594l-69.42-.01h-.001zm44.825 78.789h54.42c18.31 0 30.145 13.156 30.145 30.17v105.526c0 17.593-13.834 27.004-31.304 27.004-16.021 0-43.848.021-53.26.03v-21.966h14.327c25.46 0 42.129-18.426 42.129-42.615 0 0-.005-46.985-.005-49.833 0-10.407-8.511-30.473-33.252-30.473h-23.2v-17.844z"
        fill={color}
      />
    </svg>
  );
}
