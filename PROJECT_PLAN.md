# devmock — AI Mock Interview Platform
### Complete Project Plan & Architecture Reference

> **Purpose of this document:** This is the single source of truth for the devmock project. Paste this into any AI session to restore full context. Keep it updated as phases complete.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem & Solution](#2-problem--solution)
3. [Tech Stack](#3-tech-stack)
4. [Full Architecture](#4-full-architecture)
5. [Database Schema](#5-database-schema)
6. [Agent Architecture](#6-agent-architecture)
7. [Feature List](#7-feature-list)
8. [Key Flows](#8-key-flows)
9. [API Routes](#9-api-routes)
10. [File Structure](#10-file-structure)
11. [Environment Variables](#11-environment-variables)
12. [Cost Model](#12-cost-model)
13. [Phase-by-Phase Build Plan](#13-phase-by-phase-build-plan)
14. [Key Decisions & Rationale](#14-key-decisions--rationale)

---

## 1. Project Overview

**devmock** is an AI-powered mock interview platform that simulates real company interview experiences. Users specify the company (e.g. Amazon, Google) or job description, and the AI plans a full multi-round interview, asks real-style questions, evaluates answers, asks follow-ups, and generates a detailed scorecard.

- **Project name:** devmock
- **Type:** Portfolio SaaS project
- **Stack language:** TypeScript throughout (Next.js + AgentCore TypeScript SDK)
- **Build approach:** Frontend-first (Phases 0–5 built on mock data, backend wired in Phases 6–13)

---

## 2. Problem & Solution

**Problem:** Candidates preparing for technical interviews have no way to simulate the actual experience of a real company interview — the specific round structure, question style, follow-up pressure, and evaluation rubrics vary significantly per company.

**Solution:** devmock uses AI to:
- Read a company name → load that company's real interview structure (rounds, focus areas, LP questions, DSA categories)
- Read a job description → derive an equivalent round structure if no company is given
- Read a resume → ask personalized questions about the candidate's actual projects and experience
- Conduct the interview in a streaming chat UI, asking one question at a time with real follow-ups
- Evaluate every answer and generate a per-round + final scorecard

---

## 3. Tech Stack

| Layer | Technology | Version | Role |
|---|---|---|---|
| **Frontend** | Next.js (App Router) | 16.x | All UI pages |
| **Language** | TypeScript | 5.x | Throughout |
| **Styling** | Tailwind CSS | 4.x | Utility classes |
| **Component Library** | Base-UI | latest | Accessible components |
| **Authentication** | Clerk | 7.x | Sign up / sign in / session |
| **Database ORM** | Prisma | 7.x | DB queries |
| **Database** | PostgreSQL | 16.x | All structured data |
| **Agent Framework** | Strands Agents SDK | latest | Agent definition (tools, model, instructions) |
| **Agent Runtime** | Amazon Bedrock AgentCore | latest | Managed agent loop, memory, code execution, gateway |
| **AI Model** | Claude Sonnet 4.6 (via Bedrock) | — | All 3 agents (Planner, Interviewer, Scorecard) |
| **AWS SDK** | @aws-sdk/client-bedrock-agentcore | v3 | Invoke AgentCore from Next.js API routes |
| **Resume Parsing** | pdf-parse | latest | Extract text from uploaded PDFs |
| **Code Editor** | Monaco Editor | latest | Candidate code input in coding rounds |
| **Streaming** | Native ReadableStream + SSE | — | Stream agent responses to browser |
| **Deployment (frontend)** | Vercel | — | Next.js + API routes |
| **Deployment (agent)** | AgentCore Runtime | — | Serverless agent compute on AWS |
| **Agent Packages** | bedrock-agentcore, @strands-agents/sdk | latest | Agent definition + AgentCore Runtime wrapper |

---

## 4. Full Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                           │
│  Next.js App                                                 │
│  Routes: / | /dashboard | /interview/new                     │
│          /interview/[id] | /interview/[id]/results           │
└────────────────────────────┬─────────────────────────────────┘
                             │ HTTP / SSE
┌────────────────────────────▼─────────────────────────────────┐
│              NEXT.JS API ROUTES (Vercel)                     │
│                                                              │
│  POST /api/sessions              → create session + plan     │
│  POST /api/sessions/[id]/turn    → invoke agent per turn     │
│  POST /api/resumes               → upload + parse resume     │
│  GET  /api/sessions              → dashboard list            │
│  POST /api/sessions/[id]/complete → trigger scorecard        │
│                                                              │
│  Tool endpoints (called by AgentCore Gateway):               │
│  POST /api/tools/question-bank   → fetch DB questions        │
│  POST /api/tools/resume-projects → fetch parsed resume       │
│  POST /api/tools/save-question   → persist question to DB    │
│  POST /api/tools/save-evaluation → persist answer eval       │
│  POST /api/tools/round-complete  → mark round done           │
└───────────┬──────────────────────────────┬───────────────────┘
            │ Prisma queries               │ AWS SDK invoke
            ▼                             ▼
┌───────────────────────┐   ┌─────────────────────────────────┐
│  PostgreSQL Database  │   │    AMAZON BEDROCK AGENTCORE     │
│                       │   │                                 │
│  InterviewSession     │◄──┤  Harness (managed agent loop)   │
│  Round                │   │  ┌──────────────────────────┐  │
│  Question             │   │  │ PlannerAgent             │  │
│  Answer               │   │  │ InterviewerAgent         │  │
│  Resume               │   │  │ ScorecardAgent           │  │
│  CompanyTemplate      │   │  └──────────────────────────┘  │
│  QuestionBankEntry    │   │                                 │
└───────────────────────┘   │  Memory (short + long term)     │
                            │  Gateway (wraps tool endpoints) │
                            │  Code Interpreter (coding rounds)│
                            │  Observability (OTEL traces)    │
                            │              │                  │
                            │              ▼                  │
                            │  Claude Sonnet 4.6 (Bedrock)    │
                            └─────────────────────────────────┘
```

---

## 5. Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum InterviewType {
  BEHAVIORAL
  TECHNICAL
  SYSTEM_DESIGN
  CODING
}

enum Difficulty {
  JUNIOR
  MID
  SENIOR
}

enum SessionStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
}

enum RoundStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}

enum QuestionSource {
  BANK        // pulled from QuestionBankEntry table
  GENERATED   // AI generated fresh
  RESUME_BASED // derived from candidate's resume
}

model InterviewSession {
  id               String        @id @default(cuid())
  userId           String        // Clerk user ID (no local User table needed)
  company          String?       // e.g. "Amazon" — null if JD-based
  role             String        // e.g. "SDE2", "Frontend Engineer"
  jobDescription   String
  difficulty       Difficulty    @default(MID)
  status           SessionStatus @default(IN_PROGRESS)
  resumeId         String?

  // Final scorecard (populated on completion)
  overallScore     Int?
  categoryScores   Json?         // { behavioral: 8, technical: 7, systemDesign: 6 }
  summary          String?
  strengths        Json?         // string[]
  improvements     Json?         // string[]

  // Token usage tracking (shows caching is working)
  promptTokens     Int           @default(0)
  completionTokens Int           @default(0)
  cacheReadTokens  Int           @default(0)

  createdAt        DateTime      @default(now())
  completedAt      DateTime?

  resume           Resume?       @relation(fields: [resumeId], references: [id])
  rounds           Round[]

  @@index([userId])
}

model Round {
  id          String      @id @default(cuid())
  sessionId   String
  name        String      // e.g. "Phone Screen", "Onsite Round 2 - System Design"
  type        InterviewType
  focusAreas  Json        // string[] e.g. ["Ownership", "Customer Obsession"]
  order       Int
  status      RoundStatus @default(PENDING)
  score       Int?
  feedback    String?

  session     InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  questions   Question[]

  @@index([sessionId])
}

model Question {
  id               String         @id @default(cuid())
  roundId          String
  parentQuestionId String?        // set if this is a follow-up question
  text             String
  order            Int
  category         String?        // e.g. "LP: Ownership", "DSA: Arrays"
  source           QuestionSource @default(GENERATED)

  round            Round          @relation(fields: [roundId], references: [id], onDelete: Cascade)
  parent           Question?      @relation("FollowUps", fields: [parentQuestionId], references: [id])
  followUps        Question[]     @relation("FollowUps")
  answer           Answer?

  @@index([roundId])
}

model Answer {
  id          String   @id @default(cuid())
  questionId  String   @unique
  content     String   // typed text, spoken transcript, or code
  language    String?  // for CODING type: "javascript", "python", etc.
  score       Int?
  strengths   Json?    // string[]
  weaknesses  Json?    // string[]
  feedback    String?
  submittedAt DateTime @default(now())

  question    Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
}

model Resume {
  id               String   @id @default(cuid())
  userId           String
  rawText          String
  parsedSkills     Json?    // string[]
  parsedProjects   Json?    // { name, description, techStack, highlights }[]
  parsedExperience Json?    // { company, role, duration, highlights }[]
  createdAt        DateTime @default(now())

  sessions         InterviewSession[]
}

// Seeded once — reference data for company interview structures
model CompanyInterviewTemplate {
  id      String @id @default(cuid())
  company String @unique  // "Amazon", "Google", "Meta", etc.
  rounds  Json   // { name, type, focusAreas, questionCount, notes }[]
  notes   String?         // e.g. "Heavy focus on Leadership Principles"
}

// Seeded once — real/commonly-asked questions tagged by company + category
model QuestionBankEntry {
  id       String  @id @default(cuid())
  company  String? // null = generic, applies to any company
  role     String? // null = any role
  category String  // "LP: Ownership", "DSA: Arrays", "System Design: Caching"
  text     String  // the actual question text
}
```

---

## 6. Agent Architecture

### The Three Agents

**PlannerAgent**
- Triggered once at session creation
- Input: company name (if provided) + job description + resume summary
- Looks up `CompanyInterviewTemplate` if company matches (grounding context)
- Output (structured): array of rounds `{ name, type, focusAreas, questionCount }`
- Hands off to InterviewerAgent once plan is confirmed by user

**InterviewerAgent**
- Triggered on every user turn (answer submission)
- Manages the full Q&A loop per round
- Tools available via AgentCore Gateway:
  - `fetch_question_bank(company, category, count)` — real questions from DB
  - `fetch_resume_projects(sessionId)` — candidate's parsed projects
  - `save_question(roundId, text, source, parentId?)` — persist to DB
  - `save_evaluation(questionId, score, strengths, weaknesses, feedback, needsFollowUp, followUpQuestion?)` — persist eval
  - `mark_round_complete(roundId)` — transition round status
- Built-in tools: Code Interpreter (coding rounds), Memory (session context)
- Decides autonomously: follow-up or next question, when round is complete
- Hands off to ScorecardAgent when all rounds are done

**ScorecardAgent**
- Triggered once when all rounds complete
- Receives full session transcript from AgentCore Memory
- Output (structured): `{ overallScore, categoryScores, summary, strengths, improvements }`
- Persists scorecard to `InterviewSession`

### Question Generation Logic (per turn)

```
InterviewerAgent receives: round focusArea + conversation history
    │
    ├── Fetch matching questions from QuestionBankEntry via Gateway tool
    │       Has matching entries? → Use as-is (source: BANK) or as style reference
    │       No match? → Check if resume available
    │
    ├── Resume available? → fetch_resume_projects → ask about specific project
    │       (source: RESUME_BASED)
    │
    └── Neither? → Generate fresh question from focusArea
            (source: GENERATED)
    
After user answers:
    → Evaluate answer (score, strengths, weaknesses)
    → needsFollowUp? → generate follow-up (parentQuestionId set)
    → No follow-up? → move to next planned question or end round
```

### AgentCore Services Used

| Service | Role in devmock | Cost |
|---|---|---|
| Harness | Manages agent loop — no extra charge | Free |
| Memory (short-term) | Per-session conversation context | $0.25/1K events |
| Memory (long-term) | Cross-session candidate history (weak areas persist) | $0.75/1K records/month |
| Gateway | Wraps Prisma-backed Next.js routes as MCP tools | $0.005/1K invocations |
| Code Interpreter | Runs candidate's code in coding rounds | $0.0895/vCPU-hr |
| Observability | OTEL traces of every agent step | CloudWatch rates |
| Runtime | Hosts agent code serverless | $0.0895/vCPU-hr |

### Agent Tech Stack (npm packages)

```bash
npm install bedrock-agentcore           # AgentCore Runtime wrapper
npm install @strands-agents/sdk         # Agent framework (tools, model, streaming)
npm install @aws-sdk/client-bedrock-agentcore  # Invoke AgentCore from Next.js
npm install zod                         # Tool schema definitions
npm install pdf-parse                   # Resume parsing
npm install @aws-sdk/credential-providers
```

---

## 7. Feature List

### Core MVP Features
- [x] User authentication (Clerk — sign up, sign in, session management)
- [x] Interview setup wizard: company autocomplete + role + job description + resume upload
- [x] Company-specific interview planning (Amazon OA → phone screen → 5 onsite rounds with LP focus)
- [x] JD-based planning if no company given (derive round structure from role type)
- [x] Plan preview — user can see and confirm generated round plan before starting
- [x] AI-generated questions (bank-grounded + AI-generated + resume-based)
- [x] Streaming chat interview UI (questions stream letter-by-letter)
- [x] Follow-up questions (agent decides based on answer quality)
- [x] Resume-aware questions (asks about specific projects from uploaded resume)
- [x] Code editor (Monaco) for coding rounds with syntax highlighting
- [x] Code execution (AgentCore Code Interpreter — built-in sandbox)
- [x] Per-answer evaluation (score, strengths, weaknesses, feedback)
- [x] Round-level feedback and score on completion
- [x] Final scorecard (overall score, category breakdown, summary, recommendations)
- [x] Question tags showing what each question tests (LP name, DSA category, etc.)
- [x] Interview transcript accordion (full Q&A history on results page)
- [x] Dashboard showing past sessions with score, company, role, date
- [x] Cross-session memory (agent knows candidate's past weak areas in next session)

### Stretch Features (Phase 12)
- [ ] Voice mode — Web Speech API STT for spoken answers
- [ ] Real PDF export of transcript + scorecard (@react-pdf/renderer)
- [ ] Retry single round without redoing whole session
- [ ] Score trend chart per company/role over time
- [ ] Difficulty auto-calibration from resume experience level
- [ ] Timed rounds with countdown matching real interview durations

---

## 8. Key Flows

### Flow 1 — Interview Setup

```
User fills setup form (company, role, JD, resume)
    → POST /api/sessions (create InterviewSession row)
    → Parse resume if uploaded (pdf-parse → structured extraction → Resume row)
    → Invoke PlannerAgent via AgentCore Harness
         Agent reads company from CompanyInterviewTemplate if matched
         OR derives structure from JD if no company
    → Returns: array of Round objects { name, type, focusAreas, questionCount }
    → Persist Rounds to DB
    → Return plan to frontend → user sees Plan Preview
    → User confirms → interview begins at /interview/[id]
```

### Flow 2 — Interview Loop (per user turn)

```
User submits answer (typed text / code / spoken → STT → text)
    → POST /api/sessions/[id]/turn { questionId, answer, answerType }
    → Invoke InterviewerAgent via AWS SDK (streams response via SSE)
    
    Inside AgentCore Harness:
        Agent calls save_evaluation tool → score/feedback persisted
        Agent decides: follow-up needed?
            YES → save_question with parentQuestionId → stream follow-up
            NO  → fetch_question_bank OR generate fresh → save_question → stream next question
        CODING round → Code Interpreter runs candidate's code → result informs evaluation
        All questions in round done → mark_round_complete → if more rounds: next round
                                                          → if last round: handoff to ScorecardAgent
    
    → SSE stream → Chat UI displays question/feedback in real time
```

### Flow 3 — Scorecard Generation

```
InterviewerAgent hands off to ScorecardAgent (after final round complete)
    → ScorecardAgent receives full transcript via AgentCore Memory
    → Generates structured output: { overallScore, categoryScores, summary, strengths, improvements }
    → Persists to InterviewSession (status → COMPLETED, all score fields)
    → AgentCore long-term Memory stores: candidate strengths/weaknesses for future sessions
    → Frontend redirects to /interview/[id]/results
    → Scorecard page renders real data (replaces mocks)
```

---

## 9. API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/sessions` | Create session + invoke PlannerAgent → return round plan |
| POST | `/api/sessions/[id]/turn` | Invoke InterviewerAgent → SSE stream next question |
| POST | `/api/sessions/[id]/complete` | Trigger ScorecardAgent → store final scorecard |
| GET | `/api/sessions` | List user's sessions for dashboard (ordered by createdAt) |
| GET | `/api/sessions/[id]` | Get full session with rounds, questions, answers |
| POST | `/api/resumes` | Upload PDF, extract text, call Claude for structured parsing |
| POST | `/api/tools/question-bank` | Gateway tool: fetch QuestionBankEntry rows |
| POST | `/api/tools/resume-projects` | Gateway tool: fetch Resume.parsedProjects |
| POST | `/api/tools/save-question` | Gateway tool: persist Question to DB |
| POST | `/api/tools/save-evaluation` | Gateway tool: persist Answer with eval scores |
| POST | `/api/tools/round-complete` | Gateway tool: mark Round as COMPLETED |

---

## 10. File Structure

```
devmock/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx                  # Landing page
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx                # Sidebar nav
│   │   └── page.tsx                  # Session history + trend chart
│   ├── interview/
│   │   ├── new/
│   │   │   └── page.tsx              # Setup wizard (multi-step form)
│   │   └── [id]/
│   │       ├── page.tsx              # Chat interview UI
│   │       └── results/
│   │           └── page.tsx          # Scorecard + transcript
│   ├── api/
│   │   ├── sessions/
│   │   │   ├── route.ts              # POST - create session
│   │   │   └── [id]/
│   │   │       ├── turn/route.ts     # POST - agent turn
│   │   │       └── complete/route.ts # POST - scorecard
│   │   ├── resumes/route.ts          # POST - upload + parse
│   │   └── tools/                    # Gateway tool endpoints
│   │       ├── question-bank/route.ts
│   │       ├── resume-projects/route.ts
│   │       ├── save-question/route.ts
│   │       ├── save-evaluation/route.ts
│   │       └── round-complete/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                           # Shared primitives (Button, Card, Input...)
│   ├── landing/                      # Hero, HowItWorks, FeatureGrid, CTA
│   ├── dashboard/                    # SessionCard, ScoreTrendChart
│   ├── setup/                        # CompanyAutocomplete, ResumeUpload, PlanPreview
│   ├── interview/                    # RoundProgressBar, ChatThread, AnswerInput,
│   │                                 # CodeEditorPanel, FollowUpThread, RoundTimer
│   └── results/                      # RoundFeedbackCard, OverallScoreCard,
│                                     # CategoryBreakdownChart, TranscriptAccordion
├── lib/
│   ├── prisma.ts                     # Prisma client singleton
│   ├── agentcore.ts                  # AgentCore AWS SDK client
│   └── utils.ts                      # Shared utilities
├── agent/
│   ├── planner.ts                    # PlannerAgent definition
│   ├── interviewer.ts                # InterviewerAgent definition
│   ├── scorecard.ts                  # ScorecardAgent definition
│   └── tools/                        # Tool implementations
│       ├── question-bank.ts
│       ├── resume-projects.ts
│       ├── save-question.ts
│       ├── save-evaluation.ts
│       └── round-complete.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                       # Seed CompanyInterviewTemplate + QuestionBankEntry
│   └── migrations/
├── public/
├── middleware.ts                     # Clerk auth middleware
├── PROJECT_PLAN.md                   # This file
├── .env.local                        # Environment variables
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 11. Environment Variables

```bash
# .env.local

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database
DATABASE_URL=postgresql://user:password@host:5432/devmock

# AWS / AgentCore
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AGENTCORE_PLANNER_HARNESS_ID=harness-...
AGENTCORE_INTERVIEWER_HARNESS_ID=harness-...
AGENTCORE_SCORECARD_HARNESS_ID=harness-...

# AgentCore Gateway (auto-registered tool endpoint base URL)
GATEWAY_BASE_URL=https://your-vercel-app.vercel.app

# AgentCore Observability
OTEL_EXPORTER_OTLP_ENDPOINT=https://...
```

---

## 12. Cost Model

**Model:** Claude Sonnet 4.6 via Amazon Bedrock
- Input: $3.00 / 1M tokens
- Output: $15.00 / 1M tokens
- Cached input: $0.30 / 1M tokens (~90% discount, automatic for prefix >1024 tokens)

**Per full mock interview session (Amazon SDE2, 5 rounds, ~16 turns):**

| Component | Cost |
|---|---|
| Plan generation (1 call) | ~$0.013 |
| Resume parsing (1 call, if uploaded) | ~$0.014 |
| Interview loop (16 turns, with caching) | ~$0.226 |
| Final scorecard (1 call) | ~$0.015 |
| AgentCore infrastructure (Gateway, Memory, Code Interpreter) | ~$0.021 |
| **Total per session** | **~$0.29** |

**AWS $200 new account credits:** ~690 full sessions covered
**AWS Educate credits ($30–100 additional):** another 100–345 sessions
**Total dev budget:** ~800–1,000+ sessions — effectively unlimited for portfolio

---

## 13. Phase-by-Phase Build Plan

### FRONTEND PHASES (mock data — no AI, no AWS)

#### Phase 0 — Project Setup & Design System
**Status:** ✅ COMPLETE
- [x] `create-next-app devmock` — Next.js 16.2.9, TypeScript, Tailwind, ESLint, App Router
- [ ] Install Base-UI: `npm install @base-ui-components/react`
- [ ] Create route folder structure (see File Structure above)
- [ ] Define design tokens in `tailwind.config.ts` (colors, type scale, spacing)
- [ ] Create shared layout with placeholder nav
- [ ] Add `PROJECT_PLAN.md` to repo (this file)

**State after Phase 0:** Empty Next.js shell running locally, all routes as blank pages, design system defined.

---

#### Phase 1 — Landing Page
**Status:** ✅ COMPLETE

**Design:** Mirrors the "Retainable" reference layout — Fraunces serif headings + Inter body, pastel mesh hero backdrop, dark gradient pill buttons, soft white product mockups.

**Components built (in `components/`):**
- `ui/CtaButton` — dark/light gradient pill button
- `ui/Logo` — devmock mark (code-bracket glyph) + wordmark
- `ui/BrandMark` — monochrome company glyphs (Amazon, Google, Meta, Microsoft, Others)
- `landing/Navbar` — sticky blurred pill nav
- `landing/Hero` + `landing/HeroDashboard` — headline, CTA, brand row, interview dashboard mockup w/ "Watch how it works"
- `landing/Integrations` — connector diagram (companies → devmock) + 3 feature cards w/ mini previews
- `landing/Testimonial` — candidate card (Priya Sharma, hired @ Amazon) + quote
- `landing/Solution` — "Interview Prep, Reinvented" showcase: live interview session mock flanked by 6 feature labels
- `landing/FinalCTA` — closing two-column CTA
- `landing/Footer` — links, socials, large "devmock" watermark

**Design tokens** in `app/globals.css` (`@theme`): `--color-page #f4f3f6`, `--color-ink #2a2a2e`, `--color-ink-soft #6c6c75`, `--color-muted #9a9aa3`, `--color-line`. Fonts wired in `app/layout.tsx`. Accent palette: purple `#a78bfa`, blue `#7aa2f7`, orange `#f5a97f`, green `#8bd5a0`.

**Verified:** `tsc --noEmit` clean, `next build` succeeds (static prerender).

**State after Phase 1:** Marketing homepage complete and responsive.

---

#### Phase 2 — Auth & Dashboard Shell
**Status:** ⬜ NOT STARTED

**Tasks:**
- Install Clerk: `npm install @clerk/nextjs`
- Add Clerk middleware (`middleware.ts`)
- Create sign-in/sign-up pages using Clerk components
- Build dashboard layout: `app/dashboard/layout.tsx` with sidebar nav
- Build dashboard page: `SessionCard` list from mock array, `ScoreTrendChart` placeholder

**Mock data shape:**
```typescript
const mockSessions = [
  { id: '1', company: 'Amazon', role: 'SDE2', date: '2024-01-15', score: 76, status: 'COMPLETED' },
  { id: '2', company: 'Google', role: 'Frontend Engineer', date: '2024-01-10', score: 82, status: 'COMPLETED' },
]
```

**State after Phase 2:** Auth works, dashboard shows mock session history.

---

#### Phase 3 — Interview Setup Flow UI
**Status:** ⬜ NOT STARTED

**Components to build:**
- `CompanyAutocomplete` — autocomplete against mock company list
- `JobDescriptionInput` — textarea with character count
- `ResumeUpload` — drag-and-drop file picker (no parsing yet)
- `DifficultySelector` — JUNIOR / MID / SENIOR toggle
- `PlanPreview` — displays mock round plan, each round editable/removable

**Mock plan data:**
```typescript
const mockPlan = {
  rounds: [
    { name: 'Phone Screen', type: 'BEHAVIORAL', focusAreas: ['Ownership', 'Communication'], questionCount: 3 },
    { name: 'Technical Round', type: 'CODING', focusAreas: ['Arrays', 'HashMaps'], questionCount: 2 },
    { name: 'System Design', type: 'SYSTEM_DESIGN', focusAreas: ['Scalability', 'Caching'], questionCount: 1 },
  ]
}
```

**State after Phase 3:** Full setup wizard works end-to-end on mocks.

---

#### Phase 4 — Interview Session UI (Chat Interface)
**Status:** ⬜ NOT STARTED

**Components to build:**
- `RoundProgressBar` — "Round 2 of 5 — System Design"
- `ChatThread` — message list with AI question bubbles and user answer bubbles
- `QuestionBubble` — AI message with optional `QuestionTagBadge` (what this tests)
- `AnswerInput` — textarea + toggle to Monaco code editor for CODING rounds
- `CodeEditorPanel` — Monaco Editor with language selector
- `FollowUpThread` — nested/indented follow-up questions under parent
- `RoundTransitionBanner` — animated banner between rounds
- `RoundTimer` — countdown timer per round (15/30/45/60 min by type)

**State after Phase 4:** Mock interview session fully navigable with scripted Q&A.

---

#### Phase 5 — Feedback & Scorecard UI ← FRONTEND MILESTONE
**Status:** ⬜ NOT STARTED

**Components to build:**
- `RoundFeedbackCard` — score /10, strengths list, weaknesses list per round
- `OverallScoreCard` — total score, summary text
- `CategoryBreakdownChart` — bar/radar chart of category scores
- `TranscriptAccordion` — collapsible full Q&A history with `QuestionTagBadge`
- `ExportPdfButton` — UI only (no real export yet)

**State after Phase 5:** ✅ FRONTEND MILESTONE — every screen works on mock data.
Full flow: landing → sign up → dashboard → setup → plan preview → interview → scorecard.

---

### BACKEND PHASES (real data, real AI)

#### Phase 6 — Database Setup
**Status:** ⬜ NOT STARTED

**Tasks:**
- Install Prisma: `npm install prisma @prisma/client && npx prisma init`
- Write full schema (see Section 5 above)
- `npx prisma migrate dev --name init`
- Write `prisma/seed.ts`:
  - Seed `CompanyInterviewTemplate` for: Amazon, Google, Meta, Microsoft, Apple, Netflix, Stripe, Uber, generic-startup
  - Seed `QuestionBankEntry` (~5–10 questions per company per category)
- `npx prisma db seed`

**Amazon seed example:**
```typescript
await prisma.companyInterviewTemplate.create({
  data: {
    company: 'Amazon',
    notes: 'Heavy focus on Leadership Principles. Bar Raiser round is most senior interviewer.',
    rounds: [
      { name: 'Online Assessment', type: 'CODING', focusAreas: ['DSA: Arrays', 'DSA: HashMaps'], questionCount: 2, notes: '70 min, LeetCode medium difficulty' },
      { name: 'Phone Screen', type: 'BEHAVIORAL', focusAreas: ['LP: Ownership', 'LP: Customer Obsession', 'Technical: Basics'], questionCount: 3, notes: '45 min' },
      { name: 'Onsite Round 1 - Coding', type: 'CODING', focusAreas: ['DSA: Trees', 'DSA: Dynamic Programming'], questionCount: 2, notes: '60 min' },
      { name: 'Onsite Round 2 - Coding', type: 'CODING', focusAreas: ['DSA: Graphs', 'DSA: Strings'], questionCount: 2, notes: '60 min' },
      { name: 'Onsite Round 3 - System Design', type: 'SYSTEM_DESIGN', focusAreas: ['Scalability', 'Database Design', 'Caching'], questionCount: 1, notes: '60 min' },
      { name: 'Onsite Round 4 - LP Behavioral', type: 'BEHAVIORAL', focusAreas: ['LP: Earn Trust', 'LP: Dive Deep', 'LP: Deliver Results'], questionCount: 3, notes: '60 min' },
      { name: 'Bar Raiser - LP + Technical', type: 'BEHAVIORAL', focusAreas: ['LP: Ownership', 'LP: Hire and Develop the Best', 'Technical: Architecture'], questionCount: 3, notes: '60 min — most senior interviewer, raises the bar' },
    ]
  }
})
```

**State after Phase 6:** DB migrated, seeded. Prisma Studio shows populated reference tables.

---

#### Phase 7 — PlannerAgent (Real AI #1)
**Status:** ⬜ NOT STARTED

**Tasks:**
- Create AWS account, configure IAM role with Bedrock + AgentCore permissions
- Install agent packages: `npm install bedrock-agentcore @strands-agents/sdk @aws-sdk/client-bedrock-agentcore zod`
- Write `agent/planner.ts` — PlannerAgent definition with Claude Sonnet 4.6
- Deploy PlannerAgent to AgentCore Runtime
- Build `POST /api/sessions` route — create InterviewSession, invoke PlannerAgent, persist Rounds
- Wire Phase 3's PlanPreview component to call real API (replace mock plan JSON)

**State after Phase 7:** Setup form → real AI-generated company/JD-aware interview plan.

---

#### Phase 8 — InterviewerAgent (Real AI #2)
**Status:** ⬜ NOT STARTED

**Tasks:**
- Write Gateway tool endpoint routes: `/api/tools/question-bank`, `/api/tools/resume-projects`, `/api/tools/save-question`, `/api/tools/save-evaluation`, `/api/tools/round-complete`
- Register these routes in AgentCore Gateway as MCP tools
- Write `agent/interviewer.ts` — InterviewerAgent with all Gateway tools + Code Interpreter
- Deploy InterviewerAgent to AgentCore Runtime
- Build `POST /api/sessions/[id]/turn` route — invoke InterviewerAgent via AWS SDK → SSE stream
- Wire Phase 4's chat UI: remove scripted mock Q&A, connect to real SSE stream

**State after Phase 8:** Core interview loop fully real — streamed questions, real evaluations, real follow-ups.

---

#### Phase 9 — Resume Parsing
**Status:** ⬜ NOT STARTED

**Tasks:**
- Install: `npm install pdf-parse @types/pdf-parse`
- Build `POST /api/resumes` route: extract PDF text → call Claude Sonnet structured output → persist `Resume`
- Update `GET /api/tools/resume-projects` to return real data
- InterviewerAgent now gets real project data → resume-based questions appear

**State after Phase 9:** Resume upload functional, AI asks about specific projects from resume.

---

#### Phase 10 — ScorecardAgent (Real AI #3)
**Status:** ⬜ NOT STARTED

**Tasks:**
- Write `agent/scorecard.ts` — ScorecardAgent with full transcript input
- Configure handoff: InterviewerAgent → ScorecardAgent after final round
- Build `POST /api/sessions/[id]/complete` route
- Wire Phase 5's results page to real session data (remove all mocks)

**State after Phase 10:** ✅ END-TO-END PRODUCT COMPLETE — zero mocks remaining. Full flow works with real AI.

---

#### Phase 11 — Dashboard & History
**Status:** ⬜ NOT STARTED

**Tasks:**
- Wire `GET /api/sessions` to real Prisma query (filter by `userId`)
- Update dashboard SessionCard list to use real data
- Wire ScoreTrendChart to real `overallScore` data grouped by company+role

**State after Phase 11:** Dashboard shows real interview history and score trends.

---

#### Phase 12 — Stretch Features
**Status:** ⬜ NOT STARTED

Pick based on available time:
- [ ] **Voice mode** — Web Speech API `SpeechRecognition` in `AnswerInput`, transcript sent to same eval pipeline
- [ ] **Real PDF export** — `npm install @react-pdf/renderer`, render scorecard as downloadable PDF
- [ ] **Retry single round** — new Round rows under same session, re-invoke InterviewerAgent
- [ ] **Score trends per company/role** — line chart on dashboard, multiple data points over time
- [ ] **Difficulty auto-calibration** — read `Resume.parsedExperience` years → adjust question difficulty automatically

---

#### Phase 13 — Polish, Testing & Deploy
**Status:** ⬜ NOT STARTED

**Tasks:**
- Add loading/skeleton states on all async components
- Add error boundaries and user-friendly error messages
- Edge cases: no company + no JD, abandoned sessions mid-round, resume parse failure
- Responsive QA pass (mobile + tablet breakpoints)
- Deploy to Vercel: connect GitHub repo, add all env vars
- Production PostgreSQL: Supabase, Neon, or AWS RDS
- AgentCore Runtime: agent containers deployed to production AWS region
- Final smoke test of full flow in production

**State after Phase 13:** 🚀 devmock live in production.

---

## 14. Key Decisions & Rationale

| Decision | Choice | Why |
|---|---|---|
| Agent infrastructure | Amazon Bedrock AgentCore | AWS $200 new account credits cover everything; managed loop, memory, code execution built-in; no need to write agent loop manually |
| AI model | Claude Sonnet 4.6 via Bedrock | Same price as Anthropic direct ($3/$15 per 1M) but covered by AWS credits; no separate bill |
| Agent framework | Strands Agents SDK (@strands-agents/sdk) | Open-source framework from AWS powering the Harness; TypeScript support; Zod-based tool schemas |
| Language | TypeScript throughout | One codebase, one language; simpler for portfolio; TypeScript AgentCore SDK mature enough |
| Build order | Frontend-first (phases 0–5 on mocks) | Validate UX before touching AWS; avoid billing during UI iteration; show working product early |
| Question generation | Dynamic per-turn (not pre-generated) | Follow-ups require seeing previous answer; adapts to candidate mid-interview |
| Question sourcing | DB bank + AI generation hybrid | Bank grounds style/authenticity; AI fills gaps and personalizes; avoids repetition |
| Auth | Clerk | Pre-built UI, session management; same stack as ContentFlow/Planora projects |
| Prompt caching | Automatic via Bedrock | System prompt (persona + JD + rubric) cached after turn 1; ~90% discount on subsequent turns |
| No separate User table | Clerk userId as string FK | Simpler schema; Clerk owns user data; no sync needed |

---

*Last updated: June 2026 — Phase 1 complete*
*Next: Phase 2 — Auth & Dashboard Shell*
