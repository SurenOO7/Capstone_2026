# Phased Plan — Capstone Project

**Title:** «Թեմատիկ վեբ կայքի ստեղծում առաջատար վեբ ծրագրավորմամբ»
**Selected theme:** Personal goal tracking / անձնական նպատակների հետևում
**Approach:** Parallel — paper chapters 1-2 first, then build app, then chapters 3-5

---

## Tech Stack (Final)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Docker container) |
| ORM | Prisma (schema, migrations, typed queries) |
| Auth | Auth.js v5 (Google/GitHub OAuth + credentials) |
| UI | Tailwind CSS + shadcn/ui |
| Charts | Recharts (for analytics/progress visualization) |
| Containerization | Docker + Docker Compose |
| LaTeX | XeLaTeX + Sylfaen font |
| Deployment | Any server with Docker (VPS, cloud, self-hosted) |

---

## Phase 1: Project Setup & Paper Foundation (Week 1)

### 1.1 Repository Setup
- [x] Initialize Next.js project with TypeScript in `app/`
- [x] Set up Tailwind CSS + shadcn/ui
- [x] Create `docker-compose.yml` with PostgreSQL service
- [x] Create `Dockerfile` for Next.js app
- [x] Initialize Prisma with PostgreSQL connection
- [x] Configure `.env` with database URL and secrets
- [x] Create LaTeX project structure in `paper/`
- [x] Configure XeLaTeX with Sylfaen font, margins, spacing
- [x] Create `main.tex` with all chapter includes
- [x] Verify LaTeX compiles to PDF correctly

### 1.2 Paper: Chapter 1 — Introduction (Ներածություն — 2-3 pages)
- [x] Topic relevance: why a thematic personal goal tracking website matters (productivity research, digital wellness, advanced web programming relevance)
- [x] Problem statement: lack of user-friendly, comprehensive thematic web solutions for personal goal tracking
- [x] Research purpose: to create a thematic website using advanced web programming, with personal goal management as the selected domain
- [x] 3-5 measurable objectives (using verbs: evaluate, compare, develop, assess)
- [x] Work structure overview

### Deliverables
- [x] Working LaTeX setup producing valid PDF
- [x] Next.js project skeleton running locally
- [x] Introduction chapter draft (Armenian)

---

## Phase 2: Literature Analysis (Week 2-3)

### 2.1 Paper: Chapter 2 — Literature Analysis (Գրականության վերլուծություն — 15-17 pages)

Research areas to cover:
- [x] Goal-setting theories (SMART goals, Locke & Latham's Goal Setting Theory, OKRs)
- [x] Existing goal tracking applications analysis (Todoist, Habitica, Strides, Goals on Track, etc.)
- [x] Web application development methodologies (Agile, iterative design)
- [x] Modern web technologies review (Next.js, React, SPA vs SSR)
- [x] UX/UI design principles for productivity applications
- [x] Database design patterns for task/goal management systems
- [x] User engagement and motivation in digital tools (gamification, streaks, notifications)
- [x] Mobile-responsive design and accessibility standards

Source requirements:
- [x] Minimum 10 scientific sources
- [x] At least 3 recent scientific articles (2022-2026)
- [x] Include Armenian and international sources
- [x] All citations in APA format

### Deliverables
- [x] Complete literature review chapter (15-17 pages, Armenian)
- [x] `references.bib` with all sources in BibTeX format

---

## Phase 3: App Design & Architecture (Week 3-4)

### 3.1 Database Design (Prisma Schema + PostgreSQL)
- [x] User model (Auth.js managed, profile fields)
- [x] Goal model (title, description, category, priority, deadline, status, progress, userId FK)
- [x] Milestone model (sub-goals linked to parent Goal via FK)
- [x] Category model (name, color, icon, userId FK)
- [x] ProgressLog model (goalId FK, value, note, date)
- [x] Define relations, indexes, and constraints in Prisma schema
- [x] Prisma client generated
- [x] Create initial migration with `prisma migrate dev`
- [x] Design ER diagram for the paper

### 3.2 UI/UX Design
- [x] Wireframes for key pages (dashboard, goal detail, create goal, analytics)
- [x] Color scheme and design system setup with shadcn/ui
- [x] Responsive layout planning (mobile-first)
- [x] User flow diagrams

### 3.3 App Architecture
- [x] Next.js App Router page structure
- [x] Prisma client setup and database connection (app/src/lib/db.ts)
- [x] Auth.js v5 configuration (Google + GitHub + credentials)
- [x] API route design
- [x] State management approach

### Deliverables
- [x] Database schema (Prisma models + ER diagram)
- [x] Wireframes / UI mockups
- [x] Architecture diagram
- [x] All design artifacts saved for paper appendices

---

## Phase 4: Core App Development (Week 4-6)

### 4.1 Authentication
- [ ] Auth.js v5 setup with Prisma adapter for PostgreSQL
- [ ] Login/Register pages
- [ ] Protected routes middleware
- [ ] User profile page

### 4.2 Goal Management (CRUD)
- [ ] Create goal form (title, description, category, priority, deadline, target value)
- [ ] Goal list/grid view with filtering and sorting
- [ ] Goal detail page with progress tracking
- [ ] Edit and delete goals
- [ ] Sub-goals / milestones

### 4.3 Dashboard
- [ ] Overview statistics (total goals, completed, in progress, overdue)
- [ ] Progress charts (Recharts — pie chart, bar chart, line chart)
- [ ] Recent activity feed
- [ ] Upcoming deadlines widget

### 4.4 Categories & Organization
- [ ] Category management (create, edit, delete, color-code)
- [ ] Filter goals by category, status, priority
- [ ] Search functionality

### 4.5 Progress Tracking
- [ ] Progress update mechanism (percentage, check-in, numeric target)
- [ ] Progress history log
- [ ] Streak tracking (consecutive days of progress)
- [ ] Visual progress indicators (progress bars, rings)

### Deliverables
- Fully functional thematic goal tracking website
- All core features working end-to-end
- Screenshots captured for paper

---

## Phase 5: Advanced Features & Polish (Week 6-7)

### 5.1 Analytics Page
- [ ] Goal completion rate over time
- [ ] Category-wise performance breakdown
- [ ] Streak statistics
- [ ] Monthly/weekly/yearly views

### 5.2 UI Polish
- [ ] Dark/light mode toggle
- [ ] Animations and transitions
- [ ] Empty states and loading skeletons
- [ ] Error handling and toast notifications
- [ ] Mobile responsiveness testing

### 5.3 Additional Features
- [ ] Goal templates (predefined goal structures)
- [ ] Export data (PDF/CSV)
- [ ] Notification reminders (deadline approaching)

### Deliverables
- Polished, production-ready application
- All edge cases handled
- Final screenshots and screen recordings for paper

---

## Phase 6: Paper — Methods Chapter (Week 7-8)

### 6.1 Paper: Chapter 3 — Research Implementation Methods (Հետազոտության իրականացման մեթոդները — 1-2 pages)
- [ ] Development methodology description (Agile/iterative)
- [ ] Technology stack justification (why Next.js, PostgreSQL, Prisma, Auth.js, Docker)
- [ ] Data collection methods:
  - Comparative analysis of existing tools (qualitative)
  - User survey/questionnaire (quantitative) — if applicable
  - Literature analysis (qualitative)
- [ ] Tools and instruments used
- [ ] Include questionnaire/survey in appendices (if used)

### Deliverables
- Methods chapter draft (Armenian)
- Research instruments in appendices

---

## Phase 7: Paper — Results & Discussion (Week 8-9)

### 7.1 Paper: Chapter 4 — Results, Analysis & Discussion (Արդյունքներ, վերլուծություն և քննարկում — 15-20 pages)
- [ ] Application architecture overview with diagrams
- [ ] Database design description with ER diagram
- [ ] Key feature implementation details with screenshots
- [ ] Comparative analysis: our app vs existing solutions (feature matrix table)
- [ ] Technical decisions and trade-offs analysis
- [ ] Performance evaluation (load time, responsiveness)
- [ ] User interface walkthrough with annotated screenshots
- [ ] Usability assessment
- [ ] Discussion of results against stated objectives

### Deliverables
- Results chapter draft (Armenian)
- All figures, tables, and diagrams embedded
- Screenshots with Armenian captions

---

## Phase 8: Paper — Conclusions & Final Assembly (Week 9-10)

### 8.1 Paper: Chapter 5 — Conclusions & Recommendations (Եզրակացություններ և առաջարկություններ — 2-3 pages)
- [ ] Summary of findings linked to each objective from Introduction
- [ ] At least 2 evidence-based recommendations
- [ ] Limitations of the research
- [ ] Future development directions
- [ ] Maintain Problem→Method→Conclusion→Recommendation chain

### 8.2 Paper Assembly
- [ ] Title page (ԵՄՀ format)
- [ ] Table of contents (auto-generated from LaTeX)
- [ ] Verify all cross-references and citations
- [ ] Verify page counts per section
- [ ] Complete bibliography check (APA format, min 10 sources)
- [ ] Number and organize all appendices
- [ ] Final formatting check (Sylfaen, margins, spacing, page numbers)
- [ ] Proofread Armenian text

### 8.3 Defense Preparation
- [ ] Create presentation (15 minutes max)
- [ ] Prepare for Q&A (anticipate committee questions)
- [ ] Practice presentation

### Deliverables
- Complete thesis PDF (30-35 pages)
- Defense presentation
- Final deployed application

---

## Appendices Plan

The following should be included as appendices:

1. Application screenshots (all major pages)
2. Database schema / ER diagram
3. Architecture diagram
4. User flow diagrams
5. Survey/questionnaire (if user testing is done)
6. Source code excerpts (key algorithms/logic)
7. Comparative analysis table (feature matrix)

---

## Timeline Summary

| Phase | Duration | Output |
|-------|----------|--------|
| 1. Setup & Introduction | Week 1 | Project skeleton + Introduction draft |
| 2. Literature Analysis | Week 2-3 | Literature analysis (15-17 pages) |
| 3. App Design | Week 3-4 | Wireframes, DB schema, architecture |
| 4. Core Development | Week 4-6 | Working application |
| 5. Polish & Advanced | Week 6-7 | Production-ready app |
| 6. Methods Chapter | Week 7-8 | Methods draft (1-2 pages) |
| 7. Results Chapter | Week 8-9 | Results draft (15-20 pages) |
| 8. Conclusions & Assembly | Week 9-10 | Complete thesis + presentation |

**Total estimated time: 10 weeks**
