// KIT-08 SC#4 regression oracle — the committed proof that the typed message-id contract
// is LIVE, not merely declared. `lingui.d.ts` augments Lingui's `Register.messageIds` to
// `keyof typeof STRINGS`, so `i18n._({ id })` only accepts a real catalogued key; an
// unknown id is a compile error.
//
// GREEN/RED SEMANTICS (do NOT "fix" the deliberately-bad id on the export line below):
//   • While the augmentation holds, the unknown id on the export line is a type error — the
//     single `@ts-expect-error` directive on the line above it SUPPRESSES that error → the
//     file type-checks → the gate is GREEN.
//   • If the augmentation ever breaks (the id widens back to `string`), the call stops
//     erroring → the `@ts-expect-error` becomes an UNUSED directive → tsgolint reports it
//     → the gate goes RED. So the typed-key contract cannot silently regress.
//
// This is the ONLY sanctioned suppression in the repo. The file is reachable purely by the
// tsconfig `include` glob (it sits under `src`) — tsgolint type-checks every included file,
// not only imported ones — so it needs no import from any story/runtime path and stays out
// of the public barrel. The exported const is tree-shakeable and never called, so it never
// reaches the Ladle bundle or runtime.
import { i18n } from "./i18n";

// The id-only descriptor is the proven call shape (mirrors every story's `i18n._({ id })`);
// a valid catalogued id type-checks clean, so when the augmentation holds the ONLY error on
// this line is the unknown id — which the directive below consumes (GREEN). Flip the id to a
// real STRINGS key and the line stops erroring → the directive turns UNUSED (TS2578) → RED.
// @ts-expect-error unknown message id must be a compile error (KIT-08 SC#4)
export const UNKNOWN_MESSAGE_ID_IS_A_COMPILE_ERROR = i18n._({ id: "no.such.key.exists" });
