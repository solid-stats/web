---
phase: 02-uikit-structural-data-display-primitives
plan: 02
subsystem: uikit
tags: [data-trust, tailwind-variants, lucide-react, ladle, axe, cls, kit-04, tailwind-v4]

# Dependency graph
requires:
  - phase: 02-uikit-structural-data-display-primitives
    plan: 01
    provides: "Vitest + Playwright-against-Ladle catalog gate (axe/44px/keyboard по meta.json), canonical _fixtures (SS_BASELINE, ROSTER, STRINGS), _state-matrix (StateMatrix/StateCell), compound --color-freshness-* escape-hatch precedent (Smoke)"
provides:
  - "KIT-04 data-trust family — пять colocated Ladle-слайсов: FreshnessPill (model C), ProvenanceLine (model A), TrustBadge (Known/Unknown/Conflict), DataTrustBanner (Stale/Offline/Reconnecting + reserved), InlineReviewRow"
  - "Graduated в публичный barrel @solid-stats/design (src/index.ts) — импортируемы surface-builder'ами фазы 4+"
  - "tests/cls.spec.ts — CLS=0 инвариант для DataTrustBanner (reserved height === filled height)"
  - "Доказанный end-to-end harness на первой реальной family (catalog gate зелёный на 10 историй)"
affects: [02-03-data-table, 02-04-stat-primitives, 02-05-feedback, 02-06-nav-shell, phase-04-overview-surface, phase-06-commander-side-surface]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "tailwind-variants/lite — tailwind-merge-free build tv(): держим все классы литералами, конфликтов нет → merge-проход (и его опциональный peer tailwind-merge) не нужен"
    - "Compound data-trust токен (*-border = `1px solid …`) консьюмится через inline-style var() (sanctioned escape hatch, Smoke-прецедент), НЕ arbitrary value"
    - "Каждая *.stories.tsx — статический StateMatrix (durable axe-поверхность) + Playground (Ladle args/inline-radio); копия из _fixtures/STRINGS, RU+EN"
    - "DataTrustBanner резервирует фиксированную h-10 для kind=reserved → CLS=0 (пустое состояние занимает тот же бокс)"

key-files:
  created:
    - packages/design/src/shared/uikit/FreshnessPill/{index.ts,FreshnessPill.tsx,FreshnessPill.stories.tsx}
    - packages/design/src/shared/uikit/ProvenanceLine/{index.ts,ProvenanceLine.tsx,ProvenanceLine.stories.tsx}
    - packages/design/src/shared/uikit/TrustBadge/{index.ts,TrustBadge.tsx,TrustBadge.stories.tsx}
    - packages/design/src/shared/uikit/DataTrustBanner/{index.ts,DataTrustBanner.tsx,DataTrustBanner.stories.tsx}
    - packages/design/src/shared/uikit/InlineReviewRow/{index.ts,InlineReviewRow.tsx,InlineReviewRow.stories.tsx}
    - packages/design/tests/cls.spec.ts
  modified:
    - packages/design/src/index.ts

decisions:
  - "tailwind-variants/lite вместо tailwind-variants — опциональный peer tailwind-merge не установлен (только в lockfile как peer-констрейнт); /lite не импортирует twMerge, поэтому build проходит без нового install (избежали excluded package-install auto-fix)"
  - "Все три data-trust токен-триплета (freshness/known/unknown/conflict) применяются через inline-style var() единообразно, т.к. *-border компаундный (1px solid …); fill/text тоже var() для симметрии со Smoke-прецедентом"
  - "InlineReviewRow request-link label передаётся консьюмером (story-литерал), а не из STRINGS — это Phase-8 authenticated-surface концерн (D-05), не в Phase-2 Copywriting Contract; «на проверке» берётся из STRINGS"
  - "DataTrustBanner kind включает синтетический `reserved` (absent) для CLS-доказательства — тот же h-10 бокс без иконки/текста/роли"

metrics:
  duration: 30min
  completed: 2026-06-20
  files-created: 16
  files-modified: 1

status: complete
---

# Phase 2 Plan 02: KIT-04 Data-trust Family Summary

**Пять colocated Ladle-слайсов data-trust семейства KIT-04 (FreshnessPill model C, ProvenanceLine model A, TrustBadge Known/Unknown/Conflict, DataTrustBanner Stale/Offline/Reconnecting+reserved, InlineReviewRow), каждый — StateMatrix + Playground, никогда не цветом-в-одиночку, Unknown — литеральное слово (не 0/—), банеры CLS=0, RU+EN из _fixtures, axe-clean / keyboard / ≥44px, graduated в barrel @solid-stats/design и APPROVE на дизайн-ревью — первая реальная family, прогоняющая Wave-0 harness end-to-end.**

## Performance

- **Duration:** ~30 min
- **Tasks:** 3 (все auto, Tasks 1-2 TDD-помечены)
- **Files:** 17 (16 создано, 1 изменён), 700 insertions

## Accomplishments

- **FreshnessPill (model C):** 4 состояния (Актуально / Данные устаревают / Связь потеряна / Переподключение), каждое — Lucide-иконка (`circle`/`circle-dot`/`wifi-off`/`refresh-cw`) + литеральное слово (никогда не цветом-в-одиночку); reconnecting крутит `refresh-cw` за `motion-safe:`. Компаундные `--color-freshness-<state>-{fill,text,border}` через inline-style `var()` (Smoke-прецедент), без arbitrary-значений.
- **ProvenanceLine (model A):** «посчитано из N реплеев · <freshness> · Как считается», `text-2xs text-muted`, `·`-разделители (decorative `aria-hidden`), фокусируемая cyan-ссылка `Как считается` (`type="button"`, `min-h-11`); ручная RU one/few/many плюрализация (1 реплей / 3 реплея / 12 реплеев / 21 реплей). Панель «B» не строится (D-05).
- **TrustBadge:** known/unknown/conflict — литеральное слово (Известно/Неизвестно/Конфликт) + иконка (`circle-check`/`circle-help`/`triangle-alert`), amber для unknown/conflict, `rounded-xs`, НИКОГДА `0`/`—` для Unknown.
- **DataTrustBanner:** stale/offline/reconnecting + синтетический `reserved` — все резервируют один `h-10` бокс → CLS=0; иконка+текст, `role="status"` polite live-region, reconnecting-спин за `motion-safe:`.
- **InlineReviewRow:** тихий amber «на проверке» footnote (transparent bg, `triangle-alert`, cyan request-link) — НЕ filled banner; в истории отрендерен внутри mock-SteamID-списка как доказательство «footnote, не баннер».
- **Barrel graduation:** пять имён (+ типы) в `src/index.ts`; `_fixtures`/`_state-matrix`/Smoke остаются внутренними.
- **CLS-спека:** `tests/cls.spec.ts` ассертит reserved-height === filled-height (QUAL-04).

## Task Commits

1. **Task 1: FreshnessPill (model C) + ProvenanceLine (model A)** — `30ed50d` (feat)
2. **Task 2: TrustBadge + DataTrustBanner + InlineReviewRow** — `b34d9b2` (feat)
3. **Task 3: Graduate KIT-04 family into the barrel + per-family design-review** — `4c51e5f` (feat)

## Decisions Made

- **`tailwind-variants/lite`** (а не `tailwind-variants`): опциональный peer `tailwind-merge` (`>=3.0.0`) присутствует в lockfile лишь как peer-констрейнт, не установлен; `tv()` импортирует `twMerge` на верхнем уровне модуля → build падал `"twMerge" is not exported`. `/lite` — официальный tailwind-merge-free build, не тянет peer; мы держим все классы литералами и не порождаем конфликтующих утилит, так что merge-проход не нужен. Это **избежало** excluded package-install auto-fix (Rule 3 исключение).
- **Единообразный inline-style `var()` для всех трёх токен-триплетов** (freshness/known/unknown/conflict): `*-border` — компаундный (`1px solid …`), поэтому требует escape-hatch; `fill`/`text` тоже через `var()` для симметрии со Smoke. Линтер/ревьюер не флагает (carried_forward из 01-04).
- **`reserved` как синтетический BannerKind** для CLS-доказательства — пустой бокс той же высоты, без `role`/иконки/текста.
- **InlineReviewRow request-link label** передаётся консьюмером, не из STRINGS (Phase-8 authenticated concern, D-05); «на проверке» — из STRINGS.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] tailwind-variants → tailwind-variants/lite (отсутствующий опциональный peer tailwind-merge)**
- **Found during:** Task 1 (первый `ladle build` с `tv()` в репо)
- **Issue:** `tailwind-variants@3.2.2` импортирует `twMerge` из опционального peer `tailwind-merge`, которого нет в node_modules (в lockfile — только peer-констрейнт). Rollup падал: `"twMerge" is not exported by … tailwind-merge`. Wave-0 поставил `tailwind-variants`, но ни разу не собирал с `tv()`.
- **Fix:** переключил оба компонента (и далее все пять) на `tailwind-variants/lite` — официальный merge-free build, не требующий peer. Установка нового пакета НЕ делалась (excluded auto-fix).
- **Files modified:** все `*.tsx` с `tv()`
- **Verification:** `ladle build` зелёный; catalog gate 35/35.
- **Committed in:** 30ed50d (Task 1), распространено на b34d9b2

**2. [Rule 2 - Missing Critical] CLS-спека для DataTrustBanner**
- **Found during:** Task 2 (acceptance criteria требует assert reserved-height === filled-height)
- **Issue:** catalog.spec покрывает axe/44px/keyboard, но не CLS. План требует ассертить CLS=0 «в cls.spec или catalog spec».
- **Fix:** создал `tests/cls.spec.ts` — `reserved` боксу boundingBox().height === filled-баннеру.
- **Files modified:** packages/design/tests/cls.spec.ts
- **Verification:** спека зелёная (reserved=filled height).
- **Committed in:** b34d9b2 (Task 2)

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing-critical). Скоупа не расширяли.

## Issues Encountered

- **Stale Wave-0 `ladle preview` server squatting on port 61000.** Первый прогон catalog-спеки давал 12 таймаутов `waitForSelector([data-storyloaded])` — leftover preview-сервер с порта 61000 (build только со `smoke--tokens`) переиспользовался Playwright'ом (`reuseExistingServer: true`), отдавая старый `build/`. `pkill -f 'ladle preview'` + чистый прогон → 35/35 зелёных. (Контроль на будущее: убивать leftover preview-серверы перед прогоном спек в worktree.)
- **Node 24.16 vs ожидаемый 25:** только WARN (как в Wave-0), не блокер.

## Design Review (per-family, 7 pillars)

**Verdict: APPROVE** (0 findings).
- **Pillar 1 (токены/контраст):** нет arbitrary-значений / raw-hex (grep чисто); компаундный `*-border` через sanctioned inline-style `var()`. 7 `design.md lint` контраст-**warning** (вкл. `badge-unknown`/`badge-conflict`) — ложноположительные heuristic-а: контраст текста считается против translucent-alpha заливки (`#f2b33d26`), а не композита заливка-над-gunmetal; pre-existing (то же на `badge-outcome-*`/`badge-status-*`), warning-уровень, опровергается axe на реальном DOM.
- **Pillar 3 (a11y):** axe-core 0 serious/critical на всех 10 историях; каждый семантический цвет в паре с иконкой+словом; `min-h-11` (44px) на ссылках; motion за `motion-safe:` под `reducedMotion: reduce`; банер — polite `role="status"`.
- **Pillar 2/5 (CLS/responsive):** reserved === filled height; нет горизонтального overflow на 360px; «Данные устаревают» не клипается (пилюли переносятся).
- **Pillar 6 (domain):** Unknown — литеральное слово (не 0/—); freshness-словарь фиксирован; InlineReviewRow — footnote внутри списка, не баннер; панель «B» отсутствует (D-05).
- **Validation Gaps:** CWV (LCP/INP) через Chrome DevTools MCP не мерилось — N/A для статического fixture-каталога без fetch/route; CLS доказан =0 спекой. SEO (Pillar 7) N/A — это примитивы каталога, не публичные роуты.

## Verification (plan `<verify>`)

- ✅ `pnpm --filter @solid-stats/design exec playwright test` — **35/35 green** (axe serious/critical=0, 44px, keyboard, CLS=0, 360px no-clip).
- ✅ Barrel экспортит все пять KIT-04 слайсов; `_fixtures`/`_state-matrix`/Smoke отсутствуют.
- ✅ `solidstats-frontend-react-design-review` — **APPROVE** для семейства.
- ✅ Root `pnpm check` — **exit 0** (format + lint + tsgo + design.md lint errors=0; theme.css без дрейфа).
- ✅ `grep -rE 'bg-\[|p-\[|text-\[|#[0-9A-Fa-f]{6}'` по всем пяти слайсам — **чисто** (только `var(--color-*)` inline-style).

## Self-Check: PASSED

- 6/6 ключевых созданных файлов присутствуют на диске.
- Все 3 коммита задач существуют (`30ed50d`, `b34d9b2`, `4c51e5f`).
- Verification block: Playwright 35/35; CLS-спека зелёная; root `pnpm check` exit 0; нет arbitrary-значений; barrel чист (5 экспортов, helpers/Smoke отсутствуют); дерево чистое (нет test-results / debug-спек).

## Next Phase Readiness

- KIT-04 семейство импортируемо из `@solid-stats/design` — surface-builder'ы фаз 4+ (Overview, профиль игрока, КС-карточка) берут готовые reviewed-примитивы.
- Harness доказан end-to-end на первой реальной family: любая следующая family-история автоматически проходит axe/44px/keyboard по `meta.json`; CLS-инвариант для будущих банеров переиспользует паттерн `tests/cls.spec.ts`.
- `tailwind-variants/lite` — установленный паттерн `tv()` для всех последующих слайсов фазы 2 (data-table, stat-primitives, feedback, nav-shell).

---
*Phase: 02-uikit-structural-data-display-primitives*
*Completed: 2026-06-20*
