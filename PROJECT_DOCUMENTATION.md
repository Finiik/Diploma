# SciLearn — Project Documentation

> **Living Document** — Updated as the project evolves.
> Last updated: 2026-05-09

---

## 1. Overview

**SciLearn** is a web-based recommendation system for natural science students. It provides an interactive formula database with a built-in calculator, theoretical materials, problem examples with step-by-step solutions, and personalized recommendations powered by collaborative filtering.

**Target Audience:** University and high-school students studying Physics, Chemistry, and Biology.

**Key Differentiator:** An AI-powered assistant that answers questions using the platform's own knowledge base, combined with a collaborative filtering engine that personalizes content.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **UI Framework** | React | 19.x | Component-based UI |
| **Build Tool** | Vite | 6.x | Fast dev server & production bundler |
| **Routing** | React Router DOM | 7.x | Client-side SPA routing |
| **Math Rendering** | KaTeX | 0.16.x | LaTeX formula rendering |
| **Search** | Fuse.js | 7.x | Fuzzy search across all content |
| **Localization** | i18next + react-i18next | 24.x / 15.x | Ukrainian/English bilingual support |
| **Backend** | Firebase | 11.x | Auth, Firestore, Hosting |
| **Styling** | CSS Custom Properties | — | Theme-aware design system |

### Key Design Decisions
- **No external AI API** — The AI assistant runs entirely client-side using Fuse.js search + pattern matching
- **Firebase resilience** — The app works fully offline; Firebase is optional for cloud sync
- **Code splitting** — Vite manual chunks separate React, Firebase, KaTeX, i18n, and Fuse.js for optimal caching

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (SPA)                     │
├─────────────────────────────────────────────────────┤
│  BrowserRouter                                       │
│  ├── ErrorBoundary                                   │
│  │   └── Layout (Header + Footer + scroll-to-top)   │
│  │       ├── Home (Hero + Subjects + Recommendations)│
│  │       ├── Subject/:id (Topics → Formulas)         │
│  │       ├── FormulaDetail/:id (LaTeX + Calculator)  │
│  │       ├── Theory (Articles + Filters)             │
│  │       ├── Problems (Step-by-step + Filters)       │
│  │       └── Bookmarks (Saved formulas)              │
│  └── AIAssistant (Global floating chatbot)           │
├─────────────────────────────────────────────────────┤
│  Context Providers                                   │
│  ├── ThemeContext (light/dark mode)                   │
│  ├── AuthContext (Firebase anonymous auth)            │
│  └── BookmarkContext (saved formulas)                │
├─────────────────────────────────────────────────────┤
│  Services                                            │
│  ├── recommendations.js (Collaborative filtering)    │
│  ├── search.js (Fuse.js index)                       │
│  ├── bookmarks.js (localStorage + Firestore sync)    │
│  └── assistantEngine.js (AI chatbot logic)           │
├─────────────────────────────────────────────────────┤
│  Data Layer (Static JS modules)                      │
│  ├── physics.js (23 formulas, 7 topics)              │
│  ├── chemistry.js (18 formulas, 6 topics)            │
│  ├── biology.js (16 formulas, 7 topics)              │
│  ├── theory.js (15 articles)                         │
│  └── problems.js (15 problems)                       │
├─────────────────────────────────────────────────────┤
│  Firebase (Optional Cloud Layer)                     │
│  ├── Anonymous Auth                                  │
│  ├── Firestore (interactions, bookmarks)             │
│  └── Hosting (production deployment)                 │
└─────────────────────────────────────────────────────┘
```

---

## 4. File Structure

```
Diploma/
├── public/
│   └── favicon.svg                 # SVG favicon
├── index.html                      # Entry HTML with SEO meta tags
├── firebase.json                   # Firebase Hosting config
├── firestore.rules                 # Firestore security rules
├── .firebaserc                     # Firebase project binding
├── .env                            # Environment variables (Firebase keys)
├── vite.config.js                  # Vite config with manual chunks
├── deploy.bat                      # One-click deployment script
├── PROJECT_DOCUMENTATION.md        # This file
│
└── src/
    ├── App.jsx                     # Route definitions
    ├── main.jsx                    # Entry point (providers wrap)
    │
    ├── components/
    │   ├── Header/                 # Nav bar + mobile hamburger menu
    │   ├── Layout/                 # Shell: header + main + footer
    │   ├── SearchBar/              # Fuse.js search with dropdown
    │   ├── FormulaCard/            # Reusable formula card (KaTeX)
    │   ├── Calculator/             # Dynamic formula calculator
    │   ├── Breadcrumb/             # Hierarchical navigation
    │   ├── LoadingSkeleton/        # Shimmer loading placeholders
    │   ├── ErrorBoundary/          # Crash recovery component
    │   └── AIAssistant/            # Floating chatbot component
    │
    ├── pages/
    │   ├── Home/                   # Landing: hero, subjects, recommendations
    │   ├── Subject/                # Subject detail: topics → subtopics → formulas
    │   ├── FormulaDetail/          # Full formula view + calculator
    │   ├── Theory/                 # Theory articles with filters
    │   ├── Problems/               # Problems with step-by-step solutions
    │   └── Bookmarks/              # User's saved formulas
    │
    ├── data/
    │   ├── physics.js              # Physics formulas & topics
    │   ├── chemistry.js            # Chemistry formulas & topics
    │   ├── biology.js              # Biology formulas & topics
    │   ├── theory.js               # Theory articles
    │   └── problems.js             # Problem examples
    │
    ├── services/
    │   ├── recommendations.js      # Collaborative filtering engine
    │   ├── search.js               # Fuse.js search index builder
    │   ├── bookmarks.js            # Bookmark CRUD (local + cloud)
    │   └── assistantEngine.js      # AI assistant response engine
    │
    ├── contexts/
    │   ├── ThemeContext.jsx         # Dark/light mode state
    │   ├── AuthContext.jsx          # Firebase auth state
    │   └── BookmarkContext.jsx      # Bookmarks state
    │
    ├── firebase/
    │   ├── config.js               # Firebase app initialization
    │   └── firestore.js            # Firestore read/write helpers
    │
    ├── i18n/
    │   ├── index.js                # i18next configuration
    │   └── locales/
    │       ├── uk.json             # Ukrainian translations
    │       └── en.json             # English translations
    │
    └── styles/
        ├── global.css              # Global styles + animations
        └── variables.css           # CSS custom properties (design tokens)
```

---

## 5. Data Model

### Formula Schema
```javascript
{
  id: 'phys_newton2',           // Unique identifier (prefix: phys_, chem_, bio_)
  name: 'Другий закон Ньютона', // Ukrainian name
  nameEn: "Newton's Second Law",// English name
  latex: 'F = m \\cdot a',      // LaTeX formula string
  description: '...',           // Ukrainian description
  descriptionEn: '...',         // English description
  variables: [
    { symbol: 'F', name: '...', nameEn: '...', unit: 'Н (N)', type: 'result' },
    { symbol: 'm', name: '...', nameEn: '...', unit: 'кг (kg)', type: 'input' },
    // type: 'result' | 'input' — determines calculator behavior
  ],
  compute: (values) => values.m * values.a,  // Calculator function
  resultVar: 'F',              // Which variable is computed
  multiResult: false,          // If true, compute returns an object
  derivedFormulas: ['phys_weight'],  // Related formula IDs
  topic: 'Механіка',           // Parent topic name
  subtopic: 'Динаміка'         // Parent subtopic name
}
```

### Theory Schema
```javascript
{
  id: 'theory_newton_laws',
  name: '...', nameEn: '...',
  subject: 'physics',           // physics | chemistry | biology
  topic: 'Механіка',
  difficulty: 1,                // 1 = beginner, 2 = intermediate, 3 = advanced
  description: '...', descriptionEn: '...',
  content: '...',               // Markdown-like content (supports **bold**)
  contentEn: '...',
  relatedFormulas: ['phys_newton2']
}
```

### Problem Schema
```javascript
{
  id: 'prob_newton_car',
  name: '...', nameEn: '...',
  subject: 'physics',
  topic: 'Механіка',
  difficulty: 1,                // 1-3 star rating
  description: '...', descriptionEn: '...',
  relatedFormula: 'phys_newton2',
  steps: [
    { text: '...', textEn: '...' }  // Step-by-step solution
  ],
  answer: '...', answerEn: '...'
}
```

---

## 6. Key Interactions

### Recommendation Engine (Collaborative Filtering)
1. User interactions (views, calculations, bookmarks) are tracked per formula
2. User vectors are built from interaction scores: `views × 1 + calculations × 3 + bookmarks × 5`
3. Cosine similarity finds the most similar users
4. Formulas popular with similar users (but unseen by current user) are recommended
5. Falls back to popularity-based ranking for new users

### Search (Fuse.js)
- Indexes all formulas, theory articles, and problems
- Fuzzy matching with configurable threshold
- Returns typed results (formula/theory/problem) with navigation links

### AI Assistant
- Client-side only — no external API
- Parses questions using keyword/intent detection
- Searches all content via Fuse.js
- Constructs contextual responses with formula references and links
- Supports bilingual queries (UA/EN)

### Authentication
- Firebase anonymous auth (auto-login, no registration required)
- User ID used to track interactions for recommendations
- Graceful fallback to localStorage when Firebase is unavailable

---

## 7. Content Statistics

| Category | Count | Subjects |
|---|---|---|
| **Formulas** | 57 | Physics (23), Chemistry (18), Biology (16) |
| **Theory Articles** | 15 | 5 per subject |
| **Problem Examples** | 15 | 5 per subject |
| **Topics** | 20 | 7 Physics, 6 Chemistry, 7 Biology |

---

## 8. Deployment

### Commands
```bash
npm run dev          # Development server (localhost:5173)
npm run build        # Production build (output: dist/)
npm run preview      # Preview production build locally
npm run deploy       # Build + deploy to Firebase Hosting
npm run deploy:rules # Deploy Firestore security rules
```

### Production URL
`https://scilearn-be957.web.app`

### Build Output
- 7 code-split chunks (React, Firebase, KaTeX, i18n, Fuse.js, Firestore, App)
- ~310 KB gzipped total JavaScript
- ~15 KB gzipped CSS
- Aggressive caching headers for static assets (1 year)
