import { useBookmarks } from './BookmarkContext';

const BOOKMARK_LABEL_KEY: Record<'true' | 'false', string> = {
  true: 'formula.bookmark_remove',
  false: 'formula.bookmark_add'
};

/**
 * Per-item bookmark state in one place. FormulaCard and FormulaDetail
 * each duplicated the `isBookmarked` + `toggle` + label-key triple
 * (including a verbatim copy of the i18n key map); this centralizes it.
 */
export function useBookmarkToggle(id: string): {
  bookmarked: boolean;
  toggle: () => void;
  /** i18n key for the add/remove action label. */
  labelKey: string;
} {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(id);
  return {
    bookmarked,
    toggle: () => toggleBookmark(id),
    labelKey: BOOKMARK_LABEL_KEY[bookmarked ? 'true' : 'false']
  };
}
