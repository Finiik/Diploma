/* Contract test — firestore.rules must stay in lockstep with the
   collection ids the client actually uses (FIRESTORE_COLLECTIONS).

   This guards the exact bug class that shipped once already: a collection
   renamed in code while the rules still grant the *old* path. Every
   read/write is then server-denied the moment Firebase is configured —
   and the app's blanket offline error-swallowing hides it, so it never
   surfaces at runtime. A pure text assertion catches it in the normal
   vitest gate, with no emulator and no new dependency. */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { FIRESTORE_COLLECTIONS } from '@/shared/firebase/collections';

const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');

/**
 * Top-level collection ids the rules grant access to — i.e. the literal
 * first path segment of every `match /<seg>/…`, excluding the
 * `/databases/{database}/documents` wrapper and the `{document=**}`
 * deny-all catch-all (whose segment starts with `{`, so it can't match).
 */
function ruledCollections(src: string): Set<string> {
  const out = new Set<string>();
  for (const m of src.matchAll(/match\s+\/([A-Za-z_][A-Za-z0-9_]*)\//g)) {
    if (m[1] !== 'databases') out.add(m[1]);
  }
  return out;
}

describe('firestore.rules ↔ FIRESTORE_COLLECTIONS', () => {
  const ruled = ruledCollections(rules);
  const used = new Set<string>(Object.values(FIRESTORE_COLLECTIONS));

  it('grants a rule for every collection the client uses', () => {
    for (const id of used) expect([...ruled]).toContain(id);
  });

  it('grants no rule for a collection the client never uses', () => {
    for (const id of ruled) expect([...used]).toContain(id);
  });

  it('keeps the deny-by-default catch-all', () => {
    expect(rules).toMatch(/match\s+\/\{document=\*\*\}\s*\{[^}]*if false/);
  });
});
