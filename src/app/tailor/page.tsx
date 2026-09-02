"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Sparkles, LayoutDashboard, FileText, Settings, Copy, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TailorPage() {
  const router = useRouter();
  const [baseCv, setBaseCv] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [tailoredCv, setTailoredCv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTailor = async () => {
    if (!baseCv.trim() || !jobDescription.trim()) {
      setError("Please provide both Base CV Text and Job Description.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseCv, jobDescription, targetCompany: company, jobTitle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to tailor CV");
      setTailoredCv(data.tailoredResume || "");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tailoredCv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className={styles.layout}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className={styles.logo}><Sparkles size={18} /> ResuMate</div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground-muted)", display: "flex", padding: "4px" }}>
            <X size={20} />
          </button>
        </div>
        <nav className={styles.navMenu}>
          <Link href="/dashboard" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/tailor" className={styles.navItemActive} onClick={() => setSidebarOpen(false)}>
            <FileText size={18} /> Resume Tailor
          </Link>
          <Link href="/settings" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
            <Settings size={18} /> Settings
          </Link>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} /> Log Out
        </button>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            <button className={styles.hamburger} onClick={() => setSidebarOpen(v => !v)} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <h1>Tailor Your Resume</h1>
          </div>
        </header>

        <div className={styles.workspace}>
          {/* Input Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>Input Materials</div>
            <div className={styles.panelBody}>
              {error && (
                <div style={{ color: "var(--error)", background: "rgba(239,68,68,0.1)", padding: "1rem", borderRadius: "8px", fontSize: "0.9rem" }}>
                  {error}
                </div>
              )}
              <div className={styles.formGroup}>
                <label>Target Company</label>
                <input type="text" className={styles.input} placeholder="e.g. OpenAI" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Job Title</label>
                <input type="text" className={styles.input} placeholder="e.g. Senior Frontend Engineer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Job Description</label>
                <textarea className={styles.textarea} placeholder="Paste the full job description here…" value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Base CV Text</label>
                <textarea className={styles.textarea} placeholder="Paste your current resume text here…" value={baseCv} onChange={e => setBaseCv(e.target.value)} />
              </div>
              <button className="btn-primary" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }} onClick={handleTailor} disabled={loading}>
                {loading ? (
                  <><span className={styles.spinner} /> Generating…</>
                ) : (
                  <><Sparkles size={18} /> Generate Tailored Resume</>
                )}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              Tailored Output
              {tailoredCv && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem", width: "auto" }}
                    onClick={handleCopy}
                  >
                    <Copy size={14} /> {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.82rem", width: "auto" }}
                    onClick={() => alert("Saved to Tracker!")}
                  >
                    Save to Tracker
                  </button>
                </div>
              )}
            </div>
            <div className={styles.panelBody} style={{ background: "rgba(0,0,0,0.1)" }}>
              {tailoredCv ? (
                <div className={styles.tailoredOutput}>{tailoredCv}</div>
              ) : (
                <div className={styles.emptyState}>
                  <FileText size={48} style={{ opacity: 0.5 }} />
                  <p>Your AI-tailored resume will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
