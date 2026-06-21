// CompactRow slice entry (KIT-02). `CompactList` is the mobile list wrapper (the
// `@container` root + top-N + «показать ещё · N» expander); `CompactRow` is the
// single label-over-value row it renders. Both graduate (the surface-builder mounts
// the list; the row is the reusable leaf).
export type { CompactRowData } from "./CompactRow";
export { CompactList, CompactRow } from "./CompactRow";
