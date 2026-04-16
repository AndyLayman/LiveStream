"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase/client";
import type { User } from "@supabase/supabase-js";

interface TeamMembership {
  team_id: string;
  team_name: string;
  team_slug: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  activeTeam: TeamMembership | null;
  memberships: TeamMembership[];
  setActiveTeam: (team: TeamMembership) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  activeTeam: null,
  memberships: [],
  setActiveTeam: () => {},
  isLoading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

const ACTIVE_TEAM_KEY = "six43-active-team";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [memberships, setMemberships] = useState<TeamMembership[]>([]);
  const [activeTeam, setActiveTeamState] = useState<TeamMembership | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setActiveTeam = useCallback((team: TeamMembership) => {
    setActiveTeamState(team);
    localStorage.setItem(ACTIVE_TEAM_KEY, JSON.stringify(team));
  }, []);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: members } = await supabase
          .from("team_members")
          .select("team_id, role, teams(id, name, slug)")
          .eq("user_id", user.id);

        if (members && members.length > 0) {
          const mapped: TeamMembership[] = members.map((m: any) => ({
            team_id: m.team_id,
            team_name: m.teams.name,
            team_slug: m.teams.slug,
            role: m.role,
          }));
          setMemberships(mapped);

          // Restore from localStorage or default to first
          const stored = localStorage.getItem(ACTIVE_TEAM_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored) as TeamMembership;
              const match = mapped.find((m) => m.team_id === parsed.team_id);
              if (match) {
                setActiveTeamState(match);
              } else {
                setActiveTeam(mapped[0]);
              }
            } catch {
              setActiveTeam(mapped[0]);
            }
          } else {
            setActiveTeam(mapped[0]);
          }
        }
      }

      setIsLoading(false);
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setMemberships([]);
          setActiveTeamState(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setActiveTeam]);

  return (
    <AuthContext.Provider value={{ user, activeTeam, memberships, setActiveTeam, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
