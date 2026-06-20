#!/usr/bin/env node
// Generated from DESIGN.md by scripts/gen-theme.mjs — do NOT hand-edit theme.css
// (DESIGN.md is the single source of truth). INTERIM: @google/design.md v0.3.0
// `export --format css-tailwind` drops typography line-height; migrate this generator
// to the official export once that bug is fixed (track releases — the README already
// promises `--leading-*`).
//
// This is the SolidStats INTERIM token pipeline. It reads the YAML front matter of the
// canonical root DESIGN.md and emits the Tailwind v4 `@theme` block to
// packages/design/src/styles/theme.css (the @solid-stats/design ./theme.css export).
// It deliberately does NOT shell out to `design.md export` — that exporter is currently
// lossy (silently drops typography `lineHeight`), which is exactly the paired
// `--text-<name>--line-height` form Tailwind v4 needs.
//
// Run:  node scripts/gen-theme.mjs
// Self-contained: no package.json / node_modules required — the front-matter YAML is
// parsed by a small purpose-built parser below (the front matter is a regular,
// lint-clean 2-space-indented map; no anchors / arrays / multiline scalars).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DESIGN_PATH = join(ROOT, "DESIGN.md");
const OUT_PATH = join(ROOT, "packages", "design", "src", "styles", "theme.css");

const HEADER = `/*
 * Generated from DESIGN.md by scripts/gen-theme.mjs — do NOT hand-edit theme.css
 * (DESIGN.md is the single source of truth). INTERIM: @google/design.md v0.3.0
 * \`export --format css-tailwind\` drops typography line-height; migrate this generator
 * to the official export once that bug is fixed (track releases — the README already
 * promises \`--leading-*\`).
 */`;

// ---------------------------------------------------------------------------
// 1. Front-matter extraction + minimal YAML parse
// ---------------------------------------------------------------------------

/** Extract the text between the first two `---` fences. */
function extractFrontMatter(src) {
  const lines = src.split(/\r?\n/);
  if ((lines[0] ?? "").trim() !== "---") {
    throw new Error("DESIGN.md does not start with a `---` front-matter fence");
  }
  const end = lines.indexOf("---", 1);
  if (end === -1) throw new Error("Unterminated front-matter fence in DESIGN.md");
  return lines.slice(1, end).join("\n");
}

/** Strip a trailing `# comment` that is not inside a quoted string. */
function stripComment(value) {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "#" && !inSingle && !inDouble) {
      // a comment must be preceded by whitespace (or be at column 0)
      if (i === 0 || /\s/.test(value[i - 1])) return value.slice(0, i);
    }
  }
  return value;
}

/** Coerce a scalar token to a JS value (string, number, boolean). */
function parseScalar(raw) {
  const value = stripComment(raw).trim();
  if (value === "") return "";
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

/**
 * Minimal YAML parser for the DESIGN.md front matter: nested maps via 2-space
 * indentation, `key:` (map) or `key: scalar`. No sequences / anchors / block
 * scalars are present in this document, so they are intentionally unsupported.
 */
function parseYaml(text) {
  const root = {};
  // stack of { indent, container }
  const stack = [{ indent: -1, container: root }];

  const rawLines = text.split("\n");
  for (let li = 0; li < rawLines.length; li++) {
    const rawLine = rawLines[li];
    if (rawLine.trim() === "" || /^\s*#/.test(rawLine)) continue; // blank / comment-only
    const indent = rawLine.length - rawLine.replace(/^ */, "").length;
    const content = rawLine.slice(indent);

    const colon = findColon(content);
    if (colon === -1) {
      throw new Error(`Unparseable front-matter line: ${JSON.stringify(rawLine)}`);
    }
    const key = content
      .slice(0, colon)
      .trim()
      .replace(/^['"]|['"]$/g, "");
    const rest = content.slice(colon + 1);

    // pop stack to the correct parent for this indent
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].container;

    const restTrimmed = stripComment(rest).trim();

    // Block scalar (`>`, `>-`, `|`, `|-`): consume the more-indented continuation
    // lines as one folded/joined string. Only `description: >-` uses this, which we
    // do not consume downstream — but we must skip its body to keep the parser sane.
    if (/^[>|][-+]?$/.test(restTrimmed)) {
      const parts = [];
      while (li + 1 < rawLines.length) {
        const peek = rawLines[li + 1];
        const peekIndent = peek.length - peek.replace(/^ */, "").length;
        if (peek.trim() !== "" && peekIndent <= indent) break;
        parts.push(peek.trim());
        li++;
      }
      parent[key] = parts.join(" ").trim();
      continue;
    }

    if (restTrimmed === "") {
      const child = {};
      parent[key] = child;
      stack.push({ indent, container: child });
    } else {
      parent[key] = parseScalar(rest);
    }
  }
  return root;
}

/** Find the `:` that separates key from value (skip colons inside quotes). */
function findColon(s) {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === ":" && !inSingle && !inDouble) {
      // map-separator colon is followed by EOL or whitespace
      if (i + 1 >= s.length || s[i + 1] === " ") return i;
    }
  }
  return -1;
}

// ---------------------------------------------------------------------------
// 2. Emit the @theme block
// ---------------------------------------------------------------------------

const counts = {};
function bump(ns, n = 1) {
  counts[ns] = (counts[ns] ?? 0) + n;
}

function block(title, lines) {
  if (lines.length === 0) return "";
  return `  /* ${title} */\n${lines.map((l) => `  ${l}`).join("\n")}\n`;
}

function buildTheme(design) {
  // Fail with the *named* missing section instead of a downstream
  // `Cannot read properties of undefined` far from the cause (WR-02).
  for (const key of [
    "colors",
    "typography",
    "rounded",
    "elevation",
    "motion",
    "layout",
    "components",
  ]) {
    if (!design[key]) {
      throw new Error(`DESIGN.md front-matter missing required section: ${key}`);
    }
  }

  const { colors, typography, rounded, elevation, motion, layout, components } = design;

  // The data-trust block (D-12) reaches several levels into `components.*`; assert the
  // recipes exist up front so a rename surfaces here, not as a bare TypeError (WR-02).
  for (const recipe of [
    "badge-freshness",
    "badge-known",
    "badge-unknown",
    "badge-conflict",
    "provenance-line",
  ]) {
    if (!components[recipe]) {
      throw new Error(`DESIGN.md components.${recipe} missing (data-trust tokens)`);
    }
  }

  // The single `{colors.NAME}` / `{rounded.NAME}` reference resolver — used for both
  // the data-trust recipes AND the elevation focus-ring values. Throws on an unknown
  // token so a typo'd / renamed ref fails the run loudly instead of silently writing
  // the literal string `undefined` into theme.css (WR-01).
  const resolveRefs = (v) =>
    String(v)
      .replace(/\{colors\.([a-z0-9-]+)\}/g, (_, n) => {
        if (!(n in colors)) throw new Error(`Unknown {colors.${n}} reference in DESIGN.md`);
        return colors[n];
      })
      .replace(/\{rounded\.([a-z0-9-]+)\}/g, (_, n) => {
        if (!(n in rounded)) throw new Error(`Unknown {rounded.${n}} reference in DESIGN.md`);
        return rounded[n];
      });

  const sections = [];

  // ---- RESET: drop Tailwind's stock palettes; only SolidStats tokens exist ----
  sections.push(
    block("Reset Tailwind stock namespaces — only SolidStats tokens exist", [
      "--color-*: initial;",
      "--font-*: initial;",
      "--text-*: initial;",
      "--font-weight-*: initial;",
      "--tracking-*: initial;",
      "--radius-*: initial;",
      "--shadow-*: initial;",
      "--ease-*: initial;",
    ]),
  );

  // ---- Colors ----
  {
    const lines = [];
    for (const [name, value] of Object.entries(colors)) {
      lines.push(`--color-${name}: ${value};`);
      bump("color");
    }
    sections.push(block("Colors — ink ramp, borders, text, primary, semantics, charts", lines));
  }

  // ---- Font families ----
  {
    const lines = [];
    for (const [name, value] of Object.entries(typography.fontFamilies)) {
      lines.push(`--font-${name}: ${value};`);
      bump("font");
    }
    sections.push(block("Font families", lines));
  }

  // ---- Text sizes (paired with line-height) ----
  // Tailwind v4 pairs `--text-<n>` with `--text-<n>--line-height`. Both the size
  // AND the paired line-height come straight from each `typography.scale` entry in
  // DESIGN.md (the single source of truth) — this generator is a dumb copy. This is
  // exactly the pairing the lossy official exporter drops.
  {
    const lines = [];
    for (const [name, entry] of Object.entries(typography.scale)) {
      lines.push(`--text-${name}: ${entry.size};`);
      lines.push(`--text-${name}--line-height: ${entry.lineHeight};`);
      bump("text");
    }
    sections.push(block("Font sizes — paired with line-height (Tailwind v4 paired form)", lines));
  }

  // ---- Font weights ----
  {
    const lines = [];
    for (const [name, value] of Object.entries(typography.fontWeights)) {
      lines.push(`--font-weight-${name}: ${value};`);
      bump("font-weight");
    }
    sections.push(block("Font weights", lines));
  }

  // ---- Letter spacing (tracking) ----
  {
    const lines = [];
    for (const [name, value] of Object.entries(typography.letterSpacing)) {
      lines.push(`--tracking-${name}: ${value};`);
      bump("tracking");
    }
    sections.push(block("Letter spacing (tracking)", lines));
  }

  // ---- Radii ----
  {
    const lines = [];
    for (const [name, value] of Object.entries(rounded)) {
      lines.push(`--radius-${name}: ${value};`);
      bump("radius");
    }
    sections.push(block("Radii", lines));
  }

  // ---- Shadows + focus rings ----
  // `sm/md/lg` are shadow utilities; `ring`/`ring-glow` carry {colors.*} refs resolved
  // through the shared, WR-01-guarded `resolveRefs` (no second hand-rolled resolver).
  {
    const lines = [];
    for (const name of ["sm", "md", "lg"]) {
      lines.push(`--shadow-${name}: ${elevation[name]};`);
      bump("shadow");
    }
    // Focus-ring vars (consumed via box-shadow in component CSS, not a Tailwind shadow utility).
    lines.push(`--shadow-ring: ${resolveRefs(elevation.ring)};`);
    lines.push(`--shadow-ring-glow: ${resolveRefs(elevation["ring-glow"])};`);
    bump("shadow", 2);
    sections.push(block("Shadows (floating UI) + focus-ring custom props", lines));
  }

  // ---- Motion: easing + durations ----
  {
    const lines = [];
    for (const [name, value] of Object.entries(motion.easing)) {
      lines.push(`--ease-${name}: ${value};`);
      bump("ease");
    }
    for (const [name, value] of Object.entries(motion.duration)) {
      lines.push(`--duration-${name}: ${value};`);
      bump("duration");
    }
    sections.push(block("Motion — easing + duration custom props", lines));
  }

  // ---- Breakpoints ----
  // Keep Tailwind stock md/lg/xl/2xl; add the SolidStats 3xl/4xl.
  {
    const bp = layout.breakpoints;
    const lines = [
      `--breakpoint-md: ${bp.md};`,
      `--breakpoint-lg: ${bp.lg};`,
      `--breakpoint-xl: ${bp.xl};`,
      `--breakpoint-2xl: ${bp["2xl"]};`,
      `--breakpoint-3xl: ${bp["3xl"]};`,
      `--breakpoint-4xl: ${bp["4xl"]};`,
    ];
    bump("breakpoint", lines.length);
    sections.push(block("Breakpoints — Tailwind md/lg/xl/2xl + SolidStats 3xl/4xl", lines));
  }

  // ---- Containers ----
  {
    const lines = [
      `--container: ${layout.container};`,
      `--container-prose: ${layout["container-prose"]};`,
    ];
    bump("container", lines.length);
    sections.push(block("Content containers", lines));
  }

  // ---- Data-trust state tokens (freshness · known/unknown/conflict · provenance) ----
  // First-class @theme tokens for the data-trust vocabulary (DS-03). The Russian
  // display copy («Актуально» etc.) is product i18n, NOT a token value — only the
  // named semantic state tokens (fill/text/border) live here, resolved from the
  // win/warn/loss/info recipes in DESIGN.md components.*. (D-12)
  {
    const lines = [];

    // Emit fill/text/border for one named recipe under a token namespace.
    const emitRecipe = (ns, recipe) => {
      lines.push(`--color-${ns}-fill: ${resolveRefs(recipe.backgroundColor)};`);
      lines.push(`--color-${ns}-text: ${resolveRefs(recipe.textColor)};`);
      lines.push(`--color-${ns}-border: ${resolveRefs(recipe.border)};`);
      bump("data-trust", 3);
    };

    // Freshness ×4 (live connection state) — win/warn/loss/info recipes.
    for (const [state, recipe] of Object.entries(components["badge-freshness"].states)) {
      emitRecipe(`freshness-${state}`, recipe);
    }

    // Known / Unknown / Conflict data-trust badges.
    emitRecipe("known", components["badge-known"]);
    emitRecipe("unknown", components["badge-unknown"]);
    emitRecipe("conflict", components["badge-conflict"]);

    // Provenance line — foreground (text-muted) + link (primary).
    lines.push(`--color-provenance-fg: ${resolveRefs(components["provenance-line"].textColor)};`);
    lines.push(`--color-provenance-link: ${resolveRefs(components["provenance-line"].linkColor)};`);
    bump("data-trust", 2);

    sections.push(
      block("Data-trust state tokens (freshness · known/unknown/conflict · provenance)", lines),
    );
  }

  const body = sections.filter(Boolean).join("\n");
  // Paint the base backdrop from the design tokens via a real CSS rule. This both
  // (a) forces Tailwind v4 to retain --color-bg-0 / --color-text-primary (the
  // var() references defeat @theme tree-shaking) and (b) guarantees the dark
  // foundation independent of utility scanning.
  const base =
    `@layer base {\n` +
    `  html {\n` +
    `    background-color: var(--color-bg-0);\n` +
    `    color: var(--color-text-primary);\n` +
    `  }\n` +
    `}\n`;
  return `${HEADER}\n\n@import "tailwindcss";\n\n@theme {\n${body}}\n\n${base}`;
}

// ---------------------------------------------------------------------------
// 3. Run
// ---------------------------------------------------------------------------

const src = readFileSync(DESIGN_PATH, "utf8");
const design = parseYaml(extractFrontMatter(src));
const css = buildTheme(design);

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, css, "utf8");

const summary = Object.entries(counts)
  .map(([ns, n]) => `${ns}=${n}`)
  .join("  ");
console.log(`Wrote ${OUT_PATH}`);
console.log(`Tokens emitted: ${summary}`);
