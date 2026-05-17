# Architecture

This document describes the software architecture of **SciLearn**, the
recommendation system for natural-science students. It is written for both
maintainers and the thesis committee: it states the architectural style, the
layering rules, the rationale behind the non-obvious decisions, and how the
rules are kept honest.

---

## 1. Architectural style

The frontend follows a **feature-sliced, layered modular architecture**
(a pragmatic variant of *Feature-Sliced Design* / *vertical slice
architecture*).

The codebase is partitioned into **three layers**, each a directory under
`src/`:

| Layer        | Directory      | Responsibility                                                                 |
|--------------|----------------|--------------------------------------------------------------------------------|
| Composition  | `src/app/`     | The composition root: wires features into routes and provider trees; owns the application shell (Layout, Header) and global styles. |
| Features     | `src/features/`| Vertical slices — one folder per user-facing capability. Each owns its data, logic, UI, pages and tests behind a public API. |
| Shared       | `src/shared/`  | Horizontal foundation — domain-agnostic primitives and genuinely cross-cutting application state. |

The guiding principle is **high cohesion, low coupling**: everything that
changes together for one capability lives together in one feature folder,
and what is shared is shared deliberately, not by accident. The operative
rule for *where any module lives* — **location follows its consumers, not
its kind** — is stated in full in [§6.1](#61-the-placement-rule-location-follows-consumers-not-kind),
and is what makes the auth/bookmarks/theme split principled rather than
arbitrary.

---

## 2. The dependency rule

Dependencies point **downward only**:

```
app  ──▶  features  ──▶  shared
                 │            ▲
                 └────────────┘   (a feature may use another feature
                                   through its public barrel — acyclic)
```

Concretely:

- `app/` may import any feature (via its barrel) and anything in `shared/`.
- A `feature/` may import `shared/` and **sibling features through their
  public `index.ts` barrel only** — never another feature's internal files.
- `shared/` may import **only** other `shared/` modules. It never imports
  `app/` or `features/`.

There are **no cyclic dependencies** between features. The dependency graph
is a DAG; `formulas`, `theory` and `problems` act as foundational content
slices that `search`, `recommendations` and `assistant` consume.

---

## 3. The public-API (barrel) convention

Every feature exposes exactly one entry point: `src/features/<name>/index.ts`.

- **Cross-feature and app code import from the barrel:**
  `import { FormulaCard } from '@/features/formulas'`.
- **Intra-feature code uses concrete paths** (the feature's own files are
  private by convention).
- **Tests import the concrete unit under test**, not the barrel — a
  characterization test should pin one module, not a re-export surface.

The convention is *not* enforced by a lint rule (Biome lacks a strong
import-boundary rule); it is upheld by review and by the fact that the
typecheck + test + build gate is run green at every step.

> **Worked example — name disambiguation.** `lib/formulas.ts` exports an
> aggregated `getAllFormulas(): SubjectFormula[]`, while each subject dataset
> (`data/physics.ts` …) also exports a `getAllFormulas(): Formula[]`. The
> `formulas` barrel resolves the clash by re-exporting the per-subject ones
> under explicit aliases (`getAllPhysicsFormulas`, …) while keeping the
> aggregate name canonical. Consumers get one unambiguous public API.

---

## 4. Module map

```
src/
├── app/                         # Composition root
│   ├── App.tsx                  #   route table
│   ├── main.tsx                 #   entry — mounts provider tree (index.html → here)
│   ├── components/
│   │   ├── Layout/              #   shell: pure composition of the pieces
│   │   ├── Header/              #   nav bar (consumes search + theme features)
│   │   ├── Footer/              #   site footer (presentational)
│   │   └── ScrollToTop/         #   scroll-restoration behaviour (renders null)
│   └── styles/                  #   global.css, variables.css (design tokens)
│
├── features/                    # Vertical slices (each has an index.ts barrel)
│   ├── formulas/                #   datasets (phys/chem/bio) + catalog lib +
│   │                            #   FormulaCard + Subject & FormulaDetail pages
│   ├── calculator/              #   pure calc lib + useCalculator + Calculator UI
│   ├── recommendations/         #   collaborative-filtering service + Home page
│   ├── theory/                  #   theory dataset + Theory page
│   ├── problems/                #   problems dataset + Problems page
│   ├── bookmarks/               #   Bookmarks page (state lives in shared/bookmarks)
│   ├── search/                  #   Fuse.js service + SearchBar
│   ├── assistant/               #   AIAssistant UI + chat hooks + RAG engine
│   │                            #   (assistantEngine + services/assistant/*)
│   └── theme/                   #   ThemeContext + persistence service
│
├── shared/                      # Horizontal foundation (shared imports only shared)
│   ├── types/                   #   domain model split per bounded context:
│   │                            #   content · graph · search · recommendations,
│   │                            #   re-exported by a thin domain.ts barrel
│   ├── lib/                     #   pure utils: env, pickLang, katex, navigation,
│   │                            #   subjects (registry), subjectColor/Icon,
│   │                            #   mergeById, … (+ tests)
│   ├── hooks/                   #   generic hooks: useLocalized, useClickOutside, …
│   ├── ui/                      #   presentation primitives: Latex, Breadcrumb,
│   │                            #   LoadingSkeleton, FilterBar, Markdown, ErrorBoundary
│   ├── i18n/                    #   i18next config + en/uk bundles +
│   │                            #   lang.ts (i18n code → Lang resolver)
│   ├── firebase/                #   config + firestore data access (infrastructure)
│   ├── auth/                    #   AuthContext + useFirebaseAuthState +
│   │                            #   authGateway (the firebase/auth port)
│   └── bookmarks/               #   BookmarkContext + typed local/remote stores
│
└── vite-env.d.ts                # ambient Vite/import.meta.env types
```

---

## 5. Feature dependency graph

```mermaid
graph TD
    subgraph app
        A[app: routes + shell]
    end
    subgraph features
        F[formulas]
        C[calculator]
        R[recommendations]
        T[theory]
        P[problems]
        B[bookmarks page]
        S[search]
        AS[assistant]
        TH[theme]
    end
    subgraph shared
        SH[shared: types · lib · hooks · ui · i18n<br/>firebase · auth · bookmarks-state]
    end

    A --> F & C & R & T & P & B & S & AS & TH
    R --> F
    B --> F
    S --> F & T & P
    AS --> F & T & P & S
    F --> C
    F & C & R & T & P & B & S & AS & TH --> SH
```

Every arrow points down or sideways-through-a-barrel; none point back up.

---

## 6. Notable design decisions (and why)

### 6.1 The placement rule: location follows *consumers*, not *kind*

The single most important principle in this codebase:

> **A module's home is decided by who consumes it — not by what kind of
> thing it is.** "It's a React context / a provider / a hook" is *not* a
> reason to put something in `shared/`. The test is the consumer set.

Concretely, a stateful provider goes in `shared/` **only if** a `shared/`
module depends on it **or** two or more features depend on it. Otherwise it
stays inside the one feature that owns it (or, if only `app/` consumes it,
it can remain a feature — `app/` is allowed to import features).

The three top-level providers (auth, bookmarks, theme) are *the same kind of
thing* (a React context mounted in `main.tsx`) yet land in **different
layers**, purely because their consumer sets differ. This is the rule
applied **by consequence, not by dogma**:

| Provider | Actual consumers (verified) | Decision | Why |
|---|---|---|---|
| **bookmarks** (`useBookmarks`) | `features/formulas` (`FormulaCard`, `FormulaDetail`), `features/bookmarks` (page), `app/main.tsx` | → `shared/bookmarks` | Consumed by **two features**. Leaving it in `features/bookmarks` creates a cycle: `FormulaCard` (formulas) needs it, while the Bookmarks page needs `FormulaCard` ⇒ `formulas ⇄ bookmarks`. |
| **auth** (`useAuth`) | `shared/bookmarks` (!), `features/formulas` (`FormulaDetail`), `features/recommendations` (`Home`), `app/main.tsx` | → `shared/auth` | **Forced.** A *shared* module (`BookmarkContext`) calls `useAuth`. `shared` may not import a feature, so auth *must* be shared. |
| **theme** (`useTheme`) | `app/main.tsx`, `app/components/Header` | → `features/theme` | No `shared/` module and no other feature consumes it; both consumers are in `app/`, which may import features. **No layering pressure to promote it.** |

Two consequences the committee should note:

1. The cycle-break and the auth promotion were achieved with **zero
   behavioural change** — only the module's *location* moved; its code and
   public API are identical.
2. If a `shared/` module or a second feature ever starts consuming
   `useTheme`, theme moves to `shared/` by *this exact rule* — the decision
   is mechanical, not aesthetic.

The same rule explains an asymmetry inside the slices: the
`recommendations` *service* is consumed only by its own `Home` page, so it
stays private to `features/recommendations`; the bookmarks *context* is
consumed across slices, so it is shared. Different kinds, same rule.

### 6.2 Features carry only the kinds they need (thin is not a smell)

A feature folder is layered *internally* by kind (`data/`, `lib/`, `hooks/`,
`components/`, `pages/`, `services/`). Feature-Sliced Design does **not**
require every feature to contain every kind — each slice carries only what
it needs:

| Feature | Internal layers it owns |
|---|---|
| `formulas` | `data/` + `lib/` + `components/` + `pages/` |
| `calculator` | `lib/` + `hooks/` + `components/` |
| `assistant` | `components/` + `hooks/` + `lib/` + `services/` |
| `theory` / `problems` | `data/` + `components/` + `pages/` |
| `bookmarks` | `pages/` only (its state lives in `shared/bookmarks`) |

So a `pages/` subfolder is the feature's **internal routing layer**, *not* a
relapse to the old global `src/pages/`. `theory`/`problems` stay small —
a typed dataset, one presentational card (`TheoryCard`/`ProblemCard`) and
one filtered list screen that wires filters to it; `bookmarks` is thin
because its state was correctly hoisted to `shared`
(§6.1). Thinness here is **honest signal that the slice is small**, not an
incomplete feature. Keeping the routable screen under `pages/<Name>/` (vs a
bare `Name.tsx`) also keeps its co-located CSS and future `__tests__`
consistent with every other feature, and gives the slice a place to grow.

### 6.3 The domain model is split per bounded context, behind a barrel

The domain model was originally one `shared/types/domain.ts` grab-bag. It
grew to cover five unrelated bounded contexts (course content, the
knowledge graph, search, the assistant responder chain, recommendations)
and was imported by ~35 files, so a type change in one context forced
recompilation/coupling of files that only needed another (an
Interface-Segregation smell at module granularity).

It is now split under `src/shared/types/`:

| Module | Owns |
|---|---|
| `content.ts` | `Subject`, `FormulaMeta`, `ComputableFormula`, `Topic`, `SubjectData`, `TheoryItem`, `ProblemItem`, … |
| `graph.ts` | `GraphItem`, `Concept`, `SubjectOutline`, `CourseGraph` |
| `search.ts` | `SearchHit` |
| `recommendations.ts` | `Interaction`, `InteractionsByUser`, `Recommendation` |
| `domain.ts` | **thin barrel** re-exporting the four above |

Two deliberate choices keep this principled rather than churny:

1. **The barrel is the canonical entry point.** `domain.ts` re-exports
   every shared type, so the ~35 existing `@/shared/types/domain` imports
   keep working — the split was a **zero-behaviour, non-breaking**
   refactor. Honest scope of the win: **every consumer imports the barrel**
   (0 of ~42 import sites reference a specific context module). Because the
   barrel re-exports all four contexts, a consumer's transitive
   type-dependency surface is *unchanged* from the pre-split grab-bag — the
   Interface-Segregation benefit is therefore realized at **authoring**
   granularity (four small, single-context files instead of one ~130-line
   file, with the *ubiquitous language* preserved as one discoverable entry
   point), **not** at *consumer recompilation* granularity. Per-context
   imports would realize the latter too, but that convention is
   deliberately not adopted; the barrel is the public API and the typecheck
   + test + build gate (not module-graph pruning) is what keeps the split
   honest.
2. **Assistant types left `shared/`.** `NavLink`, `Responder`,
   `ResponderResult` and `AssistantResponse` are the responder-chain
   contract — consumed *only* by the assistant feature. By the placement
   rule (§6.1, *location follows consumers*) they are not shared domain,
   so they moved to `src/features/assistant/types.ts`. `shared/` no longer
   carries a type only one feature speaks.

### 6.4 Path alias and import convention

`@/*` resolves to `src/*` (declared once in `tsconfig.json`, mirrored in
`vite.config.js`, which Vitest also reads). Convention:

- **cross-directory** imports use the alias: `@/shared/lib/katex`,
  `@/features/search`;
- **same-directory siblings and co-located CSS** stay relative: `./types`,
  `./Header.css`.

This keeps moves cheap (rename the target, rewrite specifiers) and makes the
layer of any import obvious from its first path segment.

### 6.5 SOLID decomposition: one reason to change per module

After the slice migration, a dedicated **SOLID hardening pass** drove every
module to a single responsibility, with type dispatch expressed as data
rather than control flow:

- **Single Responsibility.** Modules that mixed concerns were split along
  the seam: the search service → an encapsulated `SearchIndex` + a
  swappable corpus-source registry + hit-mapping; the recommender → a thin
  pipeline over pure CF helpers in `lib/`; the assistant responder file →
  chain wiring vs. `instantResponders` content (whose three responders no
  longer each recompute the platform tallies a different way — they read
  one `platformStats()` selector, so the total can't drift from the
  per-subject breakdown); the Gemini prompt context →
  static catalog (`promptContext`) vs. per-query retrieval (`ragContext`);
  `Home` → `SubjectsGrid` + `RecommendationsFeed`; and `buildCourseGraph`
  (a 127-line procedure hard-bound to five concrete datasets) → a pure
  `assembleGraph(source: GraphSource)` composed of single-purpose helpers
  (`indexById` · `deriveEdges` · `buildConcepts` · `projectOutline`) plus a
  thin memoizing wirer that injects the real data. The algorithm is now
  unit-tested on a hand-built fixture, not only against the whole corpus
  (also a Dependency-Inversion fix — `GraphSource` is the injected port).
  The `Home` container/presentational discipline was then **propagated**
  to the pages it had skipped: `Theory` → `TheoryCard`, `Problems` →
  `ProblemCard`, `FormulaDetail` → `FormulaVariablesTable` +
  `DerivedFormulasGrid`, so every routable screen is now filter/data
  wiring delegating to presentational components, and the difficulty
  *card* scale lives once in `shared/lib/difficulty` (the `BADGE`/`STARS`
  keyed maps) instead of a badge map in `Theory` diverging from a stars
  map in `Problems`. One residual duplication is *not* yet closed: `Theory`
  and `Problems` still re-declare the same icons/labels as their
  filter-pill `DIFF_OPTIONS` literals, so the drift surface moved from
  card-vs-card to card-vs-filter rather than being eliminated. `Layout`
  was likewise
  reduced to pure shell composition — scroll restoration (`ScrollToTop`,
  renders `null`) and the footer markup (`Footer`) became their own
  components instead of three reasons-to-change in one shell file.
- **Open/Closed.** Variant handling uses lookup/strategy data instead of
  `if`/`switch` ladders, so adding a case is a new entry, never an edited
  branch. Two mechanisms, with *different* safety guarantees — stated
  precisely rather than conflated:
  - **Keyed maps over a discriminant** (`ITEM_FORMATTERS`,
    `FALLBACK_RENDERERS`, `SUBJECT_REGISTRY`, `COUNTER_FIELD`,
    `subjectIcon`, `subjectColor`, `SUBJECT_DATA`): typed as
    `Record<K, …>` / a mapped
    type, so an omitted case is a **compile error**. These are
    closed-by-construction. The subject set in particular is now a
    *single* `SUBJECT_REGISTRY` in `shared/lib/subjects.ts` — nav,
    footer, home grid, filter pills, icon/colour, free-text detection
    and catalog aggregation all derive from it instead of re-declaring
    `['physics','chemistry','biology']` in ~7 files. Even the canonical
    *ordered* `SUBJECTS` list carries a compile-time exhaustiveness
    guard, so iteration order is closed too, not just keyed lookup.
  - **Ordered registries** (the `createResponders()` chain, the
    `SearchCorpusSource` / `InteractionsSource` arrays): open for
    extension by appending an entry, but completeness is **convention,
    not compile-checked** — a forgotten registration is a silent
    behavioural gap, not a type error. They are still OCP for *adding*
    a strategy; they just don't carry the exhaustiveness guarantee the
    keyed maps do.

  The **locale axis** was the last open/closed offender: a raw
  `isUk: boolean` was threaded through ~14 files / 140+ sites, so a third
  locale meant reinterpreting every signature and every `isUk ? a : b`
  ternary. It is now a named `Lang` union plus a single `pick(lang, uk,
  en)` seam (`shared/lib/pickLang.ts`); the two origins resolve it once
  via `resolveLang(i18n.language)`. Adding a locale is a `Lang` member +
  new `pick`/string arms, not a boolean every call site has to second-
  guess — and the assistant's bilingual prose now reads as data
  (`pick(lang, …, …)`) rather than control flow. The change was
  behaviour-identical (the 148-test suite pins the exact uk *and* en
  outputs). One honesty caveat — the same class as the ordered registries
  above: a new locale touches **three uncoupled places** — a `Lang` member
  (`shared/lib/pickLang.ts`), a `SUPPORTED_LANGUAGES` entry
  (`shared/i18n/constants.ts`), and a `resolveLang` arm — with **no
  compile-time tie** between `Lang` and `SupportedLanguage`. Adding `'de'`
  to `SUPPORTED_LANGUAGES` without extending `Lang` is *not* a type error;
  `resolveLang` silently falls back. So the axis is named and
  single-seamed (a large improvement over the threaded boolean), but its
  completeness is **convention, not compile-checked** — it does *not*
  carry the closed-by-construction guarantee the keyed maps do.
- **Liskov / Interface Segregation.** The bookmark stores carry explicit,
  intentionally asymmetric interfaces (`LocalBookmarkStore` sync cache vs.
  `RemoteBookmarkStore` async per-user sync target) so the contract is
  visible rather than implied; the domain types are segregated per context
  (§6.3). The formula type is split the same way: `FormulaMeta` is the
  pure, serializable display shape (the search / graph / `FormulaCard`
  consumers narrow to it; the **recommendations** display path still
  annotates the `@deprecated Formula` alias rather than `FormulaMeta` —
  behaviour-identical, since `Formula = ComputableFormula` and the data
  carries `compute`, but the narrowing the split intends is not yet
  applied on that one path), while `ComputableFormula =
  FormulaMeta & { compute; resultVar; multiResult }` adds the calculator
  contract and is depended on only by the calculator feature and the
  catalog datasets that define `compute`. `GraphItem` (hence `SearchHit`,
  `CourseGraph.byId`) therefore carries no executable member and stays
  serializable. `Formula` remains as a `@deprecated` alias of
  `ComputableFormula` so the change was zero-behaviour and non-breaking
  (same compat-shim discipline as the `domain.ts` barrel, §6.3).
- **Dependency Inversion.** Side-effecting boundaries sit behind injectable
  interfaces: `GeminiTransport` (network + `isConfigured()`),
  `SearchCorpusSource`, `InteractionsSource`, and `AuthGateway` (the
  firebase/auth + Firebase-app coupling). High-level orchestrators
  depend on these ports, not on `fetch`/env/SDK concretions. Auth was the
  last stateful boundary without a seam: `useFirebaseAuthState` now
  orchestrates an `AuthGateway` resolved by `resolveAuthGateway()` (real
  vs. offline, the same shape as `resolveRemoteBookmarkStore`) and imports
  no SDK; and `firebase/config` initializes the app **lazily** via
  `getDb()` / `getFirebaseAuth()` instead of calling `initializeApp` at
  module load, so placeholder credentials are never used to construct an
  app in offline mode. The injectable **port exists at every
  infrastructure boundary**, with two honest qualifications on how tightly
  it is enforced: (a) `firestore.ts` resolves `getDb()` at *module
  evaluation* (`const db = getDb()`), so the lazy-init guarantee holds by
  **caller discipline** — every caller checks `isFirebaseConfigured()`
  before the dynamic `import()` — not by construction; and (b) see the
  `GeminiTransport` note below. Likewise
  `createSearchIndex(sources)` no longer carries a hidden default that
  silently re-coupled it: the default index is built **lazily on first
  use** (not at module import) with `DEFAULT_CORPUS_SOURCES` injected
  explicitly at that one wiring point, so the factory stays a pure seam.
  The `GeminiTransport` seam runs through the orchestrator as an *optional*
  parameter: `processMessage(query, lang, transport?)` builds the chain via
  `createResponders(transport)`, so the *whole assistant engine* can be
  exercised offline by injecting a fake transport — `assistantEngine.test.ts`
  does exactly this (a configured fake proves model text flows through; an
  unconfigured/throwing fake pins the deterministic fallback path) rather
  than stubbing global `fetch`. Honest qualification: the **running app
  does not inject** — `useChatSession` calls `processMessage(text, lang)`
  with no transport, so the default parameter re-binds the concrete
  `defaultGeminiTransport` *inside* the orchestrator. The seam is therefore
  a genuine test seam but a *convenience* default in production: the app
  path still names the concretion, and only the test path exercises the
  inverted dependency end-to-end. (Closing this would mean threading one
  app-level transport instance the way `getDefaultIndex()` threads
  `DEFAULT_CORPUS_SOURCES` at a single wiring point.) The instant
  responders take no transport, so the chain abstraction stays segregated. The same inversion applies to
  analytics: `useCalculator(formula, onCalculated?)` fires an *injected*
  callback on a successful calculation rather than importing
  `useInteractionLog` itself, so the hook stays pure and the page owns the
  sink. (This also closed a real gap — the recommender weights
  `calculation` 3×, but no running-app code emitted that event until the
  seam was wired; the README's "tracks calculations" claim is now true,
  not aspirational.)

Stateful React boundaries follow the same rule: provider effects move into
hooks (`useFirebaseAuthState`), and **all three** context values — auth,
bookmarks and theme — are `useMemo`'d with `useCallback`'d handlers, so
every provider hands consumers a referentially stable value and is a thin
boundary, not a state machine. (Theme was brought in line with the other
two in the SOLID hardening pass; the claim is now uniform, not aspirational.)

---

## 7. Testing strategy

148 Vitest tests (characterization + unit) run in `jsdom`. Tests are
**co-located with the unit they pin**:

- `src/features/<name>/__tests__/…` for feature logic (formulas,
  calculator, recommendations + the extracted CF helpers in
  `similarity.test.ts`, search, and the assistant pipeline);
- `src/shared/lib/__tests__/…` for shared pure utilities
  (env, katex, navigation, pickLang, symbol-tex).

They import the **concrete module**, not the barrel, so a failure points at
a specific unit rather than a re-export surface. The quality gate for any
change is:

```
npm run typecheck && npm test && npm run build && npm run format:check
```

---

## 8. Migration provenance

This structure was reached by an explicit, reviewable migration from the
previous layer-based layout (`components/`, `pages/`, `services/`, …). The
work was executed as **17 sequential commits, one per migration phase**
(`shared/types` → `shared/lib` → `shared/hooks` → `shared/ui` →
`shared/i18n`+`firebase` → `shared/bookmarks` → the eight feature slices →
`shared/auth` → `theme` → the `app/` shell).

A subsequent **SOLID hardening pass** (§6.5) followed the same discipline:
**11 sequential refactor commits**, each one isolated concern (domain-type
split, search corpus registry, CF-helper extraction, instant-responder
split, context memoisation, typed bookmark stores, shared `Markdown` +
`subjectIcon`, `getSubjectTopics`, Gemini config behind the transport,
`Home` decomposition, RAG/promptContext split).

The full quality gate (`typecheck` + the Vitest suite + production build +
formatter) was run **green before every commit** across both passes, so the
history is bisectable and no commit ships a broken tree.
