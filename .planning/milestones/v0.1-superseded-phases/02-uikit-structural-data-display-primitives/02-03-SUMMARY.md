---
phase: 02-uikit-structural-data-display-primitives
plan: 03
subsystem: uikit
tags: [feedback, kit-07, tailwind-variants, lucide-react, ladle, axe, cls, skeleton, tailwind-v4]

# Dependency graph
requires:
  - phase: 02-uikit-structural-data-display-primitives
    plan: 01
    provides: "Vitest + Playwright-against-Ladle catalog gate (axe/44px/keyboard по meta.json), _fixtures (STRINGS RU+EN), _state-matrix (StateMatrix/StateCell)"
  - phase: 02-uikit-structural-data-display-primitives
    plan: 02
    provides: "Установленный tv()-паттерн на tailwind-variants/lite, colocated component-shape (index.ts + Component.tsx + Component.stories.tsx, story = статический StateMatrix), tests/cls.spec.ts CLS=0 паттерн"
provides:
  - "KIT-07 feedback family — шесть colocated Ladle-слайсов: Badge (outcome-win/loss + status-pending/approved/rejected), Pill (rounded-full, semantic tones), Skeleton (text/tile/table CLS=0), EmptyState (h3+body+total-count), ErrorState (system vs user), Toast (4 semantic variants, visual-only)"
  - "Skeleton table-вариант — reusable reserved-dimension (fixed colgroup + header + N×ROW_H 52/44) для loading-стейта KIT-02 data-table (Plan 06)"
  - "ROW_H = {comfortable: 52, compact: 44} экспортирован из barrel — единый источник высоты строки для skeleton↔table"
  - "tests/cls.spec.ts расширен Skeleton CLS=0 инвариантом (skeleton box height+width === final table)"
  - "Три status-строки (statusPending/Approved/Rejected, RU+EN) добавлены в _fixtures/STRINGS"
  - "Graduated в публичный barrel @solid-stats/design (src/index.ts) — 6 KIT-07 + 5 KIT-04 = 11 экспортов"
affects: [02-04-stat-primitives, 02-05-nav-shell, 02-06-data-table, phase-04-overview-surface, phase-06-commander-side-surface, phase-08-authenticated-surfaces]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Семантические токены win/loss/warn/info — простые значения (не компаундные как freshness-триплеты), поэтому fill/text/border консьюмятся обычными Tailwind-утилитами (bg-win-weak text-win border-win-border) литералами в tv(), БЕЗ inline-style escape-hatch"
    - "Skeleton CLS=0: table-вариант резервирует точный colgroup (inline gridTemplateColumns — числовая геометрия данных, не themable свойство, прецедент DataTrustBanner reserved-height) + density ROW_H; shimmer = animate-pulse (opacity-only), motion-reduce:animate-none"
    - "Toast — VISUAL-only примитив (surface+icon+message+optional action), НЕТ portal/queue/trigger (Phase 3); action — реальный <button> с cyan focus-ring (ProvenanceLine-прецедент outline-2 outline-primary) + min-h-11"
    - "ErrorState kind=system|user через tv(): system = ref id {id} + contact path (errors.md), user = by-field fix; recovery action всегда present, role=alert"

key-files:
  created:
    - packages/design/src/shared/uikit/Badge/{index.ts,Badge.tsx,Badge.stories.tsx}
    - packages/design/src/shared/uikit/Pill/{index.ts,Pill.tsx,Pill.stories.tsx}
    - packages/design/src/shared/uikit/Skeleton/{index.ts,Skeleton.tsx,Skeleton.stories.tsx}
    - packages/design/src/shared/uikit/EmptyState/{index.ts,EmptyState.tsx,EmptyState.stories.tsx}
    - packages/design/src/shared/uikit/ErrorState/{index.ts,ErrorState.tsx,ErrorState.stories.tsx}
    - packages/design/src/shared/uikit/Toast/{index.ts,Toast.tsx,Toast.stories.tsx}
  modified:
    - packages/design/src/index.ts
    - packages/design/src/shared/uikit/_fixtures/strings.ts
    - packages/design/tests/cls.spec.ts

decisions:
  - "Семантические токены win/loss/warn/info применены через обычные Tailwind-утилиты (bg-win-weak/text-win/border-win-border), НЕ через inline-style var() — в отличие от KIT-04 freshness/known/unknown триплетов (их *-border компаундный `1px solid …`). Здесь -border = простое rgba-значение → Tailwind border-*-border резолвится напрямую, escape-hatch не нужен"
  - "Skeleton table-вариант резервирует геометрию через inline-style gridTemplateColumns/height (числовые px размеры колонок/строк) — это данные, а не themable свойство (тот же класс, что reserved h-10 у DataTrustBanner), поэтому не arbitrary-value нарушение"
  - "ROW_H {comfortable:52, compact:44} экспортирован публично — KIT-02 (Plan 06) переиспользует ту же константу для table↔skeleton консистентности (D-01)"
  - "Status-вокабуляр (statusPending/Approved/Rejected RU+EN) добавлен в STRINGS — Copywriting Contract перечисляет только outcome badges (П/пор.), но badge-status-* варианты требуют RU+EN parity (Rule 2 — required для QUAL-05/Pillar-6 fixed set)"
  - "Toast action focus-ring через focus-visible:outline-2 outline-offset-2 outline-primary (ProvenanceLine/InlineReviewRow прецедент), НЕ shadow-(--shadow-ring) — соответствие установленному паттерну, избегает arbitrary-property синтаксиса"

metrics:
  duration: 28min
  completed: 2026-06-20
  files-created: 18
  files-modified: 3

status: complete
---

# Phase 2 Plan 03: KIT-07 Feedback Family Summary

**Шесть colocated Ladle-слайсов feedback-семейства KIT-07 — Badge (outcome-win/loss + status-pending/approved/rejected, rounded-xs, icon+label), Pill (rounded-full, semantic tones), Skeleton (text/tile/table, CLS=0, opacity-only shimmer, motion-reduce), EmptyState (h3+body+total-count, никогда не пустой экран), ErrorState (system ref-id+contact vs user by-field fix), Toast (4 semantic variants, visual-only — БЕЗ portal/queue/trigger) — каждый StateMatrix+Playground, никогда не цветом-в-одиночку, RU+EN из _fixtures, axe-clean / keyboard / ≥44px, Skeleton table резервирует точный colgroup+ROW_H для KIT-02, graduated в barrel @solid-stats/design и APPROVE на дизайн-ревью.**

## Performance

- **Duration:** ~28 min
- **Tasks:** 3 (все auto; Tasks 1-2 TDD-помечены — «тест» = catalog gate + cls.spec)
- **Files:** 21 (18 создано, 3 изменено)

## Accomplishments

- **Badge:** один `variant`-union (outcome-win/loss + status-pending/approved/rejected) через `tv()` по рецептам DESIGN.md `badge-outcome-*` (L295-308) / `badge-status-*` (L309-329); каждый вариант — Lucide-иконка (trending-up/down, clock, badge-check, x-circle) + литеральный label, `rounded-xs`, семантический токен (win/loss/info weak-fill+border), НИКОГДА не цветом-в-одиночку.
- **Pill:** дженерик `rounded-full` чип с опциональным `tone` (neutral/win/loss/warn/info), всегда icon+label — общий примитив (freshness — свой KIT-04 слайс).
- **Skeleton:** три reserved-dimension варианта. `table` воспроизводит фиксированный colgroup + header + N×ROW_H (52 comfortable / 44 compact, D-01) → пара 1:1 с loading-стейтом KIT-02 (Plan 06); shimmer = `animate-pulse` (opacity-only), статичен под `motion-reduce:`; `aria-busy`/`aria-hidden`. `ROW_H` экспортирован.
- **EmptyState:** `h3` + body + опциональная total-count строка (filtered «сбросьте фильтры … всех (N)») + 24px Lucide-иконка, reserved `min-h-48`, контейнер по рецепту `card` — никогда не пустой экран.
- **ErrorState:** `kind=system|user` через `tv()`: system = ref id `{id}` + contact path (errors.md server-error → request id + контакт), user = by-field fix; recovery action всегда present, `role="alert"`.
- **Toast:** VISUAL-only примитив — 4 семантических варианта (success/error/warn/info), icon+message+опциональный action (`<button>` с cyan focus-ring + `min-h-11`), `shadow-lg` (плавает), `role="status"`. НЕТ portal/queue/trigger (Phase 3, 02-CONTEXT Deferred Ideas).
- **Barrel graduation:** 6 KIT-07 имён (+типы) в `src/index.ts` отдельным блоком ниже KIT-04; helpers/Smoke остаются внутренними (11 экспортов всего).
- **CLS-спека:** `tests/cls.spec.ts` расширен Skeleton-инвариантом (skeleton table box height+width === final table) через `Proof`-историю.

## Task Commits

1. **Task 1: Badge (outcome/status) + Pill (rounded-full)** — `e3a5a7d` (feat)
2. **Task 2: Skeleton (CLS=0) + EmptyState + ErrorState + Toast (visual-only)** — `f974183` (feat)
3. **Task 3: Graduate KIT-07 family into the barrel + per-family design-review** — `ccfc1b0` (feat)

## Decisions Made

- **Простые семантические токены через обычные Tailwind-утилиты** (а не inline-style `var()`): KIT-04 freshness/known/unknown триплеты требовали escape-hatch, т.к. их `*-border` компаундный (`1px solid …`). Здесь `--color-win-border` и т.д. — простое `rgba()`-значение, поэтому `border border-win-border` резолвится напрямую; `bg-win-weak`/`text-win` тоже обычные утилиты. Все классы литералами в `tv()`, 0 arbitrary-значений.
- **Skeleton геометрия через inline-style** (`gridTemplateColumns`, `height`): числовые px-размеры колонок/строк — это **данные** (форма таблицы), а не themable свойство; тот же sanctioned класс, что reserved `h-10` у DataTrustBanner. Не arbitrary-value нарушение.
- **`ROW_H` экспортирован публично** ({comfortable:52, compact:44}) — KIT-02 data-table (Plan 06) берёт ту же константу для table↔skeleton консистентности; иначе высоты разъедутся и CLS≠0.
- **Status-вокабуляр добавлен в STRINGS** (statusPending/Approved/Rejected RU+EN): Copywriting Contract перечисляет outcome badges (П/пор.), но badge-status-* варианты требуют RU+EN parity для QUAL-05 / design-review Pillar-6 fixed set (Rule 2 — required functionality).
- **Toast action focus-ring** через установленный `focus-visible:outline-2 outline-offset-2 outline-primary` (ProvenanceLine/InlineReviewRow прецедент), не `shadow-(--shadow-ring)` arbitrary-property синтаксис.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Status-вокабуляр (Pending/Approved/Rejected) в _fixtures/STRINGS**
- **Found during:** Task 1 (Badge stories требуют RU+EN labels для status-* вариантов)
- **Issue:** `_fixtures/STRINGS` нёс только `outcomeWin`/`outcomeLoss`; badge-status-pending/approved/rejected варианты не имели copy. Copywriting Contract (02-UI-SPEC) явно перечисляет только outcome badges, но Component Inventory называет status-вокабуляр fixed set, а acceptance criteria требует «RU + EN labels render from _fixtures/STRINGS» для всех вариантов Badge.
- **Fix:** добавлены `statusPending` (На рассмотрении / Pending), `statusApproved` (Одобрено / Approved), `statusRejected` (Отклонено / Rejected) в STRINGS, co-located с прочей copy. Vitest parity-тест (все ключи RU+EN) остался зелёным (49/49).
- **Files modified:** packages/design/src/shared/uikit/_fixtures/strings.ts
- **Verification:** Badge stories рендерят RU+EN из STRINGS; design-review Pillar-6 fixed set подтверждён.
- **Committed in:** e3a5a7d (Task 1)

**2. [Rule 2 - Missing Critical] Skeleton CLS=0 спека**
- **Found during:** Task 2 (acceptance criteria: «skeleton-vs-final cells have equal boundingBox().height — asserted by the catalog/cls spec»)
- **Issue:** `cls.spec.ts` покрывал только DataTrustBanner reserved===filled; Skeleton CLS=0 инвариант не ассертился.
- **Fix:** добавлен `Skeleton CLS = 0` describe + `Proof`-история (table skeleton над реальной таблицей с идентичным colgroup+ROW_H); ассерт skeleton box height И width === final table.
- **Files modified:** packages/design/tests/cls.spec.ts, Skeleton.stories.tsx (Proof story)
- **Verification:** спека зелёная (height+width совпадают).
- **Committed in:** f974183 (Task 2)

**Total deviations:** 2 auto-fixed (оба missing-critical). Скоупа не расширяли — обе закрывают явные acceptance criteria.

## Issues Encountered

- **Worktree path inode:** `git rev-parse --show-toplevel` отдаёт `.agents/worktrees/...`, а Write/Edit требуют `.claude/worktrees/...` (симлинк `.claude → .agents`, тот же inode — как в 01-04/02-02). Использован `.claude/...`-префикс для Write/Edit/Read; Bash работает с любым.
- **`pnpm check` формат-фикс:** Toast.tsx multi-line lucide-import был свёрнут форматтером (`vp check --fix`) в одну строку — чисто косметика, diff подтверждён. Badge.tsx import форматтер не тронул (уже однострочный после анализа). После фикса root `pnpm check` exit 0.
- **Node 24.16 vs ожидаемый 25:** только WARN (как в Wave-0/2), не блокер.

## Design Review (per-family, 7 pillars)

**Verdict: APPROVE** (0 findings).
- **Pillar 1 (токены/контраст):** 0 arbitrary-значений / raw-hex по всем шести слайсам (grep чисто); семантические цвета по смыслу (win/loss/warn/info + weak/border); cyan (`text-primary`) только на Toast action (interactive). `design.md lint` errors=0 (86 warnings — pre-existing heuristic-ложноположительные, как в Plan 02).
- **Pillar 2 (CLS):** Skeleton table воспроизводит точный colgroup+header+N×ROW_H; `cls.spec` ассертит skeleton box height И width === final table (CLS=0). Shimmer animate-pulse (opacity-only), статичен под motion-reduce. Inline-style Skeleton — числовая геометрия (данные), не themable свойство (прецедент DataTrustBanner).
- **Pillar 3 (a11y):** axe 0 serious/critical на всех 12 KIT-07 историях; никогда не цветом-в-одиночку (icon+label везде); Toast action — видимый cyan focus-ring + ≥44px, keyboard-reachable; EmptyState — реальный `<h3>`; ErrorState `role="alert"`, Toast `role="status"`.
- **Pillar 4 (×5 endings):** эти шесть примитивов ЕСТЬ scenario-ending вокабуляр — success/warn/info/error (Toast), loading (Skeleton), empty+onboarding (EmptyState), system vs user error (ErrorState).
- **Pillar 6 (domain):** Lucide-only (нет emoji/глифов); status-вокабуляр — fixed set (Pending/Approved/Rejected); rounded-xs badges vs rounded-full pills; RU читается естественно, не клипается.
- **Validation Gaps:** CWV (LCP/INP) через Chrome DevTools MCP — N/A для статического fixture-каталога без fetch/route (CLS доказан =0 спекой); SEO (Pillar 7) N/A — примитивы каталога, не публичные роуты; multi-breakpoint скриншоты — chromium-only локально, матрица под CI (статические StateMatrix, нет overflow-риска).

## Verification (plan `<verify>`)

- ✅ `pnpm exec ladle build` — зелёный (все 6 слайсов скомпилированы, meta.json создан).
- ✅ `pnpm exec playwright test` — **75/75 green** (KIT-04 + KIT-07 catalog axe serious/critical=0, 44px, keyboard; DataTrustBanner CLS=0; Skeleton CLS=0 height+width).
- ✅ `pnpm --filter @solid-stats/design test` (Vitest) — **49/49 green** (STRINGS RU+EN parity покрывает 3 новых status-ключа).
- ✅ Root `pnpm check` — **exit 0** (format: 60 files clean; lint: 54 files 0 errors; tsgo; design.md lint errors=0; theme.css без дрейфа).
- ✅ Barrel: `import { Skeleton, EmptyState, ErrorState, Toast, Badge, Pill } from "@solid-stats/design"` резолвится (6 KIT-07 + 5 KIT-04 = 11 экспортов; helpers/Smoke отсутствуют).
- ✅ `grep -rE 'bg-\[|p-\[|text-\[|rounded-\[|h-\[|w-\[|#[0-9A-Fa-f]{6}'` по всем 6 слайсам — **чисто** (0 arbitrary).
- ✅ Badge без `rounded-full`; Pill с `rounded-full` (grep подтверждён).
- ✅ Toast без `createPortal`/`useToast`/queue/setTimeout в коде (только комментарий упоминает — visual-only).
- ✅ Skeleton shimmer opacity-only (`animate-pulse`/`motion-reduce:animate-none`); нет анимации layout-свойств.
- ✅ `solidstats-frontend-react-design-review` — **APPROVE** (7 pillars, 0 findings).

## Self-Check: PASSED

- 6/6 ключевых созданных файлов присутствуют на диске (Badge/Pill/Skeleton/EmptyState/ErrorState/Toast .tsx).
- Все 3 коммита задач существуют (`e3a5a7d`, `f974183`, `ccfc1b0`).
- Verification block: Playwright 75/75; Vitest 49/49; Skeleton CLS-спека зелёная; root `pnpm check` exit 0; нет arbitrary-значений; barrel чист (11 экспортов, helpers/Smoke отсутствуют).

## Next Phase Readiness

- KIT-07 feedback-семейство импортируемо из `@solid-stats/design` — surface-builder'ы фаз 4+ берут готовые reviewed scenario-ending примитивы (success/error/loading/onboarding/empty).
- **Skeleton table-вариант + `ROW_H`** — durable seam для KIT-02 data-table loading-стейта (Plan 06): та же константа высоты строки и colgroup-резервирование гарантируют CLS=0 при table↔skeleton свопе.
- `tests/cls.spec.ts` теперь несёт два CLS=0 инварианта (DataTrustBanner + Skeleton) — паттерн для будущих reserved-dimension компонентов.
- Status-вокабуляр (Pending/Approved/Rejected) в STRINGS готов для Phase-8 authenticated/moderation surfaces.

---
*Phase: 02-uikit-structural-data-display-primitives*
*Completed: 2026-06-20*
