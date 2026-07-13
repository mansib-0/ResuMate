"use client";

import styles from "../page.module.css";
import { Sparkles, Check, ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [loadingPro, setLoadingPro] = useState(false);
  const [loadingUltra, setLoadingUltra] = useState(false);

  const handleSubscribe = async (tier: 'pro' | 'ultra_pro') => {
    if (tier === 'pro') setLoadingPro(true);
    else setLoadingUltra(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier })
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      if (tier === 'pro') setLoadingPro(false);
      else setLoadingUltra(false);
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Sparkles className={styles.logoIcon} /> ResuMate
        </div>
        <Link href="/" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </nav>

      <main style={{ padding: "4rem 0", textAlign: "center" }}>
        <h1 className={styles.title} style={{ fontSize: "3rem", marginBottom: "1rem", marginInline: "auto" }}>
          Choose Your Edge
        </h1>
        <p className={styles.subtitle} style={{ marginInline: "auto", marginBottom: "4rem" }}>
          Invest in your career. Land the interview with AI-powered matching and automated alerts.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
          
          {/* Pro Tier */}
          <div className="glass-panel" style={{ width: "350px", padding: "2.5rem", textAlign: "left", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2>Pro Version</h2>
            <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>$15<span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", fontWeight: "400" }}>/month</span></div>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>Perfect for active job seekers needing deep resume analysis.</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem", padding: 0 }}>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}><Check size={18} color="var(--success)"/> PDF Resume Upload & Parsing</li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}><Check size={18} color="var(--success)"/> Instant AI Job Search Engine</li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}><Check size={18} color="var(--success)"/> Unlimited AI Resume Tailoring</li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}><Check size={18} color="var(--success)"/> Kanban Board Tracker</li>
            </ul>
            <button 
              className="btn-secondary" 
              style={{ marginTop: "auto", border: "1px solid var(--primary)", color: "white" }}
              onClick={() => handleSubscribe('pro')}
              disabled={loadingPro || loadingUltra}
            >
              {loadingPro ? "Processing..." : "Get Pro"}
            </button>
          </div>

          {/* Ultra Pro Tier */}
          <div className="glass-panel" style={{ width: "350px", padding: "2.5rem", textAlign: "left", display: "flex", flexDirection: "column", gap: "1.5rem", border: "1px solid var(--primary)", position: "relative" }}>
            <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "var(--primary)", padding: "0.25rem 1rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600" }}>
              ULTRA PRO
            </div>
            <h2>Ultra Pro</h2>
            <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>$29<span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", fontWeight: "400" }}>/month</span></div>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>For serious hunters. Let the AI find jobs for you while you sleep.</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem", padding: 0 }}>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}><strong>Everything in Pro, plus:</strong></li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}><Bell size={18} color="var(--secondary)"/> Resume Memory storage</li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}><Bell size={18} color="var(--secondary)"/> 24/7 Automated Job Scraping</li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}><Check size={18} color="var(--success)"/> Instant Push Notifications for Matches</li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}><Check size={18} color="var(--success)"/> Cover Letter writing & Outreach</li>
            </ul>
            <button 
              className="btn-primary" 
              style={{ marginTop: "auto" }}
              onClick={() => handleSubscribe('ultra_pro')}
              disabled={loadingPro || loadingUltra}
            >
              {loadingUltra ? "Processing..." : "Upgrade to Ultra Pro"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
