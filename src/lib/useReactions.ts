"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "./supabase/client";

export type ReactionType = "celebrate" | "fire" | "sad" | "laugh";

export interface FloatingReaction {
  id: string;
  type: ReactionType;
  x: number; // random horizontal offset (0-100%)
  createdAt: number;
}

const REACTION_EMOJIS: Record<ReactionType, string> = {
  celebrate: "\u{1F389}",
  fire: "\u{1F525}",
  sad: "\u{1F622}",
  laugh: "\u{1F602}",
};

const CELEBRATION_THRESHOLD = 10;
const CELEBRATION_WINDOW_MS = 5000;
const REACTION_LIFETIME_MS = 3000;

export function useReactions(gameId: string | null) {
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [celebrationEmoji, setCelebrationEmoji] = useState<ReactionType>("celebrate");
  const recentTimestamps = useRef<number[]>([]);
  const recentTypes = useRef<ReactionType[]>([]);

  // Clean up expired reactions
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setFloatingReactions((prev) =>
        prev.filter((r) => now - r.createdAt < REACTION_LIFETIME_MS)
      );
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Add a floating reaction to the display
  const addFloating = useCallback((type: ReactionType) => {
    const reaction: FloatingReaction = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      x: 70 + Math.random() * 25, // right side of screen
      createdAt: Date.now(),
    };
    setFloatingReactions((prev) => [...prev.slice(-50), reaction]); // cap at 50

    // Track for celebration threshold
    const now = Date.now();
    recentTimestamps.current.push(now);
    recentTypes.current.push(type);
    recentTimestamps.current = recentTimestamps.current.filter(
      (t, i) => {
        if (now - t < CELEBRATION_WINDOW_MS) return true;
        recentTypes.current.splice(i, 1);
        return false;
      }
    );
    if (recentTimestamps.current.length >= CELEBRATION_THRESHOLD) {
      // Find the most popular reaction type
      const counts: Record<string, number> = {};
      recentTypes.current.forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as ReactionType;
      setCelebrationEmoji(top);
      setIsCelebrating(true);
      recentTimestamps.current = [];
      recentTypes.current = [];
      setTimeout(() => setIsCelebrating(false), 4000);
    }
  }, []);

  // Subscribe to realtime reactions
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel(`reactions-${gameId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "stream_reactions", filter: `game_id=eq.${gameId}` },
        (payload) => {
          const type = payload.new.reaction_type as ReactionType;
          addFloating(type);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, addFloating]);

  // Send a reaction — optimistically show it locally
  const sendReaction = useCallback(
    async (type: ReactionType) => {
      addFloating(type);
      if (!gameId) return;
      await supabase.from("stream_reactions").insert({ game_id: gameId, reaction_type: type });
    },
    [gameId, addFloating]
  );

  return { floatingReactions, isCelebrating, celebrationEmoji, sendReaction, reactionEmojis: REACTION_EMOJIS };
}
