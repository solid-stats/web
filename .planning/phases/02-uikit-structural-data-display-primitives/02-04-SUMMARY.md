---
phase: 02-uikit-structural-data-display-primitives
plan: 04
subsystem: uikit
tags: [nav-shell, kit-01, tailwind-variants, lucide-react, ladle, axe, a11y, container-queries, landmarks, tailwind-v4]

# Dependency graph
requires:
  - phase: 02-uikit-structural-data-display-primitives
    plan: 01
    provides: "Vitest + Playwright-against-Ladle catalog gate (axe/44px/keyboard по meta.json), _fixtures (STRINGS RU+EN), _state-matrix (StateMatrix/StateCell)"
  - phase: 02-uikit-structural-data-display-primitives
    plan: 03
    provides: "Установленный tv() на tailwind-variants/lite, colocated component-shape (index.ts + Component.tsx + Component.stories.tsx, story = StateMatrix + Playground), focus-ring через focus-visible:outline / shadow-(--shadow-ring), tests/cls.spec паттерн"
provides:
  - "KIT-01 nav-shell family — четыре colocated Ladle-слайса: SkipLink (sr-only-until-focused → #main), NavBar (desktop top nav, --nav-h h-14, ×7 nav-item states via data-state + tv()), MobileTabBar (bottom tabs, --tabbar-h h-15, ≥44×44 tabs), AppShell (composer: SkipLink → header → main#main → mobile nav)"
  - "NavItem prop-контракт (role-aware items list; denied items absent, NO RBAC — durable seam для v1.0 route-tree + signed-in role) экспортирован из barrel"
  - "tests/keyboard.spec.ts — skip-link reveal-on-focus + #main target + aria-current=page на active item + Tab-no-trap"
  - "tests/responsive.spec.ts — landmark order, no-h-scroll @360px, container-keyed reflow (@md) обе стороны"
  - "Nav-shell copy (skipToContent + nav sections + role slots + landmark aria-labels, RU+EN) добавлен в _fixtures/STRINGS"
  - "Graduated в публичный barrel @solid-stats/design (src/index.ts) — 4 KIT-01 + 6 KIT-07 + 5 KIT-04 = 15 экспортов"
affects: [02-06-data-table, phase-04-overview-surface, phase-06-commander-side-surface, phase-08-authenticated-surfaces, phase-09-all-surfaces]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Forced pseudo-state matrix (RESEARCH Pattern 2): nav/tab item читает опциональный forcedState → data-state атрибут; tv() state-variant маппит каждое из ×7 на ТЕ ЖЕ токен-утилиты, что live hover:/active:/focus-visible:. Класс-строки литералами → Tailwind v4 @source ../src их эмитит"
    - "Active-section маркер: text-primary (cyan) + aria-current=page + before:-pseudo cyan edge bar (left на NavBar, top на MobileTabBar) — три избыточных сигнала, никогда не цветом-в-одиночку"
    - "Container-keyed reflow: AppShell root = @container; desktop header hidden @md:block, MobileTabBar @md:hidden — переключение по ширине КОНТЕЙНЕРА, не viewport (styling.md). nav/tabbar высоты резервированы (h-14/h-15) → CLS=0"
    - "44px hit area на интерактивном элементе (min-h-11 / min-w-11 на <a>, не на glyph) — Pitfall 3; geometry-ассерт в catalog + responsive spec"
    - "--nav-h 56 / --tabbar-h 60 консьюмятся как stock h-14 / h-15 (DESIGN.md layout-блок не эмитится gen-theme как CSS-var; stock spacing токены резолвятся в идентичные px, 0 token drift, 0 arbitrary)"

key-files:
  created:
    - packages/design/src/shared/uikit/SkipLink/{index.ts,SkipLink.tsx,SkipLink.stories.tsx}
    - packages/design/src/shared/uikit/NavBar/{index.ts,NavBar.tsx,NavBar.stories.tsx,navFixtures.ts}
    - packages/design/src/shared/uikit/MobileTabBar/{index.ts,MobileTabBar.tsx,MobileTabBar.stories.tsx}
    - packages/design/src/shared/uikit/AppShell/{index.ts,AppShell.tsx,AppShell.stories.tsx}
    - packages/design/tests/keyboard.spec.ts
    - packages/design/tests/responsive.spec.ts
  modified:
    - packages/design/src/index.ts
    - packages/design/src/shared/uikit/_fixtures/strings.ts

decisions:
  - "--nav-h/--tabbar-h применены как stock h-14 (56px) / h-15 (60px), НЕ как arbitrary h-[56px]: DESIGN.md выносит их в layout-блок, который gen-theme.mjs не эмитит CSS-переменными; stock-токены дают идентичные px (прецедент DataTrustBanner h-10), token drift нулевой"
  - "Nav-icon размер = size-5 (20px) stock-токен, НЕ size-[18px] arbitrary: UI-SPEC допускает 18–20px в nav, 20px — единственный stock-токен в диапазоне"
  - "NavItem (role-aware items list) — durable prop-контракт: denied items просто отсутствуют в переданном списке, NO RBAC/routes (v1.0). navItemsFor/NAV_ROLES story-фикстуры остаются ВНУТРИ слайса (не graduated в barrel) — только компоненты + NavItem/NavItemState типы публичны"
  - "AppShell композирует уже-каталогизированные слайсы через их index.ts (SkipLink/NavBar/MobileTabBar), НЕ через внутренности — D-11 rebuild-not-import соблюдён, hi-fi shell.jsx взят только как markup-семантика"
  - "Reflow keyed off @container (не viewport): AppShell root @container, header @md:block / mobile-nav @md:hidden — styling.md 'prefer @container over viewport branching'. Резервированные nav-высоты → CLS=0"
  - "tests/keyboard.spec + tests/responsive.spec созданы (Rule 2/3): plan <verify> ссылался на них, но существовал только catalog.spec; они несут nav-shell-специфичные инварианты (skip-link reveal, aria-current, landmark order, 360px no-h-scroll, @md reflow), которые generic catalog gate не выражает"

metrics:
  duration: 17min
  completed: 2026-06-20
  files-created: 16
  files-modified: 2

status: complete
---

# Phase 2 Plan 04: KIT-01 Nav-shell Family Summary

**Четыре colocated Ladle-слайса nav-shell-семейства KIT-01 — SkipLink (sr-only-until-focused link → #main, cyan focus-ring), NavBar (desktop top nav, --nav-h h-14, ×7 nav-item states через data-state + tv(), active = cyan + aria-current=page + before:-edge-marker, 44px hit area, Lucide size-5), MobileTabBar (bottom tabs, --tabbar-h h-15, ≥44×44 tab-боксы, тот же tv()+data-state рецепт), AppShell (composer: landmark-порядок SkipLink → header → main#main → mobile nav, role-aware slots, container-keyed reflow @md, CLS=0) — каждый StateMatrix (×7 + роли ×4, RU+EN) + Playground, никогда не цветом-в-одиночку, axe-clean / keyboard / responsive 360px, graduated в barrel @solid-stats/design и APPROVE на дизайн-ревью.**

## Performance

- **Duration:** ~17 min (start 15:40:19Z → end 15:57:07Z)
- **Tasks:** 3 (все auto; Tasks 1-2 TDD-помечены — «тест» = catalog gate + keyboard/responsive specs)
- **Files:** 18 (16 создано, 2 изменено)

## Accomplishments

- **SkipLink:** `sr-only`-until-focused `<a>` → `#main`; на `:focus` становится фиксированным on-screen чипом top-left с `shadow-(--shadow-ring)` cyan-кольцом (focus не спрятан за sticky nav — WCAG 2.4.1 + 2.4.12). Bilingual из STRINGS.
- **NavBar:** sticky `<header>`-host `<nav aria-label>` at `--nav-h` (`h-14`), role-aware `items`. ×7 nav-item states (enabled/hover/pressed/focused/selected/disabled — loading n/a) через `data-state` + `tv()` рецепт (RESEARCH Pattern 2): рецепт несёт И live `hover:`/`active:`/`focus-visible:`, И catalog `data-state`-override. Active = `text-primary` + `aria-current="page"` + cyan `before:` left-edge bar (никогда не цветом-в-одиночку). `min-h-11` (44px) на `<a>`; Lucide `size-5`; backdrop-blur на sticky bar (`bg-bg-1/80`). Whole item — click zone.
- **MobileTabBar:** `<nav aria-label>` bottom tabs at `--tabbar-h` (`h-15`), переиспользует NavBar `tv()`+`data-state` рецепт. Каждый таб — `≥44×44` бокс (`min-h-11 min-w-11`, не glyph — Pitfall 3), icon-over-label, active = cyan + `aria-current` + cyan top-marker. Whole tab — click zone.
- **AppShell:** композирует уже-каталогизированные `SkipLink` + `NavBar` + `MobileTabBar` в landmark-порядке `SkipLink → <header> → <main id="main">{children} → <nav>(mobile)`. Meaningful `<h1>` — ответственность страницы (shell не эмитит). Reflow container-keyed (`@container`): desktop top nav `@md:block`, MobileTabBar `@md:hidden` — primary nav ниже `md`. Резервированные высоты → CLS=0, нет h-scroll на 360px.
- **navFixtures:** общий role-aware источник (роли ×4: signed-out/player/moderator/admin, RU+EN) для всех трёх KIT-01 stories; `squads`/`commanders` — disabled («soon»), так каталог доказывает и disabled-state. Остаётся внутренним (не graduated).
- **Barrel graduation:** 4 KIT-01 имени (+ `NavItem`/`NavItemState` типы) в `src/index.ts` отдельным блоком ниже KIT-07; `navItemsFor`/`NAV_ROLES`/helpers/Smoke остаются внутренними (15 экспортов всего).
- **Тесты:** `keyboard.spec` (skip-link reveal + `#main` + `aria-current` + Tab-no-trap) и `responsive.spec` (landmark order, no-h-scroll @360px, `@md` reflow обе стороны) — созданы для nav-shell-специфичных инвариантов.

## Task Commits

1. **Task 1: SkipLink + NavBar (×7 states via data-state)** — `c2d7598` (feat)
2. **Task 2: MobileTabBar + AppShell (landmarks, role-aware, responsive)** — `897b90f` (feat)
3. **Task 3: Graduate KIT-01 family into the barrel + per-family design-review** — `9ef1122` (feat)

## Decisions Made

- **`--nav-h`/`--tabbar-h` → stock `h-14`/`h-15`** (не arbitrary): DESIGN.md выносит их в `layout:`-блок, который `gen-theme.mjs` не эмитит CSS-переменными; stock spacing-токены резолвятся в идентичные 56/60px (прецедент `DataTrustBanner h-10`). 0 token drift, 0 arbitrary.
- **Nav-icon = `size-5` (20px) stock**, не `size-[18px]`: UI-SPEC допускает 18–20px в nav; 20px — единственный stock-токен в диапазоне.
- **`NavItem` — durable prop-контракт**: role-aware slots = переданный `items`-список, denied items просто отсутствуют (NO RBAC/routes, v1.0). Только компоненты + `NavItem`/`NavItemState` типы публичны; `navItemsFor`/`NAV_ROLES` story-фикстуры внутренние.
- **AppShell композирует через `index.ts`** уже-каталогизированных слайсов (не внутренности); hi-fi `shell.jsx` взят как markup-семантика, не импортирован (D-11).
- **Reflow keyed off `@container`** (не viewport): `styling.md` "prefer @container over viewport branching"; nav-высоты резервированы → CLS=0.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2/3 - Missing Critical] Созданы tests/keyboard.spec.ts + tests/responsive.spec.ts**
- **Found during:** Task 1 (verify) — план `<verify>` ссылался на `tests/keyboard.spec.ts` + `tests/responsive.spec.ts`, но на диске существовали только `catalog.spec.ts` + `cls.spec.ts`.
- **Issue:** generic `catalog.spec` итерирует все stories (axe/44px/keyboard-reachability), но не выражает nav-shell-специфичные инварианты, которые acceptance criteria требует: skip-link reveal-on-focus + `#main` target, `aria-current=page` на active item, landmark-порядок, no-h-scroll @360px, container-keyed reflow обе стороны.
- **Fix:** созданы оба спека. `keyboard.spec` — skip-link sr-only→visible+ring+`#main`, active-item `aria-current`, Tab-no-trap. `responsive.spec` — landmark DOM-порядок, `scrollWidth<=clientWidth` @360px, `@md` reflow (header visible ≥md / mobile-nav visible <md).
- **Files modified:** packages/design/tests/keyboard.spec.ts, packages/design/tests/responsive.spec.ts
- **Verification:** оба зелёные (полный прогон 110/110).
- **Committed in:** c2d7598 (keyboard), 897b90f (responsive)

**2. [Rule 2 - Missing Critical] Nav-shell copy в _fixtures/STRINGS**
- **Found during:** Task 1 (SkipLink + NavBar stories требуют RU+EN labels)
- **Issue:** STRINGS не нёс nav-section labels (overview/players/…), role-slot labels (signin/my-requests/queue/admin), skip-link copy, landmark aria-labels. Copywriting Contract (02-UI-SPEC) перечисляет data/table/freshness копию, но не nav-shell вокабуляр.
- **Fix:** добавлены `skipToContent`, `navOverview/Players/Squads/Bounty/Commanders/Replays`, `navSignIn/MyRequests/Queue/Admin`, `navPrimaryAria/MobileAria` (все RU+EN) в STRINGS.
- **Files modified:** packages/design/src/shared/uikit/_fixtures/strings.ts
- **Verification:** все KIT-01 stories рендерят RU+EN из STRINGS; Vitest STRINGS-parity тест зелёный (структурный satisfies Record<string, Bilingual>).
- **Committed in:** c2d7598 (Task 1)

**Total deviations:** 2 auto-fixed (оба missing-critical). Скоупа не расширяли — обе закрывают явные `<verify>` / acceptance criteria.

## Issues Encountered

- **Catalog-spec race (исправлено в новых спеках):** `[data-storyloaded]` появляется до коммита nav в DOM; `waitForSelector("[data-storyloaded]")` + немедленный `.count()` давал 0. Фикс: `keyboard.spec`/`responsive.spec` ждут собственные хуки (`[data-nav-item]` / `[data-skip-link]` / `[data-app-shell]` / `[data-tabbar]`), не generic story-loaded.
- **Local chromium project — desktop, не 360px:** `playwright.config` always-on `chromium` использует `devices["Desktop Chrome"]` (1280px); 360px-floor только в CI-only `mobile-360`. `responsive.spec` сначала упал (header visible на 1280). Фикс: каждый describe выставляет свой `test.use({ viewport })` (MOBILE 360 / DESKTOP 1280) — детерминизм независимо от проекта, плюс добавлен desktop-reflow ассерт (header visible ≥md / mobile-nav hidden).
- **Worktree path inode:** Read через `.agents/...`, Write/Edit требуют `.claude/...` (симлинк, тот же inode — как в 01-04/02-02/02-03). Использован `.claude/`-префикс для Write/Edit.
- **`vp check --fix` формат-дрейф:** форматтер трогал вне-скоупные `.design/support.js`, `AGENTS.md`, `DESIGN.md`, `package.json` (предсуществующий дрейф) — откатаны перед каждым коммитом, в коммиты не попали.
- **Node 24.16 vs ожидаемый 25:** только WARN (как в Wave-0/2/3), не блокер.

## Design Review (per-family, 7 pillars)

**Verdict: APPROVE** (0 findings).
- **Pillar 1 (токены/контраст):** 0 arbitrary / raw-hex по всем 4 слайсам (grep чисто). `--nav-h`/`--tabbar-h` → stock `h-14`/`h-15`; focus-ring `shadow-(--shadow-ring)` читает `@theme` var (sanctioned). `design.md lint` errors=0 (86 warnings — pre-existing weak-fill self-pairing ложноположительные, прецедент Plan 02/03).
- **Pillar 3 (a11y):** axe 0 serious/critical на всех 8 KIT-01 историях; никогда не цветом-в-одиночку (text-primary + aria-current + before:-edge + icon+label); 44px на интерактивном элементе (catalog + responsive geometry); SkipLink reveal-on-focus + `#main` (2.4.1/2.4.12); disabled items non-focusable `aria-disabled` (no trap); decorative icons `aria-hidden`.
- **Pillar 4/5 (states/responsive):** ×7 states via forced data-state; роли ×4 RU+EN; reflow container-keyed (@md обе стороны, не viewport); no-h-scroll @360px; nav-высоты резервированы (CLS=0).
- **Pillar 6 (domain):** dark-only gunmetal; cyan только на active-маркере + focus-ring; Lucide-only (size-5); RU читается естественно, не клипается @360px; role-aware slots = items-список, denied absent (NO RBAC — T-02-AC граница задокументирована).
- **Landmark order (AppShell):** SkipLink → header → main#main → mobile nav (DOM-order ассерт); meaningful h1 НЕ эмитится shell (`h1OutsideMain===0`).
- **Validation Gaps:** CWV (LCP/INP) через Chrome DevTools MCP — N/A (статический fixture-каталог без fetch/route, CLS=0 резервированием); SEO (Pillar 7) N/A (uikit-примитивы, не public routes); back/scroll-restore + SSE (Pillar 2) N/A (нет routing/data слоя); multi-breakpoint скриншоты 1920/2560 — chromium-only локально, матрица под CI (reflow доказан программно @360 + @md).

## Verification (plan `<verify>`)

- ✅ `pnpm exec ladle build` — зелёный (все 4 KIT-01 слайса скомпилированы, meta.json: 8 nav-shell историй).
- ✅ `pnpm exec playwright test` — **110/110 green** (KIT-01 + KIT-04 + KIT-07 catalog axe serious/critical=0, 44px, keyboard; DataTrustBanner + Skeleton CLS=0; nav-shell keyboard + responsive).
- ✅ `pnpm exec playwright test tests/keyboard.spec.ts` — skip-link reveal + `#main` + aria-current + Tab-no-trap зелёные.
- ✅ `pnpm exec playwright test tests/responsive.spec.ts` — landmark order, no-h-scroll @360px, @md reflow обе стороны (5/5).
- ✅ Root `pnpm check` — **exit 0** (format: 75 files clean; lint: 69 files 0 errors; tsgo; design.md lint errors=0; theme.css без дрейфа).
- ✅ Barrel: `import { AppShell, NavBar, MobileTabBar, SkipLink } from "@solid-stats/design"` резолвится (4 KIT-01 + 6 KIT-07 + 5 KIT-04 = 15 экспортов; helpers/Smoke/navFixtures отсутствуют).
- ✅ `grep -rE 'bg-\[|p-\[|text-\[|rounded-\[|h-\[|w-\[|size-\[|min-h-\[|#[0-9A-Fa-f]{6}'` по 4 слайсам — **чисто** (0 arbitrary).
- ✅ NavBar/MobileTabBar: active = `aria-current="page"` + cyan `before:`-marker + icon+label (never color-alone, grep подтверждён).
- ✅ AppShell: landmark order + no shell `<h1>` (responsive.spec DOM-order + `h1OutsideMain===0`).
- ✅ `solidstats-frontend-react-design-review` — **APPROVE** (7 pillars, 0 findings).

## Self-Check: PASSED

- 4/4 ключевых компонентных файла присутствуют на диске (SkipLink/NavBar/MobileTabBar/AppShell `.tsx`).
- Все 3 коммита задач существуют (`c2d7598`, `897b90f`, `9ef1122`).
- Verification block: Playwright 110/110; root `pnpm check` exit 0; нет arbitrary-значений; barrel 15 экспортов (helpers/Smoke/navFixtures отсутствуют).
- STATE.md / ROADMAP.md НЕ тронуты (worktree mode — оркестратор обновит после merge).

## Next Phase Readiness

- KIT-01 nav-shell-семейство импортируемо из `@solid-stats/design` — surface-builder'ы фаз 4+ монтируют готовый reviewed structural frame (AppShell) с корректным landmark-порядком, role-aware slots, keyboard-operability, 44px targets.
- **`NavItem` prop-контракт** — durable seam для v1.0: app-милстоун строит `items` из route-tree + signed-in роли, swap фикстур → реальных данных механический (denied items absent остаётся тем же механизмом, RBAC enforcement добавляется на route/loader gate, НЕ в shell).
- **`tests/keyboard.spec` + `tests/responsive.spec`** — паттерн для будущих интерактивных/responsive семейств (KIT-02 data-table density/pagination/CompactRow возьмут тот же per-describe viewport + landmark/scroll-ассерты).
- **data-state + tv() forced-pseudo-state рецепт** доказан на nav — KIT-02 sortable `Th` / row hover/selected/pressed возьмут тот же подход.

---
*Phase: 02-uikit-structural-data-display-primitives*
*Completed: 2026-06-20*
