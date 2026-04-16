"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: "var(--bg)", fontFamily: "'Montserrat', sans-serif" }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-3)",
          padding: "2.5rem 2rem",
          width: "100%",
          maxWidth: "380px",
        }}
      >
        <h1
          style={{
            color: "var(--text)",
            fontSize: "1.25rem",
            fontWeight: 500,
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Six43: Live
        </h1>

        <button
          onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            });
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%",
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-2)",
            padding: "0.6rem",
            fontSize: "0.9rem",
            fontWeight: 400,
            color: "var(--text)",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            transition: "transform var(--duration-fast) var(--ease-spring)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            margin: "0.25rem 0",
            color: "var(--text-dim)",
            fontSize: "0.75rem",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          or
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-2)",
              padding: "0.6rem 0.8rem",
              color: "var(--text)",
              fontSize: "0.9rem",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              outline: "none",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-2)",
              padding: "0.6rem 0.8rem",
              color: "var(--text)",
              fontSize: "0.9rem",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              outline: "none",
            }}
          />

          {error && (
            <p style={{ color: "var(--danger)", fontSize: "0.8rem", margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "var(--accent)",
              color: "var(--accent-on)",
              borderRadius: "var(--r-2)",
              padding: "0.6rem",
              fontSize: "0.9rem",
              fontWeight: 500,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Montserrat', sans-serif",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <a
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "1.5rem",
            color: "var(--text-dim)",
            fontSize: "0.8rem",
            textDecoration: "none",
          }}
        >
          Back to stream
        </a>
      </div>
    </div>
  );
}
