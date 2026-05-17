import { useTranslation } from 'react-i18next';
import Latex from '@/shared/ui/Latex/Latex';
import { symbolToTex } from '@/shared/lib/symbol-tex';
import { useLocalized } from '@/shared/hooks/useLocalized';
import type { FormulaVariable } from '@/shared/types/domain';

interface FormulaVariablesTableProps {
  variables: FormulaVariable[];
}

/** The "Variables" table of a formula. Presentational (styling global). */
export default function FormulaVariablesTable({
  variables
}: FormulaVariablesTableProps) {
  const { t } = useTranslation();
  const tr = useLocalized();

  return (
    <div className="formula-detail-vars">
      <h2>{t('formula.variables')}</h2>
      <div className="vars-table">
        {variables.map((v) => (
          <div key={v.symbol} className="var-row">
            <Latex tex={symbolToTex(v.symbol)} className="var-symbol" />
            <span className="var-name">{tr(v, 'name')}</span>
            <span className="var-unit">{v.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
