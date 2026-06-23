// Typography foundations showcase (Phase 2 — delivered on a UAT request). Story-only,
// like `Smoke`: there is NO Typography component — type is the DESIGN.md token system
// (DS-01), applied in code via the role utility combos below. This catalog page makes
// the system legible: the three families, the px size scale, the weights, the semantic
// roles, and tabular-mono numerals. Every specimen uses real `@theme` token utilities
// (font-display/body/mono, text-2xs…5xl, font-regular…bold, tracking-*) — never an
// arbitrary value (styling.md). Not a barrel export (a foundations doc, not a UIKIT API).
import type { Story, StoryDefault } from "@ladle/react";

export default {
  title: "Foundations / Typography",
} satisfies StoryDefault;

// ---- semantic roles (typography.roles.*) — the named recipes components apply ----
type Role = {
  readonly name: string;
  readonly cls: string;
  readonly note: string;
  readonly sample: string;
};

const ROLES: readonly Role[] = [
  {
    name: "stat-xl",
    cls: "font-display text-4xl font-bold tabular-nums tracking-tight text-text-primary",
    note: "Exo 2 · 48px · 700 · tabular — hero Счёт / K-D",
    sample: "4.13",
  },
  {
    name: "h1",
    cls: "font-display text-3xl font-bold tracking-tight text-text-primary",
    note: "Exo 2 · 36px · 700 — page title",
    sample: "Обзор статистики",
  },
  {
    name: "h2",
    cls: "font-display text-2xl font-semibold tracking-snug text-text-primary",
    note: "Exo 2 · 28px · 600 — section",
    sample: "Таблица игроков",
  },
  {
    name: "h3",
    cls: "font-display text-xl font-semibold tracking-snug text-text-primary",
    note: "Exo 2 · 22px · 600 — banner / empty-state",
    sample: "Лучшие отряды",
  },
  {
    name: "h4",
    cls: "font-body text-lg font-semibold text-text-primary",
    note: "IBM Plex Sans · 18px · 600 — card title",
    sample: "Карточка игрока",
  },
  {
    name: "body",
    cls: "font-body text-base text-text-primary",
    note: "IBM Plex Sans · 14px · 400 — UI default (not 16)",
    sample: "Стандартный текст интерфейса. Default UI body text.",
  },
  {
    name: "body-sm",
    cls: "font-body text-sm text-text-muted",
    note: "IBM Plex Sans · 13px · LH 1.35 — dense tables",
    sample: "Плотный текст строк таблицы. Dense table body.",
  },
  {
    name: "label",
    cls: "font-body text-xs font-semibold uppercase tracking-label text-text-muted",
    note: "IBM Plex Sans · 12px · 600 · caps 0.06 — table headers, nav, tile labels",
    sample: "Отряд · Squad",
  },
  {
    name: "overline",
    cls: "font-mono text-2xs font-medium uppercase tracking-caps text-text-muted",
    note: "IBM Plex Mono · 11px · 500 · caps 0.12 — provenance meta",
    sample: "Посчитано из N реплеев",
  },
  {
    name: "caption",
    cls: "font-body text-xs text-text-muted",
    note: "IBM Plex Sans · 12px — decorative captions (real placeholder/disabled use text-subtle)",
    sample: "Вспомогательная подпись · caption",
  },
  {
    name: "stat",
    cls: "font-mono text-sm font-medium tabular-nums text-text-primary",
    note: "IBM Plex Mono · 13px · 500 · tabular — numeric cells, mini-stats",
    sample: "1 234",
  },
  {
    name: "mono",
    cls: "font-mono text-sm tabular-nums text-text-muted",
    note: "IBM Plex Mono · 13px · tabular — IDs, slugs, thresholds",
    sample: "≥2.4 · SS-2026-0421",
  },
];

function RoleRow({ role }: { role: Role }): ReturnType<Story> {
  return (
    <div className="flex flex-col gap-1 border-b border-border-1 py-4 last:border-b-0 @3xl:flex-row @3xl:items-baseline @3xl:gap-6">
      <code className="font-mono text-2xs text-primary @3xl:w-32 @3xl:shrink-0">{role.name}</code>
      <div className="flex flex-col gap-1">
        <span className={role.cls}>{role.sample}</span>
        <span className="font-body text-2xs text-text-muted">{role.note}</span>
      </div>
    </div>
  );
}

export const Roles: Story = () => (
  <section className="@container mx-auto flex max-w-3xl flex-col bg-bg-1 p-6">
    <h2 className="mb-2 font-display text-lg font-semibold tracking-tight text-text-primary">
      Semantic roles · <code className="font-mono text-sm text-primary">typography.roles.*</code>
    </h2>
    <p className="mb-4 font-body text-sm text-text-muted">
      Именованные рецепты, которые применяют компоненты. Числа — табулярный моноширинный, выровнены
      вправо, дельты со знаком.
    </p>
    {ROLES.map((role) => (
      <RoleRow key={role.name} role={role} />
    ))}
  </section>
);

// ---- the raw px size scale (2xs → 5xl) ----
const SCALE: readonly { readonly token: string; readonly px: string }[] = [
  { token: "text-2xs", px: "11px" },
  { token: "text-xs", px: "12px" },
  { token: "text-sm", px: "13px" },
  { token: "text-base", px: "14px" },
  { token: "text-md", px: "16px" },
  { token: "text-lg", px: "18px" },
  { token: "text-xl", px: "22px" },
  { token: "text-2xl", px: "28px" },
  { token: "text-3xl", px: "36px" },
  { token: "text-4xl", px: "48px" },
  { token: "text-5xl", px: "64px" },
];

const WEIGHTS: readonly { readonly cls: string; readonly name: string }[] = [
  { cls: "font-regular", name: "400 regular" },
  { cls: "font-medium", name: "500 medium" },
  { cls: "font-semibold", name: "600 semibold" },
  { cls: "font-bold", name: "700 bold" },
];

export const Scale: Story = () => (
  <div className="mx-auto flex max-w-3xl flex-col gap-8 bg-bg-1 p-6">
    {/* Families */}
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary">
        Families
      </h2>
      <p className="font-display text-2xl text-text-primary">Exo 2 — дисплей · АаБбВвГг Ag 0123</p>
      <p className="font-body text-2xl text-text-primary">
        IBM Plex Sans — корпус · АаБбВвГг Ag 0123
      </p>
      <p className="font-mono text-2xl tabular-nums text-text-primary">
        IBM Plex Mono — моно · Ag 0123456789
      </p>
    </section>

    {/* Size scale */}
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary">Scale</h2>
      {SCALE.map((s) => (
        <div
          key={s.token}
          className="flex items-baseline gap-4 border-b border-border-1 py-2 last:border-b-0"
        >
          <code className="w-24 shrink-0 font-mono text-2xs text-text-muted">{s.token}</code>
          <span className="w-12 shrink-0 font-mono text-2xs tabular-nums text-text-muted">
            {s.px}
          </span>
          <span className={`font-body ${s.token} truncate text-text-primary`}>
            Статистика · Stats Ag 123
          </span>
        </div>
      ))}
    </section>

    {/* Weights */}
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary">
        Weights
      </h2>
      {WEIGHTS.map((w) => (
        <p key={w.cls} className={`font-body text-lg ${w.cls} text-text-primary`}>
          {w.name} — Solid Stats статистика
        </p>
      ))}
    </section>

    {/* Tabular numerals — alignment + signed deltas */}
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary">
        Numerals — tabular mono
      </h2>
      <div className="flex w-40 flex-col items-end gap-0.5 rounded-md border border-border-1 bg-surface-1 p-3">
        <span className="font-mono text-sm tabular-nums text-text-primary">1 234.50</span>
        <span className="font-mono text-sm tabular-nums text-text-primary">98.06</span>
        <span className="font-mono text-sm tabular-nums text-text-primary">7.13</span>
      </div>
      <p className="font-body text-sm text-text-muted">
        Дельты со знаком: <span className="font-mono tabular-nums text-win">+12</span> ·{" "}
        <span className="font-mono tabular-nums text-loss">−3</span>
      </p>
    </section>
  </div>
);
