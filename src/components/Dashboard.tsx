"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Briefcase,
  BarChart3,
  Upload,
  Sun,
  Moon,
  Sparkles,
  Check,
  X,
  Plus,
  Zap,
  Trash2,
  ArrowRight,
  Trophy,
  User,
  PlusCircle,
  GraduationCap,
  Layers,
  Shield,
  Lightbulb,
  AlertTriangle,
  Activity,
  Search,
  Database,
  Server,
  Gauge,
  FileSearch,
  type LucideIcon,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════════ */

interface AnalysisScores {
  overall: number;
  semantic: number;
  skillMatch: number;
  experience: number;
  education: number;
  summary: number;
  sections: Record<string, number>;
}
interface SkillAnalysis {
  matched: string[];
  missing: string[];
  additional: string[];
  matchRatio: number;
}
interface Explanation {
  scoreLabel: string;
  scoreColor: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keyInsights: string[];
}
interface AnalysisData {
  scores: AnalysisScores;
  skills: SkillAnalysis;
  resumeSkills: string[];
  jobSkills: string[];
  resumeSections: Record<string, string>;
  explanation: Explanation;
}
interface RankingItem {
  name: string;
  overallScore: number;
  scoreLabel: string;
  matchedSkillsCount: number;
  missingSkillsCount: number;
  skills: { matched: string[]; missing: string[] };
  scores: { overall: number; semantic: number; skillMatch: number; experience: number; education: number };
  strengths: string[];
  weaknesses: string[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════════════════════════════════════ */

const easeOutQuart: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutQuart } },
};
const staggerBox = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const staggerChild = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOutQuart } },
};

/* ═══════════════════════════════════════════════════════════════════════════
   Sample Data
   ═══════════════════════════════════════════════════════════════════════════ */

const SAMPLE_RESUME = `John Smith — Senior Software Engineer
San Francisco, CA | john.smith@email.com | linkedin.com/in/johnsmith

SUMMARY
Experienced full-stack software engineer with 6+ years of experience building scalable web applications. Proficient in JavaScript, TypeScript, React, Node.js, and Python. Strong background in cloud computing with AWS and containerization with Docker. Passionate about clean code, testing, and mentoring.

EXPERIENCE
Senior Software Engineer — TechCorp Inc. (2021 – Present)
• Led development of microservices architecture using Node.js and TypeScript serving 1M+ requests/day
• Implemented CI/CD pipelines using GitHub Actions and Docker, reducing deployment time by 60%
• Built React-based dashboard serving 50K+ daily users with real-time data visualization
• Managed PostgreSQL databases and optimized query performance achieving 99.9% uptime
• Mentored 4 junior developers and conducted weekly code reviews

Software Engineer — StartupXYZ (2018 – 2021)
• Developed REST APIs using Express.js and Python Flask for mobile applications
• Built real-time notification features using WebSocket and Redis pub/sub
• Deployed applications on AWS (EC2, S3, Lambda, CloudFront)
• Implemented automated testing using Jest and Cypress achieving 85% code coverage

EDUCATION
B.S. Computer Science — University of Technology (2018) | GPA: 3.8/4.0
M.S. Software Engineering — State University (2020) | Focus: Distributed Systems & ML

SKILLS
Languages: JavaScript, TypeScript, Python, Java, SQL
Frontend: React, Next.js, Vue.js, Tailwind CSS, Redux, HTML5, CSS3
Backend: Node.js, Express.js, Flask, REST API, GraphQL, WebSocket
Databases: PostgreSQL, MongoDB, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, GitHub Actions, Nginx
Testing: Jest, Cypress, Unit Testing, TDD`;

const SAMPLE_JOB = `Senior Full-Stack Developer

About the Role:
We are looking for a Senior Full-Stack Developer to join our growing engineering team. You will be responsible for building and maintaining web applications that serve millions of users.

Requirements:
• 5+ years of experience in full-stack web development
• Strong proficiency in JavaScript, TypeScript, and React
• Experience with Node.js and backend API development
• Experience with cloud platforms (AWS, GCP, or Azure)
• Proficiency with SQL and NoSQL databases (PostgreSQL, MongoDB)
• Experience with containerization (Docker, Kubernetes)
• Familiarity with CI/CD pipelines and DevOps practices
• Experience with testing frameworks (Jest, Cypress)
• Knowledge of REST API design and GraphQL
• Experience with Git and version control
• Strong problem-solving and communication skills

Nice to have:
• Experience with Python
• Knowledge of machine learning concepts
• Experience with microservices architecture
• Experience with Redis or similar caching solutions`;

/* ═══════════════════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Dashboard() {
  /* ── state ─────────────────────────────────────────────────────────────── */
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"analyze" | "rank">("analyze");
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rankResumes, setRankResumes] = useState<Array<{ name: string; text: string }>>([{ name: "", text: "" }]);
  const [rankJobText, setRankJobText] = useState("");
  const [isRanking, setIsRanking] = useState(false);
  const [rankResults, setRankResults] = useState<RankingItem[] | null>(null);
  const [rankError, setRankError] = useState<string | null>(null);

  /* ── dark mode ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("rm-dark");
    if (saved === "true" || (!saved && window.matchMedia("(prefers-color-scheme:dark)").matches)) {
      setDarkMode(true);
    }
  }, []);
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("rm-dark", String(darkMode));
  }, [darkMode, mounted]);

  /* ── callbacks ─────────────────────────────────────────────────────────── */
  const loadSampleData = useCallback(() => {
    setResumeText(SAMPLE_RESUME);
    setJobText(SAMPLE_JOB);
    setResult(null);
    setError(null);
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "application/pdf") {
      try {
        const ab = await file.arrayBuffer();
        const bytes = new Uint8Array(ab);
        let t = "";
        for (let i = 0; i < bytes.length; i++) {
          const c = String.fromCharCode(bytes[i]);
          if (/[a-zA-Z0-9\s.,;:!?()\-/@#$%&*+=\[\]{}"'|]/.test(c)) t += c;
        }
        t = t.replace(/\s+/g, " ").trim();
        setResumeText(t.length > 50 ? t.substring(0, 8000) : `[PDF: ${file.name}] — text extracted during analysis`);
      } catch {
        setResumeText(`[PDF: ${file.name}]`);
      }
    } else {
      setResumeText(await file.text());
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!resumeText.trim() || !jobText.trim()) { setError("Provide both resume and job description"); return; }
    setIsLoading(true); setError(null); setResult(null);
    try {
      const r = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeText, jobDescriptionText: jobText }) });
      const d = await r.json();
      if (!d.success) { setError(d.error || "Analysis failed"); return; }
      setResult(d.data);
    } catch (e) { setError(e instanceof Error ? e.message : "Server error"); } finally { setIsLoading(false); }
  }, [resumeText, jobText]);

  const addResumeSlot = useCallback(() => setRankResumes((p) => [...p, { name: "", text: "" }]), []);
  const removeResumeSlot = useCallback((i: number) => setRankResumes((p) => p.filter((_, x) => x !== i)), []);
  const updateResumeSlot = useCallback((i: number, f: "name" | "text", v: string) => setRankResumes((p) => p.map((r, x) => (x === i ? { ...r, [f]: v } : r))), []);

  const handleRanking = useCallback(async () => {
    if (!rankJobText.trim()) { setRankError("Provide a job description"); return; }
    const valid = rankResumes.filter((r) => r.text.trim());
    if (!valid.length) { setRankError("Provide at least one resume"); return; }
    setIsRanking(true); setRankError(null); setRankResults(null);
    try {
      const r = await fetch("/api/rank", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumes: valid.map((r) => ({ name: r.name || "Unnamed", text: r.text })), jobDescription: rankJobText }) });
      const d = await r.json();
      if (!d.success) { setRankError(d.error || "Ranking failed"); return; }
      setRankResults(d.data.rankings);
    } catch (e) { setRankError(e instanceof Error ? e.message : "Server error"); } finally { setIsRanking(false); }
  }, [rankResumes, rankJobText]);

  const loadRankSamples = useCallback(() => {
    setRankResumes([
      { name: "Alice Johnson", text: "Alice Johnson — Full Stack Developer\n\nSummary: 7 years in React, Node.js, TypeScript, AWS.\n\nExperience: Senior Dev at WebCo (2020-2024) — React/TS apps, Node.js APIs, AWS + Docker. Dev at CodeShop (2017-2020) — Python/Django, PostgreSQL.\n\nEducation: B.S. Computer Science\n\nSkills: JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, MongoDB, GraphQL, REST API, Git, CI/CD, Jest, Redux, Next.js" },
      { name: "Bob Williams", text: "Bob Williams — Backend Engineer\n\nSummary: Backend engineer — Python, Java, cloud.\n\nExperience: Backend Eng at DataCorp (2019-2024) — Java Spring Boot + Python FastAPI microservices. Kubernetes, CI/CD.\n\nEducation: M.S. Computer Engineering\n\nSkills: Python, Java, Spring Boot, FastAPI, Docker, Kubernetes, AWS, MySQL, Redis, Kafka, CI/CD, Microservices, REST API, Git, Linux" },
      { name: "Carol Davis", text: "Carol Davis — Frontend Developer\n\nSummary: 4 years React & modern JS.\n\nExperience: Frontend Dev at DesignStudio (2021-2024) — React + Tailwind CSS. Junior at StartupHub (2020-2021) — Vue.js.\n\nEducation: B.A. Digital Media\n\nSkills: JavaScript, React, Vue.js, HTML, CSS, Tailwind CSS, Svelte, Figma, Git, Responsive Design" },
    ]);
    setRankJobText("Senior Full-Stack Developer\n\nRequirements:\n- 5+ years experience\n- JavaScript, TypeScript, React\n- Node.js backend\n- AWS / cloud\n- PostgreSQL / MongoDB\n- Docker, CI/CD\n- REST API, GraphQL\n- Git, Jest");
  }, []);

  /* ── sub-components ────────────────────────────────────────────────────── */

  const scoreColor = (v: number) => (v >= 0.7 ? "#22c55e" : v >= 0.5 ? "#f59e0b" : v >= 0.3 ? "#f97316" : "#ef4444");
  const scoreTwBg = (v: number) => (v >= 70 ? "bg-emerald-500" : v >= 50 ? "bg-amber-500" : v >= 30 ? "bg-orange-500" : "bg-red-500");
  const scoreTwText = (v: number) => (v >= 70 ? "text-emerald-600 dark:text-emerald-400" : v >= 50 ? "text-amber-600 dark:text-amber-400" : v >= 30 ? "text-orange-600 dark:text-orange-400" : "text-red-600 dark:text-red-400");

  function ScoreRing({ score }: { score: number }) {
    const size = 164;
    const sw = 10;
    const r = (size - sw) / 2;
    const C = 2 * Math.PI * r;
    const pct = Math.round(score * 100);
    const col = scoreColor(score);
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={sw} className="stroke-slate-100 dark:stroke-slate-700/60" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C - score * C }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className="text-[42px] font-extrabold tracking-tight text-slate-900 dark:text-white" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.4, type: "spring" }}>
            {pct}
          </motion.span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Score</span>
        </div>
      </div>
    );
  }

  function MetricBar({ label, score, icon: Icon }: { label: string; score: number; icon: LucideIcon }) {
    const pct = Math.round(score * 100);
    return (
      <div className="group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-600 dark:text-slate-300">
            <Icon size={14} className="text-slate-400 group-hover:text-[#6366F1] transition-colors" />
            {label}
          </div>
          <span className={`text-[13px] font-bold tabular-nums ${scoreTwText(pct)}`}>{pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700/50 overflow-hidden">
          <motion.div className={`h-full rounded-full ${scoreTwBg(pct)}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }} />
        </div>
      </div>
    );
  }

  function Tag({ skill, variant }: { skill: string; variant: "matched" | "missing" | "additional" }) {
    const s = { matched: "bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20", missing: "bg-red-50 text-red-700 border-red-200/70 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20", additional: "bg-[#6366F1]/[0.06] text-[#6366F1] border-[#6366F1]/20 dark:bg-[#6366F1]/10 dark:text-indigo-300 dark:border-[#6366F1]/20" }[variant];
    const Ico = variant === "matched" ? Check : variant === "missing" ? X : Plus;
    return (
      <motion.span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border transition-transform hover:scale-105 ${s}`} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
        <Ico size={10} strokeWidth={3} /> {skill}
      </motion.span>
    );
  }

  /* ── render ────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#6366F1]/20">
              <FileSearch size={18} className="text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">ResumeMatch</h1>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 leading-none">NLP Matching Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[10px] font-bold text-[#22C55E]">Active</span>
            </div>
            <motion.button onClick={() => setDarkMode(!darkMode)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><Sun size={16} /></motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><Moon size={16} /></motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-5 lg:px-8 pt-10 pb-20">

        {/* Tab bar */}
        <div className="flex gap-2 mb-10">
          {(["analyze", "rank"] as const).map((tab) => (
            <motion.button key={tab} onClick={() => setActiveTab(tab)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? "bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              {tab === "analyze" ? <><Activity size={15} /> Analysis</> : <><Trophy size={15} /> Ranking</>}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ═══════════ ANALYZE TAB ═══════════ */}
          {activeTab === "analyze" && (
            <motion.div key="analyze-tab" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="space-y-10">

              {/* Hero */}
              <div className="hero-glow rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#7c3aed] p-8 lg:p-10">
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Resume–Job Matcher</h2>
                    <p className="text-indigo-200 text-sm mt-2.5 leading-relaxed">
                      Contextual embeddings &amp; transformer-based NLP analysis. Get instant matching scores, skill-gap insights, and actionable recommendations.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-6">
                      <motion.button onClick={loadSampleData} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="px-4 py-2 text-xs font-bold rounded-lg bg-white/15 text-white border border-white/20 hover:bg-white/25 transition-colors">
                        Load Sample Data
                      </motion.button>
                      <motion.button onClick={handleAnalyze} disabled={isLoading || !resumeText.trim() || !jobText.trim()} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        className="px-6 py-2.5 text-xs font-bold rounded-lg bg-white text-[#6366F1] shadow-lg shadow-black/10 hover:bg-indigo-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <span className="flex items-center gap-2"><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Zap size={14} /></motion.span>Analyzing…</span> : <span className="flex items-center gap-2"><Sparkles size={14} /> Run Analysis</span>}
                      </motion.button>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center divide-x divide-white/20">
                    {([["150+", "Skills"], ["5", "Signals"], ["TF-IDF", "Embeddings"]] as const).map(([v, l]) => (
                      <div key={l} className="text-center px-5 first:pl-0">
                        <div className="text-2xl font-extrabold text-white">{v}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mt-0.5">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resume */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 dark:border-slate-700/40">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"><FileText size={16} className="text-[#6366F1]" /> Resume</div>
                    <div className="flex items-center gap-2">
                      <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" />
                      <motion.button onClick={() => fileInputRef.current?.click()} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/40 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <Upload size={12} /> Upload
                      </motion.button>
                    </div>
                  </div>
                  <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume content here, or upload a PDF / TXT…"
                    className="w-full h-72 p-5 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
                </div>
                {/* JD */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-6 py-3.5 border-b border-slate-100 dark:border-slate-700/40 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <Briefcase size={16} className="text-[#6366F1]" /> Job Description
                  </div>
                  <textarea value={jobText} onChange={(e) => setJobText(e.target.value)} placeholder="Paste the target job description here…"
                    className="w-full h-72 p-5 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="flex lg:hidden justify-center">
                <motion.button onClick={handleAnalyze} disabled={isLoading || !resumeText.trim() || !jobText.trim()} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="w-full max-w-md px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-xl shadow-lg shadow-[#6366F1]/25 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? <span className="flex items-center justify-center gap-2"><Zap size={14} className="animate-spin" />Analyzing…</span> : <span className="flex items-center justify-center gap-2"><Sparkles size={14} /> Run Analysis</span>}
                </motion.button>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-700 dark:text-red-300">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── RESULTS ──────────────────────────────────────────────── */}
              <AnimatePresence>
                {result && (
                  <motion.div variants={staggerBox} initial="hidden" animate="visible" className="space-y-10">

                    {/* Top row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Overall score */}
                      <motion.div variants={staggerChild} className="md:col-span-3 glass-card rounded-2xl p-8 flex flex-col items-center justify-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">Overall Match</p>
                        <ScoreRing score={result.scores.overall} />
                        <div className={`mt-5 px-3 py-1 rounded-full text-xs font-bold ${result.scores.overall >= 0.7 ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : result.scores.overall >= 0.5 ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300" : result.scores.overall >= 0.3 ? "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300" : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300"}`}>
                          {result.explanation.scoreLabel}
                        </div>
                      </motion.div>

                      {/* Breakdown */}
                      <motion.div variants={staggerChild} className="md:col-span-5 glass-card rounded-2xl p-6">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-5">Score Breakdown</h3>
                        <div className="space-y-5">
                          <MetricBar label="Skill Match" score={result.scores.skillMatch} icon={Layers} />
                          <MetricBar label="Semantic Similarity" score={result.scores.semantic} icon={Search} />
                          <MetricBar label="Experience Alignment" score={result.scores.experience} icon={Briefcase} />
                          <MetricBar label="Education Alignment" score={result.scores.education} icon={GraduationCap} />
                          <MetricBar label="Summary Match" score={result.scores.summary} icon={FileText} />
                        </div>
                      </motion.div>

                      {/* Insights */}
                      <motion.div variants={staggerChild} className="md:col-span-4 rounded-2xl p-6 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-[#6366F1]/15">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200 mb-5">Key Insights</h3>
                        <ul className="space-y-3">
                          {result.explanation.keyInsights.map((ins, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-indigo-100">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />{ins}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Section scores */}
                    <motion.div variants={staggerChild} className="glass-card rounded-2xl p-6">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-5">Section-wise Similarity</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(result.scores.sections).map(([sec, sc]) => {
                          const p = Math.round(sc * 100);
                          const c = p >= 70 ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" : p >= 50 ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20" : p >= 30 ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20";
                          return (
                            <div key={sec} className={`text-center p-4 rounded-xl border ${c}`}>
                              <div className="text-2xl font-extrabold">{p}%</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">{sec}</div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Skills */}
                    <motion.div variants={staggerChild} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {([["Matched", result.skills.matched, "matched"], ["Missing", result.skills.missing, "missing"], ["Additional", result.skills.additional, "additional"]] as const).map(([title, skills, variant]) => {
                        const col = variant === "matched" ? "text-emerald-600 dark:text-emerald-400" : variant === "missing" ? "text-red-500 dark:text-red-400" : "text-[#6366F1]";
                        const bg = variant === "matched" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : variant === "missing" ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300" : "bg-[#6366F1]/[0.06] dark:bg-[#6366F1]/10 text-[#6366F1] dark:text-indigo-300";
                        return (
                          <div key={title} className="glass-card rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] ${col}`}>{title} Skills</h3>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${bg}`}>{skills.length}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {skills.length > 0 ? (title === "Additional" ? skills.slice(0, 15) : skills).map((s) => <Tag key={s} skill={s} variant={variant} />) : (
                                <p className="text-xs italic text-slate-300 dark:text-slate-600">{title === "Missing" ? "All requirements covered!" : "None identified"}</p>
                              )}
                              {title === "Additional" && skills.length > 15 && <span className="text-[11px] text-slate-400 px-2 py-1">+{skills.length - 15} more</span>}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>

                    {/* Strengths / Weaknesses / Suggestions */}
                    <motion.div variants={staggerChild} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {([
                        { title: "Strengths", items: result.explanation.strengths, icon: Shield, bg: "bg-emerald-500/[0.06] dark:bg-emerald-500/[0.08]", border: "border-emerald-500/15 dark:border-emerald-500/10", titleColor: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-400" },
                        { title: "Weaknesses", items: result.explanation.weaknesses, icon: AlertTriangle, bg: "bg-red-500/[0.06] dark:bg-red-500/[0.08]", border: "border-red-500/15 dark:border-red-500/10", titleColor: "text-red-700 dark:text-red-300", dot: "bg-red-400" },
                        { title: "Suggestions", items: result.explanation.suggestions, icon: Lightbulb, bg: "bg-blue-500/[0.06] dark:bg-blue-500/[0.08]", border: "border-blue-500/15 dark:border-blue-500/10", titleColor: "text-blue-700 dark:text-blue-300", dot: "bg-blue-400" },
                      ]).map(({ title, items, icon: Ic, bg, border, titleColor, dot }) => (
                        <div key={title} className={`rounded-2xl border backdrop-blur-xl p-6 ${bg} ${border}`}>
                          <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] ${titleColor} mb-4 flex items-center gap-2`}><Ic size={13} /> {title}</h3>
                          <ul className="space-y-2.5">
                            {items.map((t, i) => (
                              <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                                <span className={`mt-2 w-1 h-1 rounded-full shrink-0 ${dot}`} />{t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ═══════════ RANK TAB ═══════════ */}
          {activeTab === "rank" && (
            <motion.div key="rank-tab" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="space-y-10">

              {/* Hero */}
              <div className="hero-glow rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-8 lg:p-10">
                <div className="relative z-10">
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Resume Ranking</h2>
                  <p className="text-slate-400 text-sm mt-2 max-w-lg">Compare multiple candidates side-by-side and let the engine rank them by overall relevance.</p>
                </div>
              </div>

              {/* JD Input */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-3.5 border-b border-slate-100 dark:border-slate-700/40 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <Briefcase size={16} className="text-[#6366F1]" /> Target Job Description
                </div>
                <textarea value={rankJobText} onChange={(e) => setRankJobText(e.target.value)} placeholder="Paste the job description all resumes will be ranked against…"
                  className="w-full h-44 p-5 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
              </div>

              {/* Resume slots */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Candidates <span className="ml-1 text-xs font-semibold text-slate-400">({rankResumes.length})</span></h3>
                  <div className="flex gap-2">
                    <motion.button onClick={loadRankSamples} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-[#6366F1]/[0.08] dark:bg-[#6366F1]/10 text-[#6366F1] dark:text-indigo-300 border border-[#6366F1]/15 hover:bg-[#6366F1]/[0.14] transition-colors">
                      Load Samples
                    </motion.button>
                    <motion.button onClick={addResumeSlot} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <PlusCircle size={12} /> Add
                    </motion.button>
                  </div>
                </div>
                {rankResumes.map((res, idx) => (
                  <div key={idx} className="glass-card rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 dark:border-slate-700/40 bg-slate-50/40 dark:bg-slate-800/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold shadow-sm">{idx + 1}</div>
                        <input type="text" value={res.name} onChange={(e) => updateResumeSlot(idx, "name", e.target.value)} placeholder="Candidate name"
                          className="text-sm font-semibold text-slate-800 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-[#6366F1] focus:outline-none transition-colors py-0.5" />
                      </div>
                      {rankResumes.length > 1 && (
                        <motion.button onClick={() => removeResumeSlot(idx)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </motion.button>
                      )}
                    </div>
                    <textarea value={res.text} onChange={(e) => updateResumeSlot(idx, "text", e.target.value)} placeholder="Paste this candidate's resume…"
                      className="w-full h-28 p-5 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
                  </div>
                ))}
              </div>

              {/* Rank CTA */}
              <div className="flex justify-center">
                <motion.button onClick={handleRanking} disabled={isRanking || !rankJobText.trim()} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="px-10 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-xl shadow-lg shadow-[#6366F1]/25 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isRanking ? <span className="flex items-center gap-2"><Zap size={14} className="animate-spin" />Ranking…</span> : <span className="flex items-center gap-2"><Trophy size={14} /> Rank Candidates</span>}
                </motion.button>
              </div>

              {/* Rank Error */}
              <AnimatePresence>
                {rankError && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-700 dark:text-red-300">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" /> {rankError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rank Results */}
              <AnimatePresence>
                {rankResults && (
                  <motion.div initial="hidden" animate="visible" variants={staggerBox} className="space-y-5">
                    <div className="flex items-center gap-4">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Results</h3>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    </div>
                    {rankResults.map((item, idx) => {
                      const pct = Math.round(item.overallScore * 100);
                      const medal = idx === 0 ? "from-amber-400 to-amber-500 shadow-amber-300/30" : idx === 1 ? "from-slate-300 to-slate-400 shadow-slate-300/20" : idx === 2 ? "from-orange-400 to-orange-500 shadow-orange-300/20" : "from-slate-200 to-slate-300 shadow-slate-200/10";
                      const accent = idx === 0 ? "border-amber-300/60 dark:border-amber-500/20" : idx === 1 ? "border-slate-300/60 dark:border-slate-600/30" : idx === 2 ? "border-orange-300/60 dark:border-orange-500/20" : "border-slate-200/80 dark:border-slate-700/30";
                      return (
                        <motion.div key={idx} variants={staggerChild} className={`glass-card rounded-2xl overflow-hidden border-2 ${accent}`}>
                          <div className="flex items-center justify-between px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${medal} flex items-center justify-center text-white text-sm font-extrabold shadow-md`}>#{idx + 1}</div>
                              <div>
                                <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.name}</h4>
                                <p className={`text-xs font-bold mt-0.5 ${scoreTwText(pct)}`}>{item.scoreLabel}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{pct}%</div>
                              <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{item.matchedSkillsCount} matched / {item.missingSkillsCount} missing</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 border-t border-slate-100 dark:border-slate-700/30 divide-x divide-slate-100 dark:divide-slate-700/30">
                            {([["Skills", item.scores.skillMatch], ["Semantic", item.scores.semantic], ["Experience", item.scores.experience], ["Education", item.scores.education]] as const).map(([l, v]) => {
                              const p = Math.round(v * 100);
                              return <div key={l} className="px-4 py-3 text-center"><div className={`text-sm font-extrabold ${scoreTwText(p)}`}>{p}%</div><div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{l}</div></div>;
                            })}
                          </div>
                          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/30 space-y-3">
                            {item.skills.matched.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {item.skills.matched.slice(0, 8).map((s) => <Tag key={s} skill={s} variant="matched" />)}
                                {item.skills.missing.slice(0, 4).map((s) => <Tag key={s} skill={s} variant="missing" />)}
                              </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {item.strengths.length > 0 && <div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 mb-1.5">Top Strengths</p>{item.strengths.slice(0, 2).map((s, i) => <p key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed"><Check size={11} className="text-emerald-500 mt-0.5 shrink-0" />{s}</p>)}</div>}
                              {item.weaknesses.length > 0 && <div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-500 dark:text-red-400 mb-1.5">Gaps</p>{item.weaknesses.slice(0, 2).map((w, i) => <p key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed"><X size={11} className="text-red-400 mt-0.5 shrink-0" />{w}</p>)}</div>}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ARCHITECTURE ──────────────────────────────────────────────── */}
        <div className="mt-24">
          <div className="text-center mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6366F1] mb-2">System Architecture</p>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">How It Works</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-lg mx-auto">End-to-end NLP pipeline combining skill taxonomy, contextual embeddings, and weighted multi-signal scoring.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {([
              { step: "01", title: "Text Processing", desc: "PDF extraction, cleaning, tokenization, intelligent resume segmentation", icon: FileText },
              { step: "02", title: "Skill Extraction", desc: "150+ structured taxonomy with aliases, normalization, category matching", icon: Layers },
              { step: "03", title: "Embeddings", desc: "TF-IDF vectorization with semantic enrichment and cosine similarity", icon: BarChart3 },
              { step: "04", title: "Scoring Engine", desc: "Weighted multi-signal: skills, semantics, experience, education", icon: Gauge },
              { step: "05", title: "Explainability", desc: "Strengths, weaknesses, and actionable improvement suggestions", icon: Lightbulb },
              { step: "06", title: "REST API", desc: "POST /api/analyze and POST /api/rank for batch comparison", icon: Server },
              { step: "07", title: "Database", desc: "PostgreSQL via Drizzle ORM for resumes, jobs, and analysis history", icon: Database },
              { step: "08", title: "Performance", desc: "Cached lookups, singleton patterns, optimized text processing", icon: Zap },
            ] as const).map(({ step, title, desc, icon: Ic }) => (
              <motion.div key={step} whileHover={{ y: -3, transition: { duration: 0.2 } }} className="group glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#6366F1]/[0.08] dark:bg-[#6366F1]/10 border border-[#6366F1]/10 flex items-center justify-center text-[#6366F1] dark:text-indigo-300 transition-colors group-hover:bg-[#6366F1] group-hover:text-white group-hover:border-[#6366F1]">
                    <Ic size={16} />
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-200 dark:text-slate-600">{step}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Pipeline flow */}
          <div className="mt-8 relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-[#1e1b4b] dark:from-slate-950 dark:via-slate-950 dark:to-[#0f0a2e] py-10 lg:py-12 border border-slate-700/40 dark:border-slate-700/30">
            {/* background glow orbs */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#6366F1]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-[#8B5CF6]/10 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />

            <div className="relative z-10 px-8 lg:px-12">
              {/* 6-column grid: each col is icon-box + arrow segment */}
              <div className="grid grid-cols-[repeat(6,1fr)] min-w-[720px] mx-auto">
                {([["Input", "Resume + JD", FileSearch], ["Extract", "Text & Skills", Layers], ["Embed", "TF-IDF Vectors", BarChart3], ["Compare", "Cosine Sim", Search], ["Score", "Weighted", Gauge], ["Explain", "Insights", Lightbulb]] as const).map(([label, sub, Ic], i) => (
                  <div key={label} className="relative flex flex-col items-center">

                    {/* ── Horizontal track bar (behind icons) ── */}
                    <div className="relative w-full flex items-center">
                      {/* The icon box — centered in column */}
                      <div className="mx-auto relative">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.08, y: -4 }}
                          className="flex flex-col items-center cursor-default group"
                        >
                          {/* Icon container — fixed size */}
                          <div className="relative w-[72px] h-[72px]">
                            {/* glow ring */}
                            <div className="absolute inset-[-5px] rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-300" />
                            {/* icon bg */}
                            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-[#6366F1]/25 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-[#6366F1]/40">
                              <Ic size={28} strokeWidth={1.8} />
                            </div>
                            {/* step number badge */}
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#22C55E] text-[10px] font-extrabold text-white flex items-center justify-center shadow-md shadow-[#22C55E]/40 ring-[2.5px] ring-slate-900">
                              {i + 1}
                            </div>
                          </div>
                          {/* label + sub */}
                          <span className="text-sm font-bold text-white mt-4 tracking-tight leading-none">{label}</span>
                          <span className="text-[11px] font-medium text-slate-400 mt-1.5 leading-none">{sub}</span>
                        </motion.div>
                      </div>
                    </div>

                    {/* ── Connector arrow to next step (absolute, pinned to icon center) ── */}
                    {i < 5 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                        className="absolute top-9 right-0 translate-x-1/2 flex items-center z-20"
                        style={{ transform: "translateX(50%)" }}
                      >
                        {/* line segment */}
                        <div className="w-6 lg:w-10 h-[2px] bg-gradient-to-r from-[#6366F1]/70 to-[#8B5CF6]/70" />
                        {/* animated chevron */}
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay: i * 0.25 }}
                          className="ml-[1px]"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#8B5CF6]">
                            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center"><FileSearch size={14} className="text-white" /></div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">ResumeMatch</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Automated Resume–Job Description Matching</p>
              </div>
            </div>
            <div className="flex items-center gap-5 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              <span>Next.js</span><span>PostgreSQL</span><span>Drizzle ORM</span><span>TF-IDF + Cosine Similarity</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-600">Contextual Embeddings and Transformer-Based NLP Analysis</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
