'use client';

import { TdsAccordion, TdsAccordionItem } from '@scania/tegel-react';
import { ReactNode } from 'react';

// Accordion wrapper
interface AccordionProps {
  children: ReactNode;
}

export function Accordion({ children }: AccordionProps) {
  return <TdsAccordion>{children}</TdsAccordion>;
}

// AccordionItem wrapper
interface AccordionItemProps {
  children: ReactNode;
  header?: string;
  ariaLevel?: '1' | '2' | '3' | '4' | '5' | '6';
  expanded?: boolean;
}

export function AccordionItem({
  children,
  header,
  ariaLevel = '6',
  expanded = false,
}: AccordionItemProps) {
  return (
    <TdsAccordionItem
      header={header}
      aria-level={parseInt(ariaLevel) as 1 | 2 | 3 | 4 | 5 | 6}
      expanded={expanded}
    >
      {children}
    </TdsAccordionItem>
  );
}

// Default export for convenience
export default Accordion;
