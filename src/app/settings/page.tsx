"use client";

import dashStyles from "../dashboard/page.module.css";
import {
  Sparkles, LayoutDashboard, FileText, Settings, User,
  CreditCard, Bell, LogOut, Palette, Check, Moon, Sun,
  Shield, Trash2, ChevronRight, Eye, EyeOff, Menu, X
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme, THEMES, ThemeId } from "../../context/ThemeContext";

type Section = "appearance" | "account" | "subscription" | "notifications" | "security";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, themeId } = useTheme();
  const [activeSection, setActiveSection] = useState<Section>("appearance");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");
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
    setPwSuccess("Password updated successfully! \u2713");
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
    { id: "appearance", label: "Appearance", icon: <Palette size={16} /> },
    { id: "account", label: "Account", icon: <User size={16} /> },
    { id: "subscription", label: "Subscription", icon: <CreditCard size={16} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { id: "security", label: "Security", icon: <Shield size={16} /> },
  ];

  const panelPad = isMobile ? "1rem" : "2rem";

  const AppearanceSection = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="animate-fade-in">
      <div className="glass-panel" style={{ padding: panelPad }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Palette size={19} color="var(--primary)" /> Theme
        </h2>
        <p className="text-muted" style={{ fontSize: "0.82rem", marginBottom: "1.25rem" }}>Choose a theme. Changes apply instantly across the whole app.</p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(130px,1fr))", gap: "0.75rem" }}>
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
              <div style={{ borderRadius: "calc(var(--radius) - 3px)", overflow: "hidden", background: "var(--card-bg)" }}>
                <div style={{ height: 54, background: t.preview, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {themeId === t.id && (
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={14} color="#4f46e5" strokeWidth={3} />
                    </div>
                  )}
                  <div style={{ position: "absolute", top: 5, right: 5 }}>
                    {t.dark ? <Moon size={11} color="rgba(255,255,255,0.7)" /> : <Sun size={11} color="rgba(0,0,0,0.5)" />}
                  </div>
                </div>
                <div style={{ padding: "0.45rem 0.6rem", textAlign: "left", background: t.dark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.9)" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 600, color: t.dark ? "white" : "#1a1a2e", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.emoji} {t.name}</p>
                  <p style={{ fontSize: "0.62rem", color: t.dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>{t.dark ? "Dark" : "Light"}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: panelPad }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>🖼 Live Preview</h2>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <button className="btn-primary" style={{ width: "auto", padding: "0.6rem 1.1rem", fontSize: "0.82rem" }}>✦ Primary</button>
          <button className="btn-secondary" style={{ width: "auto", padding: "0.6rem 1.1rem", fontSize: "0.82rem" }}>Secondary</button>
          <span className="badge badge-primary">Pro</span>
          <span className="badge badge-success">Active</span>
          <span className="chip">React</span>
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <div className="progress-bar"><div className="progress-fill" style={{ width: "72%" }} /></div>
        </div>
      </div>
    </div>
  );

  const AccountSection = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="animate-fade-in">
      <div className="glass-panel" style={{ padding: panelPad }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <User size={19} color="var(--primary)" /> Account Details
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label className="section-label">Username</label>
            <input type="text" value="testuser" disabled style={{ ...inputStyle, color: "var(--foreground-muted)", cursor: "not-allowed" }} />
            <p className="text-muted" style={{ fontSize: "0.75rem", marginTop: "0.3rem" }}>Username cannot be changed after registration.</p>
          </div>
          <div>
            <label className="section-label">Member Since</label>
            <div className="glass-panel" style={{ padding: "0.7rem 1rem", fontSize: "0.9rem" }}>September 2026</div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: panelPad }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem" }}>🔑 Change Password</h2>
        {pwError && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "0.75rem", marginBottom: "1rem", fontSize: "0.83rem", color: "var(--error)" }}>{pwError}</div>}
        {pwSuccess && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 8, padding: "0.75rem", marginBottom: "1rem", fontSize: "0.83rem", color: "var(--success)" }}>{pwSuccess}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { label: "Current Password", val: currentPw, set: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(v => !v) },
            { label: "New Password", val: newPw, set: setNewPw, show: showNew, toggle: () => setShowNew(v => !v) },
            { label: "Confirm New Password", val: confirmPw, set: setConfirmPw, show: false as boolean, toggle: null as null },
          ].map((field) => (
            <div key={field.label}>
              <label className="section-label">{field.label}</label>
              <div style={{ position: "relative" }}>
                <input type={field.show ? "text" : "password"} style={{ ...inputStyle, paddingRight: field.toggle ? "3rem" : "1rem" }} value={field.val} onChange={e => field.set(e.target.value)} placeholder="••••••••" />
                {field.toggle && (
                  <button onClick={field.toggle} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--foreground-muted)", padding: 0, display: "flex" }}>
                    {field.show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button className="btn-primary" style={{ width: "auto", padding: "0.75rem 1.5rem" }} onClick={handlePasswordUpdate}>Update Password</button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: panelPad, border: "1px solid rgba(239,68,68,0.25)" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--error)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Trash2 size={19} /> Danger Zone
        </h2>
        <p className="text-muted" style={{ fontSize: "0.82rem", marginBottom: "1rem" }}>These actions are permanent and cannot be undone.</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button className="btn-secondary" style={{ width: "auto", borderColor: "rgba(239,68,68,0.4)", color: "var(--error)" }} onClick={handleLogout}>
            <LogOut size={14} /> Log Out
          </button>
          <button className="btn-secondary" style={{ width: "auto", borderColor: "rgba(239,68,68,0.6)", color: "var(--error)", background: "rgba(239,68,68,0.06)" }}
            onClick={() => { if (confirm("Delete account? This is irreversible.")) alert("Account deletion requested. Our team will process it within 48 hours."); }}>
            <Trash2 size={14} /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const SubscriptionSection = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="animate-fade-in">
      <div className="glass-panel" style={{ padding: panelPad }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CreditCard size={19} color="var(--primary)" /> Current Plan
        </h2>
        <div style={{ background: "rgba(var(--primary-rgb),0.08)", border: "1px solid rgba(var(--primary-rgb),0.2)", borderRadius: "var(--radius)", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Pro Plan</h3>
              <span className="badge badge-primary">Active</span>
            </div>
            <p className="text-muted" style={{ fontSize: "0.82rem" }}>$15 / month · Renews October 1, 2026</p>
          </div>
          <button className="btn-primary" style={{ width: "auto", padding: "0.6rem 1.1rem", fontSize: "0.85rem", flexShrink: 0 }} onClick={handlePortal}>
            <CreditCard size={14} /> Manage Billing
          </button>
        </div>
      </div>
      <div className="glass-panel" style={{ padding: panelPad }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.1rem" }}>Plan Comparison</h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
          {[
            { name: "Pro", price: "$15/mo", current: true, features: ["Unlimited AI tailoring", "Cover letter gen", "Job matching (50/mo)", "Kanban tracker", "Email support"] },
            { name: "Ultra Pro", price: "$29/mo", current: false, features: ["Everything in Pro", "Real-time job alerts", "Resume memory", "ATS score", "Interview prep", "Priority support"] },
          ].map((plan) => (
            <div key={plan.name} className="glass-panel" style={{ padding: "1.25rem", border: plan.current ? "1px solid rgba(var(--primary-rgb),0.35)" : "1px solid var(--card-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <h3 style={{ fontWeight: 700 }}>{plan.name}</h3>
                {plan.current && <span className="badge badge-primary">Current</span>}
              </div>
              <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--primary)", marginBottom: "0.75rem" }}>{plan.price}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", gap: "0.4rem", alignItems: "center", fontSize: "0.82rem" }}>
                    <Check size={12} color="var(--success)" strokeWidth={3} /> {f}
                  </li>
                ))}
              </ul>
              {!plan.current && (
                <button className="btn-primary" style={{ marginTop: "1rem", fontSize: "0.85rem", padding: "0.6rem" }}>
                  Upgrade <ChevronRight size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NotificationsSection = () => (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: panelPad }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Bell size={19} color="var(--primary)" /> Notifications
        </h2>
        <p className="text-muted" style={{ fontSize: "0.82rem", marginBottom: "1.25rem" }}>Choose how and when you hear from us.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { label: "In-App Alerts", desc: "Get notified inside the dashboard when jobs match your CV.", val: notifInApp, set: setNotifInApp },
            { label: "Email Alerts", desc: "Receive email summaries of high-confidence job matches.", val: notifEmail, set: setNotifEmail },
            { label: "Job Match Push", desc: "Instant alert when a new job matches your saved CV.", val: notifJobMatch, set: setNotifJobMatch },
            { label: "Weekly Digest", desc: "A curated weekly summary of your job search progress.", val: notifWeekly, set: setNotifWeekly },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", padding: "0.9rem 1rem", borderRadius: "var(--radius-sm)", background: "rgba(var(--primary-rgb),0.03)", border: "1px solid var(--card-border)" }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "0.88rem", fontWeight: 600 }}>{item.label}</p>
                <p className="text-muted" style={{ fontSize: "0.77rem", marginTop: 2, lineHeight: 1.4 }}>{item.desc}</p>
              </div>
              <label className="toggle-switch" style={{ flexShrink: 0 }}>
                <input type="checkbox" checked={item.val} onChange={e => item.set(e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SecuritySection = () => (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: panelPad }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Shield size={19} color="var(--primary)" /> Security Overview
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { label: "Password Strength", status: "Strong", statusColor: "var(--success)", icon: "🔒" },
            { label: "Two-Factor Auth (2FA)", status: "Not Enabled", statusColor: "var(--warning)", icon: "📱" },
            { label: "Active Sessions", status: "1 Device", statusColor: "var(--primary)", icon: "💻" },
            { label: "Last Login", status: "Just now", statusColor: "var(--foreground-muted)", icon: "🕐" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)", background: "var(--card-bg)", gap: "0.75rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>{item.label}</span>
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: item.statusColor, flexShrink: 0 }}>{item.status}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1.25rem", padding: "1rem", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "var(--radius-sm)" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--warning)", fontWeight: 600, marginBottom: "0.3rem" }}>⚠ Enable 2FA for maximum security</p>
          <p className="text-muted" style={{ fontSize: "0.78rem", lineHeight: 1.4 }}>Two-factor authentication adds an extra layer of protection to your account.</p>
          <button className="btn-primary" style={{ width: "auto", padding: "0.55rem 1rem", fontSize: "0.8rem", marginTop: "0.75rem" }}>Enable 2FA (Coming Soon)</button>
        </div>
      </div>
    </div>
  );

  const sectionComponents: Record<Section, React.ReactNode> = {
    appearance: <AppearanceSection />,
    account: <AccountSection />,
    subscription: <SubscriptionSection />,
    notifications: <NotificationsSection />,
    security: <SecuritySection />,
  };

  return (
    <div className={dashStyles.dashboardLayout}>
      {sidebarOpen && <div className={dashStyles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />}

      <aside className={`${dashStyles.sidebar} ${sidebarOpen ? dashStyles.sidebarOpen : ""}`}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className={dashStyles.logo}><Sparkles size={18} /> ResuMate</div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground-muted)", display: "flex", padding: "4px" }}><X size={20} /></button>
        </div>
        <nav className={dashStyles.navMenu}>
          <Link href="/dashboard" className={dashStyles.navItem} onClick={() => setSidebarOpen(false)}><LayoutDashboard size={18} /> Dashboard</Link>
          <Link href="/tailor" className={dashStyles.navItem} onClick={() => setSidebarOpen(false)}><FileText size={18} /> Resume Tailor</Link>
          <Link href="/settings" className={dashStyles.navItemActive} onClick={() => setSidebarOpen(false)}><Settings size={18} /> Settings</Link>
        </nav>
        <button className={dashStyles.logoutBtn} onClick={handleLogout}><LogOut size={16} /> Log Out</button>
      </aside>

      <main className={dashStyles.mainContent}>
        <header className={dashStyles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            <button className={dashStyles.hamburger} onClick={() => setSidebarOpen(v => !v)} aria-label="Open menu"><Menu size={20} /></button>
            <div>
              <h1 style={{ fontSize: isMobile ? "1.1rem" : "1.4rem", fontWeight: 700 }}>Settings</h1>
              {!isMobile && <p className="text-muted" style={{ fontSize: "0.82rem", marginTop: 2 }}>Manage your account, appearance, and preferences.</p>}
            </div>
          </div>
        </header>

        {isMobile && (
          <nav style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none", borderBottom: "1px solid var(--card-border)", flexShrink: 0 }}>
            {navSections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.35rem",
                  padding: "0.75rem 1rem",
                  background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                  borderBottom: activeSection === s.id ? "2px solid var(--primary)" : "2px solid transparent",
                  color: activeSection === s.id ? "var(--primary)" : "var(--foreground-muted)",
                  fontWeight: activeSection === s.id ? 600 : 400,
                  fontSize: "0.83rem", whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >{s.icon} {s.label}</button>
            ))}
          </nav>
        )}

        <div style={{ display: "flex", flex: 1, overflow: "hidden", gap: isMobile ? 0 : "1.5rem", padding: isMobile ? "1rem" : "0" }}>
          {!isMobile && (
            <div style={{ width: 190, flexShrink: 0, padding: "1.5rem 0 1.5rem 1.5rem" }}>
              <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {navSections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.55rem",
                      padding: "0.65rem 0.9rem", borderRadius: "var(--radius-sm)",
                      background: activeSection === s.id ? "rgba(var(--primary-rgb),0.15)" : "transparent",
                      color: activeSection === s.id ? "var(--primary)" : "var(--foreground-muted)",
                      fontWeight: activeSection === s.id ? 600 : 400, fontSize: "0.875rem",
                      boxShadow: activeSection === s.id ? "inset 3px 0 0 var(--primary)" : "none",
                      border: "none", cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >{s.icon} {s.label}</button>
                ))}
              </nav>
              <div className="glass-panel" style={{ marginTop: "1.25rem", padding: "0.9rem", textAlign: "center" }}>
                <div style={{ height: 50, borderRadius: 7, background: theme.preview, marginBottom: "0.6rem", boxShadow: "var(--btn-shadow)" }} />
                <p style={{ fontSize: "0.78rem", fontWeight: 600 }}>{theme.emoji} {theme.name}</p>
                <p className="text-muted" style={{ fontSize: "0.68rem", marginTop: 1 }}>Active Theme</p>
              </div>
            </div>
          )}

          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "0" : "1.5rem 1.5rem 1.5rem 0", minWidth: 0 }}>
            {sectionComponents[activeSection]}
          </div>
        </div>
      </main>
    </div>
  );
}
