"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useGameData } from "@/lib/useGameData";
import { useReactions } from "@/lib/useReactions";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import Scoreboard from "@/components/Scoreboard";
import CountIndicator from "@/components/CountIndicator";
import InningTracker from "@/components/InningTracker";
import BasesIndicator from "@/components/BasesIndicator";
import ReactionsOverlay from "@/components/ReactionsOverlay";
import ReactionButtons from "@/components/ReactionButtons";

export default function Home() {
  const [videoId, setVideoId] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [showUrlBar, setShowUrlBar] = useState(true);
  const [gameId, setGameId] = useState<string | null>(null);

  // Find the active game on load
  useEffect(() => {
    async function findActiveGame() {
      const { data } = await supabase
        .from("games")
        .select("id")
        .eq("status", "in_progress")
        .order("date", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setGameId(data.id);
      }
    }
    findActiveGame();
  }, []);

  const { game, gameState, currentBatter, balls, strikes, loading } = useGameData(gameId);
  const { floatingReactions, isCelebrating, sendReaction } = useReactions(gameId);

  const handleLoadVideo = () => {
    const match = videoInput.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/))([\w-]+)/
    );
    setVideoId(match ? match[1] : videoInput.trim());
    setShowUrlBar(false);
  };

  // Derive overlay data from Supabase
  const homeTeamName = game?.location === "home" ? "US" : game?.opponent ?? "AWAY";
  const awayTeamName = game?.location === "home" ? game?.opponent ?? "AWAY" : "US";
  const homeScore = game?.location === "home" ? (game?.our_score ?? 0) : (game?.opponent_score ?? 0);
  const awayScore = game?.location === "home" ? (game?.opponent_score ?? 0) : (game?.our_score ?? 0);
  const inning = gameState?.current_inning ?? 1;
  const isTopInning = (gameState?.current_half ?? "top") === "top";
  const outs = gameState?.outs ?? 0;
  const totalInnings = game?.num_innings ?? 6;

  // Bases — check both our runners and opponent runners based on who's batting
  const hasRunnerFirst = isTopInning
    ? gameState?.opponent_runner_first != null
    : gameState?.runner_first != null;
  const hasRunnerSecond = isTopInning
    ? gameState?.opponent_runner_second != null
    : gameState?.runner_second != null;
  const hasRunnerThird = isTopInning
    ? gameState?.opponent_runner_third != null
    : gameState?.runner_third != null;

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black overflow-hidden">
      {/* 16:9 container */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: "16 / 9",
          maxHeight: "100vh",
          maxWidth: "calc(100vh * 16 / 9)",
          containerType: "inline-size",
        }}
      >
        {/* Layer 1: YouTube Live Stream */}
        {videoId ? (
          <YouTubeEmbed videoId={videoId} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "var(--bg)", color: "var(--text-muted)" }}>
            <svg style={{ width: "5em", height: "5em", color: "var(--text-dim)", marginBottom: "1em" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p style={{ fontSize: "1.1em", fontWeight: 400, color: "var(--text)" }}>No stream loaded</p>
            <p style={{ fontSize: "0.85em", color: "var(--text-dim)", marginTop: "0.3em" }}>
              {loading ? "Looking for active game..." : "Press the URL button to enter a YouTube live stream"}
            </p>
          </div>
        )}

        {/* Layer 2: Baseball Overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ fontSize: "1.2cqw" }}>
          {/* Top-left: Scoreboard + Count */}
          <div
            className="absolute pointer-events-auto"
            style={{ top: "1.5em", left: "1.5em", display: "flex", flexDirection: "column", gap: "0.4em" }}
          >
            <Scoreboard
              away={{ name: awayTeamName, abbreviation: awayTeamName.slice(0, 4).toUpperCase(), runs: awayScore, hits: 0, errors: 0 }}
              home={{ name: homeTeamName, abbreviation: homeTeamName.slice(0, 4).toUpperCase(), runs: homeScore, hits: 0, errors: 0 }}
              inning={inning}
              isTopInning={isTopInning}
            />
            <div style={{ display: "flex", gap: "0.4em" }}>
              <CountIndicator balls={balls} strikes={strikes} outs={outs} />
              <BasesIndicator
                first={hasRunnerFirst}
                second={hasRunnerSecond}
                third={hasRunnerThird}
              />
            </div>
            {currentBatter && (
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5em",
                  padding: "0.3em 0.8em",
                }}
              >
                <span style={{ fontSize: "0.65em", color: "var(--text-muted)" }}>AB </span>
                <span style={{ fontSize: "0.85em", fontWeight: 600, color: "var(--text)" }}>
                  {currentBatter.first_name} {currentBatter.last_name}
                </span>
                {currentBatter.number && (
                  <span style={{ fontSize: "0.65em", color: "var(--text-dim)" }}> #{currentBatter.number}</span>
                )}
              </div>
            )}
          </div>

          {/* Top-right: Inning tracker */}
          <div className="absolute pointer-events-auto" style={{ top: "1.5em", right: "1.5em" }}>
            <InningTracker
              currentInning={inning}
              isTopInning={isTopInning}
              totalInnings={totalInnings}
            />
          </div>

          {/* Floating reactions */}
          <ReactionsOverlay reactions={floatingReactions} isCelebrating={isCelebrating} />
        </div>

        {/* Bottom-right: Reaction buttons */}
        <div
          className="absolute z-40"
          style={{ bottom: "4em", right: "1.5em", fontSize: "1.2cqw" }}
        >
          <ReactionButtons onReact={sendReaction} />
        </div>

        {/* URL toggle button */}
        <button
          onClick={() => setShowUrlBar(!showUrlBar)}
          className="absolute z-50 flex items-center justify-center"
          style={{
            bottom: "1em",
            right: "1em",
            width: "2.5em",
            height: "2.5em",
            fontSize: "1.2cqw",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-full)",
            color: "var(--text)",
            fontWeight: 600,
            cursor: "pointer",
            transition: `transform var(--duration-fast) var(--ease-spring)`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          title={showUrlBar ? "Hide URL bar" : "Load stream"}
        >
          {showUrlBar ? "X" : "TV"}
        </button>

        {/* URL input bar */}
        {showUrlBar && (
          <div
            className="absolute bottom-0 left-0 right-0 z-40"
            style={{
              padding: "1em",
              fontSize: "1.2cqw",
              background: "var(--bg-deep)",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div className="mx-auto flex" style={{ maxWidth: "40em", gap: "0.5em" }}>
              <input
                type="text"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLoadVideo()}
                placeholder="Paste YouTube URL or video ID..."
                className="flex-1"
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-2)",
                  padding: "0.4em 0.8em",
                  fontSize: "1em",
                  color: "var(--text)",
                  outline: "none",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                }}
              />
              <button
                onClick={handleLoadVideo}
                style={{
                  background: "var(--accent)",
                  color: "var(--accent-on)",
                  borderRadius: "var(--r-2)",
                  padding: "0.4em 1em",
                  fontSize: "1em",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Montserrat', sans-serif",
                  transition: `transform var(--duration-fast) var(--ease-spring)`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              >
                Load Stream
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
