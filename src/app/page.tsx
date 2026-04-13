"use client";

import { useState } from "react";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import Scoreboard from "@/components/Scoreboard";
import CountIndicator from "@/components/CountIndicator";
import InningTracker from "@/components/InningTracker";
import BasesIndicator from "@/components/BasesIndicator";

export default function Home() {
  const [videoId, setVideoId] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [showUrlBar, setShowUrlBar] = useState(true);

  // Game state
  const [awayTeam] = useState({ name: "New York Yankees", abbreviation: "NYY", runs: 0, hits: 0, errors: 0 });
  const [homeTeam] = useState({ name: "Boston Red Sox", abbreviation: "BOS", runs: 0, hits: 0, errors: 0 });
  const [inning] = useState(1);
  const [isTopInning] = useState(true);
  const [balls] = useState(0);
  const [strikes] = useState(0);
  const [outs] = useState(0);
  const [bases] = useState({ first: false, second: false, third: false });

  const handleLoadVideo = () => {
    const match = videoInput.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/))([\w-]+)/
    );
    setVideoId(match ? match[1] : videoInput.trim());
    setShowUrlBar(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Layer 1: YouTube Live Stream — fills the viewport */}
      {videoId ? (
        <YouTubeEmbed videoId={videoId} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-400">
          <svg className="w-20 h-20 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">No stream loaded</p>
          <p className="text-sm text-gray-500 mt-1">
            Press the URL button to enter a YouTube live stream
          </p>
        </div>
      )}

      {/* Layer 2: Baseball Overlay — scales with viewport via vw-based font-size */}
      <div className="absolute inset-0 pointer-events-none" style={{ fontSize: "1.2vw" }}>
        {/* Top-left: Scoreboard + Count */}
        <div className="absolute pointer-events-auto" style={{ top: "1.5em", left: "1.5em", display: "flex", flexDirection: "column", gap: "0.4em" }}>
          <Scoreboard
            away={awayTeam}
            home={homeTeam}
            inning={inning}
            isTopInning={isTopInning}
          />
          <div style={{ display: "flex", gap: "0.4em" }}>
            <CountIndicator balls={balls} strikes={strikes} outs={outs} />
            <BasesIndicator
              first={bases.first}
              second={bases.second}
              third={bases.third}
            />
          </div>
        </div>

        {/* Top-right: Inning tracker */}
        <div className="absolute pointer-events-auto" style={{ top: "1.5em", right: "1.5em" }}>
          <InningTracker
            currentInning={inning}
            isTopInning={isTopInning}
          />
        </div>
      </div>

      {/* URL toggle button */}
      <button
        onClick={() => setShowUrlBar(!showUrlBar)}
        className="absolute bottom-4 right-4 z-50 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold backdrop-blur-sm border border-gray-600 transition-colors"
        title={showUrlBar ? "Hide URL bar" : "Load stream"}
      >
        {showUrlBar ? "X" : "TV"}
      </button>

      {/* URL input bar */}
      {showUrlBar && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4 z-40">
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoadVideo()}
              placeholder="Paste YouTube URL or video ID..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleLoadVideo}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Load Stream
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
