import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { LineReveal } from '@/components/motion/Reveal';

/**
 * Every top-level section uses this so vertical rhythm, gutters and heading scale stay
 * consistent across the page instead of being re-invented per block.
 */
export function Section({
  id,
  children,
  tone = 'dark',
  className,
  bleed = false,
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  tone?: 'dark' | 'deeper' | 'light';
  className?: string;
  bleed?: boolean;
  labelledBy?: string;
}) {
  const tones = {
    dark: 'bg-navy text-ice',
    deeper: 'bg-abyss text-ice',
    light: 'bg-ice text-navy',
  } as const;

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'relative',
        bleed ? '' : 'py-24 md:py-32 lg:py-40',
        tones[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Small technical caption above a heading — "05 / Solutions" style. */
export function Eyebrow({
  index,
  children,
  tone = 'dark',
  className,
}: {
  index?: string;
  children: ReactNode;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'label flex items-center gap-3',
        tone === 'dark' ? 'text-aqua' : 'text-electric',
        className,
      )}
    >
      {index ? <span className="text-steel">{index}</span> : null}
      <span className={cn('h-px w-8', tone === 'dark' ? 'bg-aqua/45' : 'bg-electric/40')} />
      <span>{children}</span>
    </div>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  index,
  lines,
  lead,
  tone = 'dark',
  align = 'left',
  className,
  headingClassName,
}: {
  id?: string;
  eyebrow?: ReactNode;
  index?: string;
  /** Each array item renders as its own masked line — break copy deliberately. */
  lines: readonly ReactNode[];
  lead?: ReactNode;
  tone?: 'dark' | 'light';
  align?: 'left' | 'center';
  className?: string;
  headingClassName?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow !== undefined ? (
        <Eyebrow index={index} tone={tone}>
          {eyebrow}
        </Eyebrow>
      ) : null}

      <LineReveal
        as="h2"
        id={id}
        lines={lines}
        className={cn(
          'display-lg max-w-[22ch]',
          align === 'center' && 'mx-auto',
          headingClassName,
        )}
      />

      {lead ? (
        <p
          className={cn(
            'max-w-[62ch] text-[1.02rem] leading-[1.65] md:text-[1.12rem]',
            tone === 'dark' ? 'text-steel' : 'text-navy/68',
            align === 'center' && 'mx-auto',
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Thin animated rule used between grouped blocks. */
export function WaterLine({ className }: { className?: string }) {
  return <div className={cn('hairline-water w-full', className)} />;
}
