"use client";

interface TeamInfo {
  abbreviation: string;
  score: number;
  isUs: boolean;
  colorBg?: string | null;
  colorFg?: string | null;
  logoSvg?: string | null;
}

interface BatterGameStats {
  hits: number;
  atBats: number;
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
  batterStats?: BatterGameStats | null;
  pitcher: { number?: string | number | null } | null;
}

/* Figma proportions: team cell = 128px, score cell = 128px, count = 207px, bases = 212px */
/* Using em-based sizing so the parent's font-size controls overall scale */
const CELL = "3.2em";
const COUNT_W = "5.2em";
const BASES_W = "5.3em";
const GAP = "0.08em"; /* thin grey divider between cells */

/* Padres "us" defaults */
const US_BG = "#2F241F";
const US_FG = "#FFC425";
/* Generic opponent defaults */
const DEFAULT_BG = "#111111";
const DEFAULT_FG = "#F7F7F7";

function getTeamColors(team: TeamInfo) {
  return {
    bg: team.colorBg || (team.isUs ? US_BG : DEFAULT_BG),
    fg: team.colorFg || (team.isUs ? US_FG : DEFAULT_FG),
  };
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
  batterStats,
  pitcher,
}: GameOverlayProps) {
  const battingTeam = isTopInning ? away : home;
  const battingColors = getTeamColors(battingTeam);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column-reverse", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Main scoreboard grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `${CELL} ${CELL} ${COUNT_W} ${BASES_W}`,
          gridTemplateRows: `${CELL} ${CELL}`,
          gap: GAP,
        }}
      >
        {/* Row 1: Away */}
        <TeamCell team={away} isFielding={!isTopInning} />
        <ScoreCell score={away.score} />

        {/* Count (P, O, S, B) — spans both rows */}
        <div
          style={{
            gridColumn: 3,
            gridRow: "1 / 3",
            background: "var(--chalk)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "0.35em",
            padding: "0.4em 0.5em",
          }}
        >
          {pitcher && (
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.3em", marginBottom: "0.05em" }}>
              <span style={{ fontSize: "1.125em", fontWeight: 700, color: "var(--night-game)" }}>P</span>
              {pitcher.number != null && (
                <span style={{ fontSize: "1.125em", fontWeight: 400, color: "var(--night-game)" }}>{pitcher.number}</span>
              )}
            </div>
          )}
          <CountRow label="O" filled={outs} total={2} color="var(--night-game)" />
          <CountRow label="S" filled={strikes} total={2} color="var(--stitch-red)" />
          <CountRow label="B" filled={balls} total={3} color="var(--outfield)" />
        </div>

        {/* Bases + Inning — spans both rows */}
        <div
          style={{
            gridColumn: 4,
            gridRow: "1 / 3",
            background: "var(--chalk)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0em",
            padding: "0.2em",
          }}
        >
          <BaseDiamond bases={bases} />
          {/* Inning indicator */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.05em",
              marginTop: "-0.1em",
            }}
          >
            <InningArrow active={isTopInning} direction="up" />
            <span
              style={{
                fontSize: "1.4em",
                fontWeight: 700,
                color: "var(--night-game)",
                lineHeight: 1,
              }}
            >
              {inning}
            </span>
            <InningArrow active={!isTopInning} direction="down" />
          </div>
        </div>

        {/* Row 2: Home */}
        <TeamCell team={home} isFielding={isTopInning} />
        <ScoreCell score={home.score} />
      </div>

      {/* Batter bar */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: batter ? "1fr" : "0fr",
          transition: "grid-template-rows var(--duration-base, 200ms) var(--ease-in-out, ease)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "stretch", marginBottom: GAP }}>
            {/* AB badge */}
            <div
              style={{
                width: "1.95em",
                background: battingColors.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.8em",
                  fontWeight: 400,
                  color: battingColors.fg,
                  letterSpacing: "0.04em",
                }}
              >
                AB
              </span>
            </div>
            {/* Batter name + stats */}
            <div
              style={{
                flex: 1,
                background: "var(--chalk)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.4em 0.6em",
              }}
            >
              <span
                style={{
                  fontSize: "0.95em",
                  fontWeight: 400,
                  color: "var(--night-game)",
                  letterSpacing: "0.02em",
                }}
              >
                {batter?.number != null && `#${batter.number} `}
                {batter?.firstName} {batter?.lastName}
              </span>
              {batterStats && (
                <span
                  style={{
                    fontSize: "0.95em",
                    color: "var(--night-game)",
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{batterStats.hits}</span>
                  {" for "}
                  <span style={{ fontWeight: 700 }}>{batterStats.atBats}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function TeamCell({
  team,
  isFielding,
}: {
  team: TeamInfo;
  isFielding: boolean;
}) {
  const { bg, fg } = getTeamColors(team);
  const hasLogo = !!team.logoSvg;

  return (
    <div
      style={{
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {hasLogo ? (
        <div
          style={{ width: "2em", height: "1.6em", display: "flex", alignItems: "center", justifyContent: "center" }}
          dangerouslySetInnerHTML={{ __html: team.logoSvg!.replace(/fill="[^"]*"/g, `fill="${fg}"`) }}
        />
      ) : team.isUs ? (
        <PadresLogo color={fg} />
      ) : (
        <span
          style={{
            fontWeight: 700,
            fontSize: "1.1em",
            color: fg,
            letterSpacing: "0.06em",
          }}
        >
          {team.abbreviation.slice(0, 2).toUpperCase()}
        </span>
      )}
      {/* Fielding indicator — small diamond + baseball */}
      {isFielding && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "-0.7em",
            transform: "translateY(-50%)",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "1.15em",
            height: "1.15em",
          }}
        >
          {/* Chalk diamond behind the ball */}
          <div
            style={{
              position: "absolute",
              width: "0.82em",
              height: "0.82em",
              background: "var(--chalk)",
              transform: "rotate(45deg)",
            }}
          />
          {/* Baseball */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <BaseballIcon size="0.52em" />
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCell({ score }: { score: number }) {
  return (
    <div
      style={{
        background: "var(--chalk)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: "1.9em",
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

function InningArrow({ active, direction }: { active: boolean; direction: "up" | "down" }) {
  const points = direction === "up" ? "6,11 12,3 18,11" : "6,5 12,13 18,5";
  return (
    <svg width="1.1em" height="0.7em" viewBox="0 0 24 16">
      <polygon
        points={points}
        fill={active ? "var(--night-game)" : "none"}
        stroke="var(--night-game)"
        strokeWidth={active ? 0 : 2}
      />
    </svg>
  );
}

function BaseDiamond({
  bases,
}: {
  bases: { first: boolean; second: boolean; third: boolean };
}) {
  /*
   * Figma geometry (normalized to em units):
   * - Base square: 1.12em, border 0.1em, rotated 45° (bounding box ~1.58em)
   * - 2nd base center: top-center
   * - 3rd base center: left, 1.42em below 2nd
   * - 1st base center: right, 1.42em below 2nd
   * - Horizontal spread (3rd→1st centers): 3.32em
   * - Baselines: rotated rectangles connecting base centers
   */
  const BASE = 1.12;       // base square side length
  const BORDER = 0.1;      // border width
  const BB = BASE * Math.SQRT2; // bounding box of rotated base
  const H_SPREAD = 3.32;   // horizontal distance between 3rd and 1st centers
  const V_DROP = 1.6;      // vertical distance from 2nd center to 3rd/1st centers
  const LINE_LEN = Math.sqrt(H_SPREAD / 2 * H_SPREAD / 2 + V_DROP * V_DROP);
  const LINE_ANGLE = Math.atan2(V_DROP, H_SPREAD / 2) * (180 / Math.PI);
  const LINE_W = 0.16;

  const W = H_SPREAD + BB;         // total width
  const H = V_DROP + BB;           // total height
  const CX = W / 2;               // center X
  const SECOND_Y = BB / 2;        // 2nd base center Y
  const SIDE_Y = SECOND_Y + V_DROP; // 3rd/1st base center Y

  return (
    <div
      style={{
        position: "relative",
        width: `${W}em`,
        height: `${H}em`,
      }}
    >
      {/* Baseline: 2nd → 3rd */}
      <div
        style={{
          position: "absolute",
          left: `${CX}em`,
          top: `${SECOND_Y}em`,
          width: `${LINE_LEN}em`,
          height: `${LINE_W}em`,
          background: "var(--night-game)",
          transformOrigin: "0 50%",
          transform: `rotate(${LINE_ANGLE}deg)`,
          marginLeft: `-${LINE_W / 2}em`,
        }}
      />
      {/* Baseline: 2nd → 1st */}
      <div
        style={{
          position: "absolute",
          right: `${CX}em`,
          top: `${SECOND_Y}em`,
          width: `${LINE_LEN}em`,
          height: `${LINE_W}em`,
          background: "var(--night-game)",
          transformOrigin: "100% 50%",
          transform: `rotate(-${LINE_ANGLE}deg)`,
          marginRight: `-${LINE_W / 2}em`,
        }}
      />

      {/* Second base — top center */}
      <Diamond
        active={bases.second}
        style={{
          position: "absolute",
          top: `${SECOND_Y - BASE / 2}em`,
          left: `${CX - BASE / 2}em`,
          transform: "rotate(45deg)",
        }}
        size={BASE}
        border={BORDER}
      />
      {/* Third base — middle left */}
      <Diamond
        active={bases.third}
        style={{
          position: "absolute",
          top: `${SIDE_Y - BASE / 2}em`,
          left: `${CX - H_SPREAD / 2 - BASE / 2}em`,
          transform: "rotate(45deg)",
        }}
        size={BASE}
        border={BORDER}
      />
      {/* First base — middle right */}
      <Diamond
        active={bases.first}
        style={{
          position: "absolute",
          top: `${SIDE_Y - BASE / 2}em`,
          left: `${CX + H_SPREAD / 2 - BASE / 2}em`,
          transform: "rotate(45deg)",
        }}
        size={BASE}
        border={BORDER}
      />
    </div>
  );
}

function Diamond({
  active,
  style,
  size = 1.12,
  border = 0.1,
}: {
  active: boolean;
  style?: React.CSSProperties;
  size?: number;
  border?: number;
}) {
  return (
    <div
      style={{
        width: `${size}em`,
        height: `${size}em`,
        border: `${border}em solid var(--night-game)`,
        background: active ? "var(--night-game)" : "var(--chalk)",
        transition: "all var(--duration-fast, 100ms) ease",
        ...style,
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
    <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
      <span
        style={{
          fontSize: "1.125em",
          fontWeight: 700,
          color: "var(--night-game)",
          width: "0.85em",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: "0.4em" }}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{
              width: "0.7em",
              height: "0.7em",
              borderRadius: "50%",
              border: `0.07em solid ${i < filled ? color : "var(--night-game)"}`,
              background: i < filled ? color : "transparent",
              transition: "all var(--duration-fast, 100ms) ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function BaseballIcon({ size = "0.5em" }: { size?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="11" fill="var(--chalk)" stroke="var(--stitch-red)" strokeWidth="2" />
      <path
        d="M9.5 1C9.2 5.5 7 9 4 11.5M14.5 23C14.8 18.5 17 15 20 12.5"
        stroke="var(--stitch-red)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
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
