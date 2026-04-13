"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "./supabase";

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
  const recentTimestamps = useRef<number[]>([]);

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
    recentTimestamps.current = recentTimestamps.current.filter(
      (t) => now - t < CELEBRATION_WINDOW_MS
    );
    if (recentTimestamps.current.length >= CELEBRATION_THRESHOLD) {
      setIsCelebrating(true);
      recentTimestamps.current = [];
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

  // Send a reaction
  const sendReaction = useCallback(
    async (type: ReactionType) => {
      if (!gameId) return;
      await supabase.from("stream_reactions").insert({ game_id: gameId, reaction_type: type });
    },
    [gameId]
  );

  return { floatingReactions, isCelebrating, sendReaction, reactionEmojis: REACTION_EMOJIS };
}
