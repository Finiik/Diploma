# 🔬 SciLearn — Recommendation System for Natural Science Students

> **Diploma Project** — A web-based intelligent recommendation platform for Physics, Chemistry, and Biology students featuring an interactive formula database, AI-powered assistant, and collaborative filtering engine.

[![Built with React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9_strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Vitest-143_passing-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11.x-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-3.1_Flash--Lite-4285F4?logo=google)](https://ai.google.dev/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture) · [full architecture doc](docs/ARCHITECTURE.md)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Testing](#-testing)
- [Content Database](#-content-database)
- [AI Assistant](#-ai-assistant)
- [Autonomous Course Evolution (Roadmap)](#-autonomous-course-evolution-roadmap)
- [Recommendation Engine](#-recommendation-engine)
- [Localization](#-localization)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## 🎯 Overview

**SciLearn** is a modern single-page application designed to support university and high-school students in learning natural sciences. The platform combines an extensive formula database with interactive calculators, theoretical materials, problem-solving examples, and personalized recommendations — all wrapped in a premium, responsive UI with bilingual support (Ukrainian/English).

The platform's unique differentiator is a **Gemini-powered AI assistant** that answers questions using the platform's own knowledge base, providing contextual, accurate responses with direct navigation links to relevant formulas and articles.

### 🏗️ Built For

- 🎓 University students studying natural sciences
- 📚 High-school students preparing for exams
- 👨‍🏫 Teachers looking for a structured formula reference

---

## ✨ Key Features

### 📐 Interactive Formula Database
- **78 formulas** across Physics (30), Chemistry (25), and Biology (23)
- Each formula includes LaTeX rendering, variable descriptions with units, and a **real-time calculator**
- Organized hierarchically: Subject → Topic → Subtopic → Formulas
- Cross-linked with related/derived formulas for navigation

### 🤖 AI Assistant (Gemini-Powered)
- Floating chatbot available on **every page**
- Powered by **Google Gemini 3.1 Flash-Lite** API with full platform knowledge
- Smart local fallback with intent detection and fuzzy search
- Bilingual — responds in Ukrainian or English based on current language
- Provides formula details, theory excerpts, and problem solutions
- Direct navigation links to relevant platform content
- **Auto-derived knowledge graph (graph/keyword RAG)** — concepts are not hardcoded; the platform's own topics/subtopics are the concepts and the data's own cross-links are the edges. The AI explains a concept by *synthesizing the course materials it actually connects to*, grounded in what the platform teaches — no hand-written definitions to maintain. Works in both the Gemini and offline-synthesis paths

### 📊 Personalized Recommendations
- **Collaborative filtering** engine using cosine similarity
- Tracks user interactions (views, calculations, bookmarks)
- Pre-seeded with demo users for immediate recommendations
- Firebase Firestore sync for multi-device persistence

### 📖 Theory & Problems
- **15 theory articles** with difficulty badges (🟢 Beginner / 🟡 Intermediate / 🔴 Advanced)
- **25 step-by-step problem examples** with expandable solutions
- Filterable by subject and difficulty level
- Cross-referenced with relevant formulas

### 🔍 Fuzzy Search
- Powered by **Fuse.js** with weighted multi-field search
- Searches across formulas, theory, and problems simultaneously
- Real-time dropdown with type badges and subject colors

### 🌙 Theme & Localization
- **Dark/Light mode** with system preference detection
- **Ukrainian/English** bilingual interface (i18next)
- Persistent theme and language preferences (localStorage)

### ⭐ Bookmarks
- Save favorite formulas for quick access
- Synced via Firebase for authenticated users
- Local fallback for offline use

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Language** | TypeScript 5.9 (`strict`) | Static typing across the entire codebase |
| **Frontend** | React 19 | Component-based UI framework |
| **Build** | Vite 6 | Lightning-fast dev server & bundler |
| **Testing** | Vitest 4 + jsdom | Characterization + unit suite (143 tests) for the core logic |
| **Routing** | React Router DOM 7 | Client-side SPA navigation |
| **Math** | KaTeX 0.16 | LaTeX formula rendering |
| **Search** | Fuse.js 7 | Client-side fuzzy search |
| **AI** | Google Gemini 3.1 Flash-Lite | Intelligent chatbot responses |
| **i18n** | i18next + react-i18next | Bilingual support (UA/EN) |
| **Backend** | Firebase 11 | Auth, Firestore, Hosting |
| **Styling** | CSS Custom Properties | Theme-aware design system |

### Design Decisions
- **Strict TypeScript, zero `any`** — the whole codebase compiles under `tsconfig` `strict: true` with no `any` and no `@ts-ignore`/`@ts-expect-error` in source; the domain model is split per bounded context under `src/shared/types/` (`content` / `graph` / `search` / `recommendations`) behind a thin `domain.ts` barrel, while the assistant responder-chain contract is feature-owned in `src/features/assistant/types.ts`
- **SOLID, single-responsibility modules** — each module has one reason to change: data fetching, transformation and presentation are separated; type dispatch uses exhaustive lookup/strategy maps (not `if`/`switch` ladders); service boundaries (Gemini transport, bookmark/interaction/search corpus sources) sit behind injectable interfaces
- **Behavior pinned by tests** — a 143-test Vitest suite (characterization + unit) locks the *observed* behavior of the algorithmic core, so refactors cannot silently change results (see [Testing](#-testing))
- **No CSS framework** — Custom design system with CSS custom properties for full control
- **No external AI dependency** — Smart local fallback ensures the AI assistant works even without API
- **Auto-derived concept graph (graph/keyword RAG)** — no hardcoded concept table; concepts/edges are computed from the course data itself, and the AI explains by synthesizing the connected materials. Covering a new topic in any subject is a pure content change, no engine code
- **Code splitting** — 5 manual vendor chunks (React, Firebase, KaTeX, i18n, Fuse.js); app code + data in the main `index` chunk; Firestore lazy-loaded via dynamic `import()`
- **Firebase resilience** — App functions fully offline; cloud features are optional enhancements

---

## 🏛️ Architecture

The frontend uses a **feature-sliced, layered modular architecture**. `src/`
is split into three layers with a strict downward dependency rule —
`app/` → `features/` → `shared/` — and each feature exposes a single public
`index.ts` barrel. The full rationale (layering rules, the cycle-breaking
decisions, the public-API convention, testing strategy and migration
provenance) is documented in **[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)**.

The runtime composition is:

```
┌──────────────────────────────────────────────────────────┐
│                     Browser (SPA)                         │
├──────────────────────────────────────────────────────────┤
│  BrowserRouter                                            │
│  ├── ErrorBoundary                                        │
│  │   └── Layout (Header + Footer + scroll-to-top)        │
│  │       ├── Home (Hero + Subjects + Recommendations)     │
│  │       ├── Subject/:id (Topics → Formulas grid)         │
│  │       ├── FormulaDetail/:id (KaTeX + Calculator)       │
│  │       ├── Theory (Articles + Difficulty filters)       │
│  │       ├── Problems (Step-by-step + Difficulty filters) │
│  │       └── Bookmarks (Saved formulas)                   │
│  └── AIAssistant (Global floating chatbot)                │
├──────────────────────────────────────────────────────────┤
│  Context Providers                                        │
│  ├── ThemeContext (light/dark mode persistence)            │
│  ├── AuthContext (Firebase anonymous auth)                 │
│  └── BookmarkContext (saved formula state)                 │
├──────────────────────────────────────────────────────────┤
│  Services (TypeScript)                                    │
│  ├── recommendations.ts (CF pipeline; math in lib/)       │
│  ├── search.ts (SearchIndex + swappable corpus sources)   │
│  ├── bookmarks.ts (local cache + Firestore sync, typed)   │
│  ├── assistantEngine.ts (entry → responder chain)         │
│  └── assistant/* (responders, RAG graph, Gemini 3)        │
├──────────────────────────────────────────────────────────┤
│  Domain Types — src/shared/types/* (per context)          │
│  ├── content.ts  Formula / Topic / SubjectData / …        │
│  ├── graph.ts    GraphItem / Concept / CourseGraph        │
│  ├── search.ts   SearchHit                                │
│  ├── recommendations.ts  Interaction / Recommendation     │
│  └── domain.ts   thin barrel (assistant types live in     │
│                  features/assistant/types.ts)             │
├──────────────────────────────────────────────────────────┤
│  Data Layer (Static TS modules, typed via domain model)   │
│  ├── features/formulas/data/physics.ts   — 30 formulas    │
│  ├── features/formulas/data/chemistry.ts — 25 formulas    │
│  ├── features/formulas/data/biology.ts   — 23 formulas    │
│  ├── features/theory/data/theory.ts      — 15 articles    │
│  └── features/problems/data/problems.ts  — 25 problems    │
├──────────────────────────────────────────────────────────┤
│  External Services                                        │
│  ├── Google Gemini API (AI chatbot)                       │
│  └── Firebase (Auth, Firestore, Hosting)                  │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
SciLearn/
├── public/
│   └── favicon.svg                  # App favicon
├── index.html                       # Entry HTML with SEO meta tags
├── firebase.json                    # Firebase Hosting configuration
├── firestore.rules                  # Firestore security rules
├── .firebaserc                      # Firebase project alias
├── .env                             # Environment variables (API keys)
├── vite.config.js                   # Vite build + Vitest (jsdom) config
├── tsconfig.json                    # TypeScript config (strict: true)
├── deploy.bat                       # One-click deployment script
├── PROJECT_DOCUMENTATION.md         # Detailed technical documentation
├── README.md                        # This file
│
└── src/                            # Feature-sliced, 3-layer architecture
    │                               # (see docs/ARCHITECTURE.md)
    ├── vite-env.d.ts               # Vite/import.meta.env ambient types
    │
    ├── app/                         # ▸ Composition root
    │   ├── App.tsx                  #   route table
    │   ├── main.tsx                 #   entry — mounts the provider tree
    │   ├── components/
    │   │   ├── Layout/              #   shell: header + outlet + AIAssistant
    │   │   └── Header/              #   nav bar + mobile menu
    │   └── styles/                  #   global.css, variables.css (tokens)
    │
    ├── features/                    # ▸ Vertical slices (each has index.ts barrel)
    │   ├── formulas/                #   data (phys/chem/bio) + catalog lib +
    │   │                            #   FormulaCard + Subject/FormulaDetail pages
    │   ├── calculator/              #   pure calc lib + useCalculator + UI
    │   ├── recommendations/         #   collaborative filtering + Home page
    │   ├── theory/                  #   theory dataset + Theory page
    │   ├── problems/                #   problems dataset + Problems page
    │   ├── bookmarks/               #   Bookmarks page (state → shared/bookmarks)
    │   ├── search/                  #   Fuse.js service + SearchBar
    │   ├── assistant/               #   🤖 AIAssistant UI + chat hooks +
    │   │                            #   assistantEngine + services/assistant/*
    │   └── theme/                   #   ThemeContext + persistence service
    │
    └── shared/                      # ▸ Horizontal foundation (imports only shared)
        ├── types/                   #   🧩 domain model, split per context:
        │                            #   content · graph · search ·
        │                            #   recommendations + domain.ts barrel
        ├── lib/                     #   pure utils: env, pickLang, katex,
        │                            #   navigation, subjectIcon, mergeById (+ tests)
        ├── hooks/                   #   generic hooks (useLocalized, …)
        ├── ui/                      #   Latex, Breadcrumb, LoadingSkeleton,
        │                            #   FilterBar, Markdown, ErrorBoundary
        ├── i18n/                    #   i18next config + uk/en locales
        ├── firebase/                #   config + firestore helpers (infra)
        ├── auth/                    #   AuthContext + useFirebaseAuthState hook
        └── bookmarks/               #   BookmarkContext + typed local/remote stores
```

> **Tests** are co-located with the unit they pin —
> `src/features/*/__tests__/` and `src/shared/lib/__tests__/` — 143 Vitest
> characterization + unit tests in total. See
> [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the layering rules,
> the public-API convention, and the rationale behind placing cross-cutting
> state (`auth`, `bookmarks`) in `shared/`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Google Gemini API key** (free at [ai.google.dev](https://ai.google.dev/)) — optional, for AI assistant
- **Firebase project** (free at [firebase.google.com](https://firebase.google.com/)) — optional, for cloud features

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/scilearn.git
cd scilearn

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and add your API keys (see below)

# 4. Start the development server
npm run dev

# 5. Open in browser
# → http://localhost:5173/
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Firebase (optional — app works without it)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000:web:000000

# Gemini AI (optional — local fallback works without it)
VITE_GEMINI_API_KEY=your_gemini_api_key
# Optional model overrides (no code change needed):
VITE_GEMINI_MODEL=gemini-3.1-flash-lite
VITE_GEMINI_THINKING=low          # minimal | low | medium | high
```

> **Note:** The app works fully without any API keys. Firebase enables cloud bookmarks and multi-device recommendations. Gemini enables AI-powered chatbot responses (falls back to smart local search otherwise).

---

## 🧪 Testing

The algorithmic core is covered by a **Vitest suite** — 143 characterization + unit tests that pin the *current, observed* behavior of the non-UI logic so refactors (the JS → TS migration and the later SOLID hardening pass) cannot silently change results.

```bash
npm test            # run the suite once (143 tests)
npm run test:watch  # watch mode
npm run typecheck   # tsc --noEmit (strict, must report 0 errors)
```

Suites are co-located with the unit they pin (`src/features/*/__tests__/`, `src/shared/lib/__tests__/`):

| Suite | Pins |
|---|---|
| `assistant/text.test.ts` | Levenshtein / similarity, normalization, intent & concept extraction |
| `assistant/intents.test.ts` | Regex intent detectors |
| `assistant/courseGraph.test.ts` | Auto-derived graph structure, concept match, related-item resolution |
| `assistant/context.test.ts` | Nav-link merge/dedup, RAG context block |
| `assistant/markdown.test.ts` | Inline-markdown → HTML boundary |
| `assistant/assistantEngine.test.ts` | Full responder chain end-to-end |
| `search/search.test.ts` | Fuse.js hits, scoring shape, index rebuild |
| `recommendations/recommendations.test.ts` | Cold-start popularity order + collaborative-filtering path |
| `recommendations/similarity.test.ts` | Pure CF helpers (similar-user search, neighbour scoring, popularity) |
| `formulas/formulas.test.ts` | Cross-subject catalog aggregation & lookups |
| `calculator/calculator.test.ts` | Pure calculator outcomes |
| `shared/lib/*.test.ts` | env, katex, navigation, pickLang, symbol-tex utilities |

Tests run in a `jsdom` environment (configured in `vite.config.js`) and deterministically force the offline paths: the assistant engine is exercised by **injecting a fake `GeminiTransport`** through its Dependency-Inversion seam (`processMessage(query, isUk, transport)`) rather than monkey-patching global `fetch`, and Firebase is gated off. The suite needs **no API keys and no network**. It is a behavioral contract: the TS migration and every SOLID refactor kept all 143 green at every commit, and `tsc --noEmit` reports zero errors under `strict: true`.

---

## 📚 Content Database

### Physics (30 formulas)

| Topic | Formulas |
|---|---|
| **Mechanics** | Newton's 2nd Law, Weight, Kinetic Energy, Work, Momentum |
| **Electricity** | Ohm's Law, Electric Power, Coulomb's Law |
| **Thermodynamics** | Heat Transfer, Ideal Gas Law |
| **Optics** | Snell's Law, Thin Lens, Magnification |
| **Waves** | Wave Speed, Period & Frequency, Pendulum Period |
| **Gravitation** | Universal Gravitation, Orbital Velocity, Escape Velocity |
| **Nuclear Physics** | E=mc², Radioactive Decay, Photon Energy |
| **Fluid Mechanics** | Bernoulli's Equation, Archimedes' Principle, Continuity Equation |
| **Electromagnetic Waves** | EM Wave Equation, Doppler Effect |
| **Rotational Mechanics** | Torque, Rotational Kinetic Energy |

### Chemistry (25 formulas)

| Topic | Formulas |
|---|---|
| **General Chemistry** | Ideal Gas, Molarity, Dilution, pH, Mass Fraction |
| **Chemical Reactions** | Reaction Rate, Equilibrium Constant, Arrhenius Equation |
| **Electrochemistry** | Faraday's Law, Nernst Equation |
| **Thermochemistry** | Enthalpy, Combustion Heat, Molar Mass |
| **Gas Laws** | Dalton's Law, Graham's Law |
| **Organic Chemistry** | Degree of Unsaturation, Mass Percent, Reaction Yield |
| **Colligative Properties** | Osmotic Pressure, Boiling Point Elevation, Freezing Point Depression |
| **Analytical Chemistry** | Henderson-Hasselbalch, Percent Composition, Titration, Solubility Product |

### Biology (23 formulas)

| Topic | Formulas |
|---|---|
| **Genetics** | Hardy-Weinberg Equation |
| **Ecology** | Population Growth, Biodiversity Index |
| **Biochemistry** | Michaelis-Menten Kinetics, BMI |
| **Cell Biology** | Osmotic Pressure, Dilution Plating |
| **Physiology** | Cardiac Output, Harris-Benedict BMR |
| **Mendelian Genetics** | Monohybrid Cross, Dihybrid Cross |
| **Metabolism** | Respiratory Quotient, Daily Caloric Expenditure, Water Balance |
| **Molecular Biology** | DNA Length, Protein Molecular Weight, Codon Count |
| **Epidemiology** | Basic Reproduction Number (R₀), Prevalence, Selection Coefficient, Doubling Time |

### Theory Articles (15)
5 per subject — ranging from 🟢 Beginner to 🔴 Advanced, covering Newton's Laws, Solutions, Hardy-Weinberg, Thermodynamics, Circuits, Kinetics, Acid-Base Theory, Ecology, Enzymes, Optics, Waves, Electrochemistry, Thermochemistry, Cell Biology, and Cardiovascular Physiology.

### Problem Examples (25)
With step-by-step solutions, star difficulty ratings (⭐ to ⭐⭐⭐), and links to related formulas.

---

## 🤖 AI Assistant

The AI assistant is a floating chatbot (bottom-right corner) that combines **Google Gemini 3.1 Flash-Lite** with an **auto-derived course knowledge graph** using a lightweight **graph/keyword RAG** (Retrieval-Augmented Generation) design, and degrades gracefully to an offline-synthesis fallback when the API is unavailable.

### Design Philosophy: No Hardcoded Concepts

Earlier iterations carried a hand-maintained concept dictionary — each concept (e.g. *Avogadro's constant*) had explicitly authored Ukrainian/English definition text. That does not scale: every new concept demanded fresh prose, the explanations could drift from the actual course content, and the AI that the platform already integrates was not being used for what it is good at.

The system now holds **zero hardcoded concept definitions**. Instead:

- **The course data *is* the knowledge base.** Every topic and subtopic the platform teaches is treated as a concept; the data's own cross-links (`derivedFormulas`, `relatedFormulas`, `relatedFormula`) are the relationship edges. Curating a concept means editing course content — never the engine.
- **The AI does the explaining.** Given the relevant slice of course materials as grounded context, Gemini synthesizes the explanation and connects the topics, instead of reciting a stored paragraph.

### Request Pipeline (Responder Chain)

`processMessage(query, isUk)` — the single entry point used by `AIAssistant.tsx` — is a **chain of responders**, not an `if`/`return` ladder. Each responder is `(query, isUk) => response | null`: return `null` to pass, return an object to answer and stop. First non-null wins; the terminal AI responder never returns `null`.

```
processMessage(query, isUk)
   │  empty query ──────────────► validation reply
   ▼
RESPONDERS  (assistant/responders.ts — ordered, first match wins)
   1. greeting      "привіт" / "hi"             → templated reply + chips
   2. help          capabilities intent         → what-I-can-do reply
   3. thanks        "дякую" / "thanks"          → acknowledgement
   4. list          "які формули" / "list"      → catalog (subject or all)
   5. pure-subject  bare "фізика" (<15 chars)   → subject overview + link
   6. ai            everything else (TERMINAL)  → graph/keyword RAG + Gemini,
                                                   else offline synthesis
   ▼
finalizeResponse()  ──────────► always { text, links[], suggestions[] }
```

Instant intents (1–5) stay zero-latency — no API call. `finalizeResponse()` centralizes the response contract so handlers declare only non-default fields. **Adding an intent = write a function and slot it into `RESPONDERS`**; the orchestrator never changes. The engine is split into one focused module each:

| Module (`src/features/assistant/services/assistant/`) | Responsibility |
|---|---|
| `../assistantEngine.ts` | thin entry: validate input → run the chain |
| `responders.ts` | the ordered chain wiring + terminal AI/fallback responder |
| `instantResponders.ts` | the five zero-latency intent responders (their content) |
| `intents.ts` | instant-intent detectors (regex) |
| `text.ts` | intent stripping, fuzzy/concept primitives (Levenshtein) |
| `courseGraph.ts` | auto-derived concept knowledge graph (built once) |
| `promptContext.ts` | static full-catalog summary for the prompt |
| `ragContext.ts` | per-query retrieval/RAG context serialization |
| `navLinks.ts` | item → navigation link chips |
| `geminiPrompt.ts` | system-prompt construction (prompt engineering) |
| `geminiClient.ts` | HTTP transport behind an injectable `GeminiTransport` |
| `gemini.ts` | orchestrator: build prompt → transport → extract text |
| `fallback.ts` | offline graph-synthesis answers |
| `subjects.ts` | formula catalogs, labels, localization |

### How It Works (Graph / Keyword RAG)

```
User Question
     │
     ▼
┌─ Instant intent? (greeting / help / thanks / list / pure subject) ── Yes ──► Templated reply + chips
│
No
│
▼
RETRIEVE  (graph / keyword)
├── Auto-derived course graph (built once from the data files):
│     • flat index of every formula / theory article / problem
│     • undirected edge set from derivedFormulas / relatedFormulas / relatedFormula
│     • concept index: every topic & subtopic name (UA + EN) → the items it owns
│     • per-subject topic → subtopic outline
├── matchConcept(): typo-/inflection-tolerant, whole-string match of the query
│   core against the concept index (exact key wins; else Levenshtein ≥ 0.84,
│   short queries only — so "сила тяжіння" isn't swallowed by the "Сила" topic)
└── resolveRelated(): the matched concept's items, expanded one hop along the
    edges, ordered theory → formula → problem, capped
     │
     ▼
AUGMENT + GENERATE
┌─ Gemini available? ── Yes ──► Prompt = COURSE TOPIC MAP + compact catalog +
│                                 CONNECTED PLATFORM MATERIALS block, with an
│                                 instruction to SYNTHESIZE those materials,
│                                 ground every claim in them, and connect the
│                                 topics. → AI answer + navigation links
No (or rate-limited)
│
▼
Offline synthesis fallback
├── Lead with the connected theory article's own content (already prose in
│   the data); if none, stitch a summary from the connected formulas
├── Append "🔗 connects to …" + sibling-topic follow-up chips
└── No hand-written prose anywhere — everything is synthesized from the data
```

### Gemini Client Configuration & Gemini 3 Gotchas

The chatbot calls the Gemini REST API directly via `fetch` — **no SDK**: it makes exactly one `generateContent` call, the app has no backend, and a native call keeps the client bundle lean (the SDK gives no security benefit since the key is client-side either way). Model: **`gemini-3.1-flash-lite`**. Moving to a Gemini 3 model is *not* just a string swap — these are the hard-won specifics, split across `gemini.ts` (orchestration), `geminiPrompt.ts` (prompt) and `geminiClient.ts` (transport + config) under `src/features/assistant/services/assistant/`:

| Setting | Value | Why it matters on Gemini 3 |
|---|---|---|
| `generationConfig.thinkingConfig.thinkingLevel` | `low` | Gemini 3 **reasons before answering**. `low` keeps the tutor fast/cheap while leaving enough budget for the synthesis task. Allowed: `minimal \| low \| medium \| high` |
| `temperature` / `topP` | **unset (default 1.0)** | Google *strongly* recommends **not** lowering temperature on Gemini 3 — it causes looping / degraded reasoning. The previous `0.7` was actively harmful here |
| `maxOutputTokens` | `2048` | Budget covers **thinking + answer**. The previous `600` could be spent entirely on thinking, returning an empty answer |
| Response parsing | filter `part.thought === true`, join remaining text parts | Gemini 3 returns **multi-part** responses; `parts[0].text` is no longer reliably the answer |
| Errors | diagnostic (`finishReason`, `blockReason`, HTTP status) | A quota `429` or token-starved `MAX_TOKENS` is now distinguishable in the console, not a silent generic "empty response" |

Both the model and thinking level are env-overridable with no code change: `VITE_GEMINI_MODEL`, `VITE_GEMINI_THINKING`.

> **Quota gotcha (read before blaming the code):** a `429` with `"limit: 0"` on `generate_content_free_tier_requests` is **not** rate-limiting — it means the API key's Google Cloud **project has no free-tier allowance** for that model (region- or billing-tier-related). Minting a new key on the *same project* changes nothing; enable billing on the project, or use a free-tier-eligible one. Whenever Gemini is unreachable for any reason, the assistant transparently serves the offline graph-synthesis fallback, so the UX never hard-fails.

### Why graph/keyword RAG (and not LangChain + a vector store)

This is genuine RAG — retrieval feeds grounded context into the model — but deliberately **without embeddings, a vector database, or LangChain**:

| Factor | Implication |
|---|---|
| **Corpus is small & fully structured** (~78 formulas, 15 theory, 25 problems) | The whole catalog already fits in Gemini's context window; semantic vector search would add latency, cost and a build step for negligible recall gain |
| **Data has explicit relationship edges** | Graph traversal over real edges is *more precise* than cosine similarity for "what connects to this concept" — vector RAG would be a downgrade in linking quality here |
| **App is browser-only** (client-side React + Vite, no backend) | A vector store / embedding pipeline would force a server or hosted vector DB — an architectural shift, not a library swap |
| **One model call, structured context** | LangChain's orchestration value (multi-tool agents, swappable retrievers) does not apply; it would be heavy dead weight |

Embedding-based semantic RAG is documented below as the deliberate scale-up path once the corpus grows large or free-text (see *Autonomous Course Evolution*).

### Features
- **Auto-derived graph** — concept index, edges and topic outline are computed once from the data files; adding coverage is a pure content change
- **Grounded generation** — Gemini receives the course topic map + the connected materials and is instructed to explain *only* from what the platform covers, not to pad with outside facts
- **Offline synthesis** — without Gemini, concept answers are stitched from the connected materials' own theory/formula text — never a hardcoded body
- **Typo/inflection tolerance** — whole-string Levenshtein matching resolves "стала Авагадро" → the right concept without hijacking specific lookups
- **Navigation links** — clickable buttons to the connected formulas, theory and problems
- **Bilingual** — retrieves and responds in the active interface language

---

## 🧭 Autonomous Course Evolution (Roadmap)

> **Status: planned — documented here for the thesis committee. Not yet implemented.**

The graph/keyword RAG design above makes the assistant honest about its own scope: it explains strictly from what the course actually teaches. That same property enables a self-improving loop, where the platform learns *what it is missing* from real student usage and proposes its own growth — shifting maintenance from manual authoring toward an autonomous, increasingly personalised system.

### 1. Coverage-gap detection

When answering, the model already knows the course's scope (the COURSE TOPIC MAP) and the connected materials it was given. The roadmap adds an explicit signal: when the retrieved materials are **insufficient to fully cover the asked concept** (a low grounding/confidence verdict from the model, plus a thin retrieval result), the turn is flagged as a *coverage gap* instead of silently answering from outside knowledge.

### 2. Structured improvement suggestion

A flagged gap produces a structured suggestion — not free text — capturing:

- the student's question and detected concept/topic,
- which existing materials were retrieved (and why they fell short),
- a concrete proposed addition: a new **formula**, **theory article**, or **problem**, drafted in the same schema the data files use,
- the subject/topic/subtopic it should slot into.

The suggestion is **emailed to the admin** and persisted to a Firestore `suggestions` collection (`status: new | accepted | rejected`, timestamps, frequency counter so repeatedly-requested gaps rank higher).

### 3. Admin curation dashboard

An admin-only view lists incoming suggestions, ranked by demand, with one-click **accept / edit / reject**. Accepting turns the drafted item into a real entry in the course data (review-gated — a human still approves what enters the curriculum).

### 4. Self-improving loop

```
Students ask  ──►  Gaps detected  ──►  Suggestions queued + emailed
     ▲                                          │
     │                                          ▼
Better, broader  ◄──  Course data grows  ◄──  Admin accepts (human-gated)
 grounding for          (new formulas /
 future answers          theory / problems)
```

As accepted suggestions enrich the data, retrieval gets richer, answers get better grounded, and the platform's interpretation of each subject becomes more complete and more personalised to what its students actually ask — with steadily less manual input required.

### Architecture note: when embedding-RAG becomes the right call

The current graph/keyword retrieval is optimal for today's small, structured corpus. Once this loop accumulates a large and increasingly free-text body of user-driven content, semantic recall starts to matter more than structural precision. **That is the deliberate trigger point** to introduce embedding-based retrieval and a proper vector store (and, if multi-step retrieval/agent orchestration is needed, a framework such as LangChain) — a backend-side evolution, not a rewrite of the client.

---

## 📈 Recommendation Engine

The recommendation system uses **user-based collaborative filtering**:

1. **Interaction tracking** — Records views (×1), calculations (×3), bookmarks (×5) per formula
2. **User vectors** — Builds interaction score vectors across all formulas
3. **Cosine similarity** — Finds the top 5 most similar users
4. **Weighted aggregation** — Scores unseen formulas based on similar users' preferences
5. **Popularity fallback** — Returns most popular formulas for new users

Pre-seeded with 5 demo users to ensure immediate recommendations for first-time visitors.

---

## 🌍 Localization

Full bilingual support with **i18next**:

| Feature | Ukrainian 🇺🇦 | English 🇬🇧 |
|---|---|---|
| UI Labels | ✅ | ✅ |
| Formula names | ✅ | ✅ |
| Formula descriptions | ✅ | ✅ |
| Theory articles | ✅ | ✅ |
| Problem text & steps | ✅ | ✅ |
| AI Assistant responses | ✅ | ✅ |
| SEO meta tags | ✅ | ✅ |

Language toggle in the header; preference persisted to localStorage.

---

## 🚢 Deployment

### Production Build

```bash
npm run build        # Generates optimized dist/ folder (~310 KB JS gzipped)
npm run preview      # Preview production build locally
```

### Deploy to Firebase Hosting

```bash
# Option 1: One-click
deploy.bat           # Windows — handles login + build + deploy

# Option 2: Manual
firebase login       # One-time Google auth
npm run deploy       # Build + deploy hosting
npm run deploy:rules # Deploy Firestore security rules
```

### Production URL
🌐 **https://scilearn-be957.web.app**

### Build Output (Code-Split)

| Chunk | Size (gzip) | Contents |
|---|---|---|
| `index` | ~101 KB | App code + all data |
| `vendor-firebase` | ~109 KB | Firebase SDK |
| `vendor-katex` | ~77 KB | KaTeX math renderer |
| `vendor-react` | ~17 KB | React + React DOM |
| `vendor-i18n` | ~15 KB | i18next |
| `vendor-search` | ~7 KB | Fuse.js |
| `firestore` | ~1 KB | Firestore lazy-loaded |

---

## 🖼️ Screenshots

### Home Page
Hero section with subject cards (Physics, Chemistry, Biology), personalized recommendations, and the floating AI assistant button.

### Formula Detail
Full formula view with KaTeX rendering, interactive calculator, variable table, bookmark toggle, and related formula navigation.

### AI Assistant
Floating chatbot with Gemini-powered responses, suggestion chips, formula variable breakdowns, and direct navigation links.

### Theory Page
Articles with dual filters (subject + difficulty), color-coded difficulty badges (🟢🟡🔴), and collapsible content sections.

### Problems Page
Step-by-step problem solutions with expandable sections, star difficulty ratings, and links to related formulas.

---

## 📄 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (localhost:5173) |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | Type-check the project (`tsc --noEmit`, strict) |
| `npm test` | Run the Vitest suite once (143 tests) |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run deploy` | Build + deploy to Firebase Hosting |
| `npm run deploy:rules` | Deploy Firestore security rules only |

---

## 🔮 Future Enhancements

- [ ] **Autonomous Course Evolution** — AI coverage-gap detection → structured improvement suggestions emailed to the admin + stored in Firestore → admin curation dashboard → self-improving loop (see [Autonomous Course Evolution](#-autonomous-course-evolution-roadmap))
- [ ] **Embedding-RAG scale-up** — semantic retrieval + vector store once the user-driven corpus grows large/free-text (deliberate successor to today's graph/keyword RAG)
- [ ] **PWA** — Service workers for offline formula browsing
- [ ] **Cloud Functions** — Server-side recommendation processing
- [ ] **User profiles** — Learning progress tracking
- [ ] **Formula editor** — User-submitted formulas
- [ ] **Quiz mode** — Interactive testing from problem database
- [ ] **Export** — PDF/image export for formulas

---

## 📝 License

This project was developed as a diploma thesis. All rights reserved.

---

<p align="center">
  Built with ❤️ using TypeScript, React, Vite, Firebase & Google Gemini
</p>