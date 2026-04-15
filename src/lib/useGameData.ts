"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

interface GameState {
  current_inning: number;
  current_half: "top" | "bottom";
  outs: number;
  runner_first: number | null;
  runner_second: number | null;
  runner_third: number | null;
  opponent_runner_first: string | null;
  opponent_runner_second: string | null;
  opponent_runner_third: string | null;
  current_batter_index: number;
  opponent_batter_index: number;
  current_pitcher_id: number | null;
}

interface Game {
  id: string;
  opponent: string;
  our_score: number;
  opponent_score: number;
  num_innings: number | null;
  status: string;
  location: string;
  opponent_logo_svg: string | null;
  opponent_color_fg: string | null;
  opponent_color_bg: string | null;
}

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  number: string | null;
}

interface LineupEntry {
  player_id: number;
  batting_order: number;
  players: Player;
}

interface Pitch {
  pitch_type: "ball" | "strike" | "foul";
}

export interface GameData {
  game: Game | null;
  gameState: GameState | null;
  currentBatter: Player | null;
  currentPitcher: Player | null;
  balls: number;
  strikes: number;
  loading: boolean;
}

export function useGameData(gameId: string | null): GameData {
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [lineup, setLineup] = useState<LineupEntry[]>([]);
  const [balls, setBalls] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    async function fetchAll() {
      const [gameRes, stateRes, lineupRes] = await Promise.all([
        supabase.from("games").select("*").eq("id", gameId).single(),
        supabase.from("game_state").select("*").eq("game_id", gameId).single(),
        supabase
          .from("game_lineup")
          .select("player_id, batting_order, players(id, first_name, last_name, number)")
          .eq("game_id", gameId)
          .order("batting_order"),
      ]);

      if (gameRes.data) setGame(gameRes.data);
      if (stateRes.data) setGameState(stateRes.data);
      if (lineupRes.data) setLineup(lineupRes.data as unknown as LineupEntry[]);
      setLoading(false);
    }

    fetchAll();
  }, [gameId]);

  // Fetch pitch count whenever game state changes (new batter, new inning, etc.)
  useEffect(() => {
    if (!gameId || !gameState) return;

    async function fetchPitches() {
      const isOurAtBat = gameState!.current_half === "bottom";
      const { data } = await supabase
        .from("pitches")
        .select("pitch_type")
        .eq("game_id", gameId!)
        .eq("inning", gameState!.current_inning)
        .eq("half", gameState!.current_half)
        .order("pitch_num", { ascending: false });

      if (!data || data.length === 0) {
        setBalls(0);
        setStrikes(0);
        return;
      }

      // Get pitches for the current at-bat (reset on each new batter)
      // The most recent sequence of pitches before a plate appearance result
      let b = 0;
      let s = 0;
      for (const pitch of data) {
        if (pitch.pitch_type === "ball") b++;
        else if (pitch.pitch_type === "strike") s = Math.min(s + 1, 2);
        else if (pitch.pitch_type === "foul") s = Math.min(s + 1, 2);
      }
      setBalls(b);
      setStrikes(s);
    }

    fetchPitches();
  }, [gameId, gameState]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel(`game-${gameId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games", filter: `id=eq.${gameId}` },
        (payload) => {
          if (payload.new) setGame(payload.new as Game);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_state", filter: `game_id=eq.${gameId}` },
        (payload) => {
          if (payload.new) setGameState(payload.new as GameState);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pitches", filter: `game_id=eq.${gameId}` },
        (payload) => {
          const pitch = payload.new as Pitch;
          if (pitch.pitch_type === "ball") {
            setBalls((prev) => prev + 1);
          } else if (pitch.pitch_type === "strike" || pitch.pitch_type === "foul") {
            setStrikes((prev) => Math.min(prev + 1, 2));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_lineup", filter: `game_id=eq.${gameId}` },
        async () => {
          const { data } = await supabase
            .from("game_lineup")
            .select("player_id, batting_order, players(id, first_name, last_name, number)")
            .eq("game_id", gameId)
            .order("batting_order");
          if (data) setLineup(data as unknown as LineupEntry[]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  // Resolve current batter from lineup + batter index
  const currentBatter =
    gameState && lineup.length > 0
      ? lineup[gameState.current_batter_index % lineup.length]?.players ?? null
      : null;

  // Resolve current pitcher
  const [currentPitcher, setCurrentPitcher] = useState<Player | null>(null);
  useEffect(() => {
    if (!gameState?.current_pitcher_id) {
      setCurrentPitcher(null);
      return;
    }
    async function fetchPitcher() {
      const { data } = await supabase
        .from("players")
        .select("id, first_name, last_name, number")
        .eq("id", gameState!.current_pitcher_id!)
        .single();
      if (data) setCurrentPitcher(data);
    }
    fetchPitcher();
  }, [gameState?.current_pitcher_id]);

  return { game, gameState, currentBatter, currentPitcher, balls, strikes, loading };
}
