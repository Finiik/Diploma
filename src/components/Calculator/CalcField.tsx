import { useTranslation } from 'react-i18next';
import type { FormulaVariable } from '@/shared/types/domain';

interface CalcFieldProps {
  variable: FormulaVariable;
  /** Already-localized display name. */
  name: string;
  value: string | number;
  onChange: (value: string) => void;
}

/** One labelled numeric input row. */
export default function CalcField({
  variable,
  name,
  value,
  onChange
}: CalcFieldProps) {
  const { t } = useTranslation();
  const inputId = `calc-input-${variable.symbol}`;

  return (
    <div className="calc-field">
      <label className="calc-label" htmlFor={inputId}>
        <span className="calc-symbol">{variable.symbol}</span>
        <span className="calc-name">{name}</span>
        <span className="calc-unit">{variable.unit}</span>
      </label>
      <input
        type="number"
        className="calc-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('formula.enter_value')}
        step="any"
        id={inputId}
      />
    </div>
  );
}
