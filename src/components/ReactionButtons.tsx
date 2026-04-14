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
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "2em",
        padding: "0.3em 0.5em",
        gap: "0.2em",
      }}
    >
      {REACTIONS.map((r) => (
        <button
          key={r.type}
          onClick={() => onReact(r.type)}
          style={{
            fontSize: "1.5em",
            padding: "0.2em",
            lineHeight: 1,
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: `transform var(--duration-fast) var(--ease-spring)`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.25)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.25)")}
          title={r.label}
        >
          {r.emoji}
        </button>
      ))}
    </div>
  );
}
