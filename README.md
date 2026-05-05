<div align="center">

# 🎯 ContextMatch AI

### Automated Resume–Job Description Matching System Using Contextual Embeddings and Transformers

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📸 Overview

**ContextMatch AI** is a full-stack NLP application that intelligently scores how well a resume matches a job description. It uses a multi-signal scoring engine powered by TF-IDF contextual embeddings, a structured skill taxonomy of 150+ skills, and cosine similarity — producing an explainable match score with actionable recommendations.

<p align="center">
  <img src="https://img.shields.io/badge/Single_Analysis-One_to_One-6366F1?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Ranking-One_to_Many-8B5CF6?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PDF_Support-Upload_&_Parse-22C55E?style=for-the-badge" />
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| **Text Processing Pipeline** | PDF extraction, text cleaning, tokenization, and intelligent resume section segmentation |
| **Skill Extraction** | 150+ structured skill taxonomy with aliases, category grouping, and word-boundary matching |
| **Contextual Embeddings** | TF-IDF vectorization with semantic enrichment via taxonomy relationships and cosine similarity |
| **Multi-Signal Scoring** | Weighted engine combining skill match, semantic similarity, experience, education, and summary alignment |
| **Explainability Layer** | Human-readable strengths, weaknesses, and actionable improvement suggestions |
| **Resume Ranking** | Rank multiple candidates against a single job description side-by-side |
| **PDF Upload** | Upload and parse PDF resumes directly through the UI or API |
| **Dark Mode** | Full dark/light theme with system preference detection and persistent toggle |
| **REST API** | Clean JSON endpoints for single analysis, batch ranking, and health checks |
| **Database Persistence** | PostgreSQL storage via Drizzle ORM for resumes, job descriptions, and analysis results |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Frontend (React)                               │
│  Next.js App Router · Tailwind CSS · Framer Motion · Lucide Icons      │
└──────────────┬──────────────────────────────────────────┬───────────────┘
               │  POST /api/analyze                       │  POST /api/rank
               ▼                                          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           REST API Layer                                 │
│                 Next.js Route Handlers (App Router)                      │
└──────────────┬───────────────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        Analysis Orchestrator                             │
│                         src/lib/analyzer.ts                              │
└──┬──────────┬──────────────┬──────────────┬──────────────┬──────────────┘
   │          │              │              │              │
   ▼          ▼              ▼              ▼              ▼
┌──────┐ ┌──────────┐ ┌───────────┐ ┌────────────┐ ┌──────────┐
│ Text │ │  Skill   │ │ Embedding │ │  Scoring   │ │ Explain  │
│ Proc │ │ Extract  │ │   Engine  │ │   Engine   │ │  Layer   │
│      │ │          │ │           │ │            │ │          │
│ PDF  │ │ Taxonomy │ │  TF-IDF + │ │  Weighted  │ │Strengths │
│ Clean│ │ 150+     │ │  Cosine   │ │  5-signal  │ │Weaknesses│
│ Segm │ │ Aliases  │ │  Similar. │ │  Scoring   │ │Suggest.  │
└──────┘ └──────────┘ └───────────┘ └────────────┘ └──────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│              PostgreSQL · Drizzle ORM · Persistent Storage               │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts     # POST — single resume analysis
│   │   ├── rank/route.ts        # POST — batch resume ranking
│   │   └── health/route.ts      # GET  — system health check
│   ├── globals.css              # Design system, dark mode, glassmorphism
│   ├── layout.tsx               # Root HTML layout
│   └── page.tsx                 # Entry point → renders Dashboard
│
├── components/
│   └── Dashboard.tsx            # Full client-side SPA (analysis + ranking)
│
├── db/
│   ├── index.ts                 # PostgreSQL connection (pg + Drizzle)
│   └── schema.ts                # Tables: resumes, job_descriptions, analyses
│
└── lib/
    ├── analyzer.ts              # Main orchestrator — coordinates full pipeline
    ├── embeddings.ts            # TF-IDF vectorization + cosine similarity
    ├── explainer.ts             # Generates strengths, weaknesses, suggestions
    ├── scoring-engine.ts        # Weighted multi-signal scoring + ranking
    ├── skill-extractor.ts       # Skill extraction + comparison logic
    ├── skill-taxonomy.ts        # 150+ skills across 10 categories with aliases
    └── text-processor.ts        # PDF extraction, cleaning, tokenization, segmentation
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Install |
|---|---|---|
| **Node.js** | ≥ 18 | [nodejs.org](https://nodejs.org) |
| **PostgreSQL** | ≥ 14 | [postgresql.org](https://www.postgresql.org/download/) or `docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=app_db -p 5432:5432 postgres:16` |
| **npm** | ≥ 9 | Comes with Node.js |

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/resume-job-matcher.git
cd resume-job-matcher
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
```

> **Docker alternative:** If you don't have PostgreSQL installed locally, spin up a container:
> ```bash
> docker run -d --name postgres \
>   -e POSTGRES_USER=postgres \
>   -e POSTGRES_PASSWORD=postgres \
>   -e POSTGRES_DB=app_db \
>   -p 5432:5432 \
>   postgres:16
> ```

### 4. Initialize the Database

```bash
# Create the database (if not using Docker)
createdb app_db

# Push the schema
npx drizzle-kit push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🖥 Usage

### Web Interface

#### Single Analysis
1. Navigate to the **Analysis** tab
2. Paste a resume and a job description (or click **Load Sample Data**)
3. Click **Run Analysis**
4. View the overall score, skill breakdown, section similarities, strengths, weaknesses, and suggestions

#### Resume Ranking
1. Navigate to the **Ranking** tab
2. Paste a target job description
3. Add multiple candidate resumes (name + text)
4. Click **Rank Candidates**
5. View candidates ranked by overall match score with per-signal breakdown

### Dark Mode
Click the sun/moon icon in the navigation bar to toggle between light and dark themes. The preference is saved to `localStorage` and respects your system's `prefers-color-scheme` on first visit.

---

## 📡 API Reference

### `POST /api/analyze`

Analyze a single resume against a job description.

**Request (JSON):**

```json
{
  "resumeText": "John Smith — Senior Software Engineer\n\nSkills: JavaScript, React, Node.js, AWS, Docker, PostgreSQL",
  "jobDescriptionText": "Senior Full-Stack Developer\n\nRequirements: JavaScript, React, Node.js, AWS, Docker, PostgreSQL, GraphQL, Kubernetes"
}
```

**Request (FormData — PDF upload):**

```
POST /api/analyze
Content-Type: multipart/form-data

resumeFile:     <PDF file>
jobDescription: <job description text>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "scores": {
      "overall": 0.78,
      "semantic": 0.72,
      "skillMatch": 0.86,
      "experience": 0.80,
      "education": 0.90,
      "summary": 0.65,
      "sections": {
        "skills": 0.80,
        "experience": 0.72,
        "education": 0.91,
        "summary": 0.68
      }
    },
    "skills": {
      "matched": ["JavaScript", "React", "Node.js", "AWS", "Docker", "PostgreSQL"],
      "missing": ["GraphQL", "Kubernetes"],
      "additional": [],
      "matchRatio": 0.86
    },
    "explanation": {
      "scoreLabel": "Strong Match",
      "strengths": ["..."],
      "weaknesses": ["..."],
      "suggestions": ["..."],
      "keyInsights": ["..."]
    }
  }
}
```

---

### `POST /api/rank`

Rank multiple resumes against a single job description.

**Request:**

```json
{
  "resumes": [
    { "name": "Alice Johnson", "text": "..." },
    { "name": "Bob Williams", "text": "..." },
    { "name": "Carol Davis", "text": "..." }
  ],
  "jobDescription": "Senior Full-Stack Developer. Requirements: ..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "rankings": [
      {
        "name": "Alice Johnson",
        "overallScore": 0.92,
        "scoreLabel": "Excellent Match",
        "matchedSkillsCount": 15,
        "missingSkillsCount": 0,
        "scores": { "overall": 0.92, "semantic": 0.87, "skillMatch": 1.0, "experience": 0.89, "education": 0.89 },
        "strengths": ["..."],
        "weaknesses": ["..."]
      }
    ]
  }
}
```

---

### `GET /api/health`

System health check.

```json
{
  "status": "healthy",
  "service": "Resume-Job Matching System",
  "version": "1.0.0",
  "capabilities": ["text-analysis", "pdf-extraction", "skill-matching", "semantic-similarity", "resume-ranking", "explainability"]
}
```

---

## 🧠 How the Scoring Works

### Weighted Multi-Signal Formula

```
Overall Score = 0.35 × SkillMatch
              + 0.25 × SemanticSimilarity
              + 0.20 × ExperienceAlignment
              + 0.10 × EducationAlignment
              + 0.10 × SummaryMatch
```

| Signal | Weight | Method |
|---|---|---|
| **Skill Match** | 35% | Ratio of job-required skills found in resume, using 150+ taxonomy with aliases |
| **Semantic Similarity** | 25% | TF-IDF vectors with taxonomy-enriched terms, compared via cosine similarity |
| **Experience Alignment** | 20% | Years-of-experience extraction + semantic similarity of experience sections |
| **Education Alignment** | 10% | Degree/field keyword matching against job education requirements |
| **Summary Match** | 10% | Cosine similarity between resume summary/profile and full job description |

### Score Labels

| Range | Label |
|---|---|
| 85–100% | Excellent Match |
| 70–84% | Strong Match |
| 55–69% | Good Match |
| 40–54% | Partial Match |
| 25–39% | Weak Match |
| 0–24% | Poor Match |

### Skill Taxonomy

The taxonomy covers **10 categories** with **150+ skills** and **aliases**:

- **Programming Languages** — JavaScript, TypeScript, Python, Java, Go, Rust, C++, C#, etc.
- **Frontend Frameworks** — React, Angular, Vue.js, Next.js, Svelte, Tailwind CSS, Redux
- **Backend Frameworks** — Node.js, Express.js, Django, Flask, FastAPI, Spring Boot, GraphQL
- **Databases** — PostgreSQL, MongoDB, Redis, MySQL, Elasticsearch, DynamoDB
- **Cloud & DevOps** — AWS, Azure, GCP, Docker, Kubernetes, Terraform, CI/CD, Git
- **Data Science & ML** — Machine Learning, TensorFlow, PyTorch, NLP, Pandas, Apache Spark
- **Testing** — Jest, Cypress, Selenium, Unit Testing, TDD
- **Mobile Development** — React Native, Flutter, iOS, Android
- **Methodologies** — Agile, DevOps, Microservices, System Design
- **Soft Skills** — Leadership, Communication, Problem Solving, Teamwork

---

## 🗃 Database Schema

Three tables managed by Drizzle ORM:

```
resumes
├── id              SERIAL PRIMARY KEY
├── name            TEXT NOT NULL
├── raw_text        TEXT NOT NULL
├── sections        JSONB (summary, experience, education, skills, projects, certifications)
├── extracted_skills JSONB (string[])
├── file_type       TEXT DEFAULT 'text'
└── created_at      TIMESTAMP DEFAULT NOW()

job_descriptions
├── id              SERIAL PRIMARY KEY
├── title           TEXT NOT NULL
├── raw_text        TEXT NOT NULL
├── extracted_skills JSONB (string[])
└── created_at      TIMESTAMP DEFAULT NOW()

analyses
├── id              SERIAL PRIMARY KEY
├── resume_id       INTEGER → resumes.id
├── job_description_id INTEGER → job_descriptions.id
├── overall_score   TEXT NOT NULL
├── semantic_score  TEXT NOT NULL
├── skill_score     TEXT NOT NULL
├── experience_score TEXT NOT NULL
├── education_score TEXT NOT NULL
├── section_scores  JSONB (Record<string, number>)
├── matched_skills  JSONB (string[])
├── missing_skills  JSONB (string[])
├── additional_skills JSONB (string[])
├── strengths       JSONB (string[])
├── weaknesses      JSONB (string[])
├── suggestions     JSONB (string[])
└── created_at      TIMESTAMP DEFAULT NOW()
```

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| **Primary** | `#6366F1` | Brand, CTAs, active states, links |
| **Secondary** | `#8B5CF6` | Gradients, secondary actions |
| **Accent** | `#22C55E` | Success, "Active" badges, positive signals |
| **Background** | `#F8FAFC` / `#0F172A` | Light / dark body background |
| **Text** | `#0F172A` / `#F1F5F9` | Primary text in light / dark mode |

Cards use **glassmorphism** (`backdrop-blur: 24px` + semi-transparent backgrounds). The UI supports **class-based dark mode** with `localStorage` persistence and `prefers-color-scheme` detection.

---

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start dev server with hot reload (port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
npx drizzle-kit push # Push schema changes to database
```

### Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5.9 |
| **Database** | PostgreSQL via Drizzle ORM |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **PDF Parsing** | pdf-parse |

---

## 📦 Production Deployment

```bash
# Build for production
npm run build

# Start the production server
npm run start
```

The application runs on **port 3000** by default. Set the `PORT` environment variable to change it.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built by me, somehow it works 🤷‍♂️💻*

</div>
