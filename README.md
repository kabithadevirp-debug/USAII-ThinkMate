```
███████╗██╗  ██╗██╗███╗   ██╗██╗  ██╗███╗   ███╗ █████╗ ███████╗███████╗
╚══█╔══╝██║  ██║██║████╗  ██║██║ ██╔╝████╗ ████║██╔══██╗╚══██╔══╝██╔════╝
   ██║   ███████║██║██╔██╗ ██║█████╔╝ ██╔████╔██║███████║   ██║   █████╗
   ██║   ██╔══██║██║██║╚██╗██║██╔═██╗ ██║╚██╔╝██║██╔══██║   ██║   ██╔══╝
   ██║   ██║  ██║██║██║ ╚████║██║  ██╗██║ ╚═╝ ██║██║  ██║   ██║   ███████╗
   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝

 █████╗ ██╗
██╔══██╗██║
███████║██║
██╔══██║██║
██║  ██║██║
╚═╝  ╚═╝╚═╝
```

```
              ⚡ T H I N K M A T E ⚡
         by  K A B I T H A D E V I R P
    ─────────────────────────────────────────
    "Think less about what to do.
              Do more of what matters."
    ─────────────────────────────────────────
         🏆  USAII Global Hackathon 2026
              Productivity Track
```

---

## 📋 Table of Contents

```
  01 ── Executive Summary ..................... The Big Picture
  02 ── Project Overview ...................... At a Glance
  03 ── Tech Stack & Architecture ............. Under the Hood
  04 ── System Architecture Diagram ........... How It All Connects
  05 ── Core Features & All Functions ......... What It Does
  06 ── Complete User Workflow ................ End-to-End Journey
  07 ── Flow of a User Query .................. From Thought to Action
  08 ── AI Decision Engine .................... How the Brain Works
  09 ── Component-by-Component Breakdown ...... Deep Dive
  10 ── Data Flow & State Management .......... The Memory System
  11 ── Authentication & Security ............. The Vault
  12 ── AI Provider Architecture .............. The Fallback Waterfall
  13 ── Database Layer ........................ The Persistence Engine
  14 ── File Structure Reference .............. The Blueprint
  15 ── Running the Project ................... Launch Sequence
```

---

## `01` Executive Summary

> **ThinkMate AI** (`mind-free-ai`) is an AI-powered personal productivity assistant engineered to eliminate cognitive overload — the paralysis that comes from having too many things in your head and no clear starting point.

Users perform a **brain dump** — typing everything overwhelming their mind in free-form text — and the AI does the heavy lifting:

| What ThinkMate Does | How It Does It |
|---|---|
| 🔍 **Extracts** structured tasks | NLP via Gemini 2.5 Flash |
| 🏷️ **Classifies** tasks by urgency × importance | Eisenhower Priority Matrix |
| 📊 **Scores** mental load | Weighted 0–100 formula |
| ☝️ **Recommends** ONE next step | Momentum-first selection logic |
| ⚖️ **Compares** decision options | Weighted factor matrix |
| 🎯 **Breaks down** long-term goals | Monthly milestone roadmap |
| 🌙 **Reflects** each evening | Carry-forward + encouragement |

> **Philosophy:** AI provides clarity. Humans make the final call. Always.

---

## `02` Project Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      PROJECT IDENTITY                           │
├──────────────────────┤───────────────────────────────────────────┤
│  App Name            │  ThinkMate AI  (codebase: mind-free-ai)  │
│  Domain              │  Personal Productivity / AI Second Brain  │
│  Hackathon           │  USAII Global Hackathon — Productivity    │
│  Type                │  Full-stack SSR Web App (TanStack Start)  │
│  Dev Port            │  localhost:8080                           │
│  Entry Point         │  src/start.ts → src/router.tsx            │
│  Primary AI Model    │  Gemini 2.5 Flash                         │
│  Fallback AI Model   │  Llama 3.3 70B (via Groq)                 │
│  Client Storage      │  localStorage (11 named keys)             │
│  Server Storage      │  PostgreSQL (7 tables)                    │
└──────────────────────┴───────────────────────────────────────────┘
```

---

## `03` Tech Stack & Architecture

### 🖥️ Frontend

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 19 | Component rendering |
| **Router** | TanStack Router v1 | File-based routing + SSR |
| **SSR Runtime** | TanStack Start + Nitro | Server-side rendering |
| **Styling** | Tailwind CSS v4 + tw-animate | Utility-first + animations |
| **UI Components** | Radix UI (shadcn/ui) | Accessible primitives |
| **Icons** | Lucide React | Consistent icon set |
| **Forms** | React Hook Form + Zod | Validation + schema safety |
| **State** | `useThinkMate` hook | localStorage-backed global state |
| **Build** | Vite 7 | Lightning-fast bundler |

### ⚙️ Backend (Server Functions)

| Layer | Technology | Purpose |
|---|---|---|
| **Server Runtime** | Nitro | Lightweight edge-ready server |
| **Server Functions** | `createServerFn` | Type-safe RPC (no REST needed) |
| **Database Client** | `pg` (node-postgres) | PostgreSQL driver |
| **Validation** | Zod schemas | Shared client/server contracts |
| **AI Gateway** | Multi-provider dispatcher | OpenRouter / Groq / Gemini / Lovable |

### 🤖 AI & LLM Providers

| Provider | Model | Key Prefix | Routing Order |
|---|---|---|---|
| OpenRouter | `google/gemini-2.5-flash` | `sk-or-` | 1st |
| Groq | `llama-3.3-70b-versatile` | `gsk_` | 2nd |
| Direct Gemini | `gemini-2.5-flash` | `AIzaSy` | 3rd |
| Lovable Gateway | `google/gemini-2.5-flash` | `AQ.` | 4th |

---

## `04` System Architecture Diagram

```
╔═══════════════════════════════════════════════════════════════════╗
║                         USER BROWSER                              ║
║                                                                    ║
║   /landing ──► /brain-dump ──► /dashboard ──► /matrix             ║
║                    │               │            │                  ║
║                 /goals          /reflect     /decide               ║
║                                                                    ║
║  ┌────────────────────────────────────────────────────────────────┐  ║
║  │              useThinkMate Hook  (State Layer)                │  ║
║  │   localStorage ◄──────► React State ◄──────► CustomEvent    │  ║
║  │   Keys: thinkmate:state:v1, thinkmate-tasks, ..............  │  ║
║  └────────────────────────────────────────────────────────────────┘  ║
╚═══════════════════════════╦════════════════════════════════════════╝
                            ║  HTTP/RPC  (TanStack Server Functions)
                            ↓
╔═══════════════════════════════════════════════════════════════════╗
║                    NITRO SERVER  (SSR Layer)                       ║
║                                                                    ║
║   thinkmate.functions.ts      |      db.server.ts                  ║
║   -- conductBrainDumpSession  |  -- saveSessionServer              ║
║   -- analyzeBrainDump         |  -- saveTasksServer                ║
║   -- analyzeDecision          |  -- updateTaskServer               ║
║   -- generateReflection       |  -- getUserTasksServer             ║
║   -- breakdownGoal            |  -- appendLoadHistoryServer        ║
║   -- callGateway()            |  -- save/getReflectionServer       ║
║          |                    |  -- save/getGoalServer             ║
║          v                    |  -- save/getDecisionServer         ║
║   [AI Gateway Dispatch]       |  -- signUp/In/OutUserServer        ║
║          |                    |           |                        ║
╚════════════╦════════════════════════════════╦═══════════╝
           ║  HTTPS                            ║  TCP
           ↓                                  ↓
╔═════════════════════════╗     ╔═════════════════════════════════╗
║  AI PROVIDER GATEWAY    ║     ║      POSTGRESQL DATABASE         ║
║                         ║     ║                                  ║
║ 1. OpenRouter           ║     ║  users          load_history     ║
║    Gemini 2.5 Flash     ║     ║  sessions       reflections      ║
║ 2. Groq / Llama 3.3 70B ║     ║  brain_sessions  goals           ║
║ 3. Direct Gemini API    ║     ║  tasks          decisions        ║
║ 4. Lovable Gateway      ║     ║  (optional -- works without)     ║
╚═════════════════════════╝     ╚═════════════════════════════════╝
```

---

## `05` Core Features & All Functions

### 🧠 5.1 — Brain Dump  `/brain-dump`

> *The entry point of the entire user journey. A canvas for your chaos.*

- Accepts **free-form text input** (up to 8,000 characters)
- Provides **3 sample prompts** to get users started
- Supports **Demo Mode** — auto-fills + auto-submits a realistic example
- Triggers the **Akinator Wizard** — AI-driven Q&A to clarify ambiguity
- Shows real-time character count and calming UI copy

| Function | File | Role |
|---|---|---|
| `conductBrainDumpSession` | `thinkmate.functions.ts` | Core: manages wizard Q&A + finalization |
| `analyzeBrainDump` | `thinkmate.functions.ts` | Legacy: direct single-shot analysis |
| `callGateway` | `thinkmate.functions.ts` | Dispatches to AI providers |
| `saveAnalysis` | `thinkmate-store.ts` | Persists result to localStorage + DB |

---

### 📊 5.2 — Dashboard  `/dashboard`

> *Your calm command center. One place to see everything that matters.*

- **Mental Load Score** — SVG circular gauge (0–100) with risk coloring
- **Smart Next Step** — hero card: single most important action + rationale + time
- **Top 3 Priority Tasks** — ranked by Eisenhower quadrant then priority
- **7-Day Sparkline** — bar chart history of daily mental load scores
- **AI Rationale Panel** — collapsible explanation of why each task was classified
- **Carried-Over Alert** — banner when incomplete tasks roll in from yesterday

| Function | File | Role |
|---|---|---|
| `useThinkMate()` | `thinkmate-store.ts` | Returns state + all mutations |
| `toggleTask()` | `thinkmate-store.ts` | Mark task complete/incomplete |
| `getLoadHistoryServer` | `db.server.ts` | Fetch 7-day sparkline data |
| `getUserTasksServer` | `db.server.ts` | Hydrate tasks from DB on login |

---

### 🗂️ 5.3 — Eisenhower Matrix  `/matrix`

> *See your chaos organized. Drag. Drop. Decide.*

- Renders a **2×2 visual grid** of all extracted tasks by quadrant
  - 🔴 **Do Now** — Urgent + Important
  - 🔵 **Schedule** — Important, Not Urgent
  - 🟡 **Delegate** — Urgent, Not Important
  - ⚫ **Ignore** — Neither Urgent nor Important
- Supports **drag-and-drop** to manually override AI classifications
- Each card shows: title, priority badge, estimated time, deadline

| Function | File | Role |
|---|---|---|
| `moveTask()` | `thinkmate-store.ts` | Reassign task to a new quadrant |
| `updateTaskServer` | `db.server.ts` | Persist quadrant change to DB |
| `toggleTask()` | `thinkmate-store.ts` | Mark completion from matrix view |

---

### ⚖️ 5.4 — Decision Framework  `/decide`

> *When you're stuck between options, ThinkMate builds the scorecard.*

- User inputs a **decision description** + **2–6 options** + optional personal values
- AI auto-derives **4–6 relevant factors** with weights
- Returns a **weighted comparison table** (score × weight per option)
- Delivers a **reasoned recommendation** — always ending with "Final decision is yours."

| Function | File | Role |
|---|---|---|
| `analyzeDecision` | `thinkmate.functions.ts` | Builds weighted comparison matrix |
| `callGateway` | `thinkmate.functions.ts` | Routes to AI provider |
| `saveDecisionServer` | `db.server.ts` | Persist decision to PostgreSQL |

---

### 🎯 5.5 — Goal Breakdown  `/goals`

> *From fuzzy dream to concrete week-one action in seconds.*

- **Goal restatement** in clear, actionable language
- **3–6 milestones** (monthly cadence), each with 3 concrete sub-actions
- **Week 1 Actions** — exactly 3 specific tasks to start this week
- **Today's First Step** — one tiny, immediately actionable step
- **Estimated Duration** — realistic total timeline (e.g., "6–9 months")
- **"Add to Tasks"** button — one-click push of first step to Dashboard

| Function | File | Role |
|---|---|---|
| `breakdownGoal` | `thinkmate.functions.ts` | Decomposes goal into milestone plan |
| `callGateway` | `thinkmate.functions.ts` | Routes to AI provider |
| `addTask()` | `thinkmate-store.ts` | Pushes first step to task queue |
| `saveGoalServer` | `db.server.ts` | Persist goal result to PostgreSQL |

---

### 🌙 5.6 — Evening Reflection  `/reflect`

> *A quiet moment at day's end. What did you do? What carries forward?*

- Shows **checklist of all current tasks** — mark complete or incomplete
- Accepts a **free-text journal entry**
- AI generates: accomplishment summary, tailored encouragement, tomorrow's focus, carried-over tasks
- **"Push to Tomorrow"** button — adds carried items back to the task queue

| Function | File | Role |
|---|---|---|
| `generateReflection` | `thinkmate.functions.ts` | Generates AI recap + carried tasks |
| `callGateway` | `thinkmate.functions.ts` | Routes to AI provider |
| `addTask()` | `thinkmate-store.ts` | Re-adds carried tasks for tomorrow |
| `saveReflectionServer` | `db.server.ts` | Persist reflection to PostgreSQL |
| `getReflectionsServer` | `db.server.ts` | Load past reflections |

---

## `06` Complete User Workflow — End to End

```
  🌐 User visits  /  (Landing Page)
         |
         +---> [Sign Up / Login]  ->  /signup  ->  /login
         |                              |
         |                    AuthGuard HOC (Token check)
         |                              |
         +--> [Demo Mode] ---------------+
                                         |
                                         v
                           /brain-dump
                           User types brain dump (free-form, <=8000 ch.)
                                         |
                           POST: conductBrainDumpSession(next_question)
                                         |
                           AKINATOR WIZARD
                           Round 1: AI asks Q1  -->  User answers
                           Round 2: AI asks Q2  -->  User answers
                           [Up to 5 rounds, skip available anytime]
                                         |
                           POST: conductBrainDumpSession(finalize)
                                         |
                           AI ANALYSIS ENGINE:
                           (1) Extract all tasks from dump
                           (2) Classify: quadrant + priority
                           (3) Calculate mental load score
                           (4) Select ONE recommended next step
                           (5) Write session summary + rationale
                                         |
                           saveAnalysis()
                           |              |              |
                           v              v              v
                    localStorage     PostgreSQL    Load History
                    (instant)     (async/bg)     (7-day chart)
                                         |
                                         v
                           /dashboard
                           Mental Load Gauge | Next Step | Top 3 Tasks
                           7-Day Sparkline   | Rationale | Carried-Over
                                         |
              +------------------+--------+-----------+
              |                  |                    |
              v                  v                    v
          /matrix             /decide              /goals
          2x2 Grid view       Weighted decision    Milestone roadmap
          Drag-drop tasks     matrix + AI rec      Week 1 actions
          Override AI         "Final call is       Add first step
          quadrants           yours."             to task queue
              |
              v
          /reflect  (Evening)
          Check off completed tasks
          Write journal entry
          AI -> Summary + Encouragement + Tomorrow focus
          [Push to Tomorrow] button
```

---

## `07` Flow of a User Query

> *Tracing one thought from keystroke to insight — the complete technical journey.*

```
EXAMPLE INPUT:
  "I need to finish the report by Friday, call my mom, prepare for
   the quarterly review, and I keep forgetting to exercise..."

STEP 1: CLIENT (brain-dump.tsx)
  onChange handler -> updates text state
  Character count updates in real-time
  User clicks "Analyze My Thoughts"
  Validation: length > 10 && length <= 8000
  setIsLoading(true) -> spinner renders
        |
        | HTTP POST (TanStack Server Function)
        v
STEP 2: SERVER FN - conductBrainDumpSession()
  File: src/lib/thinkmate.functions.ts
  Input: { brainDump, conversationHistory:[], action:'next_question', apiKey }
  Builds SYSTEM PROMPT (ThinkMate persona + rules)
  Builds USER MESSAGE (dump + Q&A history)
  Decides: ask clarifying question OR finalize
        |
        | Calls callGateway()
        v
STEP 3: AI GATEWAY - callGateway()
  Cascading fallback waterfall:
  key.startsWith("sk-or-")  -->  OpenRouter  (Gemini 2.5 Flash)
          if fails:
  key.startsWith("gsk_")    -->  Groq        (Llama 3.3 70B)
          if fails:
  key.startsWith("AIzaSy")  -->  Direct Gemini API
          if fails:
  key.startsWith("AQ.")     -->  Lovable Gateway
          all fail:
  throw Error(all error messages)
  SUCCESS -> Returns structured JSON (tool call arguments)
        |
        v
STEP 4: AI MODEL PROCESSES (e.g., Gemini 2.5 Flash)
  Returns strict JSON:
  {
    tasks: [
      { title:"Finish quarterly report", quadrant:"do_now",
        priority:"high", estimatedMinutes:120, deadline:"Friday",
        rationale:"Hard deadline with high stakes impact" },
      { title:"Call mom", quadrant:"schedule", ... },
      { title:"Quarterly review prep", quadrant:"do_now", ... },
      { title:"Exercise routine", quadrant:"schedule", ... }
    ],
    mentalLoadScore: 68,
    riskLevel: "moderate",
    nextStep: {
      task: "Finish quarterly report",
      reason: "Hard Friday deadline with highest business impact",
      estimatedMinutes: 120
    },
    sessionSummary: "4 tasks across work and personal life...",
    classificationExplanations: { ... }
  }
        |
        v
STEP 5: SERVER RETURNS RESULT
  If 'next_question': return { question, quickOptions }
    -> Client renders wizard UI, user answers, cycle repeats
  If 'finalize': return full AkinatorResult -> proceed to Step 6
        |
        v
STEP 6: CLIENT - saveAnalysis() in thinkmate-store.ts
  (1) Write localStorage["thinkmate:state:v1"]    <- synchronous
  (2) Write localStorage["thinkmate-tasks"]        <- synchronous
  (3) Write localStorage["thinkmate-load-history"] <- synchronous
  (4) Fire CustomEvent("thinkmate:update")         <- cross-tab sync
  (5) saveSessionServer()   -> PostgreSQL brain_sessions  [async]
  (6) saveTasksServer()     -> PostgreSQL tasks           [async]
  (7) appendLoadHistoryServer() -> PostgreSQL load_history [async]
  Steps 5/6/7 are fire-and-forget (non-blocking)
        | navigate("/dashboard")
        v
STEP 7: DASHBOARD RENDERS
  Mental Load: 68/100  [MODERATE]
  Next Step: "Finish quarterly report" (est. 120 min)
  Top 3: Report | Review Prep | Call Mom
  Sparkline: last 7 days of load scores
  "Report classified as Do Now: hard Friday deadline..."

  Total time from keypress to rendered dashboard: ~2-4 seconds
```

---

## `08` AI Decision Engine — Deep Dive

### 8.1 The Core System Prompt

```
  You are ThinkMate AI -- a calm, focused personal thinking partner.
  Your job is not to impress users with everything you can do.
  Your job is to help them think clearly and take their most important next step.

  CORE BEHAVIOURS:
  1. Extract tasks. Identify deadlines. Spot dependencies.
     Classify each by urgency x importance (Eisenhower).
  2. Return STRICT JSON matching the schema. No prose outside JSON.
  3. Recommend exactly ONE next step. Justify in one sentence.
  4. Calculate Mental Load Score (0-100):
     - Task count:              30%
     - Urgent tasks:            40%
     - High-stakes decisions:   20%
     - Interdependencies:       10%
  5. Never list more than 3 priority tasks. Focus > completeness.
  6. Tone: calm, grounding, never catastrophising.
  7. If load > 75, suggest 1-2 tasks to postpone/delegate.
  8. Preserve human agency -- surface options, not mandates.
```

### 8.2 Mental Load Score Formula

```
  Score = (task_count_factor  x 0.30)
        + (urgent_task_factor x 0.40)
        + (decision_factor    x 0.20)
        + (dependency_factor  x 0.10)

  Risk Thresholds:
  +--------------+----------+--------------------------------------+
  |   Range      |  Level   |  Guidance                            |
  +--------------+----------+--------------------------------------+
  |   0  - 39   |  LOW     |  Manageable. Keep moving with intent |
  |   40 - 70   |  MODERATE|  Buffer time. Protect deep work.     |
  |   71 - 100  |  HIGH    |  Postpone or delegate non-essentials |
  +--------------+----------+--------------------------------------+
```

### 8.3 Eisenhower Matrix Classification Logic

```
                    HIGH IMPORTANCE
                          |
          +---------------+---------------+
          |               |               |
          |  [DO NOW]     |  [SCHEDULE]   |
          |  Urgent +     |  Important,   |
          |  Important    |  Not Urgent   |
          |               |               |
 LOW -----+---------------+---------------+----- HIGH URGENCY
          |               |               |
          |  [DELEGATE]   |  [IGNORE]     |
          |  Urgent,      |  Neither      |
          |  Not Imp.     |  Urgent nor   |
          |               |  Important    |
          +---------------+---------------+
                          |
                    LOW IMPORTANCE

  For each task, AI evaluates:
  (1) Urgency   -- Hard deadline? Someone waiting? Consequences today?
  (2) Importance -- Advances core goals? Lasting impact? Irreversible?
  (3) Dependencies -- Is another task blocking on this?
  (4) Writes a classificationExplanation (1-2 sentences) per task
```

### 8.4 Smart Next Step Selection

```
  Filter: quadrant == "do_now"
    -> Any found? YES: Filter priority == "high"
         -> Multiple? Pick lowest estimatedMinutes (momentum principle)
         -> One? That's the next step.
    -> None found? Fall to "schedule" quadrant

  Recommendation payload:
  {
    task:             "The action title",
    reason:           "One sentence justification",
    estimatedMinutes: 45
  }
```

### 8.5 Akinator Wizard Algorithm

```
  1. Read brain dump + prior Q&A history
  2. Identify highest-uncertainty dimension:
     - Deadline pressure
     - Personal vs. professional split
     - Delegation availability
     - Energy level
     - Decision vs. task complexity
  3. Ask ONE targeted question (never multiple at once)
  4. Offer 2-4 quickOptions pill buttons for fast answers
  5. After >= 2 answered questions -> finalize analysis
  6. Max 5 rounds -> always finalize
  7. User can click 'Skip to instant analysis' at any time
```

### 8.6 Decision Framework Weighted Matrix

```
  Input: { decision, options:[A, B], userValues }

  AI auto-derives factors:
  +---------------------+--------+----------+----------+
  | Factor              | Weight | Option A | Option B |
  +---------------------+--------+----------+----------+
  | Financial stability |   8    |   7      |   5      |
  | Career growth       |   9    |   6      |   8      |
  | Work-life balance   |   7    |   8      |   4      |
  | Learning potential  |   6    |   5      |   9      |
  +---------------------+--------+----------+----------+
  | TOTAL SCORE         |   -    |  186     |  198     |
  +---------------------+--------+----------+----------+

  Footer always appended: "Final decision is yours."
```

---

## `09` Component-by-Component Breakdown

### `thinkmate.functions.ts` — The AI Engine

| Function | Signature | Returns |
|---|---|---|
| `conductBrainDumpSession` | `(brainDump, history, action, apiKey)` | `{ question, quickOptions }` OR full `AkinatorResult` |
| `analyzeBrainDump` | `(brainDump, apiKey)` | Full analysis in one round-trip (legacy) |
| `analyzeDecision` | `(description, options, values, apiKey)` | Weighted comparison matrix + recommendation |
| `generateReflection` | `(completed, incomplete, journal, apiKey)` | Summary, encouragement, focus, carriedOver |
| `breakdownGoal` | `(goalText, apiKey)` | milestones[], week1Actions[], firstStep, duration |
| `callGateway` | `(messages, tool, apiKey)` | Parsed tool call arguments or structured JSON |

### `thinkmate-store.ts` — The State Layer

| Function | What it Does |
|---|---|
| `useThinkMate()` | Master React hook — returns state + all mutations |
| `saveAnalysis(result)` | Saves AI output to localStorage + fires async DB writes |
| `toggleTask(taskId)` | Flips completed boolean, syncs to DB |
| `moveTask(taskId, newQuadrant)` | Overrides AI quadrant assignment, syncs to DB |
| `addTask(task)` | Manually injects a task (used by Goals + Reflect) |
| `clearAll()` | Wipes all localStorage keys, resets state to initial |
| `initializeFromDB(userId)` | On login: pulls tasks + history from PostgreSQL, hydrates localStorage |

### `db.server.ts` — PostgreSQL Operations

| Function | Operation | Table |
|---|---|---|
| `saveSessionServer` | INSERT brain session | `brain_sessions` |
| `saveTasksServer` | Bulk UPSERT tasks | `tasks` |
| `updateTaskServer` | PATCH task fields | `tasks` |
| `getUserTasksServer` | SELECT all user tasks | `tasks` |
| `appendLoadHistoryServer` | INSERT daily load entry | `load_history` |
| `getLoadHistoryServer` | SELECT last N load entries | `load_history` |
| `saveReflectionServer` | INSERT reflection | `reflections` |
| `getReflectionsServer` | SELECT reflections | `reflections` |
| `saveGoalServer` | INSERT goal result | `goals` |
| `getGoalsServer` | SELECT goals | `goals` |
| `saveDecisionServer` | INSERT decision result | `decisions` |
| `getDecisionsServer` | SELECT decisions | `decisions` |
| `signUpUserServer` | INSERT user + hash password + create session | `users`, `sessions` |
| `signInUserServer` | Verify bcrypt hash + create session token | `users`, `sessions` |
| `signOutUserServer` | Invalidate session token | `sessions` |

### UI Components

| Component | File | Purpose |
|---|---|---|
| `AppShell` | `AppShell.tsx` | Navigation bar, user avatar, hamburger menu, layout wrapper |
| `MentalLoadGauge` | `MentalLoadGauge.tsx` | SVG animated circular gauge (0–100), color-coded risk |
| `AuthGuard` | `AuthGuard.tsx` | HOC: renders children if authenticated, redirects if not |

---

## `10` Data Flow & State Management

### localStorage Keys Reference

| Key | Contents |
|---|---|
| `thinkmate:state:v1` | Full ThinkMateState object (tasks, score, nextStep) |
| `thinkmate-tasks` | Task array (mirror) |
| `thinkmate-analysis` | Full analysis result (mirror) |
| `thinkmate-load-history` | Last 7 `{date, score, risk_level}` entries |
| `thinkmate-session-context` | Session summary + classification reasons |
| `thinkmate-reflections` | Array of evening reflection results |
| `thinkmate-goals` | Array of goal breakdown results |
| `thinkmate-session-token` | Auth session token (opaque string) |
| `thinkmate-user-id` | Authenticated user UUID |
| `thinkmate-display-name` | User's display name |
| `thinkmate-demo-mode` | `"true"` when in demo mode (skips DB writes) |
| `thinkmate-explain-expanded` | UI state for rationale panel (open/closed) |

### Cross-Tab Sync

```
  Tab A writes to localStorage
        |-> fires CustomEvent("thinkmate:update")
        Tab B listens via window.addEventListener("storage")
        Tab B rehydrates state from localStorage
```

---

## `11` Authentication & Security

```
  Auth Provider:     Self-hosted (no Supabase/Firebase)
  Password Hashing:  bcrypt (server-side only in db.server.ts)
  Session Tokens:    Opaque random strings stored in DB
  Token Storage:     localStorage (client-side)
  Credential Leak:   IMPOSSIBLE -- DB ops only in db.server.ts
  Demo Mode:         Bypasses auth + all DB writes silently

  Every server function call:
  1. Reads token from localStorage
  2. Validates token against DB sessions table
  3. Rejects if expired or not found
  4. Proceeds with operation only if valid

  AuthGuard HOC:
  - Wraps all protected routes
  - Checks isAuthenticated on render
  - Redirects to /login if token missing/invalid
  - Demo mode bypasses guard entirely
```

---

## `12` AI Provider Architecture — The Fallback Waterfall

```
  callGateway(messages, tool, apiKey)
         |
  key.startsWith("sk-or-")  --> OpenRouter API
    POST /v1/chat/completions
    model: google/gemini-2.5-flash
    SUCCESS -> parse tool call -> return
    FAIL    -> log error, try next
         |
  key.startsWith("gsk_")    --> Groq API
    POST /openai/v1/chat/completions
    model: llama-3.3-70b-versatile
    SUCCESS -> parse tool call -> return
    FAIL    -> log error, try next
         |
  key.startsWith("AIzaSy")  --> Direct Gemini API
    POST /v1beta/models/gemini-2.5-flash:generateContent
    uses responseSchema (structured output)
    SUCCESS -> parse JSON text -> return
    FAIL    -> log error, try next
         |
  key.startsWith("AQ.")     --> Lovable Gateway
    model: google/gemini-2.5-flash
    SUCCESS -> parse tool call -> return
    FAIL    -> log error
         |
  ALL FAILED -> throw Error([all error messages combined])
```

**Environment Variables:**

```env
GEMINI_API_KEY=AIzaSy...         # Direct Google Gemini
GEMINI_API_KEY=sk-or-...         # Via OpenRouter
GEMINI_API_KEY=gsk_...           # Via Groq (Llama 3.3)
LOVABLE_API_KEY=AQ....           # Via Lovable Gateway
DATABASE_URL=postgresql://user:pass@host:5432/dbname  # Optional
```

---

## `13` Database Layer

### Full Schema

```sql
-- users
id            UUID         PRIMARY KEY
email         TEXT         UNIQUE NOT NULL
password_hash TEXT         NOT NULL
display_name  TEXT
created_at    TIMESTAMP    DEFAULT NOW()

-- sessions (auth tokens)
id            UUID         PRIMARY KEY
user_id       UUID         REFERENCES users
token         TEXT         UNIQUE NOT NULL
created_at    TIMESTAMP
expires_at    TIMESTAMP

-- brain_sessions
id                          UUID    PRIMARY KEY
user_id                     UUID    REFERENCES users
brain_dump_text             TEXT
conversation_history        JSONB
analysis                    JSONB
session_summary             TEXT
classification_explanations JSONB
created_at                  TIMESTAMP

-- tasks
id                UUID    PRIMARY KEY
user_id           UUID    REFERENCES users
session_id        UUID    REFERENCES brain_sessions
title             TEXT
priority          ENUM('high','medium','low')
quadrant          ENUM('do_now','schedule','delegate','ignore')
completed         BOOLEAN DEFAULT FALSE
estimated_minutes INT
deadline          TEXT
dependencies      JSONB
rationale         TEXT
carried_over_from DATE
created_at        TIMESTAMP

-- load_history
id          UUID  PRIMARY KEY
user_id     UUID  REFERENCES users
score       INT
risk_level  ENUM('low','moderate','high')
recorded_at TIMESTAMP DEFAULT NOW()

-- reflections
id               UUID  PRIMARY KEY
user_id          UUID  REFERENCES users
completed_tasks  JSONB
incomplete_tasks JSONB
free_text        TEXT
summary          TEXT
carried_over     JSONB
tomorrow_focus   TEXT
encouragement    TEXT
created_at       TIMESTAMP

-- goals
id          UUID  PRIMARY KEY
user_id     UUID  REFERENCES users
goal_text   TEXT
timeline    TEXT
result      JSONB  -- milestones, week1Actions, firstStep
created_at  TIMESTAMP

-- decisions
id               UUID  PRIMARY KEY
user_id          UUID  REFERENCES users
decision_prompt  TEXT
result           JSONB  -- factors, scores, recommendation
created_at       TIMESTAMP
```

---

## `14` File Structure Reference

```
mind-free-ai/
|
+-- src/
|   +-- start.ts                      <- App entry point (Nitro SSR bootstrap)
|   +-- router.tsx                    <- TanStack Router configuration
|   +-- styles.css                    <- Global CSS + design tokens
|   |
|   +-- routes/
|   |   +-- __root.tsx                <- Root layout + AppShell init + DB hydration
|   |   +-- index.tsx                 <- Landing page (/)
|   |   +-- brain-dump.tsx            <- Brain dump + Akinator wizard (/brain-dump)
|   |   +-- dashboard.tsx             <- Main dashboard (/dashboard)
|   |   +-- matrix.tsx                <- Eisenhower matrix view (/matrix)
|   |   +-- decide.tsx                <- Decision framework tool (/decide)
|   |   +-- reflect.tsx               <- Evening reflection (/reflect)
|   |   +-- goals.tsx                 <- Goal breakdown (/goals)
|   |   +-- login.tsx                 <- Login page (/login)
|   |   +-- signup.tsx                <- Sign-up page (/signup)
|   |
|   +-- components/
|   |   +-- AppShell.tsx              <- Navigation + layout shell
|   |   +-- AuthGuard.tsx             <- Route protection HOC
|   |   +-- MentalLoadGauge.tsx       <- SVG animated circular gauge
|   |   +-- ui/                       <- Radix UI / shadcn components
|   |
|   +-- hooks/
|   |   +-- use-mobile.tsx            <- Responsive breakpoint hook
|   |
|   +-- lib/
|       +-- thinkmate.functions.ts    <- [*] All AI server functions (core engine)
|       +-- thinkmate-store.ts        <- [*] Client state hook + DB initialization
|       +-- auth.ts                   <- useAuth hook + session management
|       +-- db.ts                     <- Client-side DB bridge (wraps server fns)
|       +-- db.server.ts              <- [*] Server-only PostgreSQL operations
|       +-- config.server.ts          <- Server config (env vars reader)
|       +-- utils.ts                  <- cn() class utility
|       +-- error-capture.ts          <- Error boundary utilities
|       +-- error-page.ts             <- Error page helper
|       +-- lovable-error-reporting.ts
|
+-- public/                           <- Static assets
+-- .env                              <- API keys (never committed)
+-- vite.config.ts                   <- Vite + TanStack plugin config
+-- package.json
+-- tsconfig.json
+-- bunfig.toml                      <- Bun configuration
+-- components.json                  <- shadcn/ui config
+-- start.bat                        <- Smart launcher (auto-detects pkg manager)
+-- run.bat                          <- Simple launcher script

  [*] = Core files you'll spend most time in
```

---

## `15` Running the Project

### Prerequisites

```
  Node.js 18+  OR  Bun 1.0+
  API key for at least ONE of:
    - Google Gemini (AIzaSy...)
    - OpenRouter   (sk-or-...)
    - Groq         (gsk_...)
    - Lovable      (AQ....)
  PostgreSQL (optional -- app works without it via demo mode)
```

### Environment Setup

```env
# Create mind-free-ai/.env with ONE of:
GEMINI_API_KEY=AIzaSy...          # Direct Google Gemini
GEMINI_API_KEY=sk-or-...          # OpenRouter -> Gemini
GEMINI_API_KEY=gsk_...            # Groq -> Llama 3.3
LOVABLE_API_KEY=AQ....            # Lovable Gateway

# Optional persistent storage:
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

### Launch

```bash
# npm
npm run dev

# Bun
bun run dev

# Windows launchers (auto-detect package manager)
start.bat
run.bat
```

> **App runs at:** `http://localhost:8080`

### Demo Mode

No database? No problem. Click **"See a Live Demo"** on the landing page.
All AI calls still work normally. All data stored in localStorage only. DB writes are silently skipped.

### Production Build

```bash
npm run build
npm run preview
```

---

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                      ║
║    ███████╗██║  ██╗██║███╗   ██╗██║  ██╗███╗   ███╗ █████╗       ║
║       ██║   ██║  ██║██║████╗  ██║██║ ██╔╝████╗ ████║██╔══██╗      ║
║       ██║   ███████║██║██╔██╗ ██║█████╔╝ ██╔████╔██║███████║      ║
║       ██║   ██╔══██║██║██║╚██╗██║██╔═██╗ ██║╚██╔╝██║██╔══██║      ║
║       ██║   ██║  ██║██║██║ ╚████║██║  ██╗██║ ╚═╝ ██║██║  ██║      ║
║       ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝      ║
║                                                                      ║
║              ⚡  Think less. Do more. Live fully.  ⚡                ║
║                                                                      ║
║          Documentation by  K A B I T H A D E V I R P                ║
║          USAII Global Hackathon 2026 · Productivity Track            ║
║          Last Updated: June 2026                                     ║
║                                                                      ║
╚═══════════════════════════════════════════════════════════════════╝
```

*Documentation generated from source code analysis of the `mind-free-ai` codebase.*
*Last updated: June 2026*


---

## `16` Planned Enhancements — Hackathon Build Roadmap

> *High-impact, low-effort features that push ThinkMate from great to exceptional.*

---

### 🥇 Enhancement 1 — Cognitive Overload Index (COI)

**Build effort: ~2 hours — Reframing of the existing Mental Load Score.**

Rename the Mental Load Score to the **Cognitive Overload Index** and expand it with two new input signals:

- **Context switching count** — how many different life domains appear in the dump (work, personal, financial, health)
- **Decision count** — how many items in the dump are decisions vs. tasks

The updated 5-dimension formula:

```
COI FRAMEWORK
┌─────────────────────────────────┬────────┐
│ Dimension                       │ Weight │
├─────────────────────────────────┼────────┤
│ Active task volume              │  25%   │
│ Deadline pressure (urgency)     │  30%   │
│ Dependency complexity           │  15%   │
│ Decision count                  │  20%   │
│ Context switching (domain mix)  │  10%   │
└─────────────────────────────────┴────────┘

COI Zones:
🟢  0–39   GREEN ZONE   — Focused execution mode
🟡  40–70  YELLOW ZONE  — Buffer and protect deep work
🔴  71–100 RED ZONE     — Delegate, defer, or decompress
```

> *"COI is not a to-do counter. It's a cognitive health vital sign."*

**Files to update:**
- `thinkmate.functions.ts` — expand AI prompt to return `contextSwitchCount` + `decisionCount`
- `thinkmate-store.ts` — update state schema
- `dashboard.tsx` — replace "Mental Load Score" label with "COI" + add methodology tooltip card
- `MentalLoadGauge.tsx` — update zone labels to GREEN / YELLOW / RED ZONE

---

### 🥈 Enhancement 2 — Bottleneck & Hidden Dependency Detection

**Build effort: ~4–6 hours — AI prompt upgrade only, zero new routes.**

Upgrade the brain dump analysis prompt to also return a `bottlenecks` field. The AI identifies tasks that block 3+ downstream items and infers hidden dependencies the user didn't explicitly state.

**Prompt addition for `conductBrainDumpSession`:**

```
Additionally, identify BOTTLENECKS -- tasks that are blocking
3 or more downstream tasks. For each bottleneck, return:
  - blockingTask   : the task causing the jam
  - blockedTasks[] : list of tasks it blocks
  - action         : "escalate" | "delegate" | "do_first"

Also detect HIDDEN DEPENDENCIES the user didn't explicitly state.
Example: if user mentions "submit internship application" and
"update resume" as separate tasks, infer resume blocks application.
Return as: hiddenDependencies[{ prerequisite, dependent }]
```

**New dashboard card (example output):**

```
⚠️  BOTTLENECK DETECTED
"Manager approval" is blocking 3 downstream tasks:
  → Finalize project report
  → Submit to client
  → Schedule review meeting

Recommendation: Escalate TODAY before 2 PM.
Estimated unblock impact: Frees 4.5 hours of blocked work.

🔗 Hidden Dependency Discovered:
"Update resume" must precede "Apply to internship"
(these were listed as independent tasks)
```

**Files to update:**
- `thinkmate.functions.ts` — expand `AkinatorResult` schema + prompt
- `thinkmate-store.ts` — add `bottlenecks[]` + `hiddenDependencies[]` to state
- `dashboard.tsx` — add Bottleneck card below Smart Next Step card

---

### 🥉 Enhancement 3 — Productivity Framework Intelligence Layer

**Build effort: ~3–4 hours — Prompt upgrade + one UI label on dashboard.**

Instead of always applying the Eisenhower Matrix, ThinkMate detects which framework best fits the user's situation and applies it automatically. Add a `frameworkUsed` field to the analysis output.

**Framework Selection Logic (AI-driven):**

```
IF dump contains mostly urgent tasks with hard deadlines
  → EISENHOWER MATRIX (urgency × importance)

IF dump contains a major life/career decision
  → WEIGHTED DECISION MATRIX (routes to /decide)

IF dump contains a long-term goal with no clear steps
  → OKR DECOMPOSITION (routes to /goals)

IF dump contains >8 tasks with unclear priority
  → ABCDE METHOD (A=must, B=should, C=nice, D=delegate, E=eliminate)

IF dump signals cognitive overload (COI > 70)
  → MIT METHOD (Most Important Task -- surface only 3 for the day)

IF dump mentions emotional weight or anxiety
  → MIND SWEEP + GTD CAPTURE (clear mental RAM first)
```

**Dashboard display:**

```
Framework applied today: Eisenhower Matrix + MIT Method
Why: High urgency load detected with decision fatigue signals.
```

**Files to update:**
- `thinkmate.functions.ts` — add `frameworkUsed` + `frameworkReason` to prompt schema
- `thinkmate-store.ts` — add fields to state
- `dashboard.tsx` — add framework badge/label

---

### 📊 Enhancement 4 — Explainable AI Card

**Build effort: ~1 hour — UI-only, no backend changes needed.**

Add a small expandable **"Why this task?"** card on the Dashboard that surfaces the scoring breakdown behind the Smart Next Step recommendation. Uses the existing `rationale` and `classificationExplanations` fields already in the DB.

**Card layout:**

```
Why AI chose: "Finish quarterly report"

┌──────────────────────────────────────┬───────┐
│ Factor                               │ Score │
├──────────────────────────────────────┼───────┤
│ Deadline impact (Friday)             │  40%  │
│ Blocks 3 downstream tasks            │  30%  │
│ Aligns with your stated goal         │  20%  │
│ Estimated effort: short (25 min)     │  10%  │
└──────────────────────────────────────┴───────┘

"AI chose this because starting it TODAY prevents a cascade failure."
```

**Files to update:**
- `dashboard.tsx` — add expandable "Why this task?" card under Smart Next Step
  (data already available via `state.analysis.classificationExplanations`)

---

### 🎯 Enhancement Summary

```
  WHAT TO BUILD:                     WHAT TO SKIP:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ COI rename + 5-dim formula     ❌ Focus Timer
  ✅ Bottleneck detection           ❌ Weekly PDF Report
  ✅ Framework intelligence layer   ❌ Morning Notification
  ✅ Explainable AI card            ❌ Team Mode
  ✅ Polish existing UX             ❌ Cognitive Twin
                                     ❌ Pattern Profiler

  Total estimated build: ~13 hours of focused work
```

### 🎤 Pitch Narrative

```
  THE PROBLEM
  Productivity apps add tools. Cognitive load adds up.
  Nobody solves the root cause.

  THE INSIGHT
  The bottleneck isn't effort.
  It's knowing what to do first, right now,
  given your actual mental state.

  THE INNOVATION
  ① Cognitive Overload Index — a cognitive health vital sign
  ② Hidden dependency detection — only AI can do this reliably
  ③ Multi-framework intelligence — picks the right mental model
     for YOUR specific situation, automatically

  THE PROOF (live demo)
  → Paste a messy brain dump
  → Watch COI calculate across 5 dimensions
  → Watch bottleneck surface automatically
  → Watch ONE next step emerge with full rationale

  THE PHILOSOPHY
  "AI recommends. Humans decide. Always."
```
