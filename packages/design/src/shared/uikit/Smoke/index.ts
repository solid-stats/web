// Slice entrypoint (architecture.md: a slice owns its component + story + index).
// The Smoke slice is a catalog-story-only artifact (D-07: zero real components),
// so there is no component to re-export — the story is discovered by Ladle's glob,
// not imported through this barrel, and it is NOT part of the public UIKIT surface.
export {};
