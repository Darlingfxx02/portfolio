import type { ReactNode } from "react";

/**
 * Shared case text layout. Use the default split layout only when the heading
 * and body are meant to read as parallel columns; use "stack" or "center" for
 * narrative sections where long copy needs a readable measure.
 */
export function Row({
  heading,
  children,
  className = "",
  bodyClassName = "",
  headingClassName = "",
  variant = "split",
}: {
  heading: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  headingClassName?: string;
  variant?: "split" | "stack" | "center";
}) {
  if (variant === "center") {
    return (
      <div className={`case-row case-row--center ${className}`}>
        <div className={`case-row__heading ${headingClassName}`}>{heading}</div>
        <div className={`case-row__body ${bodyClassName}`}>{children}</div>
      </div>
    );
  }

  if (variant === "stack") {
    return (
      <div className={`case-row case-row--stack ${className}`}>
        <div className={`case-row__heading ${headingClassName}`}>{heading}</div>
        <div className={`case-row__body ${bodyClassName}`}>{children}</div>
      </div>
    );
  }

  return (
    <div className={`case-row case-row--split ${className}`}>
      <div className={`case-row__heading ${headingClassName}`}>{heading}</div>
      <div className={`case-row__body ${bodyClassName}`}>{children}</div>
    </div>
  );
}
