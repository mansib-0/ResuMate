"use client";

import { useState } from "react";
import styles from "./page.module.css";
import {
  Sparkles, LayoutDashboard, FileText, Settings, Upload,
  Bell, Search, CheckCircle, Plus, Trash2, LogOut, Briefcase, Menu, X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Types ────────────────────────────────────────────────────────────────────
interface KanbanCard {
  id: string;
  title: string;
  company: string;
  date: string;
}
interface KanbanColumn {
  id: string;
  label: string;
  color: string;
  cards: KanbanCard[];
}

// ── Initial data ─────────────────────────────────────────────────────────────
const INITIAL_COLUMNS: KanbanColumn[] = [
  {
    id: "wishlist",
    label: "Wishlist",
    color: "#6366f1",
    cards: [
      { id: "w1", title: "Senior React Engineer", company: "TechNova", date: "Sep 1, 2026" },
    ],
  },
  {
    id: "applied",
    label: "Applied",
    color: "#f59e0b",
    cards: [
      { id: "a1", title: "Backend Developer", company: "DataFlow", date: "Aug 28, 2026" },
      { id: "a2", title: "Full Stack Engineer", company: "StartupX", date: "Aug 30, 2026" },
    ],
  },
  {
    id: "interview",
    label: "Interview",
    color: "#8b5cf6",
    cards: [
      { id: "i1", title: "Frontend Specialist", company: "WebCorp", date: "Aug 25, 2026" },
    ],
  },
  {
    id: "offer",
    label: "Offer",
    color: "#10b981",
    cards: [],
  },
  {
    id: "rejected",
    label: "Rejected",
    color: "#ef4444",
    cards: [
      { id: "r1", title: "ML Engineer", company: "AI Inc", date: "Aug 20, 2026" },
    ],
  },
];

const NOTIFICATIONS = [
  { id: 1, text: "New job match: Senior Frontend at Stripe", time: "2h ago" },
  { id: 2, text: "Your saved resume got a 98% match!", time: "1d ago" },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"search" | "kanban">("search");
  const [showNotif, setShowNotif] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Job Search state
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  // Kanban state
  const [columns, setColumns] = useState<KanbanColumn[]>(INITIAL_COLUMNS);
  const [dragCardId, setDragCardId] = useState<string | null>(null);
  const [dragSourceCol, setDragSourceCol] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [addingCol, setAddingCol] = useState<string | null>(null);
  const [addCompany, setAddCompany] = useState("");
  const [addRole, setAddRole] = useState("");

  // ── Handlers: Job Search ─────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setScanning(true);
    const formData = new FormData();
    formData.append("cv", f);
    try {
      const res = await fetch("/api/scan-cv", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setMatchedJobs(data.matchedJobs);
        setSkills(data.extractedSkills);
      } else {
        alert(data.error || "Scan failed");
      }
    } catch {
      alert("Upload failed.");
    } finally {
      setScanning(false);
    }
  };

  // ── Handlers: Kanban ─────────────────────────────────────────────────────
  const handleDragStart = (cardId: string, colId: string) => {
    setDragCardId(cardId);
    setDragSourceCol(colId);
  };

  const handleDrop = (targetColId: string) => {
    if (!dragCardId || !dragSourceCol || dragSourceCol === targetColId) {
      setDragOverCol(null);
      return;
    }
    setColumns(prev => {
      const next = prev.map(col => ({ ...col, cards: [...col.cards] }));
      const srcCol = next.find(c => c.id === dragSourceCol)!;
      const tgtCol = next.find(c => c.id === targetColId)!;
      const cardIdx = srcCol.cards.findIndex(c => c.id === dragCardId);
      if (cardIdx === -1) return prev;
      const [card] = srcCol.cards.splice(cardIdx, 1);
      tgtCol.cards.push(card);
      return next;
    });
    setDragCardId(null);
    setDragSourceCol(null);
    setDragOverCol(null);
  };

  const handleDeleteCard = (colId: string, cardId: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === colId
          ? { ...col, cards: col.cards.filter(c => c.id !== cardId) }
          : col
      )
    );
  };

  const handleAddCard = (colId: string) => {
    if (!addRole.trim()) return;
    const newCard: KanbanCard = {
      id: `${colId}-${Date.now()}`,
      title: addRole.trim(),
      company: addCompany.trim() || "Unknown Company",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setColumns(prev =>
      prev.map(col =>
        col.id === colId ? { ...col, cards: [...col.cards, newCard] } : col
      )
    );
    setAddCompany("");
    setAddRole("");
    setAddingCol(null);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className={styles.logo}><Sparkles size={18} /> ResuMate</div>
        <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground-muted)", display: "flex", padding: "4px" }}>
          <X size={20} />
        </button>
      </div>
      <nav className={styles.navMenu}>
        <Link href="/dashboard" className={styles.navItemActive} onClick={() => setSidebarOpen(false)}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link href="/tailor" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
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
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={styles.dashboardLayout}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar />
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            <button className={styles.hamburger} onClick={() => setSidebarOpen(v => !v)} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <h1>{activeTab === "search" ? "Job Search" : "Kanban Tracker"}</h1>
          </div>
          <div className={styles.bellWrapper}>
            <button className={styles.bellBtn} onClick={() => setShowNotif(v => !v)}>
              <Bell size={22} />
              <span className={styles.notifDot} />
            </button>
            {showNotif && (
              <div className={styles.dropdown}>
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className={styles.dropdownItem}>
                    <p className={styles.dropdownItemText}>{n.text}</p>
                    <p className={styles.dropdownItemTime}>{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={activeTab === "search" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("search")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Search size={16} /> Job Search
            </span>
          </button>
          <button
            className={activeTab === "kanban" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("kanban")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Briefcase size={16} /> Kanban Tracker
            </span>
          </button>
        </div>

        {/* ── Job Search Tab ── */}
        {activeTab === "search" && (
          <div className={styles.boardContainer} style={{ overflowX: "hidden", overflowY: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", border: "1px dashed var(--primary)" }}>
                <h2 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <Search /> Scan CV &amp; Find Jobs
                </h2>
                <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "2rem", maxWidth: "600px", marginInline: "auto" }}>
                  Upload your PDF CV. Our AI will extract your skills and instantly match you with open roles.
                </p>
                <input type="file" accept=".pdf" id="cv-upload" style={{ display: "none" }} onChange={handleFileUpload} />
                <label htmlFor="cv-upload" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", width: "auto", padding: "0.75rem 2rem" }}>
                  {scanning ? (
                    <>
                      <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                      Scanning…
                    </>
                  ) : (
                    <><Upload size={18} /> Upload PDF CV</>
                  )}
                </label>
                {file && !scanning && (
                  <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <CheckCircle size={16} /> {file.name} loaded
                  </p>
                )}
              </div>

              {skills.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: "0.75rem" }}>Extracted Skills</h3>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                    {skills.map(s => (
                      <span key={s} style={{ background: "rgba(99,102,241,0.2)", color: "var(--primary)", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.85rem" }}>{s}</span>
                    ))}
                  </div>

                  <h3 style={{ marginBottom: "1rem" }}>Matched Jobs</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                    {matchedJobs.map(job => (
                      <div key={job.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <h4 style={{ fontSize: "1rem" }}>{job.title}</h4>
                            <span style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 600, flexShrink: 0 }}>
                              {job.matchScore ?? 80}% Match
                            </span>
                          </div>
                          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.88rem", marginTop: "0.25rem" }}>{job.company} • {job.location}</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          {(job.skills || []).map((s: string) => (
                            <span key={s} style={{ border: "1px solid var(--card-border)", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>{s}</span>
                          ))}
                        </div>
                        <button
                          className="btn-secondary"
                          style={{ marginTop: "auto", padding: "0.6rem", fontSize: "0.88rem" }}
                          onClick={() => alert(`Applying to ${job.title} at ${job.company}…`)}
                        >
                          Apply Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Kanban Tab ── */}
        {activeTab === "kanban" && (
          <div className={styles.boardContainer}>
            <div className={styles.board}>
              {columns.map(col => (
                <div
                  key={col.id}
                  className={`${styles.column} ${dragOverCol === col.id ? styles.dragOver : ""}`}
                  onDragOver={e => { e.preventDefault(); setDragOverCol(col.id); }}
                  onDragLeave={() => setDragOverCol(null)}
                  onDrop={() => handleDrop(col.id)}
                >
                  <div className={styles.columnHeader}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.color, flexShrink: 0 }} />
                      {col.label}
                      <span className={styles.badge}>{col.cards.length}</span>
                    </span>
                    <button
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "0.15rem" }}
                      onClick={() => setAddingCol(addingCol === col.id ? null : col.id)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className={styles.columnBody}>
                    {col.cards.map(card => (
                      <div
                        key={card.id}
                        className={styles.card}
                        draggable
                        onDragStart={() => handleDragStart(card.id, col.id)}
                        onDragEnd={() => { setDragCardId(null); setDragSourceCol(null); }}
                      >
                        <div className={styles.cardTitle}>{card.title}</div>
                        <div className={styles.cardCompany}>{card.company}</div>
                        <div className={styles.cardActions}>
                          <span className={styles.date}>{card.date}</span>
                          <button
                            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}
                            onClick={() => handleDeleteCard(col.id, card.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {addingCol === col.id && (
                    <div className={styles.addForm}>
                      <input
                        className={styles.addInput}
                        placeholder="Company name"
                        value={addCompany}
                        onChange={e => setAddCompany(e.target.value)}
                      />
                      <input
                        className={styles.addInput}
                        placeholder="Job role"
                        value={addRole}
                        onChange={e => setAddRole(e.target.value)}
                      />
                      <div className={styles.addBtns}>
                        <button
                          className="btn-primary"
                          style={{ padding: "0.5rem 1rem", fontSize: "0.82rem", flex: 1 }}
                          onClick={() => handleAddCard(col.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}
                          onClick={() => { setAddingCol(null); setAddCompany(""); setAddRole(""); }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
