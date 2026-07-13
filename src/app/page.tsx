"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Sparkles, FileText, Briefcase, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    // Simulate auto-demo
    const timer = setTimeout(() => {
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setAnalyzed(true);
      }, 3000);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Sparkles className={styles.logoIcon} /> ResuMate
        </div>
        <div className={styles.navLinks}>
          <Link href="/pricing" className={styles.btnSecondary}>Pricing</Link>
          <Link href="/dashboard" className="btn-primary">Dashboard</Link>
        </div>
      </nav>

      <main>
        <section className={`${styles.hero} animate-fade-in-up`}>
          <h1 className={styles.title}>
            Land More Interviews with <span className="heading-gradient">AI-Tailored Resumes</span>
          </h1>
          <p className={styles.subtitle}>
            Upload your base CV, paste a job description, and instantly get a perfectly matched resume. Track all your applications in one smart Kanban board.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/tailor" className="btn-primary">Start Tailoring for Free</Link>
          </div>
        </section>

        <section className={styles.demoSection}>
          <div className={`glass-panel ${styles.demoCard}`}>
            <div className={styles.demoHeader}>
              <FileText className={styles.demoHeaderIcon} />
              Your Base CV
            </div>
            <div className={styles.cvBox}>
              {analyzing && <div className={styles.scanLine}></div>}
              <strong>Jane Doe | Software Engineer</strong>
              <br/><br/>
              - Developed web applications using React and Node.js.
              <br/>
              - <span className={analyzed ? styles.highlight : ""}>{analyzed ? "Architected scalable microservices, improving system performance by 40%." : "Improved backend systems for better performance."}</span>
              <br/>
              - <span className={analyzed ? styles.highlight : ""}>{analyzed ? "Collaborated in Agile teams, utilizing AWS and CI/CD pipelines." : "Worked with teams to deploy code to the cloud."}</span>
            </div>
            {analyzing && <p style={{ color: "var(--warning)", fontSize: "0.9rem" }}>AI is analyzing job descriptions and optimizing bullet points...</p>}
            {analyzed && <p style={{ color: "var(--success)", fontSize: "0.9rem", display: "flex", gap: "0.5rem", alignItems: "center" }}><CheckCircle size={16} /> Optimized for Senior Full Stack Role</p>}
          </div>

          <div className={`glass-panel ${styles.demoCard}`}>
            <div className={styles.demoHeader}>
              <Briefcase className={styles.demoHeaderIcon} />
              Matched Jobs
            </div>
            <div className={styles.jobList}>
              <div className={styles.jobItem}>
                <div className={styles.jobInfo}>
                  <h4>Senior Full Stack Engineer</h4>
                  <p>TechNova Inc. • Remote</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {analyzed && <span className={styles.matchScore}>98% Match</span>}
                  <button className={styles.applyBtn}>Apply Now</button>
                </div>
              </div>
              <div className={styles.jobItem}>
                <div className={styles.jobInfo}>
                  <h4>Software Development Engineer II</h4>
                  <p>GlobalFlow • New York, NY</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {analyzed && <span className={styles.matchScore}>92% Match</span>}
                  <button className={styles.applyBtn}>Apply Now</button>
                </div>
              </div>
              <div className={styles.jobItem}>
                <div className={styles.jobInfo}>
                  <h4>React Developer</h4>
                  <p>StartupX • San Francisco, CA</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {analyzed && <span className={styles.matchScore}>85% Match</span>}
                  <button className={styles.applyBtn}>Apply Now</button>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "auto", textAlign: "center" }}>
              <Link href="/dashboard" style={{ color: "var(--primary)", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", textDecoration: "underline" }}>
                View Kanban Application Tracker <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
