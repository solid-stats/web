// Ladle GlobalProvider — the ONE place app-wide CSS is imported (styling.md
// import-once). fonts.css before theme.css so the self-hosted @font-face is
// registered before the @theme that references the families. theme.css carries
// `@import "tailwindcss"`, so this single import emits the @theme tokens and the
// utilities Tailwind v4 source-scans from the colocated stories. Dark-only: the
// root wrapper paints the gunmetal base surface using @theme utilities.
import type { GlobalProvider } from "@ladle/react";
import "../src/styles/fonts.css";
// tailwind.css is the single Tailwind root: it `@import`s ../src/styles/theme.css
// (the one generated token source) and adds the @source Ladle needs because its
// Vite root is the bundled app dir in node_modules, not this package — see the file.
import "./tailwind.css";

export const Provider: GlobalProvider = ({ children }) => (
  <div className="bg-bg-0 text-text-primary font-body min-h-screen p-4">{children}</div>
);
