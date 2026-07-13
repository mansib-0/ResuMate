"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Sparkles, LayoutDashboard, FileText, Settings, Briefcase, ChevronRight, Upload, Bell, Search, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  
  // Mock notifications
  const notifications = [
    { id: 1, text: "New job match: Senior Frontend at Stripe", time: "2h ago" },
    { id: 2, text: "Your saved resume got a 98% match!", time: "1d ago" }
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto trigger scan
      setScanning(true);
      const formData = new FormData();
      formData.append("cv", selectedFile);

      try {
        const res = await fetch("/api/scan-cv", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        
        if (res.ok) {
          setMatchedJobs(data.matchedJobs);
          setSkills(data.extractedSkills);
        } else {
          alert(data.error);
        }
      } catch (err) {
        alert("Upload failed.");
      } finally {
        setScanning(false);
      }
    }
  };

  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Sparkles /> ResuMate Pro
        </div>
        <nav className={styles.navMenu}>
          <Link href="/dashboard" className={styles.navItemActive}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/tailor" className={styles.navItem}>
            <FileText size={20} /> Resume Tailor
          </Link>
          <Link href="/settings" className={styles.navItem}>
            <Settings size={20} /> Settings
          </Link>
        </nav>

        <div className="glass-panel" style={{ marginTop: "auto", padding: "1.5rem", borderRadius: "8px", background: "rgba(99, 102, 241, 0.1)" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem", fontWeight: "600" }}>
            <Bell size={18} color="var(--primary)" /> Notifications
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {notifications.map(n => (
              <div key={n.id} style={{ fontSize: "0.85rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem" }}>
                <p style={{ color: "rgba(255,255,255,0.9)" }}>{n.text}</p>
                <span style={{ color: "var(--primary)", fontSize: "0.75rem" }}>{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Job Search Engine</h1>
        </header>

        <div className={styles.boardContainer} style={{ display: "flex", flexDirection: "column", gap: "2rem", overflowY: "auto" }}>
          
          {/* Upload Section */}
          <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", border: "1px dashed var(--primary)" }}>
            <h2 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}><Search /> Scan CV & Find Jobs</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "2rem", maxWidth: "600px", marginInline: "auto" }}>
              Upload your latest PDF CV. Our AI will extract your skills and instantly match you with open roles. Ultra Pro users automatically get notified when new jobs match this CV!
            </p>
            
            <input 
              type="file" 
              accept=".pdf" 
              id="cv-upload" 
              style={{ display: "none" }} 
              onChange={handleFileUpload}
            />
            <label htmlFor="cv-upload" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              {scanning ? "Scanning..." : <><Upload size={18} /> Upload PDF CV</>}
            </label>
            {file && <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--success)" }}><CheckCircle size={16} style={{ display: "inline", verticalAlign: "middle" }}/> {file.name} loaded</p>}
          </div>

          {/* Results Section */}
          {skills.length > 0 && (
            <div style={{ padding: "0 1rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>Extracted Skills</h3>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                {skills.map(skill => (
                  <span key={skill} style={{ background: "rgba(99, 102, 241, 0.2)", color: "var(--primary)", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.85rem" }}>
                    {skill}
                  </span>
                ))}
              </div>

              <h3 style={{ marginBottom: "1rem" }}>Matched Jobs</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {matchedJobs.map(job => (
                  <div key={job.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h4 style={{ fontSize: "1.1rem" }}>{job.title}</h4>
                        <span style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "600" }}>
                          {job.matchScore || 85}% Match
                        </span>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginTop: "0.25rem" }}>{job.company} • {job.location}</p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {job.skills.map((s: string) => (
                        <span key={s} style={{ border: "1px solid var(--card-border)", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>{s}</span>
                      ))}
                    </div>
                    <button className="btn-secondary" style={{ marginTop: "auto" }}>Apply Now</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
