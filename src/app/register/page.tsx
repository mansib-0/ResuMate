"use client";

import { useState } from "react";
import styles from "../page.module.css";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (username.length < 3) { setError("Username must be at least 3 characters."); return; }
    if (username.includes(" ")) { setError("Username cannot contain spaces."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Sparkles className={styles.logoIcon} /> ResuMate
        </div>
        <Link href="/" className={styles.btnSecondary} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </nav>

      <main style={{ padding: "4rem 0", display: "flex", justifyContent: "center" }}>
        <div className="glass-panel" style={{ width: "420px", padding: "2.5rem" }}>
          <h1 style={{ marginBottom: "1.5rem", textAlign: "center", fontSize: "2rem" }}>Create Account</h1>

          {error && (
            <div style={{ color: "var(--error)", background: "rgba(239,68,68,0.1)", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--card-border)", borderRadius: "8px", padding: "1rem", color: "white", outline: "none", fontFamily: "inherit" }}
                placeholder="jobhunter99"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--card-border)", borderRadius: "8px", padding: "1rem", color: "white", outline: "none", fontFamily: "inherit" }}
                placeholder="At least 6 characters"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>Confirm Password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--card-border)", borderRadius: "8px", padding: "1rem", color: "white", outline: "none", fontFamily: "inherit" }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: "0.5rem" }}
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--primary)", textDecoration: "underline" }}>
              Log in here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
