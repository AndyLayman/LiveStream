import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 300,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <a href="/" style={{ color: "var(--text-dim)", fontSize: "0.8rem", textDecoration: "none" }}>
            Stream
          </a>
          <span style={{ fontWeight: 500, fontSize: "0.95rem" }}>
            Six43: Live Admin
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            {user.email}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              style={{
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-2)",
                padding: "0.3rem 0.8rem",
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
              }}
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>
      <main style={{ padding: "1.5rem" }}>{children}</main>
    </div>
  );
}
