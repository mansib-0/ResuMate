"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Sparkles, LayoutDashboard, FileText, Settings, Upload, CheckCircle, Save } from "lucide-react";
import Link from "next/link";

export default function TailorPage() {
  const [baseCv, setBaseCv] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  
  const [tailoredCv, setTailoredCv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTailor = async () => {
    if (!baseCv || !jobDescription) {
      setError("Please provide both base CV and Job Description.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseCv, jobDescription })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to tailor CV");
      
      setTailoredCv(data.tailoredCv);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDashboard = () => {
    // In a real app, this would POST to a Supabase route to insert into the applications table
    alert(`Saved ${jobTitle} at ${company} to Dashboard!`);
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Sparkles /> ResuMate
        </div>
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
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Tailor Your Resume</h1>
        </header>

        <div className={styles.workspace}>
          {/* Left Panel: Input */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              Input Materials
            </div>
            <div className={styles.panelBody}>
              {error && <div style={{ color: "var(--error)", padding: "1rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px" }}>{error}</div>}
              
              <div className={styles.formGroup}>
                <label>Target Company</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. OpenAI" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Job Title</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. Senior Frontend Engineer" 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Job Description</label>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label>Base CV Text</label>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Paste your current resume text here..."
                  value={baseCv}
                  onChange={(e) => setBaseCv(e.target.value)}
                ></textarea>
                <div style={{ textAlign: "center", margin: "0.5rem 0", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>OR</div>
                <div className={styles.fileUpload}>
                  <Upload size={24} style={{ margin: "0 auto 0.5rem", color: "var(--primary)" }} />
                  <div>Upload PDF Resume (Coming Soon)</div>
                </div>
              </div>

              <button 
                className="btn-primary" 
                style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "0.5rem", alignItems: "center" }}
                onClick={handleTailor}
                disabled={loading}
              >
                {loading ? <div className={styles.spinner}></div> : <><Sparkles size={18} /> Generate Tailored Resume</>}
              </button>
            </div>
          </div>

          {/* Right Panel: Output */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              Tailored Output
              {tailoredCv && (
                <button 
                  className="btn-secondary" 
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                  onClick={handleSaveToDashboard}
                >
                  <Save size={14} /> Save to Tracker
                </button>
              )}
            </div>
            <div className={styles.panelBody} style={{ background: "rgba(0,0,0,0.1)" }}>
              {tailoredCv ? (
                <div className={styles.tailoredOutput}>
                  {tailoredCv}
                </div>
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
