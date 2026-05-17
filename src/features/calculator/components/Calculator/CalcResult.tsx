import { useTranslation } from 'react-i18next';
import Latex from '@/shared/ui/Latex/Latex';
import { symbolToTex } from '@/shared/lib/symbol-tex';
import {
  formatResult,
  type CalcResult as CalcResultValue
} from '@/features/calculator/lib/calculator';

interface CalcResultProps {
  result: CalcResultValue;
  multiResult: boolean;
  resultSymbol?: string;
  resultUnit?: string;
}

/** Renders the computed value(s): one row, or several for multi-result formulas. */
export default function CalcResult({
  result,
  multiResult,
  resultSymbol,
  resultUnit
}: CalcResultProps) {
  const { t } = useTranslation();

  return (
    <div className="calc-result animate-scale-in" id="calc-result">
      <span className="calc-result-label">{t('formula.result')}:</span>
      {multiResult && typeof result === 'object' ? (
        <div className="calc-multi-result">
          {Object.entries(result).map(([key, val]) => (
            <div key={key} className="calc-result-row">
              <Latex tex={symbolToTex(key)} className="calc-result-key" />
              <span className="calc-result-value">{formatResult(val)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="calc-result-row">
          {resultSymbol && (
            <Latex
              tex={symbolToTex(resultSymbol)}
              className="calc-result-key"
            />
          )}
          <span className="calc-result-value">
            {formatResult(typeof result === 'number' ? result : Number(result))}{' '}
            {resultUnit}
          </span>
        </div>
      )}
    </div>
  );
}
