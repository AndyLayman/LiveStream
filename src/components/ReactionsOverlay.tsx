"use client";

import { useEffect, useRef } from "react";
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
  celebrationEmoji?: ReactionType;
}

const BURST_COUNT = 12;

export default function ReactionsOverlay({
  reactions,
  isCelebrating,
  celebrationEmoji = "celebrate",
}: ReactionsOverlayProps) {
  const emoji = REACTION_EMOJIS[celebrationEmoji];

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
          <span className="wobble">{REACTION_EMOJIS[r.type]}</span>
        </div>
      ))}

      {/* Celebration — big emoji with mini burst */}
      {isCelebrating && (
        <div
          className="absolute pointer-events-none z-30"
          style={{
            bottom: "8em",
            right: "1.5em",
            fontSize: "1.2cqw",
          }}
        >
          {/* Mini emojis radiating outward */}
          {Array.from({ length: BURST_COUNT }, (_, i) => {
            const angle = (360 / BURST_COUNT) * i;
            const rad = (angle * Math.PI) / 180;
            const dist = 120 + Math.random() * 40;
            const tx = Math.cos(rad) * dist;
            const ty = Math.sin(rad) * dist;
            return (
              <BurstParticle key={i} emoji={emoji} tx={tx} ty={ty} delay={i * 30} />
            );
          })}
          {/* Big central emoji */}
          <div className="animate-celebrate-pop" style={{ fontSize: "5em" }}>
            {emoji}
          </div>
        </div>
      )}
    </>
  );
}

function BurstParticle({ emoji, tx, ty, delay }: { emoji: string; tx: number; ty: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const timeout = setTimeout(() => {
      const anim = el.animate(
        [
          { transform: "translate(-50%, -50%) translate(0px, 0px) scale(1)", opacity: 1 },
          { transform: `translate(-50%, -50%) translate(${tx * 0.5}px, ${ty * 0.5}px) scale(0.1)`, opacity: 0 },
        ],
        { duration: 400, easing: "ease-out", fill: "forwards" }
      );
      anim.onfinish = () => { el.style.display = "none"; };
    }, delay);

    return () => clearTimeout(timeout);
  }, [tx, ty, delay]);

  return (
    <span
      ref={ref}
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        fontSize: "1.5em",
        transform: "translate(-50%, -50%)",
      }}
    >
      {emoji}
    </span>
  );
}
