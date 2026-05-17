/* ============================================
   bookmarks — public API

   The bookmark context + persistence service live in
   @/shared/bookmarks (cross-cutting state consumed by FormulaCard);
   this feature owns the Bookmarks page only.
   ============================================ */

export { default as Bookmarks } from './pages/Bookmarks/Bookmarks';
