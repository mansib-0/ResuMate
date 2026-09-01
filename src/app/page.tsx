"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Sparkles, FileText, Briefcase, CheckCircle, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const DEMO_JOBS = [
  { id: 1, title: "Senior Full Stack Engineer", company: "TechNova Inc.", location: "Remote" },
  { id: 2, title: "Software Development Engineer II", company: "GlobalFlow", location: "New York, NY" },
  { id: 3, title: "React Developer", company: "StartupX", location: "San Francisco, CA" },
];

export default function Home() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setAnalyzing(true), 1500);
    const t2 = setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className={styles.container}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Sparkles className={styles.logoIcon} /> ResuMate
        </div>
        <div className={styles.navLinks}>
          <Link href="/login" className={styles.btnSecondary}>Login</Link>
          <Link href="/pricing" className={styles.btnSecondary}>Pricing</Link>
          <Link href="/register" className={styles.btnPrimary}>Get Started</Link>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className={`${styles.hero} animate-fade-in-up`}>
          <div className={styles.badge}>AI-Powered Career Tool</div>
          <h1 className={styles.title}>
            Land More Interviews,{" "}
            <span className="heading-gradient">IN SHA ALLAH</span>
          </h1>
          <p className={styles.subtitle}>
            Upload your CV, match to live job listings, tailor your resume with AI,
            and track every application — all in one premium workspace.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/register" className={styles.btnPrimary}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className={styles.btnSecondary}>
              View Pricing
            </Link>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className={styles.demoSection}>
          {/* CV scan panel */}
          <div className={`glass-panel ${styles.demoCard}`}>
            <div className={styles.demoHeader}>
              <FileText className={styles.demoHeaderIcon} /> Your Base CV
            </div>
            <div className={styles.cvBox}>
              {analyzing && <div className={styles.scanLine} />}
              <strong>Jane Doe | Software Engineer</strong>
              <br /><br />
              {"- Developed web applications using React and Node.js."}
              <br />
              {"- "}
              <span className={analyzed ? styles.highlight : ""}>
                {analyzed
                  ? "Architected scalable microservices, improving performance by 40%."
                  : "Improved backend systems for better performance."}
              </span>
              <br />
              {"- "}
              <span className={analyzed ? styles.highlight : ""}>
                {analyzed
                  ? "Led CI/CD pipelines on AWS, reducing deploy time by 60%."
                  : "Worked with teams to deploy code to the cloud."}
              </span>
            </div>
            {analyzing && (
              <p style={{ color: "var(--warning)", fontSize: "0.9rem" }}>
                AI is analyzing job descriptions and optimizing bullet points…
              </p>
            )}
            {analyzed && (
              <p style={{ color: "var(--success)", fontSize: "0.9rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <CheckCircle size={16} /> Optimized for Senior Full Stack Role
              </p>
            )}
          </div>

          {/* Matched jobs panel */}
          <div className={`glass-panel ${styles.demoCard}`}>
            <div className={styles.demoHeader}>
              <Briefcase className={styles.demoHeaderIcon} /> Matched Jobs
            </div>
            <div className={styles.jobList}>
              {DEMO_JOBS.map((job, i) => (
                <div key={job.id} className={styles.jobItem}>
                  <div className={styles.jobInfo}>
                    <h4>{job.title}</h4>
                    <p>{job.company} &bull; {job.location}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                    {analyzed && (
                      <span className={styles.matchScore}>{[98, 92, 85][i]}% Match</span>
                    )}
                    <button
                      className={styles.applyBtn}
                      onClick={() => alert(`Applying to ${job.title} at ${job.company}…`)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "auto" }}>
              <Link
                href="/dashboard"
                style={{ color: "var(--primary)", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.3rem", textDecoration: "underline" }}
              >
                View Kanban Tracker <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Plans Preview */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>
            Simple, <span className="heading-gradient">Powerful</span> Pricing
          </h2>
          <p className={styles.sectionSubtitle}>
            No free tier. Every plan is built for serious job seekers who want results.
          </p>
          <div className={styles.plansGrid}>
            {/* Pro */}
            <div className={styles.planCard}>
              <div className={styles.planName}>Pro</div>
              <div className={styles.planPrice}>$15<span>/mo</span></div>
              <p className={styles.planDesc}>Perfect for active job seekers who need AI resume analysis.</p>
              <ul className={styles.featureList}>
                {["PDF Resume Upload & Parsing", "Instant AI Job Search Engine", "Unlimited AI Resume Tailoring", "Kanban Board Tracker", "Priority Support"].map(f => (
                  <li key={f} className={styles.featureItem}><Check size={16} color="var(--success)" /> {f}</li>
                ))}
              </ul>
              <Link href="/register" className={styles.btnSecondary} style={{ textAlign: "center", marginTop: "auto" }}>Get Pro</Link>
            </div>
            {/* Ultra Pro */}
            <div className={`${styles.planCard} ${styles.planCardFeatured}`}>
              <div className={styles.planBadge}>MOST POPULAR</div>
              <div className={styles.planName}>Ultra Pro</div>
              <div className={styles.planPrice}>$29<span>/mo</span></div>
              <p className={styles.planDesc}>For serious hunters. Let AI find jobs while you sleep.</p>
              <ul className={styles.featureList}>
                {["Everything in Pro", "Resume Memory Storage", "24/7 Automated Job Scraping", "Instant Push Notifications", "Cover Letter AI Writing", "Outreach Templates"].map(f => (
                  <li key={f} className={styles.featureItem}><Check size={16} color="var(--secondary)" /> {f}</li>
                ))}
              </ul>
              <Link href="/register" className={styles.btnPrimary} style={{ textAlign: "center", marginTop: "auto" }}>Get Ultra Pro</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} ResuMate. All rights reserved. Built with love for job seekers.</p>
      </footer>
    </div>
  );
}
