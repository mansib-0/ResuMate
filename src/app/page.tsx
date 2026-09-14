"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import {
  Sparkles, FileText, Briefcase, CheckCircle, ArrowRight,
  Check, Zap, Shield, Brain, TrendingUp, Star, ChevronRight,
  Play, Users, Award
} from "lucide-react";
import Link from "next/link";

const DEMO_JOBS = [
  { id: 1, title: "Senior Full Stack Engineer", company: "TechNova Inc.", location: "Remote", match: 98 },
  { id: 2, title: "Software Engineer II", company: "GlobalFlow", location: "New York, NY", match: 92 },
  { id: 3, title: "React Developer", company: "StartupX", location: "San Francisco", match: 85 },
];

const STATS = [
  { value: 12000, suffix: "+", label: "Resumes Tailored" },
  { value: 94, suffix: "%", label: "Interview Rate" },
  { value: 3, suffix: "x", label: "Faster Job Search" },
  { value: 50, suffix: "K+", label: "Jobs Matched" },
];

const FEATURES = [
  { icon: <Brain size={24} />, title: "AI Resume Tailoring", desc: "Gemini AI rewrites your resume to perfectly match each job description — keywords, tone, impact.", color: "#6366f1" },
  { icon: <Briefcase size={24} />, title: "Smart Job Matching", desc: "Upload your CV and instantly get ranked job matches with compatibility scores.", color: "#ec4899" },
  { icon: <TrendingUp size={24} />, title: "Kanban Job Tracker", desc: "Drag-and-drop board to track every application from wishlist to offer.", color: "#10b981" },
  { icon: <Zap size={24} />, title: "Instant Optimization", desc: "Real-time ATS scoring tells you exactly how your resume performs before you apply.", color: "#f59e0b" },
  { icon: <Shield size={24} />, title: "Privacy First", desc: "Your CV data is encrypted and never shared. You own your data, always.", color: "#8b5cf6" },
  { icon: <Star size={24} />, title: "Cover Letter AI", desc: "Generate compelling, personalized cover letters for every job in seconds.", color: "#06b6d4" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setAnalyzing(true), 1500);
    const t2 = setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className={styles.container}>
      {/* ── Animated grid background ── */}
      <div className={styles.gridBg} aria-hidden />
      <div className={styles.orb1} aria-hidden />
      <div className={styles.orb2} aria-hidden />
      <div className={styles.orb3} aria-hidden />

      {/* ── Nav ── */}
      <nav className={styles.nav} style={{ position: "relative", zIndex: 50 }}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}><Sparkles size={18} /></div>
          <span>ResuMate</span>
          <span className={styles.logoBadge}>AI</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/pricing" className={styles.navLink}>Pricing</Link>
          <Link href="/login" className={styles.navLinkSecondary}>Log In</Link>
          <Link href="/register" className={styles.btnPrimary}>
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            AI-Powered Career Platform
          </div>

          <h1 className={styles.title}>
            Land Your Dream Job,{" "}
            <span className={styles.titleGradient}>IN SHA ALLAH</span>
          </h1>

          <p className={styles.subtitle}>
            Upload your CV → AI matches live jobs → tailors your resume → tracks applications.
            <br className={styles.subtitleBr} />
            All in one premium workspace, built for serious job seekers.
          </p>

          <div className={styles.ctaGroup}>
            <Link href="/register" className={styles.btnPrimary}>
              <Sparkles size={16} />
              Start for Free
            </Link>
            <Link href="/pricing" className={styles.btnSecondary}>
              View Pricing <ChevronRight size={15} />
            </Link>
          </div>

          {/* Trust badges */}
          <div className={styles.trustRow}>
            <span className={styles.trustItem}><CheckCircle size={13} color="#10b981" /> No credit card required</span>
            <span className={styles.trustItem}><Shield size={13} color="#6366f1" /> Bank-grade encryption</span>
            <span className={styles.trustItem}><Zap size={13} color="#f59e0b" /> Results in 30 seconds</span>
          </div>
        </section>

        {/* ── Live Demo ── */}
        <section className={styles.demoSection}>
          <div className={styles.demoLabel}>
            <Play size={13} fill="currentColor" /> Live Demo — Watch AI Work
          </div>
          <div className={styles.demoGrid}>
            {/* CV scan panel */}
            <div className={`${styles.demoCard} ${styles.glassCard}`}>
              <div className={styles.demoHeader}>
                <div className={styles.demoHeaderIcon}><FileText size={16} /></div>
                Your Base CV
                {analyzing && <span className={styles.scanBadge}>Scanning…</span>}
                {analyzed && <span className={styles.doneBadge}><CheckCircle size={11} /> Optimized</span>}
              </div>
              <div className={styles.cvBox}>
                {analyzing && <div className={styles.scanLine} />}
                <p className={styles.cvName}>Jane Doe | Software Engineer</p>
                <p className={styles.cvLine}>— Developed web apps using React and Node.js.</p>
                <p className={`${styles.cvLine} ${analyzed ? styles.highlight : ""}`}>
                  {analyzed
                    ? "— Architected scalable microservices, improving performance by 40%."
                    : "— Improved backend systems for better performance."}
                </p>
                <p className={`${styles.cvLine} ${analyzed ? styles.highlight : ""}`}>
                  {analyzed
                    ? "— Led CI/CD pipelines on AWS, reducing deploy time by 60%."
                    : "— Worked with teams to deploy code to the cloud."}
                </p>
              </div>
            </div>

            {/* Matched jobs panel */}
            <div className={`${styles.demoCard} ${styles.glassCard}`}>
              <div className={styles.demoHeader}>
                <div className={styles.demoHeaderIcon} style={{ background: "rgba(236,72,153,0.15)", color: "#ec4899" }}><Briefcase size={16} /></div>
                AI Matched Jobs
              </div>
              <div className={styles.jobList}>
                {DEMO_JOBS.map((job, i) => (
                  <div key={job.id} className={styles.jobItem} style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className={styles.jobInfo}>
                      <h4>{job.title}</h4>
                      <p>{job.company} · {job.location}</p>
                    </div>
                    <div className={styles.jobRight}>
                      {analyzed && (
                        <span className={styles.matchScore}
                          style={{ color: job.match >= 95 ? "#10b981" : job.match >= 88 ? "#f59e0b" : "#6366f1" }}>
                          {job.match}%
                        </span>
                      )}
                      <button className={styles.applyBtn} onClick={() => alert(`Applying to ${job.title}…`)}>
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard" className={styles.demoLink}>
                Open Full Dashboard <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className={styles.statsSection}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statValue}>
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── Features ── */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionTag}>Everything You Need</div>
          <h2 className={styles.sectionTitle}>
            The complete AI job search{" "}
            <span className={styles.titleGradient}>toolkit</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Stop spending hours tailoring resumes manually. Let AI do the heavy lifting.
          </p>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={styles.featureCard}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{ "--accent-color": f.color } as React.CSSProperties}
              >
                <div className={styles.featureIcon} style={{ background: `${f.color}18`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
                <div className={styles.featureArrow} style={{ color: f.color }}>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing plans ── */}
        <section className={styles.plansSection}>
          <div className={styles.sectionTag}>Pricing</div>
          <h2 className={styles.sectionTitle}>
            Simple, <span className={styles.titleGradient}>powerful</span> plans
          </h2>
          <p className={styles.sectionSubtitle}>
            No free tier. Every plan is built for serious job seekers who want results.
          </p>
          <div className={styles.plansGrid}>
            {/* Pro */}
            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <span className={styles.planName}>Pro</span>
                <div className={styles.planPrice}>$15<span>/mo</span></div>
              </div>
              <p className={styles.planDesc}>Perfect for active job seekers who need AI resume analysis.</p>
              <ul className={styles.featureList}>
                {["PDF Resume Upload & AI Parse", "Instant Job Matching Engine", "Unlimited AI Resume Tailoring", "Kanban Board Tracker", "Cover Letter Generator", "Email Support"].map(f => (
                  <li key={f} className={styles.featureItem}><Check size={14} color="#10b981" strokeWidth={2.5} /> {f}</li>
                ))}
              </ul>
              <Link href="/register" className={`${styles.planBtn} ${styles.planBtnSecondary}`}>
                Get Started → Pro
              </Link>
            </div>

            {/* Ultra Pro */}
            <div className={`${styles.planCard} ${styles.planCardFeatured}`}>
              <div className={styles.planBadge}>⚡ MOST POPULAR</div>
              <div className={styles.planHeader}>
                <span className={styles.planName}>Ultra Pro</span>
                <div className={styles.planPrice}>$29<span>/mo</span></div>
              </div>
              <p className={styles.planDesc}>For serious hunters. Let AI find jobs while you sleep, IN SHA ALLAH.</p>
              <ul className={styles.featureList}>
                {["Everything in Pro", "Resume Memory Storage", "24/7 Automated Job Alerts", "ATS Score Simulation", "Interview Prep AI", "LinkedIn Outreach Templates", "Priority Support"].map(f => (
                  <li key={f} className={styles.featureItem}><Check size={14} color="#ec4899" strokeWidth={2.5} /> {f}</li>
                ))}
              </ul>
              <Link href="/register" className={`${styles.planBtn} ${styles.planBtnPrimary}`}>
                <Sparkles size={15} /> Get Ultra Pro
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className={styles.ctaBanner}>
          <div className={styles.ctaBannerBg} aria-hidden />
          <div className={styles.ctaBannerContent}>
            <h2 className={styles.ctaBannerTitle}>
              Ready to land your dream job,{" "}
              <span className={styles.titleGradient}>IN SHA ALLAH?</span>
            </h2>
            <p className={styles.ctaBannerSub}>Join thousands of job seekers who accelerated their career with ResuMate AI.</p>
            <div className={styles.ctaGroup} style={{ justifyContent: "center" }}>
              <Link href="/register" className={styles.btnPrimary}>
                <Sparkles size={16} /> Start Now — It Takes 30 Seconds
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Link href="/" className={styles.footerLogo}>
            <Sparkles size={16} /> ResuMate
          </Link>
          <div className={styles.footerLinks}>
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Sign Up</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} ResuMate. All rights reserved. Made with ❤️ for job seekers everywhere.</p>
          <p style={{ marginTop: "0.25rem", fontSize: "0.8rem" }}>IN SHA ALLAH — May every application be a success.</p>
        </div>
      </footer>
    </div>
  );
}
