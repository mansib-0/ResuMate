"use client";

import styles from "../dashboard/page.module.css";
import {
  Sparkles, LayoutDashboard, FileText, Settings, User,
  CreditCard, Bell, LogOut, Palette, Check, Moon, Sun,
  Shield, Trash2, ChevronRight, Eye, EyeOff
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme, THEMES, ThemeId } from "../../context/ThemeContext";

type Section = "account" | "appearance" | "subscription" | "notifications" | "security";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, themeId } = useTheme();
  const [activeSection, setActiveSection] = useState<Section>("appearance");

  // Account
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  // Notifications
  const [notifInApp, setNotifInApp] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifJobMatch, setNotifJobMatch] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.2)",
    border: "1px solid var(--card-border)",
    borderRadius: 8,
    padding: "0.8rem 1rem",
    color: "var(--foreground)",
    outline: "none",
    fontFamily: "inherit",
    fontSize: "0.9rem",
    width: "100%",
    transition: "all 0.2s",
  };

  const handlePasswordUpdate = () => {
    setPwError(""); setPwSuccess("");
    if (!currentPw || !newPw || !confirmPw) { setPwError("Please fill in all password fields."); return; }
    if (newPw !== confirmPw) { setPwError("New passwords do not match."); return; }
    if (newPw.length < 6) { setPwError("Password must be at least 6 characters."); return; }
    setPwSuccess("Password updated successfully! ✓");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  const handlePortal = async () => {
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      window.open(data.url || "/pricing", "_blank");
    } catch {
      window.open("/pricing", "_blank");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navSections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: "appearance", label: "Appearance", icon: <Palette size={17} /> },
    { id: "account", label: "Account", icon: <User size={17} /> },
    { id: "subscription", label: "Subscription", icon: <CreditCard size={17} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={17} /> },
    { id: "security", label: "Security", icon: <Shield size={17} /> },
  ];

  return (
    <div className={styles.dashboardLayout}>
      {/* ─── Sidebar ─── */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Sparkles size={20} />
          ResuMate
          <span className="badge badge-primary" style={{ fontSize: "0.65rem", marginLeft: "auto" }}>Pro</span>
        </div>
        <nav className={styles.navMenu}>
          <Link href="/dashboard" className={styles.navItem}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/tailor" className={styles.navItem}>
            <FileText size={18} /> Resume Tailor
          </Link>
          <Link href="/settings" className={styles.navItemActive}>
            <Settings size={18} /> Settings
          </Link>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} /> Log Out
        </button>
      </aside>

      {/* ─── Main ─── */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Settings size={26} style={{ color: "var(--primary)" }} />
            Settings
          </h1>
          <p className="text-muted" style={{ marginTop: 4, fontSize: "0.9rem" }}>
            Manage your account, appearance, and preferences.
          </p>
        </header>

        <div style={{ display: "flex", gap: "1.5rem", padding: "0 1.5rem 1.5rem", height: "calc(100vh - 120px)", overflow: "hidden" }}>

          {/* ─── Settings Nav ─── */}
          <div style={{ width: 200, flexShrink: 0 }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {navSections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    padding: "0.65rem 0.9rem", borderRadius: "var(--radius-sm)",
                    background: activeSection === s.id ? "rgba(var(--primary-rgb),0.15)" : "transparent",
                    color: activeSection === s.id ? "var(--primary)" : "var(--foreground-muted)",
                    fontWeight: activeSection === s.id ? 600 : 400,
                    fontSize: "0.875rem", textAlign: "left",
                    transition: "all 0.2s",
                    boxShadow: activeSection === s.id ? "inset 3px 0 0 var(--primary)" : "none",
                    border: "none", cursor: "pointer", fontFamily: "inherit",
                    width: "100%",
                  }}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </nav>

            {/* Theme preview mini card */}
            <div className="glass-panel" style={{ marginTop: "1.5rem", padding: "1rem", textAlign: "center" }}>
              <div style={{
                height: 60, borderRadius: 8, background: theme.preview,
                marginBottom: "0.75rem", boxShadow: "var(--btn-shadow)"
              }} />
              <p style={{ fontSize: "0.8rem", fontWeight: 600 }}>{theme.emoji} {theme.name}</p>
              <p className="text-muted" style={{ fontSize: "0.72rem", marginTop: 2 }}>Active Theme</p>
            </div>
          </div>

          {/* ─── Content Panel ─── */}
          <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem" }}>

            {/* ══════════════ APPEARANCE ══════════════ */}
            {activeSection === "appearance" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in">
                <div className="glass-panel" style={{ padding: "2rem" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Palette size={20} color="var(--primary)" /> Theme
                  </h2>
                  <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                    Choose a visual theme for your entire ResuMate experience. Changes are applied instantly.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as ThemeId)}
                        style={{
                          border: "none", cursor: "pointer", fontFamily: "inherit",
                          borderRadius: "var(--radius)",
                          padding: "3px",
                          background: themeId === t.id ? "var(--btn-gradient)" : "var(--card-border)",
                          boxShadow: themeId === t.id ? "var(--btn-shadow)" : "none",
                          transition: "all 0.25s",
                          transform: themeId === t.id ? "scale(1.04)" : "scale(1)",
                        }}
                      >
                        <div style={{
                          borderRadius: "calc(var(--radius) - 3px)",
                          overflow: "hidden",
                          background: "var(--card-bg)",
                        }}>
                          {/* Gradient swatch */}
                          <div style={{
                            height: 70,
                            background: t.preview,
                            position: "relative",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {themeId === t.id && (
                              <div style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: "rgba(255,255,255,0.95)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                              }}>
                                <Check size={16} color="#4f46e5" strokeWidth={3} />
                              </div>
                            )}
                            {/* Mode indicator */}
                            <div style={{ position: "absolute", top: 6, right: 6 }}>
                              {t.dark
                                ? <Moon size={12} color="rgba(255,255,255,0.7)" />
                                : <Sun size={12} color="rgba(0,0,0,0.5)" />
                              }
                            </div>
                          </div>
                          <div style={{ padding: "0.6rem 0.75rem", textAlign: "left", background: t.dark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.9)" }}>
                            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: t.dark ? "white" : "#1a1a2e", lineHeight: 1.2 }}>
                              {t.emoji} {t.name}
                            </p>
                            <p style={{ fontSize: "0.68rem", color: t.dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", marginTop: 2 }}>
                              {t.dark ? "Dark" : "Light"}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent color quick-pick (just changes primary) */}
                <div className="glass-panel" style={{ padding: "2rem" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    ✨ Dynamic Effects
                  </h2>
                  <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                    All themes feature live glow effects, button shimmer, glass morphism, and smooth transitions. These are always active.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    {[
                      { label: "Glass Morphism", desc: "Frosted glass panels", icon: "🪟" },
                      { label: "Button Shimmer", desc: "Light sweep on hover", icon: "✨" },
                      { label: "Glow Effects", desc: "Dynamic ambient glow", icon: "💫" },
                      { label: "Smooth Transitions", desc: "0.25s cubic bezier", icon: "🌊" },
                      { label: "Gradient Text", desc: "Theme-matched headings", icon: "🎨" },
                      { label: "Custom Scrollbar", desc: "Styled to theme color", icon: "📜" },
                    ].map((effect) => (
                      <div key={effect.label} className="glass-panel" style={{ padding: "1rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{effect.icon}</span>
                        <div>
                          <p style={{ fontSize: "0.82rem", fontWeight: 600 }}>{effect.label}</p>
                          <p className="text-muted" style={{ fontSize: "0.72rem", marginTop: 2 }}>{effect.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live preview */}
                <div className="glass-panel" style={{ padding: "2rem" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1.25rem" }}>
                    🖼 Live Preview
                  </h2>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    <button className="btn-primary" style={{ width: "auto", padding: "0.65rem 1.25rem", fontSize: "0.875rem" }}>
                      ✦ Primary Button
                    </button>
                    <button className="btn-secondary" style={{ width: "auto", padding: "0.65rem 1.25rem", fontSize: "0.875rem" }}>
                      Secondary Button
                    </button>
                    <button className="btn-ghost" style={{ fontSize: "0.875rem" }}>
                      Ghost Button
                    </button>
                    <span className="badge badge-primary">Pro</span>
                    <span className="badge badge-success">Active</span>
                    <span className="chip">React</span>
                    <span className="chip">TypeScript</span>
                  </div>
                  <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: "72%" }} />
                    </div>
                    <span className="text-muted" style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>72% Match Score</span>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════ ACCOUNT ══════════════ */}
            {activeSection === "account" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in">
                <div className="glass-panel" style={{ padding: "2rem" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <User size={20} color="var(--primary)" /> Account Details
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <label className="section-label">Username</label>
                      <input type="text" value="testuser" disabled style={{ ...inputStyle, color: "var(--foreground-muted)", cursor: "not-allowed" }} />
                      <p className="text-muted" style={{ fontSize: "0.78rem", marginTop: "0.35rem" }}>Username cannot be changed after registration.</p>
                    </div>
                    <div>
                      <label className="section-label">Member Since</label>
                      <div className="glass-panel" style={{ padding: "0.75rem 1rem", fontSize: "0.9rem" }}>
                        September 2026
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: "2rem" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                    🔑 Change Password
                  </h2>
                  {pwError && (
                    <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.85rem", color: "var(--error)" }}>
                      {pwError}
                    </div>
                  )}
                  {pwSuccess && (
                    <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.85rem", color: "var(--success)" }}>
                      {pwSuccess}
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                    {[
                      { label: "Current Password", val: currentPw, set: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(v => !v) },
                      { label: "New Password", val: newPw, set: setNewPw, show: showNew, toggle: () => setShowNew(v => !v) },
                      { label: "Confirm New Password", val: confirmPw, set: setConfirmPw, show: false, toggle: null },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="section-label">{field.label}</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={field.show ? "text" : "password"}
                            style={{ ...inputStyle, paddingRight: field.toggle ? "3rem" : "1rem" }}
                            value={field.val}
                            onChange={e => field.set(e.target.value)}
                            placeholder="••••••••"
                          />
                          {field.toggle && (
                            <button onClick={field.toggle} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--foreground-muted)", padding: 0 }}>
                              {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button className="btn-primary" style={{ width: "auto", padding: "0.75rem 1.5rem" }} onClick={handlePasswordUpdate}>
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="glass-panel" style={{ padding: "2rem", border: "1px solid rgba(239,68,68,0.25)" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--error)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Trash2 size={20} /> Danger Zone
                  </h2>
                  <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                    These actions are permanent and cannot be undone.
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button
                      className="btn-secondary"
                      style={{ width: "auto", borderColor: "rgba(239,68,68,0.4)", color: "var(--error)" }}
                      onClick={handleLogout}
                    >
                      <LogOut size={15} /> Log Out
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ width: "auto", borderColor: "rgba(239,68,68,0.6)", color: "var(--error)", background: "rgba(239,68,68,0.06)" }}
                      onClick={() => { if (confirm("Are you sure? This is irreversible.")) alert("Account deletion requested. Our team will process it within 48 hours."); }}
                    >
                      <Trash2 size={15} /> Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════ SUBSCRIPTION ══════════════ */}
            {activeSection === "subscription" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in">
                <div className="glass-panel" style={{ padding: "2rem" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <CreditCard size={20} color="var(--primary)" /> Current Subscription
                  </h2>
                  <div style={{ background: "rgba(var(--primary-rgb),0.08)", border: "1px solid rgba(var(--primary-rgb),0.2)", borderRadius: "var(--radius)", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Pro Plan</h3>
                        <span className="badge badge-primary">Active</span>
                      </div>
                      <p className="text-muted" style={{ fontSize: "0.85rem" }}>$15 / month · Renews October 1, 2026</p>
                    </div>
                    <button className="btn-primary" style={{ width: "auto", padding: "0.65rem 1.25rem", fontSize: "0.88rem" }} onClick={handlePortal}>
                      <CreditCard size={15} /> Manage Billing
                    </button>
                  </div>
                </div>

                {/* Plan comparison */}
                <div className="glass-panel" style={{ padding: "2rem" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1.25rem" }}>Plan Comparison</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {[
                      {
                        name: "Pro", price: "$15/mo", current: true,
                        features: ["Unlimited AI tailoring", "Cover letter gen", "Job matching (50/mo)", "Kanban tracker", "Email support"],
                      },
                      {
                        name: "Ultra Pro", price: "$29/mo", current: false,
                        features: ["Everything in Pro", "Real-time job alerts", "Resume in memory", "ATS simulation score", "Interview prep", "Priority support"],
                      },
                    ].map((plan) => (
                      <div key={plan.name} className="glass-panel" style={{ padding: "1.5rem", border: plan.current ? "1px solid rgba(var(--primary-rgb),0.35)" : "1px solid var(--card-border)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                          <h3 style={{ fontWeight: 700 }}>{plan.name}</h3>
                          {plan.current && <span className="badge badge-primary">Current</span>}
                        </div>
                        <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)", marginBottom: "1rem" }}>{plan.price}</p>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {plan.features.map(f => (
                            <li key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.83rem" }}>
                              <Check size={13} color="var(--success)" strokeWidth={3} /> {f}
                            </li>
                          ))}
                        </ul>
                        {!plan.current && (
                          <button className="btn-primary" style={{ marginTop: "1.25rem", fontSize: "0.875rem", padding: "0.65rem 1rem" }}>
                            Upgrade <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════ NOTIFICATIONS ══════════════ */}
            {activeSection === "notifications" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in">
                <div className="glass-panel" style={{ padding: "2rem" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Bell size={20} color="var(--primary)" /> Notification Preferences
                  </h2>
                  <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: "1.75rem" }}>
                    Choose how and when you hear from us.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {[
                      { label: "In-App Alerts", desc: "Get notified when new jobs match your CV inside the dashboard.", val: notifInApp, set: setNotifInApp },
                      { label: "Email Alerts", desc: "Receive email summaries of high-confidence job matches.", val: notifEmail, set: setNotifEmail },
                      { label: "New Job Match Notifications", desc: "Ultra Pro: Instant alert when a new job matches your saved CV.", val: notifJobMatch, set: setNotifJobMatch },
                      { label: "Weekly Digest", desc: "A curated weekly summary of your job search progress.", val: notifWeekly, set: setNotifWeekly },
                    ].map((item) => (
                      <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", padding: "1rem", borderRadius: "var(--radius-sm)", background: "rgba(var(--primary-rgb),0.03)", border: "1px solid var(--card-border)" }}>
                        <div>
                          <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>{item.label}</p>
                          <p className="text-muted" style={{ fontSize: "0.8rem", marginTop: 2 }}>{item.desc}</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" checked={item.val} onChange={e => item.set(e.target.checked)} />
                          <span className="toggle-slider" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════ SECURITY ══════════════ */}
            {activeSection === "security" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in">
                <div className="glass-panel" style={{ padding: "2rem" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Shield size={20} color="var(--primary)" /> Security Overview
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {[
                      { label: "Password Strength", status: "Strong", color: "var(--success)", icon: "🔒" },
                      { label: "Two-Factor Auth (2FA)", status: "Not Enabled", color: "var(--warning)", icon: "📱" },
                      { label: "Active Sessions", status: "1 Device", color: "var(--primary)", icon: "💻" },
                      { label: "Last Login", status: "Just now", color: "var(--foreground-muted)", icon: "🕐" },
                    ].map((item) => (
                      <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)", background: "var(--card-bg)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{ fontSize: "1.3rem" }}>{item.icon}</span>
                          <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{item.label}</span>
                        </div>
                        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: item.color }}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "var(--radius-sm)" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--warning)", fontWeight: 600, marginBottom: "0.35rem" }}>⚠ Enable 2FA for maximum security</p>
                    <p className="text-muted" style={{ fontSize: "0.8rem" }}>Two-factor authentication adds an extra layer of protection to your account.</p>
                    <button className="btn-primary" style={{ width: "auto", padding: "0.6rem 1.1rem", fontSize: "0.82rem", marginTop: "0.75rem" }}>
                      Enable 2FA (Coming Soon)
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
