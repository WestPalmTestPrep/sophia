'use client';

// Custom SVG icons to replace emojis throughout the site
// All icons are inline SVGs for consistent styling

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

function makeIcon(path: string, viewBox = '0 0 24 24') {
  return function Icon({ size = 24, color = 'currentColor', className }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      >
        <g fill={color} dangerouslySetInnerHTML={{ __html: path }} />
      </svg>
    );
  };
}

// Queen chess piece (simplified)
export const QueenIcon = makeIcon(
  '<path d="M12 2l2.5 6.5L20 5l-2 7h-0.5l1 7H5.5l1-7H6L4 5l5.5 3.5L12 2z" fill-rule="evenodd"/><rect x="5" y="19" width="14" height="2" rx="1"/>'
);

// Camera / Photography
export const CameraIcon = makeIcon(
  '<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>'
);

// Graduation cap
export const GradCapIcon = makeIcon(
  '<path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>'
);

// Crown
export const CrownIcon = makeIcon(
  '<path d="M2 17l2-11 5 4 3-7 3 7 5-4 2 11H2z"/><rect x="2" y="18" width="20" height="2" rx="1"/>'
);

// Palm tree / Sunshine
export const PalmIcon = makeIcon(
  '<path d="M12 22V12m0 0c-2-4-7-5-10-3m10 3c2-4 7-5 10-3M12 12c0-5-2-9-4-10m4 10c0-5 2-9 4-10"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
);

// Dumbbell / Fitness
export const FitnessIcon = makeIcon(
  '<path d="M6.5 6.5a2 2 0 00-2 2v7a2 2 0 002 2m0-11v11m0-11H4a1.5 1.5 0 00-1.5 1.5v8A1.5 1.5 0 004 17.5h2.5m0 0h11m0-11a2 2 0 012 2v7a2 2 0 01-2 2m0-11v11m0-11H20a1.5 1.5 0 011.5 1.5v8a1.5 1.5 0 01-1.5 1.5h-2.5m0 0h-11" stroke="currentColor" stroke-width="1.5" fill="none"/>'
);

// Ring / Wedding
export const RingIcon = makeIcon(
  '<circle cx="12" cy="14" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 7V3m-2 1l2-2 2 2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M9.5 11l1.5 1.5L14.5 9" stroke="currentColor" stroke-width="1.5" fill="none"/>'
);

// Camp / Tent
export const TentIcon = makeIcon(
  '<path d="M12 2L3 20h18L12 2z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 2v18M8 20l4-8 4 8" stroke="currentColor" stroke-width="1.5" fill="none"/>'
);

// Magazine / Document
export const MagazineIcon = makeIcon(
  '<rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 7h8M8 11h8M8 15h4" stroke="currentColor" stroke-width="1.5"/>'
);

// Target / Crosshair
export const TargetIcon = makeIcon(
  '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'
);

// Heart
export const HeartIcon = makeIcon(
  '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>'
);

// Crystal ball / Oracle
export const OracleIcon = makeIcon(
  '<circle cx="12" cy="10" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 18c0 1.1 1.79 2 4 2s4-.9 4-2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M9 8c1-1.5 4.5-1.5 6 0" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>'
);

// Greek temple
export const TempleIcon = makeIcon(
  '<path d="M12 2l10 6v2H2V8l10-6z"/><rect x="4" y="10" width="2" height="9"/><rect x="9" y="10" width="2" height="9"/><rect x="13" y="10" width="2" height="9"/><rect x="18" y="10" width="2" height="9"/><rect x="2" y="19" width="20" height="2"/>'
);

// Trophy
export const TrophyIcon = makeIcon(
  '<path d="M6 9a6 6 0 0012 0V3H6v6z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M6 5H3v3a3 3 0 003 3m12-6h3v3a3 3 0 01-3 3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 15v3m-3 0h6" stroke="currentColor" stroke-width="1.5"/><rect x="8" y="20" width="8" height="2" rx="1"/>'
);

// Palette / Art
export const PaletteIcon = makeIcon(
  '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="7.5" cy="11.5" r="1.5" fill="currentColor"/><circle cx="10.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="15" cy="7.5" r="1.5" fill="currentColor"/>'
);

// Chess pawn
export const PawnIcon = makeIcon(
  '<circle cx="12" cy="7" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M9 13c0-1.66 1.34-3 3-3s3 1.34 3 3v1H9v-1z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M7 20l2-6h6l2 6H7z" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="6" y="20" width="12" height="2" rx="1"/>'
);

// Lock
export const LockIcon = makeIcon(
  '<rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/>'
);

// Star / Sparkle
export const SparkleIcon = makeIcon(
  '<path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/>'
);

// Sun / Golden hour
export const SunIcon = makeIcon(
  '<circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 1v3m0 16v3m11-11h-3M4 12H1m18.07-7.07l-2.12 2.12M7.05 16.95l-2.12 2.12m14.14 0l-2.12-2.12M7.05 7.05L4.93 4.93" stroke="currentColor" stroke-width="1.5"/>'
);

// Decade / Calendar
export const DecadeIcon = makeIcon(
  '<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M3 9h18" stroke="currentColor" stroke-width="1.5"/><path d="M8 2v4m8-4v4" stroke="currentColor" stroke-width="1.5"/><text x="12" y="17" text-anchor="middle" fill="currentColor" font-size="8" font-weight="bold" font-family="monospace">10</text>'
);

// Bolt / Lightning
export const BoltIcon = makeIcon(
  '<path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z"/>'
);

// Diamond / Sparkle small
export const DiamondIcon = makeIcon(
  '<path d="M12 2l4 8-4 8-4-8 4-8z" stroke="currentColor" stroke-width="1.5" fill="none"/>'
);

// Record dot
export const RecordIcon = makeIcon(
  '<circle cx="12" cy="12" r="8" fill="currentColor"/>'
);

// String icon map for data files that can't use JSX
export const ICON_CHARS: Record<string, string> = {
  queen: '♛',
  crown: '♕',
  sun: '✺',
  temple: '⛩',
  sparkle: '✦',
  star: '★',
  diamond: '◆',
  circle: '◉',
  camera: '⊙',
  target: '◎',
  pawn: '♟',
  lock: '⊘',
  bolt: '⚡',
  heart: '♥',
  ring: '○',
  tent: '⛺',
  palette: '◐',
  trophy: '⊛',
  magazine: '▣',
  fitness: '⬡',
  palm: '⌘',
  grad: '◭',
};
