import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getBookmarks, addBookmark, removeBookmark, isBookmarked as checkBookmarked } from '../services/bookmarks';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);
  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    loadBookmarks();
  }, [userId]);

  const loadBookmarks = async () => {
    const bm = await getBookmarks(userId);
    setBookmarks(bm);
  };

  const toggleBookmark = useCallback(async (formulaId) => {
    if (bookmarks.includes(formulaId)) {
      const updated = await removeBookmark(userId, formulaId);
      setBookmarks(updated);
    } else {
      const updated = await addBookmark(userId, formulaId);
      setBookmarks(updated);
    }
  }, [bookmarks, userId]);

  const isBookmarked = useCallback((formulaId) => {
    return bookmarks.includes(formulaId);
  }, [bookmarks]);

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked, loadBookmarks }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) throw new Error('useBookmarks must be used within BookmarkProvider');
  return context;
}
