# Capstone Project — Bachelor's Thesis at ԵՄՀ

> This file mirrors CLAUDE.md for Codex compatibility. Keep both files in sync when making changes.

## Project Overview

- **University:** Eurasia International University (Եվրասիա միջազգային համալսարան)
- **Degree:** Bachelor's (բակալավր)
- **Department:** Computer Science / IT
- **Year:** 2026
- **Student:** Suren Arzumanyan (Սուրեն Արզումանյան)
- **Paper Title:** «Անձնական նպատակների հետևման վեբ հավելվածի նախագծում և մշակում»
  - (Design and Development of a Web Application for Personal Goal Tracking)
- **Paper Language:** Armenian
- **Tech Stack:** Next.js full-stack

This repository contains two parts:
1. **`paper/`** — The LaTeX source for the bachelor's thesis (Armenian, XeLaTeX + Sylfaen)
2. **`app/`** — The Next.js web application (goal tracking platform)

---

## Paper Structure (Format 1 — Bachelor's)

The paper MUST follow the university's Format 1 structure exactly, without modification.

| # | Section | Pages | Key Requirements |
|---|---------|-------|------------------|
| 1 | Titlepage | 1 | ԵՄՀ official format |
| 2 | Table of Contents | 1-2 | All chapters and subchapters listed |
| 3 | Ch.1: Introduction (Ներածություն) | 2-3 | Topic relevance, purpose, 3-5 measurable objectives, work structure overview |
| 4 | Ch.2: Literature Analysis (Գրականության վերլուծություն) | 15-17 | Min 10 scientific sources, 3+ must be recent articles |
| 5 | Ch.3: Research Implementation Methods (Հետազոտության իրականացման մեթոդները) | 1-2 | Data collection methods (quantitative/qualitative/mixed), tools in appendices |
| 6 | Ch.4: Results, Analysis & Discussion (Արդյունքներ, վերլուծություն և քննարկում) | 15-20 | Main findings, data interpretation, analysis |
| 7 | Ch.5: Conclusions & Recommendations (Եզրակացություններ և առաջարկություններ) | 2-3 | Linked to Ch.1 objectives, evidence-based recommendations |
| 8 | Bibliography (Օգտագործված գրականության ցանկ) | — | APA format, alphabetical, categorized |
| 9 | Appendices (Հավելվածներ) | — | Numbered, referenced in text |

**Total: 30-35 pages** (excluding appendices and bibliography)

---

## Formatting Requirements

All formatting rules are mandatory and checked during grading (20% of final grade).

| Parameter | Value |
|-----------|-------|
| Paper size | A4 |
| Font | Sylfaen |
| Text size | 12pt |
| Headings | 12pt, **Bold**, UPPERCASE |
| Line spacing | 1.5 |
| Left margin | 3 cm |
| Right margin | 1 cm |
| Top margin | 2.5 cm |
| Bottom margin | 2 cm |
| Page numbers | Bottom-right corner |
| New chapters | Start on a new page |
| Chapter/paragraph titles | No period at the end |
| Footnotes | Bottom of page, separated by straight line, numbered with digits |
| Appendices | Numbered, titled, in order of text reference |

---

## Citation Rules (APA Format)

- **In-text:** Author-date system — e.g., (Հեղինակ, 2017)
- **Format:** APA 6th edition (pp. 174-179)
- **Bibliography order** (alphabetical within each category):
  1. Legal acts and official documents
  2. Monographs and textbooks
  3. Scientific articles and press
  4. Websites
  5. Databases and other sources
- **Minimum sources for bachelor's:** 10 scientific sources, of which at least 3 must be recent scientific articles

---

## Grading Rubric (100 points)

### Reviewer Evaluation (20% of final grade)

| Criteria | Weight | Breakdown |
|----------|--------|-----------|
| 1. Relevance justification | 30% | 1.1 Topic relevance & problem formulation (max 10) |
| | | 1.2 Clear purpose & objectives (max 10) |
| | | 1.3 Literature review quality — min 10 sources, 3+ recent (max 10) |
| 2. Research methods | 20% | 2.1 Detailed method description & tools (max 20) |
| 3. Results & conclusions | 30% | 3.1 Complete results analysis (max 10) |
| | | 3.2 Evidence-based conclusions & recommendations (max 10) |
| | | 3.3 Problem→Method→Conclusion→Recommendation chain (max 10) |
| 4. Writing & formatting | 20% | 4.1 Literate writing, logical structure, ԵՄՀ technical requirements (max 10) |
| | | 4.2 APA citations properly reflected in bibliography (max 10) |

### Committee Evaluation (80% of final grade)

| Criteria | Weight |
|----------|--------|
| Presentation skills | 20% |
| Content quality (problem→method→conclusion→recommendation chain) | 50% |
| Ability to answer questions | 30% |

---

## Critical Quality Rules

These rules are non-negotiable and directly affect grading:

1. **Problem→Method→Conclusion→Recommendation chain** must be maintained throughout the entire paper
2. **Minimum 10 scientific sources** (at least 3 recent scientific articles)
3. **Objectives must use measurable verbs:** evaluate, compare, prove, discover, assess
   - Do NOT use vague verbs: explain, interpret, describe
4. **Each recommendation** must be supported by corresponding data, logical analysis, or research findings
5. **Plagiarism check** by the Research Incubator is mandatory before defense
6. **At least 2 recommendations** must be clearly linked to the purpose and objectives for a passing grade
7. **Introduction must include:** topic relevance justification, purpose, 3-5 objectives, work structure
8. **Each new chapter** starts on a new page

---

## LaTeX Setup

### Compiler
Use **XeLaTeX** (required for Armenian/Sylfaen font support).

### Key Packages
```latex
\usepackage{fontspec}        % Sylfaen font
\usepackage{polyglossia}     % Armenian language support
\usepackage{geometry}        % Page margins
\usepackage{setspace}        % 1.5 line spacing
\usepackage{fancyhdr}        % Page numbers bottom-right
\usepackage{titlesec}        % Chapter/section formatting
\usepackage{hyperref}        % Clickable references
\usepackage{graphicx}        % Images
\usepackage{booktabs}        % Tables
\usepackage{biblatex}        % APA bibliography
```

### Build Command
```bash
xelatex main.tex
biber main
xelatex main.tex
xelatex main.tex
```

### Font Configuration
```latex
\setmainfont{Sylfaen}
```

### Geometry Configuration
```latex
\geometry{
  a4paper,
  left=3cm,
  right=1cm,
  top=2.5cm,
  bottom=2cm
}
```

---

## Tech Stack — Web Application

### Core
- **Framework:** Next.js 15 (App Router, full-stack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL (Docker container)
- **ORM:** Prisma (schema, migrations, typed queries)
- **Authentication:** Auth.js v5 (Google/GitHub OAuth + credentials)
- **Charts:** Recharts
- **Containerization:** Docker + Docker Compose (PostgreSQL + Next.js)
- **Deployment:** Any server with Docker (VPS, cloud, self-hosted)

### Project Structure
```
app/                    # Next.js web application
  src/
    app/               # App Router pages
    components/        # React components
    lib/               # Utilities, database, auth
    types/             # TypeScript types
  prisma/              # Database schema
  public/              # Static assets

paper/                  # LaTeX thesis
  main.tex             # Main document
  chapters/            # Individual chapter files
    introduction.tex
    literature.tex
    methods.tex
    results.tex
    conclusions.tex
  references.bib       # BibTeX bibliography
  appendices/          # Appendix files
  figures/             # Images and diagrams
```

---

## File Naming Convention

When submitting the final paper and presentation:
- **Paper:** `Suren Arzumanyan - CS Department - Bachelor's research - 2026`
- **Presentation:** `Suren Arzumanyan - CS Department - Bachelor's research - 2026`

---

## Defense Requirements

- **Presentation:** Maximum 15 minutes
- **Q&A:** Up to 30 minutes
- **Content to present:** Topic relevance, purpose, objectives, research methods, main conclusions and recommendations
- **Must respond** to reviewer's comments — agree or provide justified explanations

---

## Working Rules for AI Assistants

1. **Paper content** must be written in Armenian. Use formal academic Armenian writing style.
2. **LaTeX** files must compile with XeLaTeX without errors.
3. **Always maintain** the problem→method→conclusion→recommendation chain.
4. **Never** write vague objectives — always use measurable verbs.
5. **APA format** must be strictly followed for all citations.
6. **Page counts** per section must stay within the specified ranges.
7. **Code** must follow Next.js and TypeScript best practices.
8. **Every change** to the paper should be verified by recompiling LaTeX.
9. **Sylfaen font** must be used — do not substitute with other fonts.
10. **Chapter titles** in the paper must be UPPERCASE, Bold, 12pt, no trailing period.
