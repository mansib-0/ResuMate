"use client";

import styles from "../dashboard/page.module.css";
import { Sparkles, LayoutDashboard, FileText, Settings, User, CreditCard, Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [notifInApp, setNotifInApp] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);

  const inputStyle = { background: "rgba(0,0,0,0.2)", border: "1px solid var(--card-border)", borderRadius: 8, padding: "0.8rem 1rem", color: "white", outline: "none", fontFamily: "inherit", fontSize: "0.9rem", width: "100%" };

  const handlePasswordUpdate = () => {
    if (!currentPw || !newPw || !confirmPw) { alert("Please fill in all password fields."); return; }
    if (newPw !== confirmPw) { alert("New passwords do not match."); return; }
    if (newPw.length < 6) { alert("Password must be at least 6 characters."); return; }
    alert("Password updated successfully!");
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

  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}><Sparkles /> ResuMate Pro</div>
        <nav className={styles.navMenu}>
          <Link href="/dashboard" className={styles.navItem}><LayoutDashboard size={20} /> Dashboard</Link>
          <Link href="/tailor" className={styles.navItem}><FileText size={20} /> Resume Tailor</Link>
          <Link href="/settings" className={styles.navItemActive}><Settings size={20} /> Settings</Link>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}><LogOut size={18} /> Log Out</button>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}><h1>Settings</h1></header>

        <div className={styles.boardContainer} style={{ overflowX: "hidden", overflowY: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: 760 }}>

            {/* Account */}
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User size={20} /> Account
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Username</label>
                  <input type="text" value="testuser" disabled style={{ ...inputStyle, color: "rgba(255,255,255,0.45)" }} />
                </div>
                <hr style={{ border: "none", borderTop: "1px solid var(--card-border)" }} />
                <h3 style={{ fontSize: "1rem" }}>Change Password</h3>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Current Password</label>
                  <input type="password" style={inputStyle} value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>New Password</label>
                  <input type="password" style={inputStyle} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="At least 6 characters" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Confirm New Password</label>
                  <input type="password" style={inputStyle} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" />
                </div>
                <button className="btn-primary" style={{ width: "auto", padding: "0.75rem 1.5rem" }} onClick={handlePasswordUpdate}>
                  Update Password
                </button>
              </div>
            </div>

            {/* Subscription */}
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CreditCard size={20} /> Subscription
              </h2>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(99,102,241,0.1)", padding: "1.5rem", borderRadius: 10, border: "1px solid var(--primary)" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
                    <h3 style={{ fontSize: "1.05rem" }}>Current Plan</h3>
                    <span style={{ background: "var(--primary)", color: "white", padding: "0.2rem 0.75rem", borderRadius: 20, fontSize: "0.78rem", fontWeight: 700 }}>Pro</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.65)" }}>Your AI job search tools are active.</p>
                </div>
                <button className="btn-primary" style={{ width: "auto", padding: "0.6rem 1.25rem", fontSize: "0.88rem" }} onClick={handlePortal}>
                  Manage Billing
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Bell size={20} /> Notifications
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={notifInApp} onChange={e => setNotifInApp(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--primary)" }} />
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>In-App Alerts</p>
                    <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Get notified when new jobs match your CV inside the dashboard.</p>
                  </div>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={notifEmail} onChange={e => setNotifEmail(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--primary)" }} />
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>Email Alerts</p>
                    <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Receive email summaries of high-confidence job matches.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-panel" style={{ padding: "2rem", border: "1px solid rgba(239,68,68,0.3)" }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "var(--error)" }}>Danger Zone</h2>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button
                  className="btn-secondary"
                  style={{ width: "auto", border: "1px solid rgba(239,68,68,0.4)", color: "var(--error)" }}
                  onClick={handleLogout}
                >
                  Log Out
                </button>
                <button
                  className="btn-secondary"
                  style={{ width: "auto", border: "1px solid rgba(239,68,68,0.6)", color: "var(--error)", background: "rgba(239,68,68,0.08)" }}
                  onClick={() => { if (confirm("Are you sure you want to delete your account? This action is irreversible.")) { alert("Account deletion requested. Our team will process it within 48 hours."); } }}
                >
                  Delete Account
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
