"use client";
import Link from "next/link";
import { useState } from "react";

// Sample leaderboard data
const leaderboardData = [
  { id: 1, name: "Team Alpha", score: 950, rank: 1 },
  { id: 2, name: "Team Beta", score: 875, rank: 2 },
  { id: 3, name: "Team Gamma", score: 820, rank: 3 },
  { id: 4, name: "Team Delta", score: 780, rank: 4 },
  { id: 5, name: "Team Epsilon", score: 720, rank: 5 },
  { id: 6, name: "Team Zeta", score: 680, rank: 6 },
  { id: 7, name: "Team Eta", score: 640, rank: 7 },
  { id: 8, name: "Team Theta", score: 590, rank: 8 },
];

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = leaderboardData.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Leaderboard</h1>
      <p className="text-slate-600">Search and view leaderboard results.</p>

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
              <th style={thStyle}>Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((team) => (
              <tr key={team.id}>
                <td style={{ ...tdStyle, ...rankStyle }}>{team.rank}</td>
                <td style={tdStyle}>{team.name}</td>
                <td style={{ ...tdStyle, ...scoreStyle }}>{team.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link href="/">Back home</Link>
    </main>
  );
}
