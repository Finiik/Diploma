/**
 * Convert an informal variable *symbol* (as stored in `FormulaVariable.symbol`)
 * into valid LaTeX so it can go through the shared `<Latex>` / `renderLatex`
 * boundary instead of being printed verbatim.
 *
 * The `symbol` field is *also a logical key* (calculator state, result maps,
 * React keys) so it must not be mutated in the data — this converts at render
 * time only.
 *
 * The data uses an ad-hoc notation that is *almost* LaTeX:
 *
 * - `V_max`, `K_m`, `pK_a`  — an ASCII `_` whose subscript is the whole rest
 *   of the token, not just the next character (so it needs braces:
 *   `V_max` → `V_{max}`, matching the canonical `formula.latex`).
 * - `m_теор`, `H_прод`      — a Cyrillic subscript. KaTeX has no Cyrillic in
 *   math mode, so the subscript is wrapped in `\text{…}`, exactly the
 *   convention the hand-written `formula.latex` strings already use
 *   (`m_{\text{теор}}`). `\text` picks up the page font, which *does* have
 *   Cyrillic — bare Cyrillic in math mode would render as tofu.
 * - `p²`, `N₀`, `θ₂`, `[A⁻]`, `Mᵣ`, `V_CO₂` — Unicode super/subscript
 *   characters, which KaTeX rejects in math mode; they are folded back into
 *   `^{…}` / `_{…}` groups.
 * - `α`, `ρ_f`, `ΔC`, `θ₂`  — Greek letters → the matching `\command`.
 * - `T½` → `T_{1/2}` (half-life), `%` → `\%` (a TeX comment otherwise).
 *
 * Plain ASCII identifiers (`v`, `S`, `BMI`, `dN/dt`, `[HA]`, `H'`) pass
 * through unchanged and render as ordinary math italics.
 */

const GREEK: Record<string, string> = {
  α: '\\alpha',
  β: '\\beta',
  γ: '\\gamma',
  ε: '\\varepsilon',
  η: '\\eta',
  θ: '\\theta',
  λ: '\\lambda',
  μ: '\\mu',
  ρ: '\\rho',
  τ: '\\tau',
  ω: '\\omega',
  Δ: '\\Delta',
  Π: '\\Pi'
};

/** Unicode superscript char → its base character. */
const SUPERSCRIPT: Record<string, string> = {
  '²': '2',
  '⁰': '0',
  '⁺': '+',
  '⁻': '-'
};

/** Unicode subscript char → its base character. */
const SUBSCRIPT: Record<string, string> = {
  ᵣ: 'r',
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3'
};

const isCyrillic = (ch: string) => ch >= 'Ѐ' && ch <= 'ӿ';

/**
 * Per-character pass: Greek → command, runs of Unicode super/subscripts →
 * `^{…}` / `_{…}`, runs of Cyrillic → `\text{…}`, `½`/`%` special-cased.
 * No ASCII `_` is expected here — {@link symbolToTex} peels that off first.
 */
function convertAtoms(input: string): string {
  let out = '';
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (GREEK[ch]) {
      out += `${GREEK[ch]} `;
      i += 1;
      continue;
    }

    if (SUPERSCRIPT[ch]) {
      let run = '';
      while (i < input.length && SUPERSCRIPT[input[i]]) {
        run += SUPERSCRIPT[input[i]];
        i += 1;
      }
      out += `^{${run}}`;
      continue;
    }

    if (SUBSCRIPT[ch]) {
      let run = '';
      while (i < input.length && SUBSCRIPT[input[i]]) {
        run += SUBSCRIPT[input[i]];
        i += 1;
      }
      out += `_{${run}}`;
      continue;
    }

    if (isCyrillic(ch)) {
      let run = '';
      while (i < input.length && isCyrillic(input[i])) {
        run += input[i];
        i += 1;
      }
      out += `\\text{${run}}`;
      continue;
    }

    if (ch === '½') {
      out += '_{1/2}';
      i += 1;
      continue;
    }

    if (ch === '%' || ch === '&' || ch === '#' || ch === '$') {
      out += `\\${ch}`;
      i += 1;
      continue;
    }

    out += ch;
    i += 1;
  }

  return out;
}

/** Convert one stored `symbol` into a render-safe LaTeX string. */
export function symbolToTex(symbol: string): string {
  const us = symbol.indexOf('_');
  if (us === -1) return convertAtoms(symbol);

  const head = symbol.slice(0, us);
  const tail = symbol.slice(us + 1);
  const tailTex = /^[Ѐ-ӿ]+$/.test(tail) ? `\\text{${tail}}` : symbolToTex(tail);

  return `${symbolToTex(head)}_{${tailTex}}`;
}
