import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormulaVariable } from '@/shared/types/domain';
import Latex from '@/shared/ui/Latex/Latex';
import { symbolToTex } from '@/shared/lib/symbol-tex';

interface CalcFieldProps {
  variable: FormulaVariable;
  /** Already-localized display name. */
  name: string;
  value: string | number;
  /**
   * Receives (symbol, value) so the parent can pass the stable `setField`
   * reference directly — no per-field closure — keeping `memo` effective.
   */
  onChange: (symbol: string, value: string) => void;
}

/** One labelled numeric input row. */
function CalcField({ variable, name, value, onChange }: CalcFieldProps) {
  const { t } = useTranslation();
  const inputId = `calc-input-${variable.symbol}`;

  return (
    <div className="calc-field">
      <label className="calc-label" htmlFor={inputId}>
        <Latex tex={symbolToTex(variable.symbol)} className="calc-symbol" />
        <span className="calc-name">{name}</span>
        <span className="calc-unit">{variable.unit}</span>
      </label>
      <input
        type="number"
        className="calc-input"
        value={value}
        onChange={(e) => onChange(variable.symbol, e.target.value)}
        placeholder={t('formula.enter_value')}
        step="any"
        id={inputId}
      />
    </div>
  );
}

/**
 * Memoized: a keystroke in one field updates only that field's `value`;
 * `variable`/`name` and the `onChange` ref are stable, so the other rows
 * (each rendering a KaTeX `<Latex>`) skip re-render.
 */
export default memo(CalcField);
