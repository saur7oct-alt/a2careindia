import Image from 'next/image';
import { decor } from '@/lib/media';
import { cn } from '@/lib/cn';

/**
 * Layered decorative water wash behind cinematic sections.
 *
 * Sits under a scrim so headline copy keeps contrast, and is aria-hidden because it is
 * atmosphere rather than information. Never reuse this where an image would be read as
 * documentation of a real A2Care plant — that is what <MediaFrame> is for.
 */
export function DecorBackdrop({
  slot,
  className,
  priority = false,
  scrim = 'default',
}: {
  slot: keyof typeof decor;
  className?: string;
  priority?: boolean;
  scrim?: 'default' | 'heavy' | 'none';
}) {
  const asset = decor[slot];

  const scrims = {
    default:
      'bg-[linear-gradient(180deg,rgba(4,15,25,0.72)_0%,rgba(7,27,43,0.82)_58%,rgba(4,15,25,0.94)_100%)]',
    heavy:
      'bg-[linear-gradient(180deg,rgba(4,15,25,0.86)_0%,rgba(7,27,43,0.9)_55%,rgba(4,15,25,0.97)_100%)]',
    none: 'bg-transparent',
  } as const;

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
      data-decor-credit={asset.credit}
    >
      <Image
        src={asset.src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className={cn('absolute inset-0', scrims[scrim])} />
      {/* Vignette keeps the eye off the image edges and onto the copy */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_35%,transparent_35%,rgba(4,15,25,0.6)_100%)]" />
    </div>
  );
}
