"use client";

import styles from "../dashboard/page.module.css";
import { Sparkles, LayoutDashboard, FileText, Settings, User, CreditCard, Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
  // Mock data for UI display
  const [username] = useState("jobhunter99");
  const [tier] = useState("Ultra Pro");
  
  const handlePortalRedirect = () => {
    alert("Redirecting to Stripe Customer Billing Portal...");
  };

  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Sparkles /> ResuMate Pro
        </div>
        <nav className={styles.navMenu}>
          <Link href="/dashboard" className={styles.navItem}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/tailor" className={styles.navItem}>
            <FileText size={20} /> Resume Tailor
          </Link>
          <Link href="/settings" className={styles.navItemActive}>
            <Settings size={20} /> Settings
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Settings</h1>
        </header>

        <div className={styles.boardContainer} style={{ display: "flex", flexDirection: "column", gap: "2rem", overflowY: "auto", maxWidth: "800px" }}>
          
          {/* Account Profile */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><User size={20}/> Account Profile</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Username</label>
                <input type="text" value={username} disabled style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--card-border)", borderRadius: "6px", padding: "0.75rem", color: "rgba(255,255,255,0.5)", width: "100%", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Password</label>
                <button className="btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>Change Password</button>
              </div>
            </div>
          </div>

          {/* Billing & Subscription */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><CreditCard size={20}/> Subscription</h2>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(99, 102, 241, 0.1)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--primary)" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Current Plan: {tier}</h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>Your automated job search is active 24/7.</p>
              </div>
              <button onClick={handlePortalRedirect} className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>Manage Billing</button>
            </div>
          </div>

          {/* Notifications Preferences */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Bell size={20}/> Notifications</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }} />
                <span style={{ fontSize: "0.9rem" }}>In-App Dashboard Alerts for New Job Matches</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }} />
                <span style={{ fontSize: "0.9rem" }}>Email me when high-confidence matches are found</span>
              </label>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
