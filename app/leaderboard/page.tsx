"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface TeamVote {
  id: string;
  name: string;
  voteCount: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<TeamVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch all projects
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("id, name");

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
          setLeaderboardData([]);
          setLoading(false);
          return;
        }

        // Fetch all votes
        const { data: votes, error: votesError } = await supabase
          .from("votes")
          .select("winner_project_id");

        if (votesError) {
          console.error("Error fetching votes:", votesError);
          setLeaderboardData([]);
          setLoading(false);
          return;
        }

        // Count votes per project
        const voteCounts = new Map<string, number>();
        votes?.forEach((vote) => {
          const projectId = vote.winner_project_id;
          voteCounts.set(projectId, (voteCounts.get(projectId) || 0) + 1);
        });

        // Build leaderboard data with vote counts
        const teamData = (projects || []).map((project) => ({
          id: project.id,
          name: project.name,
          voteCount: voteCounts.get(project.id) || 0,
          rank: 0,
        }));

        // Sort by vote count (descending) and assign ranks
        teamData.sort((a, b) => b.voteCount - a.voteCount);
        teamData.forEach((team, index) => {
          team.rank = index + 1;
        });

        setLeaderboardData(teamData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const filteredData = leaderboardData.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch("/api/leaderboard-export");
      if (!response.ok) {
        throw new Error("Failed to download CSV");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leaderboard.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("Failed to download CSV. Please try again.");
    }
  };

  const searchInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
    marginBottom: "16px",
  };

  const noResultsStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "24px",
    color: "#64748b",
    fontStyle: "italic",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "16px",
  };

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    borderBottom: "2px solid #e2e8f0",
    fontWeight: "600",
    color: "#475569",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 16px",
    borderBottom: "1px solid #e2e8f0",
  };

  const rankStyle: React.CSSProperties = {
    fontWeight: "600",
    color: "#3b82f6",
  };

  const scoreStyle: React.CSSProperties = {
    fontWeight: "600",
    color: "#1e293b",
  };

  const downloadButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginBottom: "16px",
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-8">
        <h1 className="text-2xl font-semibold">Leaderboard</h1>
        <p className="text-slate-600">Loading vote counts...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Leaderboard</h1>
      <p className="text-slate-600">Search and view leaderboard results.</p>

      <button
        onClick={handleDownloadCSV}
        style={downloadButtonStyle}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download CSV
      </button>

      <input
        type="text"
        placeholder="Search teams..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchInputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
      />

      {filteredData.length === 0 ? (
        <div style={noResultsStyle}>
          No teams found matching "{searchTerm}"
        </div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Rank</th>
              <th style={thStyle}>Team</th>
              <th style={thStyle}>Votes</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((team) => (
              <tr key={team.id}>
                <td style={{ ...tdStyle, ...rankStyle }}>{team.rank}</td>
                <td style={tdStyle}>{team.name}</td>
                <td style={{ ...tdStyle, ...scoreStyle }}>{team.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link href="/">Back home</Link>
    </main>
  );
}
