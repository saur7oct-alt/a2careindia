import { useMemo } from 'react';

/**
 * Technical line motifs used in place of photography that A2Care has not supplied yet.
 * They read as engineering drawing, never as a photo of somebody else's plant.
 */

export type MotifKind = 'vessels' | 'membrane' | 'panel' | 'flow' | 'chiller' | 'nature' | 'wave';

const MOTIF_BY_SLOT: Record<string, MotifKind> = {
  'story.raw': 'flow',
  'story.sediment': 'vessels',
  'story.membrane': 'membrane',
  'story.monitoring': 'panel',
  'story.treated': 'wave',
  'product.industrial-ro': 'membrane',
  'product.commercial-ro': 'vessels',
  'product.etp': 'flow',
  'product.stp': 'flow',
  'product.dosing': 'panel',
  'product.rainwater': 'nature',
  'product.chillers': 'chiller',
  'hero.reel': 'wave',
  'cta.band': 'wave',
  'about.works': 'vessels',
  'sustainability.nature': 'nature',
};

export function motifFor(slotId: string): MotifKind {
  if (MOTIF_BY_SLOT[slotId]) return MOTIF_BY_SLOT[slotId];
  if (slotId.startsWith('project.')) {
    const kinds: MotifKind[] = ['membrane', 'flow', 'vessels', 'panel'];
    const seed = slotId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return kinds[seed % kinds.length];
  }
  return 'wave';
}

const stroke = { stroke: 'currentColor', strokeWidth: 1.25, fill: 'none' } as const;

export function AssetMotif({ kind, className }: { kind: MotifKind; className?: string }) {
  const paths = useMemo(() => {
    switch (kind) {
      case 'vessels':
        return (
          <g {...stroke}>
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${64 + i * 92} 0)`}>
                <rect x="0" y="54" width="54" height="122" rx="27" />
                <path d="M0 108h54M0 140h54" strokeDasharray="4 6" />
                <path d="M27 54V30M14 30h26" />
                <path d="M27 176v22M8 198h38" />
              </g>
            ))}
            <path d="M64 120H28M248 120h36" />
          </g>
        );
      case 'membrane':
        return (
          <g {...stroke}>
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${44} ${62 + i * 52})`}>
                <rect x="0" y="0" width="230" height="34" rx="17" />
                <path d="M28 0v34M64 0v34M100 0v34M136 0v34M172 0v34M206 0v34" strokeDasharray="3 5" />
                <path d="M230 17h26" />
              </g>
            ))}
            <path d="M20 79v130M20 79h24M20 131h24M20 183h24" />
            <path d="M282 62v150" />
          </g>
        );
      case 'panel':
        return (
          <g {...stroke}>
            <rect x="40" y="46" width="200" height="150" rx="8" />
            <rect x="60" y="66" width="72" height="44" rx="4" />
            <path d="M72 100l14-14 12 10 16-20" />
            <circle cx="176" cy="80" r="10" />
            <path d="M150 130h70M150 148h70M150 166h44" />
            <path d="M60 130h58v46H60z" strokeDasharray="4 5" />
            <path d="M40 214v18h200v-18" />
          </g>
        );
      case 'flow':
        return (
          <g {...stroke}>
            <path d="M28 92h84a26 26 0 0126 26v56a26 26 0 0026 26h84" />
            <path d="M28 150h56a26 26 0 0026-26V74a26 26 0 0126-26h102" />
            <circle cx="138" cy="118" r="7" />
            <circle cx="200" cy="200" r="7" />
            <path d="M242 48h24M242 74h24" strokeDasharray="4 6" />
            <path d="M52 192h40v28H52z" />
          </g>
        );
      case 'chiller':
        return (
          <g {...stroke}>
            <rect x="34" y="96" width="212" height="96" rx="10" />
            <circle cx="96" cy="144" r="30" />
            <path d="M96 114v60M66 144h60" strokeDasharray="4 5" />
            <path d="M150 118h72M150 140h72M150 162h50" />
            <path d="M74 96V70h120v26" />
            <path d="M34 200h212" />
          </g>
        );
      case 'nature':
        return (
          <g {...stroke}>
            <path d="M20 176c40-28 78 22 118-6s74 24 124-10" />
            <path d="M20 200c40-24 78 18 118-4s74 20 124-8" strokeDasharray="5 7" />
            <path d="M92 176V96M92 96c-22-6-30-30-22-48 20 2 32 20 22 48zM92 96c22-8 30-32 22-50-20 2-32 22-22 50z" />
            <path d="M196 176v-58M196 118c-16-4-22-22-16-36 14 2 24 16 16 36z" />
          </g>
        );
      default:
        return (
          <g {...stroke}>
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M12 ${112 + i * 30}c42-26 84 22 126-4s84 20 130-8`}
                opacity={0.85 - i * 0.18}
              />
            ))}
            <circle cx="138" cy="86" r="34" strokeDasharray="6 8" />
          </g>
        );
    }
  }, [kind]);

  return (
    <svg
      viewBox="0 0 280 240"
      className={className}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {paths}
    </svg>
  );
}
