import type { ReactNode } from "react";

/**
 * Two-column case text row: section heading on the left half, body on the
 * right half (both left-aligned). Stacks to one column on narrow screens.
 * Shared across all case pages so the layout stays consistent.
 */
export function Row({
  heading,
  children,
  className = "",
}: {
  heading: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-16 ${className}`}>
      <div>{heading}</div>
      <div>{children}</div>
    </div>
  );
}
