'use client';

import Image from 'next/image';
import { getMedia } from '@/lib/media';
import { AssetMotif, motifFor } from './AssetMotif';
import { cn } from '@/lib/cn';

/**
 * Renders a media slot: genuine company asset when the manifest says `real: true`,
 * otherwise a designed technical stand-in. This is what keeps licensed or generated
 * imagery from ever being presented as an A2Care installation.
 */
export function MediaFrame({
  slotId,
  className,
  imageClassName,
  motifClassName,
  priority = false,
  sizes,
  showLabel = false,
}: {
  slotId: string;
  className?: string;
  imageClassName?: string;
  motifClassName?: string;
  priority?: boolean;
  sizes?: string;
  showLabel?: boolean;
}) {
  const slot = getMedia(slotId);
  const motif = motifFor(slotId);

  if (slot.real) {
    if (slot.kind === 'video') {
      return (
        <div className={cn('relative overflow-hidden bg-navy', className)}>
          {/* autoplay contract: muted + playsInline, never with sound */}
          <video
            className={cn('h-full w-full object-cover', imageClassName)}
            src={slot.src}
            poster={slot.poster}
            autoPlay
            muted
            loop
            playsInline
            preload={priority ? 'auto' : 'none'}
            aria-label={slot.alt}
          />
        </div>
      );
    }

    return (
      <div className={cn('relative overflow-hidden bg-navy', className)}>
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          priority={priority}
          sizes={sizes ?? '(min-width: 1280px) 1200px, (min-width: 768px) 90vw, 100vw'}
          className={cn('object-cover', imageClassName)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      data-slot={slot.id}
      data-expects={slot.expected ?? undefined}
      role="img"
      aria-label={`${slot.alt} (stand-in artwork — awaiting A2Care media)`}
    >
      {/* Depth: two restrained water washes, no neon bloom */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_18%_8%,rgba(0,174,239,0.18)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(130%_110%_at_82%_20%,rgba(32,213,210,0.16),transparent_58%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(158deg,#071b2b_0%,#0a263d_46%,#061622_100%)]" />

      {/* Engineering grid, faded toward the edges */}
      <div
        className="absolute inset-0 opacity-[0.5] [mask-image:radial-gradient(80%_70%_at_50%_45%,#000_20%,transparent_75%)]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(129,147,160,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(129,147,160,0.14) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />

      <AssetMotif
        kind={motif}
        className={cn(
          'absolute left-1/2 top-1/2 w-[62%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 text-aqua/45',
          motifClassName,
        )}
      />

      {/* Fine sweep so the panel is not dead flat */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,transparent_35%,rgba(255,255,255,0.06)_50%,transparent_65%)]" />

      {showLabel ? (
        <span className="label absolute bottom-3 left-3 rounded-pill border border-hairline-dark bg-abyss/45 px-2.5 py-1 text-steel backdrop-blur-sm">
          Stand-in artwork
        </span>
      ) : null}
    </div>
  );
}
