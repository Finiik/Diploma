import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Home from './pages/Home/Home';
import Subject from './pages/Subject/Subject';
import FormulaDetail from './pages/FormulaDetail/FormulaDetail';
import Theory from './pages/Theory/Theory';
import Problems from './pages/Problems/Problems';
import Bookmarks from './pages/Bookmarks/Bookmarks';
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
