"use client";

import { useAuth } from "@/lib/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface GameSummary {
  id: string;
  opponent: string;
  date: string;
  game_time: string | null;
  status: string;
}

export default function AdminPage() {
  const { activeTeam, memberships, setActiveTeam } = useAuth();
  const [games, setGames] = useState<GameSummary[]>([]);

  useEffect(() => {
    if (!activeTeam) return;

    async function fetchGames() {
      const { data } = await supabase
        .from("games")
        .select("id, opponent, date, game_time, status")
        .eq("team_id", activeTeam!.team_id)
        .in("status", ["in_progress", "scheduled"])
        .order("date", { ascending: true })
        .limit(5);
      setGames(data ?? []);
    }
    fetchGames();
  }, [activeTeam]);

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 500, marginBottom: "1.5rem" }}>
        Dashboard
      </h1>

      {memberships.length > 1 && (
        <section
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-3)",
            padding: "1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "0.95rem", fontWeight: 500, marginBottom: "0.75rem" }}>
            Team
          </h2>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {memberships.map((m) => (
              <button
                key={m.team_id}
                onClick={() => setActiveTeam(m)}
                style={{
                  background: m.team_id === activeTeam?.team_id ? "var(--accent)" : "var(--bg-input)",
                  color: m.team_id === activeTeam?.team_id ? "var(--accent-on)" : "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-2)",
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: m.team_id === activeTeam?.team_id ? 500 : 300,
                }}
              >
                {m.team_name}
              </button>
            ))}
          </div>
        </section>
      )}

      <section
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-3)",
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "0.95rem", fontWeight: 500, marginBottom: "1rem" }}>
          YouTube Channel
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Channel ID is configured via <code style={{ color: "var(--clay)", fontSize: "0.8rem" }}>YOUTUBE_CHANNEL_ID</code> environment variable.
        </p>
      </section>

      <section
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-3)",
          padding: "1.25rem",
        }}
      >
        <h2 style={{ fontSize: "0.95rem", fontWeight: 500, marginBottom: "1rem" }}>
          Upcoming Games
        </h2>
        {games.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {games.map((game) => (
              <li
                key={game.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0.75rem",
                  background: "var(--bg-input)",
                  borderRadius: "var(--r-2)",
                  fontSize: "0.85rem",
                }}
              >
                <span>vs {game.opponent}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  {game.date} {game.game_time ?? ""}{" "}
                  <span
                    style={{
                      color: game.status === "in_progress" ? "var(--success)" : "var(--text-dim)",
                      fontWeight: game.status === "in_progress" ? 500 : 300,
                    }}
                  >
                    {game.status === "in_progress" ? "LIVE" : "Scheduled"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
            No upcoming games.
          </p>
        )}
      </section>
    </div>
  );
}
