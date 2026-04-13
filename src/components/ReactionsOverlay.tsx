"use client";

import { FloatingReaction, ReactionType } from "@/lib/useReactions";

const REACTION_EMOJIS: Record<ReactionType, string> = {
  celebrate: "\u{1F389}",
  fire: "\u{1F525}",
  sad: "\u{1F622}",
  laugh: "\u{1F602}",
};

interface ReactionsOverlayProps {
  reactions: FloatingReaction[];
  isCelebrating: boolean;
}

export default function ReactionsOverlay({
  reactions,
  isCelebrating,
}: ReactionsOverlayProps) {
  return (
    <>
      {/* Floating emoji reactions */}
      {reactions.map((r) => (
        <div
          key={r.id}
          className="absolute pointer-events-none animate-float-up"
          style={{
            left: `${r.x}%`,
            bottom: "10%",
            fontSize: "2em",
          }}
        >
          {REACTION_EMOJIS[r.type]}
        </div>
      ))}

      {/* Big celebration overlay */}
      {isCelebrating && (
        <div className="absolute inset-0 pointer-events-none animate-fade-out z-30 flex items-center justify-center">
          <div className="celebration-burst">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  fontSize: "2em",
                }}
              >
                {["🎉", "🔥", "⭐", "🎊", "💥"][i % 5]}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
