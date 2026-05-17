/* ============================================
   Core domain model — a thin barrel over the per-context type modules so
   existing `@/shared/types/domain` imports keep working.

   The shapes are split by bounded context; prefer importing from the
   specific module:
     - ./content          course content (Formula, Topic, SubjectData, …)
     - ./graph            the auto-derived knowledge graph
     - ./search           the Fuse.js search hit
     - ./recommendations  collaborative-filter interactions/recommendations

   The assistant responder-chain contract (NavLink, Responder,
   AssistantResponse, …) is feature-owned and lives in
   `@/features/assistant/types`, not here.
   ============================================ */

export type * from './content';
export type * from './graph';
export type * from './search';
export type * from './recommendations';
