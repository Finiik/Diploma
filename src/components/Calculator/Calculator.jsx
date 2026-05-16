import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import katex from 'katex';
import './Calculator.css';

export default function Calculator({ formula }) {
  const { t, i18n } = useTranslation();
  const isUk = i18n.language === 'uk';
  const inputVars = formula.variables.filter(v => v.type === 'input');
  const resultVar = formula.variables.find(v => v.type === 'result');

  const [values, setValues] = useState(() => {
    const init = {};
    inputVars.forEach(v => {
      init[v.symbol] = v.defaultValue !== undefined ? v.defaultValue : '';
    });
    return init;
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (symbol, value) => {
    setValues(prev => ({ ...prev, [symbol]: value }));
    setError('');
  };

  const handleCalculate = () => {
    const numValues = {};
    for (const v of inputVars) {
      const val = parseFloat(values[v.symbol]);
      if (isNaN(val)) {
        setError(t('formula.invalid_value', { name: isUk ? v.name : (v.nameEn || v.name) }));
        return;
      }
      numValues[v.symbol] = val;
    }

    try {
      const computed = formula.compute(numValues);
      setResult(computed);
      setError('');
    } catch (e) {
      setError(t('formula.calc_error'));
    }
  };

  const formatResult = (val) => {
    if (typeof val === 'number') {
      return Number.isInteger(val) ? val.toString() : val.toFixed(4).replace(/\.?0+$/, '');
    }
    return val;
  };

  const renderedLatex = katex.renderToString(formula.latex, {
    throwOnError: false,
    displayMode: true
  });

  return (
    <div className="calculator" id="formula-calculator">
      <h3 className="calculator-title">{t('formula.calculate')}</h3>
      <div
        className="calculator-formula"
        dangerouslySetInnerHTML={{ __html: renderedLatex }}
      />

      <div className="calculator-inputs">
        {inputVars.map(v => (
          <div key={v.symbol} className="calc-field">
            <label className="calc-label">
              <span className="calc-symbol">{v.symbol}</span>
              <span className="calc-name">{isUk ? v.name : (v.nameEn || v.name)}</span>
              <span className="calc-unit">{v.unit}</span>
            </label>
            <input
              type="number"
              className="calc-input"
              value={values[v.symbol]}
              onChange={(e) => handleChange(v.symbol, e.target.value)}
              placeholder={t('formula.enter_value')}
              step="any"
              id={`calc-input-${v.symbol}`}
            />
          </div>
        ))}
      </div>

      {error && <p className="calc-error">{error}</p>}

      <button className="calc-button" onClick={handleCalculate} id="calc-button">
        {t('formula.calculate')}
      </button>

      {result !== null && (
        <div className="calc-result animate-scale-in" id="calc-result">
          <span className="calc-result-label">{t('formula.result')}:</span>
          {formula.multiResult && typeof result === 'object' ? (
            <div className="calc-multi-result">
              {Object.entries(result).map(([key, val]) => (
                <div key={key} className="calc-result-row">
                  <span className="calc-result-key">{key}</span>
                  <span className="calc-result-value">{formatResult(val)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="calc-result-row">
              <span className="calc-result-key">{resultVar?.symbol}</span>
              <span className="calc-result-value">
                {formatResult(result)} {resultVar?.unit}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
