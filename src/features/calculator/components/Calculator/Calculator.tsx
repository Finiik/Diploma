import { useTranslation } from 'react-i18next';
import type { ComputableFormula } from '@/shared/types/domain';
import { useLocalized } from '@/shared/hooks/useLocalized';
import { useCalculator } from '@/features/calculator/hooks/useCalculator';
import Latex from '@/shared/ui/Latex/Latex';
import CalcField from './CalcField';
import CalcResult from './CalcResult';
import './Calculator.css';

interface CalculatorProps {
  formula: ComputableFormula;
}

export default function Calculator({ formula }: CalculatorProps) {
  const { t } = useTranslation();
  const tr = useLocalized();
  const { values, result, error, setField, calculate, inputVars, resultVar } =
    useCalculator(formula);

  return (
    <div className="calculator" id="formula-calculator">
      <h3 className="calculator-title">{t('formula.calculate')}</h3>
      <Latex tex={formula.latex} display className="calculator-formula" />

      <div className="calculator-inputs">
        {inputVars.map((v) => (
          <CalcField
            key={v.symbol}
            variable={v}
            name={tr(v, 'name')}
            value={values[v.symbol]}
            onChange={(value) => setField(v.symbol, value)}
          />
        ))}
      </div>

      {error && (
        <p className="calc-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <button className="calc-button" onClick={calculate} id="calc-button">
        {t('formula.calculate')}
      </button>

      {result !== null && (
        <CalcResult
          result={result}
          multiResult={!!formula.multiResult}
          resultSymbol={resultVar?.symbol}
          resultUnit={resultVar?.unit}
        />
      )}
    </div>
  );
}
