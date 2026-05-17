import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import ErrorBoundary from '@/shared/ui/ErrorBoundary/ErrorBoundary';
import { Home } from '@/features/recommendations';
import { Subject, FormulaDetail } from '@/features/formulas';
import { Theory } from '@/features/theory';
import Problems from '@/pages/Problems/Problems';
import Bookmarks from '@/pages/Bookmarks/Bookmarks';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="subject/:subjectId" element={<Subject />} />
            <Route path="formula/:formulaId" element={<FormulaDetail />} />
            <Route path="theory" element={<Theory />} />
            <Route path="problems" element={<Problems />} />
            <Route path="bookmarks" element={<Bookmarks />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
