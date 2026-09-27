interface Orderable {
  display_order: number;
  is_visible: boolean;
}

/** Public lists show only visible rows, in admin-defined order. */
export function visibleInOrder<T extends Orderable>(rows: readonly T[]): T[] {
  return rows.filter((r) => r.is_visible).sort((a, b) => a.display_order - b.display_order);
}
