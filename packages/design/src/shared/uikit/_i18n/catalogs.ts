// KIT-08 runtime i18n catalogs (Lingui v6 RUNTIME mode — no macros, no @lingui/cli;
// Open Question 1 resolution, RESEARCH Pitfall 1). The Phase-2 `STRINGS`
// Record<string, Bilingual> seed is the ONE migration source: each locale catalog is a
// plain `{ id → ICU message string }` map derived from it, so the keys, the RU/EN
// parity, and the typed-key union (lingui.d.ts) all flow from a single declaration —
// `_fixtures/strings.ts` is NOT deleted (existing Phase-2 stories still import it).
//
// Plural copy carries ICU `{n, plural, one{} few{} many{} other{}}` INSIDE the message
// string (see `replayCount`), parsed at runtime by Lingui's CLDR rules — never
// concatenation (localization.md; RESEARCH Pitfall 6).
import { STRINGS } from "../_fixtures/strings";

import type { StringKey } from "../_fixtures/strings";

/** A locale catalog: every copy-element id → its ICU message string in one language. */
export type Catalog = Record<StringKey, string>;

// Object.fromEntries widens to `Record<string, string>`; re-narrow to the typed key
// union (the keys are exactly `keyof typeof STRINGS`, the same source the union derives
// from). This `as Catalog` is safe by construction — the map is built from STRINGS'
// own entries — and keeps a missing/renamed id a tsc error at every catalog consumer.
export const ru = Object.fromEntries(
  Object.entries(STRINGS).map(([key, value]) => [key, value.ru]),
) as Catalog;

export const en = Object.fromEntries(
  Object.entries(STRINGS).map(([key, value]) => [key, value.en]),
) as Catalog;
