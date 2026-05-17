import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import type { ReactNode } from 'react';
import {
  getBookmarks,
  addBookmark,
  removeBookmark
} from '@/shared/bookmarks/bookmarks';
import { useAuth } from '@/shared/auth/AuthContext';

type BookmarkContextValue = {
  bookmarks: string[];
  toggleBookmark: (formulaId: string) => Promise<void>;
  isBookmarked: (formulaId: string) => boolean;
  loadBookmarks: () => Promise<void>;
};

const BookmarkContext = createContext<BookmarkContextValue | undefined>(
  undefined
);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const { user } = useAuth();
  const userId = user?.uid;

  const loadBookmarks = useCallback(async () => {
    const bm = await getBookmarks(userId);
    setBookmarks(bm);
  }, [userId]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const toggleBookmark = useCallback(
    async (formulaId: string) => {
      if (bookmarks.includes(formulaId)) {
        const updated = await removeBookmark(userId, formulaId);
        setBookmarks(updated);
      } else {
        const updated = await addBookmark(userId, formulaId);
        setBookmarks(updated);
      }
    },
    [bookmarks, userId]
  );

  const isBookmarked = useCallback(
    (formulaId: string) => {
      return bookmarks.includes(formulaId);
    },
    [bookmarks]
  );

  const value = useMemo<BookmarkContextValue>(
    () => ({ bookmarks, toggleBookmark, isBookmarked, loadBookmarks }),
    [bookmarks, toggleBookmark, isBookmarked, loadBookmarks]
  );

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context)
    throw new Error('useBookmarks must be used within BookmarkProvider');
  return context;
}
