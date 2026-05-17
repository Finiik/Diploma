import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Latex from '@/shared/ui/Latex/Latex';
import { useLocalized } from '@/shared/hooks/useLocalized';
import type { FormulaMeta } from '@/shared/types/domain';

interface DerivedFormulasGridProps {
  /** Display-only: renders name + latex links. */
  formulas: FormulaMeta[];
}

/** The "Derived formulas" link grid. Renders nothing when empty. */
export default function DerivedFormulasGrid({
  formulas
}: DerivedFormulasGridProps) {
  const { t } = useTranslation();
  const tr = useLocalized();

  if (formulas.length === 0) return null;

  return (
    <div className="derived-section">
      <h2>{t('formula.derived')}</h2>
      <div className="derived-grid">
        {formulas.map((df) => (
          <Link
            key={df.id}
            to={`/formula/${df.id}`}
            className="derived-card"
            id={`derived-${df.id}`}
          >
            <span className="derived-name">{tr(df, 'name')}</span>
            <Latex tex={df.latex} className="derived-latex" />
          </Link>
        ))}
      </div>
    </div>
  );
}
