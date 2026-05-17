import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@/features/theme';
import { AuthProvider } from '@/shared/auth/AuthContext';
import { BookmarkProvider } from '@/shared/bookmarks/BookmarkContext';
import '@/shared/i18n/index.js';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BookmarkProvider>
          <App />
        </BookmarkProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
