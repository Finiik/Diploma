import { Outlet } from 'react-router-dom';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import ScrollToTop from '@/app/components/ScrollToTop/ScrollToTop';
import { AIAssistant } from '@/features/assistant';
import './Layout.css';

/** The application shell — pure composition of the shell pieces. Scroll
    restoration and footer content are their own components now (SRP). */
export default function Layout() {
  return (
    <div className="layout">
      <ScrollToTop />
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}
