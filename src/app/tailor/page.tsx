"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Sparkles, LayoutDashboard, FileText, Settings, Copy, LogOut } from "lucide-react";
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
      <aside className={styles.sidebar}>
        <div className={styles.logo}><Sparkles /> ResuMate</div>
        <nav className={styles.navMenu}>
          <Link href="/dashboard" className={styles.navItem}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/tailor" className={styles.navItemActive}>
            <FileText size={20} /> Resume Tailor
          </Link>
          <Link href="/settings" className={styles.navItem}>
            <Settings size={20} /> Settings
          </Link>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} /> Log Out
        </button>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Tailor Your Resume</h1>
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
