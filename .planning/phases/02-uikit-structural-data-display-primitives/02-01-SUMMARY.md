---
phase: 02-uikit-structural-data-display-primitives
plan: 01
subsystem: testing
tags: [vitest, playwright, axe-core, ladle, tailwind-variants, lucide-react, fixtures, tailwind-v4]

# Dependency graph
requires:
  - phase: 01-design-system-skeleton
    provides: "Ladle 5.1 catalog + Tailwind v4 @theme (theme.css), the .ladle/tailwind.css @source scan seam, the Smoke story precedent, the compound data-trust border tokens"
provides:
  - "Vitest harness (packages/design/vitest.config.ts) for pure-logic fixture/tier units"
  - "Playwright-against-Ladle catalog gate (playwright.config.ts + tests/globalSetup.ts + tests/catalog.spec.ts): per-story axe + 44px geometry + keyboard, iterating build/meta.json"
  - "Five pinned dev/runtime deps: vitest, @playwright/test, @axe-core/playwright, tailwind-variants, lucide-react"
  - "The single canonical _fixtures module (SS_BASELINE, ROSTER, STRINGS, tierFor, scoreOf, kdOf) — Vasiliy #1 everywhere, Score/K-D + tier consistency proven in Vitest"
  - "The _state-matrix story helper (StateMatrix + StateCell) for uniform per-story state demos"
  - "sr-only base-layer utility in .ladle/tailwind.css"
affects: [02-02-data-trust, 02-03-data-table, 02-04-stat-primitives, 02-05-feedback, 02-06-nav-shell, all later UIKIT family slices]

# Tech tracking
tech-stack:
  added: [vitest@4.1.9, "@playwright/test@1.61.0", "@axe-core/playwright@4.11.3", tailwind-variants@3.2.2, lucide-react@1.21.0]
  patterns:
    - "Runner split: Vitest = pure logic (no DOM render/RTL); Playwright-against-Ladle = component/a11y"
    - "Catalog gate iterates build/meta.json (no hardcoded story list, no sync-fetch dep)"
    - "Single canonical fixture source imported by every stat/table/tier story (D-06)"
    - "Underscore-prefixed internal helpers (_fixtures, _state-matrix) never graduate into the public barrel"

key-files:
  created:
    - packages/design/vitest.config.ts
    - packages/design/playwright.config.ts
    - packages/design/tests/globalSetup.ts
    - packages/design/tests/catalog.spec.ts
    - packages/design/src/shared/uikit/_fixtures/index.ts
    - packages/design/src/shared/uikit/_fixtures/tiers.ts
    - packages/design/src/shared/uikit/_fixtures/roster.ts
    - packages/design/src/shared/uikit/_fixtures/strings.ts
    - packages/design/src/shared/uikit/_fixtures/_fixtures.test.ts
    - packages/design/src/shared/uikit/_fixtures/tiers.test.ts
    - packages/design/src/shared/uikit/_state-matrix/StateMatrix.tsx
    - packages/design/src/shared/uikit/_state-matrix/index.ts
  modified:
    - packages/design/package.json
    - packages/design/.ladle/tailwind.css
    - .gitignore

key-decisions:
  - "ladle build + ladle preview (static serve) for the Playwright webServer over ladle dev — CI-deterministic (Open Q1)"
  - "catalog.spec.ts reads build/meta.json from disk, not via a LADLE_META env var, because globalSetup's process env does not propagate into Playwright test workers"
  - "chromium is the always-on local proof project; firefox/webkit/mobile-360 widen the matrix only under CI (host libs present there)"
  - "tier-level data key is a stable low|base|good|elite union; the RU display name (хорошо etc.) is carried separately via TIER_NAMES, matching the UI-SPEC Copywriting Contract"
  - "the generated tail is clamped strictly below the lowest real Overview Score so no generated player can outscore a real leader (QUAL-06)"

patterns-established:
  - "Playwright catalog gate: every later family story flows through axe + 44px + keyboard automatically by being picked up from meta.json"
  - "StateMatrix/StateCell: each cell carries a visible label + data-state-cell attribute the spec can assert named cells against"

requirements-completed: [QUAL-03, QUAL-04, QUAL-05, QUAL-06]

# Metrics
duration: 14min
completed: 2026-06-20
status: complete
---

# Phase 2 Plan 01: Wave-0 Harness + Canonical Fixtures Summary

**Вайр Vitest + Playwright-against-Ladle гейта в `packages/design` (axe / 44px / клавиатура по `meta.json`, доказан на `smoke--tokens`), установка пяти закреплённых зависимостей, единый канонический `_fixtures`-модуль (Vasiliy #1, Score/K-D + тиры согласованы в 46 Vitest-тестах) и `_state-matrix` helper.**

## Performance

- **Duration:** ~14 min
- **Started:** 2026-06-20T14:32:50Z
- **Completed:** 2026-06-20T14:47:15Z
- **Tasks:** 3 (Task 1 предварительно разрешён оркестратором; Tasks 2 + 3 реализованы)
- **Files modified:** 15 (12 создано, 3 изменено)

## Accomplishments

- Поднят тестовый harness фазы 2 в `packages/design`, где тестового тулинга не было: Vitest (чистая логика) + Playwright-против-собранного-Ladle (axe serious/critical блокируют, геометрия 44×44, доступность с клавиатуры), итерируя `build/meta.json`. Гейт доказан end-to-end на существующей истории `smoke--tokens` (4 теста зелёные на chromium).
- Установлены пять зависимостей строго закреплёнными (exact-pin, без caret): dev — `vitest@4.1.9`, `@playwright/test@1.61.0`, `@axe-core/playwright@4.11.3`; runtime/style — `tailwind-variants@3.2.2`, `lucide-react@1.21.0`.
- Построен единый канонический `_fixtures`-модуль (D-06): `SS_BASELINE` (популяционные тиры по периодам), `ROSTER` (10 Overview-игроков дословно + детерминированный хвост до отрицательного Score, Vasiliy #1), `STRINGS` (RU+EN на каждый элемент Copywriting Contract), чистые `tierFor`/`scoreOf`/`kdOf`. Согласованность доказана 46 Vitest-ассертами (QUAL-06 / QUAL-05).
- Построен `_state-matrix` helper (`StateMatrix` + `StateCell`) — единый механизм для равномерной демонстрации ×7 состояний / ×4 объёмов данных в каждой будущей истории (enabler для QUAL-01 / D-08).
- Добавлена `sr-only` утилита в base-layer `.ladle/tailwind.css` (нужна accessible-сводке Sparkline в Plan 05).

## Task Commits

1. **Task 1: Package legitimacy gate** — предварительно разрешён оркестратором (response "approved"). Две не-в-локфайле зависимости подтверждены легитимными: `tailwind-variants@3.2.2` (репозиторий `github.com/heroui-inc/tailwind-variants`, без network-postinstall) и `lucide-react@1.21.0` (репозиторий `github.com/lucide-icons/lucide`, homepage lucide.dev, без install-hook) — совпадают с RESEARCH-аудитом. Коммита нет (гейт предшествует установке в Task 2).
2. **Task 2: Install deps + wire Vitest, Playwright, catalog harness; confirm sr-only** — `43a0905` (feat)
3. **Task 3: Canonical _fixtures module + _state-matrix helper (Vitest-proven)** — `4f24190` (feat)

_Примечание: оба auto-задания TDD-помечены, но их «тест» — это сам harness (catalog.spec доказан на Smoke) и Vitest-наборы; RED→GREEN прошёл внутри одной реализации (spec/fixtures написаны → прогон зелёный)._

## Files Created/Modified

- `packages/design/vitest.config.ts` — Vitest, node-окружение, `src/**/*.test.ts`, без DOM-рендера.
- `packages/design/playwright.config.ts` — webServer `ladle preview`, `baseURL`, chromium локально + firefox/webkit/mobile-360 матрица под CI, `reducedMotion: reduce`.
- `packages/design/tests/globalSetup.ts` — собирает каталог (`ladle build`) перед стартом webServer.
- `packages/design/tests/catalog.spec.ts` — читает `build/meta.json`, на каждую историю: axe (`wcag2a/2aa/22aa`, блок serious/critical), геометрия ≥44×44, достижимость интерактивных контролов с клавиатуры.
- `packages/design/src/shared/uikit/_fixtures/{index,tiers,roster,strings}.ts` — единый канонический модуль фикстур.
- `packages/design/src/shared/uikit/_fixtures/{_fixtures,tiers}.test.ts` — 46 Vitest-ассертов согласованности (QUAL-06/05).
- `packages/design/src/shared/uikit/_state-matrix/{StateMatrix.tsx,index.ts}` — helper состояний, tokens-only.
- `packages/design/package.json` — добавлены 5 зависимостей + скрипты `test`/`test:e2e`; `exports`-карта и `ladle`/`ladle:build` сохранены; прямой `vite`-зависимости нет.
- `packages/design/.ladle/tailwind.css` — `sr-only` в `@layer base`; `@source ../src` не тронут.
- `.gitignore` — игнор Playwright-артефактов (`test-results/`, `playwright-report/`, `.last-run.json`).

## Decisions Made

- **Playwright webServer = `ladle build` + `ladle preview`** (статическая отдача собранного `build/`) вместо `ladle dev` — детерминизм для CI (Open Q1). `globalSetup` владеет сборкой; `webServer` только превьюит.
- **`catalog.spec.ts` читает `build/meta.json` с диска**, а не через env-переменную `LADLE_META`: env, выставленный в `globalSetup`, не попадает в воркеры Playwright (RESEARCH-набросок предполагал env/temp-файл — заменено на прямое чтение, что надёжнее).
- **Тир-уровень — стабильный union `low|base|good|elite`** (форма данных), RU-имя (`хорошо` и т.д.) вынесено в `TIER_NAMES` по Copywriting Contract. Прозаический `хороший` из текста плана трактован как display-копия `хорошо`; тест ассертит стабильный ключ `good` + порог `≥2.4`.
- **Хвост ростера зажат строго ниже минимального реального Score** (а не только ниже лидера) — гарантия «ни один сгенерированный игрок не обгоняет реального лидера» (QUAL-06).
- **chromium — единственный always-on проект**, firefox/webkit/mobile-360 включаются под `CI` (в этой среде системные библиотеки для них не валидируются, но chromium запускается и `boundingBox()` работает — проверено smoke-запуском).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Замена env-проброса story-списка на чтение с диска в catalog.spec.ts**
- **Found during:** Task 2 (wiring globalSetup + catalog.spec)
- **Issue:** RESEARCH-набросок (L364) предполагал `process.env.LADLE_META`, выставляемый в `globalSetup` и читаемый в спеке на этапе collection. Playwright собирает/исполняет спеки в воркер-процессах, куда env из `globalSetup` не доходит — спек получил бы `undefined` и упал на чтении.
- **Fix:** `globalSetup` только собирает каталог; `catalog.spec.ts` читает `build/meta.json` напрямую с диска (детерминированный путь от `import.meta.url`).
- **Files modified:** packages/design/tests/globalSetup.ts, packages/design/tests/catalog.spec.ts
- **Verification:** 4 теста зелёные на `smoke--tokens` (axe + 44px + keyboard + non-empty meta).
- **Committed in:** 43a0905 (Task 2)

**2. [Rule 1 - Bug] Зажатие сгенерированного хвоста ниже минимального реального Score**
- **Found during:** Task 3 (roster.ts)
- **Issue:** Первая версия генерации non-negative хвоста (`kills` до 20, `games` от 4) могла дать Score выше Vasiliy (например 20/4 = 5.0 > 4.13), нарушая «ни один сгенерированный игрок не обгоняет реального лидера» (QUAL-06).
- **Fix:** добавлен потолок `headFloor = min(head.score)`; для non-negative игроков `kills` зажат через `maxNet = floor(headFloor·(games+deathsTk)) − 1`, так что весь хвост строго ниже реального ростера.
- **Files modified:** packages/design/src/shared/uikit/_fixtures/roster.ts
- **Verification:** Vitest-ассерт «no generated tail player outscores any real Overview leader» зелёный.
- **Committed in:** 4f24190 (Task 3)

**3. [Rule 2 - Missing Critical] Игнор Playwright-артефактов в .gitignore**
- **Found during:** Task 2
- **Issue:** План не упоминал, что `playwright test` создаёт `test-results/` (и при отчётах `playwright-report/`, `.last-run.json`), которые иначе попали бы в дерево как untracked.
- **Fix:** добавлены паттерны `packages/*/test-results/`, `packages/*/playwright-report/`, `packages/*/.last-run.json` в `.gitignore`.
- **Files modified:** .gitignore
- **Verification:** `git status --short` чист после прогона (артефакты помечены `!!`).
- **Committed in:** 43a0905 (Task 2)

---

**Total deviations:** 3 auto-fixed (1 blocking, 1 bug, 1 missing-critical)
**Impact on plan:** Все три — корректность/детерминизм harness и доменная согласованность фикстур. Скоупа не расширяли. Дополнительно: `vp check --fix` при автоформате затронул несколько вне-скоупных файлов (`.design/support.js`, `AGENTS.md`, `DESIGN.md`, корневой `package.json`) предсуществующим дрейфом — они откатаны, в коммиты не попали.

## Issues Encountered

- **Несоответствие пути worktree:** `git rev-parse --show-toplevel` отдаёт `.agents/worktrees/...`, а инструмент записи требует `.claude/worktrees/...` (это симлинк `.claude → .agents`, тот же inode). Решено использованием `.claude/...`-префикса для Read/Write/Edit; Bash работает с любым (один inode).
- **Playwright host-libs warning:** `playwright install` сообщает о недостающих системных библиотеках для firefox/webkit, но бинарники скачаны и chromium запускается (`boundingBox()` работает — проверено). Локальный proof идёт на chromium; firefox/webkit/mobile-360 включены только под `CI`.
- **Node 24.16 vs ожидаемый 25:** workspace требует Node `>=25 <26`; в среде Node 24.16 — только WARN, не блокер, установки и тесты прошли.

## User Setup Required

None — внешней конфигурации сервисов не требуется (фаза 2 — презентационный каталог из фикстур; нет auth/сети/секретов).

## Self-Check: PASSED

- 12/12 созданных файлов присутствуют на диске.
- Оба коммита задач существуют в истории (`43a0905`, `4f24190`).
- Verification block: Vitest 46/46 зелёных; Playwright catalog 4/4 зелёных на `smoke--tokens`; корневой `pnpm check` exit 0; нет arbitrary-значений в `_state-matrix`; `_fixtures`/`_state-matrix` отсутствуют в публичном barrel; `sr-only` доступен; 5 зависимостей закреплены exact.

## Next Phase Readiness

- Harness существует и демонстративно исполняется: `pnpm --filter @solid-stats/design test` (Vitest, 46 зелёных), `ladle build && playwright test tests/catalog.spec.ts` (4 зелёных на Smoke), корневой `pnpm check` exit 0.
- `_fixtures` и `_state-matrix` готовы для импорта всеми family-слайсами фазы 2 (Wave 1+). Проп-контракт фикстур — durable seam для v1.0 swap-to-server.
- Контроль на будущее: при добавлении интерактивных историй (nav/Th/density/pagination) `catalog.spec` уже покрывает их axe/44px/keyboard автоматически по `meta.json`; CLS/responsive/state-presence ассерты добавляются в тот же spec по мере появления историй (per VALIDATION map).

---
*Phase: 02-uikit-structural-data-display-primitives*
*Completed: 2026-06-20*
