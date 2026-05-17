import { describe, it, expect } from 'vitest';
import { symbolToTex } from '@/shared/lib/symbol-tex';
import { renderLatex } from '@/shared/lib/katex';

describe('symbolToTex', () => {
  it('braces a multi-character ASCII subscript', () => {
    expect(symbolToTex('V_max')).toBe('V_{max}');
    expect(symbolToTex('K_m')).toBe('K_{m}');
    expect(symbolToTex('pK_a')).toBe('pK_{a}');
    expect(symbolToTex('C_1')).toBe('C_{1}');
  });

  it('wraps a Cyrillic subscript in \\text (matches the formula.latex convention)', () => {
    expect(symbolToTex('m_теор')).toBe('m_{\\text{теор}}');
    expect(symbolToTex('H_прод')).toBe('H_{\\text{прод}}');
    expect(symbolToTex('N_заг')).toBe('N_{\\text{заг}}');
  });

  it('folds Unicode super/subscripts back into ^{} / _{}', () => {
    expect(symbolToTex('p²')).toBe('p^{2}');
    expect(symbolToTex('E⁰')).toBe('E^{0}');
    expect(symbolToTex('[A⁻]')).toBe('[A^{-}]');
    expect(symbolToTex('N₀')).toBe('N_{0}');
    expect(symbolToTex('Mᵣ')).toBe('M_{r}');
    expect(symbolToTex('r₁/r₂')).toBe('r_{1}/r_{2}');
  });

  it('handles a Unicode subscript inside an ASCII subscript (V_CO₂)', () => {
    expect(symbolToTex('V_CO₂')).toBe('V_{CO_{2}}');
    expect(symbolToTex('V_O₂')).toBe('V_{O_{2}}');
  });

  it('maps Greek letters to commands', () => {
    expect(symbolToTex('α')).toBe('\\alpha ');
    expect(symbolToTex('ΔC')).toBe('\\Delta C');
    expect(symbolToTex('ρ_f')).toBe('\\rho _{f}');
    expect(symbolToTex('θ₂')).toBe('\\theta _{2}');
    expect(symbolToTex('ΔT_b')).toBe('\\Delta T_{b}');
  });

  it('special-cases half-life and the percent comment character', () => {
    expect(symbolToTex('T½')).toBe('T_{1/2}');
    expect(symbolToTex('%')).toBe('\\%');
  });

  it('passes plain ASCII identifiers through untouched', () => {
    for (const s of ['v', 'S', 'BMI', 'dN/dt', '[HA]', "H'", '2pq']) {
      expect(symbolToTex(s)).toBe(s);
    }
  });

  it('produces LaTeX that KaTeX renders without an error node', () => {
    const symbols = [
      'v',
      'V_max',
      'K_m',
      'S',
      'pK_a',
      'm_теор',
      'H_прод',
      'p²',
      'N₀',
      'θ₂',
      '[A⁻]',
      'V_CO₂',
      'Mᵣ',
      'ΔT_b',
      'α',
      'ρ_f',
      'T½',
      '%',
      'dN/dt',
      'r₁/r₂'
    ];
    for (const s of symbols) {
      expect(renderLatex(symbolToTex(s))).not.toContain('katex-error');
    }
  });
});
