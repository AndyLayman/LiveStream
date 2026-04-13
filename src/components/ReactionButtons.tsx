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
      className="flex bg-gray-900/80 backdrop-blur-sm border border-gray-700 shadow-2xl"
      style={{ borderRadius: "2em", padding: "0.3em 0.5em", gap: "0.2em" }}
    >
      {REACTIONS.map((r) => (
        <button
          key={r.type}
          onClick={() => onReact(r.type)}
          className="hover:scale-125 active:scale-90 transition-transform"
          style={{ fontSize: "1.5em", padding: "0.2em", lineHeight: 1 }}
          title={r.label}
        >
          {r.emoji}
        </button>
      ))}
    </div>
  );
}
