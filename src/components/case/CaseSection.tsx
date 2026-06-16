import type { ReactNode } from "react";

export type CaseSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function CaseSection({ children, className, id }: CaseSectionProps) {
  return (
    <section id={id} className={`w-full px-[14px] ${className ?? ""}`}>
      {children}
    </section>
  );
}
