import React, { useEffect, useState } from "react";
import BowlerCard from "../components/BowlerCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchBowlers } from "../utils/api";

const roleFilters = ["All", "Fast", "Medium", "Medium-Fast", "Spin", "Leg-Spin", "Off-Spin"];

export default function HomePage() {
  const [bowlers, setBowlers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    loadBowlers();
  }, []);

  const loadBowlers = async () => {
    try {
      setLoading(true);
      const data = await fetchBowlers();
      if (data.success) setBowlers(data.bowlers);
      else setError("Failed to load bowlers");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = bowlers
    .filter((b) => {
      const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "All" || b.role === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) => {
      const as = a.overallStats || {};
      const bs = b.overallStats || {};
      if (sortBy === "wickets") return (bs.wickets || 0) - (as.wickets || 0);
      if (sortBy === "economy") return (as.economy || 999) - (bs.economy || 999);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const totalWickets = bowlers.reduce((s, b) => s + (b.overallStats?.wickets || 0), 0);
  const totalMatches = bowlers.reduce((s, b) => s + (b.overallStats?.matches || 0), 0);
  const bestBowler = [...bowlers].sort((a, b) => (b.overallStats?.wickets || 0) - (a.overallStats?.wickets || 0))[0];

  return (
    <div className="min-h-screen px-4 pt-24 pb-16 sm:px-6 page-enter">
      <div className="mx-auto max-w-7xl">
        {/* Hero Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 font-mono text-xs tracking-widest border rounded-full glass border-cricket-green/20 text-cricket-green">
            <span className="w-2 h-2 rounded-full bg-cricket-green animate-pulse" />
            IGNOU CRICKET CLUB — SEASON {new Date().getFullYear()}
          </div>
          <h1 className="mb-3 text-4xl font-display font-700 sm:text-5xl lg:text-6xl">
            <span className="gradient-text">Bowling</span> <span className="text-white">Squad</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm text-slate-500 font-body sm:text-base">
            Complete bowling statistics for all active squad members — home & away performance.
          </p>
        </div>

        {/* Club Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-4">
          {[
            { label: "Total Bowlers", value: bowlers.length, icon: "👥", color: "border-cricket-teal/20" },
            {
              label: "Total Matches",
              value: Math.max(...bowlers.map((b) => b.overallStats?.matches || 0), 0),
              icon: "🏏",
              color: "border-cricket-blue/20",
            },
            { label: "Total Wickets", value: totalWickets, icon: "🎯", color: "border-cricket-green/20" },
            { label: "Top Bowler", value: bestBowler?.name?.split(" ")[0] || "—", icon: "🏆", color: "border-cricket-gold/20" },
          ].map((s, i) => (
            <div key={i} className={`glass-card rounded-xl p-4 border ${s.color} text-center`}>
              <div className="mb-1 text-2xl">{s.icon}</div>
              <div className="font-mono text-xl text-white font-700">{s.value}</div>
              <div className="text-xs text-slate-500 font-display uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 p-4 mb-6 glass-card rounded-2xl sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute text-sm -translate-y-1/2 left-3 top-1/2 text-slate-500">🔍</span>
            <input
              type="text"
              placeholder="Search bowler..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-body"
            />
          </div>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-input px-4 py-2.5 rounded-xl text-sm font-body cursor-pointer min-w-[140px]"
          >
            <option value="name">Sort: Name</option>
            <option value="wickets">Sort: Wickets</option>
            <option value="economy">Sort: Economy</option>
          </select>
        </div>

        {/* Role Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {roleFilters.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-600 transition-all ${
                roleFilter === r
                  ? "bg-cricket-green/15 border border-cricket-green/30 text-cricket-green"
                  : "glass border border-white/8 text-slate-500 hover:text-slate-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Bowler Cards Grid */}
        {loading ? (
          <LoadingSpinner message="Loading squad..." />
        ) : error ? (
          <div className="p-8 text-center glass-card rounded-2xl">
            <p className="mb-4 text-red-400">{error}</p>
            <button onClick={loadBowlers} className="px-6 py-2 btn-primary rounded-xl font-display font-600">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-2xl">
            <div className="mb-3 text-4xl">🔍</div>
            <p className="text-slate-400 font-display">No bowlers found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((bowler, i) => (
              <BowlerCard key={bowler._id} bowler={bowler} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
