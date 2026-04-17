"use client";

import { ReactionType } from "@/lib/useReactions";

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "celebrate", emoji: "\u{1F389}", label: "Celebrate" },
  { type: "fire", emoji: "\u{1F525}", label: "Fire" },
  { type: "sad", emoji: "\u{1F622}", label: "Sad" },
  { type: "laugh", emoji: "\u{1F602}", label: "Laugh" },
];

interface ReactionButtonsProps {
  onReact: (type: ReactionType) => void;
}

export default function ReactionButtons({ onReact }: ReactionButtonsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.15em",
      }}
    >
      {REACTIONS.map((r) => (
        <button
          key={r.type}
          onClick={() => onReact(r.type)}
          style={{
            fontSize: "1.5em",
            width: "1.8em",
            height: "1.8em",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-2)",
            cursor: "pointer",
            transition: `transform var(--duration-fast) var(--ease-spring)`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          title={r.label}
        >
          {r.emoji}
        </button>
      ))}
    </div>
  );
}
