"use client";

import styles from "../page.module.css";
import { Sparkles, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PRO_FEATURES = [
  "PDF Resume Upload & AI Parsing",
  "Unlimited AI Resume Tailoring",
  "Instant Job Search Engine",
  "Kanban Application Tracker",
  "ATS Keyword Optimization",
  "Priority Email Support",
];

const ULTRA_FEATURES = [
  "Everything in Pro",
  "Resume Memory Storage",
  "24/7 Automated Job Scraping",
  "Instant Push Notifications for Matches",
  "AI Cover Letter Writing",
  "Outreach Email Templates",
  "Dedicated Account Manager",
];

const COMPARISON = [
  { feature: "AI Resume Tailoring", pro: true, ultra: true },
  { feature: "PDF CV Upload & Parse", pro: true, ultra: true },
  { feature: "Kanban Tracker", pro: true, ultra: true },
  { feature: "ATS Keyword Score", pro: true, ultra: true },
  { feature: "Automated Job Scraping", pro: false, ultra: true },
  { feature: "Push Notifications", pro: false, ultra: true },
  { feature: "Cover Letter AI", pro: false, ultra: true },
  { feature: "Resume Memory", pro: false, ultra: true },
];

export default function PricingPage() {
  const router = useRouter();
  const [loadingPro, setLoadingPro] = useState(false);
  const [loadingUltra, setLoadingUltra] = useState(false);

  const handleSubscribe = async (tier: "pro" | "ultra_pro") => {
    if (tier === "pro") setLoadingPro(true);
    else setLoadingUltra(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push("/register");
      }
    } catch {
      router.push("/register");
    } finally {
      setLoadingPro(false);
      setLoadingUltra(false);
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}><Sparkles className={styles.logoIcon} /> ResuMate</div>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.btnSecondary} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <ArrowLeft size={15} /> Home
          </Link>
          <Link href="/login" className={styles.btnSecondary}>Login</Link>
        </div>
      </nav>

      <main style={{ paddingBottom: "6rem" }}>
        <div style={{ textAlign: "center", paddingTop: "4rem", paddingBottom: "3rem" }}>
          <h1 className={styles.title} style={{ fontSize: "3rem", marginInline: "auto" }}>
            Choose Your <span className="heading-gradient">Edge</span>
          </h1>
          <p className={styles.subtitle} style={{ marginInline: "auto", marginTop: "1rem" }}>
            No free tier. Every plan is built for serious job seekers who want results.
          </p>
        </div>

        {/* Plan cards */}
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
          {/* Pro */}
          <div className="glass-panel" style={{ width: 360, padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Pro</h2>
            <div style={{ fontSize: "3rem", fontWeight: 700, lineHeight: 1 }}>
              $15<span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>/month</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>Perfect for active job seekers needing deep resume analysis.</p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.85rem", flex: 1 }}>
              {PRO_FEATURES.map(f => (
                <li key={f} style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontSize: "0.9rem" }}>
                  <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>
            <button
              className="btn-secondary"
              style={{ border: "1px solid var(--primary)", color: "white", marginTop: "auto" }}
              onClick={() => handleSubscribe("pro")}
              disabled={loadingPro || loadingUltra}
            >
              {loadingPro ? "Processing…" : "Get Pro"}
            </button>
          </div>

          {/* Ultra Pro */}
          <div className="glass-panel" style={{ width: 360, padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", border: "1px solid var(--primary)", position: "relative" }}>
            <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "var(--primary)", padding: "0.3rem 1.2rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
              MOST POPULAR
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Ultra Pro</h2>
            <div style={{ fontSize: "3rem", fontWeight: 700, lineHeight: 1 }}>
              $29<span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>/month</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>For serious hunters. Let AI find jobs while you sleep.</p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.85rem", flex: 1 }}>
              {ULTRA_FEATURES.map(f => (
                <li key={f} style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontSize: "0.9rem" }}>
                  <Check size={16} color="var(--secondary)" style={{ flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>
            <button
              className="btn-primary"
              style={{ marginTop: "auto" }}
              onClick={() => handleSubscribe("ultra_pro")}
              disabled={loadingPro || loadingUltra}
            >
              {loadingUltra ? "Processing…" : "Get Ultra Pro"}
            </button>
          </div>
        </div>

        {/* Comparison table */}
        <div style={{ maxWidth: 760, margin: "5rem auto 0" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.75rem" }}>Feature Comparison</h2>
          <div className="glass-panel" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "left", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Feature</th>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "center", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Pro</th>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "center", color: "var(--primary)", fontWeight: 600 }}>Ultra Pro</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} style={{ borderBottom: i < COMPARISON.length - 1 ? "1px solid var(--card-border)" : "none" }}>
                    <td style={{ padding: "0.9rem 1.5rem", fontSize: "0.92rem" }}>{row.feature}</td>
                    <td style={{ padding: "0.9rem 1.5rem", textAlign: "center" }}>
                      {row.pro ? <Check size={18} color="var(--success)" /> : <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}
                    </td>
                    <td style={{ padding: "0.9rem 1.5rem", textAlign: "center" }}>
                      {row.ultra ? <Check size={18} color="var(--success)" /> : <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
