import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalized } from '@/shared/hooks/useLocalized';
import { difficultyStars } from '@/shared/lib/difficulty';
import type { ProblemItem } from '@/shared/types/domain';

const SOLUTION_TOGGLE_KEY: Record<'true' | 'false', string> = {
  true: 'problems.hide_solution',
  false: 'problems.show_solution'
};

interface ProblemCardProps {
  problem: ProblemItem;
  isOpen: boolean;
  onToggle: () => void;
}

/** One worked problem with a toggleable solution. Presentational; the
    open/closed state is owned by the page (Problems.css styles it). */
export default function ProblemCard({
  problem,
  isOpen,
  onToggle
}: ProblemCardProps) {
  const { t } = useTranslation();
  const tr = useLocalized();

  return (
    <article className="problem-card" id={`problem-${problem.id}`}>
      <div className="problem-header">
        <h2 className="problem-title">{tr(problem, 'name')}</h2>
        <span
          className="problem-difficulty"
          title={t(`problems.diff_${problem.difficulty}`)}
        >
          {difficultyStars(problem.difficulty)}
        </span>
      </div>

      <p className="problem-desc">{tr(problem, 'description')}</p>

      <button
        className="solution-toggle"
        onClick={onToggle}
        id={`solution-toggle-${problem.id}`}
      >
        {t(SOLUTION_TOGGLE_KEY[isOpen ? 'true' : 'false'])}
        <span className={`toggle-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="solution animate-slide-up">
          {problem.steps.map((step, i) => (
            <div key={i} className="solution-step">
              <span className="step-number">
                {t('problems.step')} {i + 1}
              </span>
              <p className="step-text">{tr(step, 'text')}</p>
            </div>
          ))}
          <div className="solution-answer">
            <strong>{t('formula.result')}:</strong> {tr(problem, 'answer')}
          </div>
          {problem.relatedFormula && (
            <Link
              to={`/formula/${problem.relatedFormula}`}
              className="problem-formula-link"
            >
              {t('problems.go_to_formula')}
            </Link>
          )}
        </div>
      )}
    </article>
  );
}
