'use client';

import { useId, useState } from 'react';
import { AnimateHeight } from './AnimateHeight';
import { cn } from '@/lib/cn';

export type AccordionItem = {
  question: string;
  answer: string;
};

/**
 * Accessible accordion: real <button> headers, aria-expanded/controls wiring, one panel
 * open at a time, and height animated through a wrapper so long answers never jump.
 */
export function Accordion({
  items,
  className,
  tone = 'dark',
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  className?: string;
  tone?: 'dark' | 'light';
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn('flex flex-col', className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div
            key={item.question}
            className={cn(
              'border-b',
              tone === 'dark' ? 'border-hairline-dark' : 'border-hairline-light',
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className={cn(
                  'group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-300 md:py-7',
                  tone === 'dark' ? 'hover:text-aqua' : 'hover:text-electric',
                )}
              >
                <span className="flex items-start gap-4 md:gap-6">
                  <span
                    className={cn(
                      'label mt-1.5 tabular-nums',
                      tone === 'dark' ? 'text-steel' : 'text-navy/45',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="display-sm max-w-[46ch]">{item.question}</span>
                </span>

                <span
                  className={cn(
                    'relative mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-300',
                    tone === 'dark'
                      ? 'border-hairline-dark group-hover:border-aqua/60'
                      : 'border-hairline-light group-hover:border-electric/60',
                    isOpen && (tone === 'dark' ? 'border-aqua/60' : 'border-electric/60'),
                  )}
                  aria-hidden="true"
                >
                  <span className="absolute h-px w-3.5 bg-current" />
                  <span
                    className={cn(
                      'absolute h-3.5 w-px bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      isOpen ? 'scale-y-0' : 'scale-y-100',
                    )}
                  />
                </span>
              </button>
            </h3>

            <AnimateHeight open={isOpen}>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={cn(
                  'pb-7 pl-[2.6rem] pr-10 text-[1rem] leading-[1.72] md:pl-[3.4rem]',
                  tone === 'dark' ? 'text-steel' : 'text-navy/68',
                )}
              >
                {item.answer}
              </div>
            </AnimateHeight>
          </div>
        );
      })}
    </div>
  );
}
