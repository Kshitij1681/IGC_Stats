import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import BgOrbs from "./components/BgOrbs";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import RankingsPage from "./pages/RankingsPage";
import BowlerOfWeekPage from "./pages/BowlerOfWeekPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative min-h-screen bg-hero-gradient">
          <BgOrbs />
          <div className="relative z-10">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/rankings" element={<RankingsPage />} />
                <Route path="/bowler-of-week" element={<BowlerOfWeekPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <footer className="relative z-10 py-8 mt-8 text-center border-t border-white/5">
              <p className="font-mono text-xs tracking-widest text-slate-700">
                IGNOU CRICKET CLUB © {new Date().getFullYear()} · BOWLING STATS TRACKER
              </p>
            </footer>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
