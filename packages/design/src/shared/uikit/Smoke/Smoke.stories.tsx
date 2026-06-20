// The ONE smoke story (D-07 / MIGRATION D4: zero real components — token-driven
// utilities only). It is the visual proof the generated @theme resolves on the
// real Ladle + Vite + Tailwind v4 stack, dark-only:
//   - gunmetal surface ramp + the single cyan primary accent
//   - real self-hosted Exo 2 display type (Cyrillic), IBM Plex body, IBM Plex Mono
//   - tabular-nums on the mono numerals
//   - the data-trust freshness vocabulary (Актуально / Данные устаревают /
//     Связь потеряна / Переподключение) wired to DS-03's `--color-freshness-*`
//     tokens, which simultaneously proves Cyrillic renders on the self-hosted fonts.
//
// All visuals use real @theme tokens — never arbitrary Tailwind values (styling.md).
// The freshness tokens are compound custom properties (fill/text/border, the border
// value already includes `1px solid …`), so they are consumed via inline style
// reading the custom property — the plan-sanctioned way to exercise them.

type Freshness = {
  label: string;
  fill: string;
  text: string;
  border: string;
};

const FRESHNESS_STATES: readonly Freshness[] = [
  {
    label: "Актуально",
    fill: "var(--color-freshness-up-to-date-fill)",
    text: "var(--color-freshness-up-to-date-text)",
    border: "var(--color-freshness-up-to-date-border)",
  },
  {
    label: "Данные устаревают",
    fill: "var(--color-freshness-stale-fill)",
    text: "var(--color-freshness-stale-text)",
    border: "var(--color-freshness-stale-border)",
  },
  {
    label: "Связь потеряна",
    fill: "var(--color-freshness-offline-fill)",
    text: "var(--color-freshness-offline-text)",
    border: "var(--color-freshness-offline-border)",
  },
  {
    label: "Переподключение",
    fill: "var(--color-freshness-reconnecting-fill)",
    text: "var(--color-freshness-reconnecting-text)",
    border: "var(--color-freshness-reconnecting-border)",
  },
];

export const Tokens = () => (
  <div className="flex flex-col gap-6">
    {/* Display type — self-hosted Exo 2, Cyrillic */}
    <h1 className="font-display text-4xl font-bold text-text-primary tracking-tight">
      Solid Stats — статистика
    </h1>

    {/* Surfaced card — gunmetal surface step + border + the cyan primary accent */}
    <div className="bg-surface-1 border border-border-1 rounded-lg p-4 flex flex-col gap-3">
      <p className="font-body text-base text-text-muted">
        IBM Plex Sans — корпус. Кириллица рендерится на самостоятельно размещённых шрифтах.
      </p>
      <p className="text-primary font-display text-lg font-semibold">
        Cyan accent — единственный акцент системы
      </p>
      {/* Tabular mono numerals — IBM Plex Mono, tabular-nums */}
      <p className="font-mono tabular-nums text-md text-text-primary">
        1 234 567 · 89.50% · 00:42:17
      </p>
    </div>

    {/* Data-trust freshness pills — DS-03 tokens visibly wired */}
    <div className="flex flex-wrap gap-2">
      {FRESHNESS_STATES.map((state) => (
        <span
          key={state.label}
          className="font-body text-xs font-medium rounded-full px-3 py-1"
          style={{
            backgroundColor: state.fill,
            color: state.text,
            border: state.border,
          }}
        >
          {state.label}
        </span>
      ))}
    </div>
  </div>
);
